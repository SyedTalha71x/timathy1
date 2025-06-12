"use client"

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
} from "lucide-react"

import DefaultStudioImage from "../../../public/default-avatar.avif"
import toast, { Toaster } from "react-hot-toast"
import { RiContractFill } from "react-icons/ri"
import { TbReportAnalytics } from "react-icons/tb"
import { FaUserGroup } from "react-icons/fa6"
import FranchiseModal from "../../components/customer-dashboard/studios-modal/franchise-modal"
import AssignStudioModal from "../../components/customer-dashboard/studios-modal/assign-studios-modal"
import StudioManagementModal from "../../components/customer-dashboard/studios-modal/studio-management-modal"
import FranchiseDetailsModal from "../../components/customer-dashboard/studios-modal/franchise-details-modal"

import EditMemberModal from "../../components/customer-dashboard/studios-modal/edit-member-modal"
import EditStaffModal from "../../components/customer-dashboard/studios-modal/edit-staff-modal"
import StudioDetailsModal from "../../components/customer-dashboard/studios-modal/studios-detail-modal"
import StudioFinancesModal from "../../components/customer-dashboard/studios-modal/finances-modal"
import {
  FranchiseData,
  studioContractsData,
  studioFinanceData,
  studioLeadData,
  studioMembersData,
  studioStaffData,
  studioStatsData,
} from "../../states/states"
import EditStudioModal from "../../components/customer-dashboard/studios-modal/edit-studio-modal"
import ContractsModal from "../../components/customer-dashboard/studios-modal/contract-modal"
import { EditLeadModal } from "../../components/edit-lead-modal"
import { AddLeadModal } from "../../components/customer-dashboard/studios-modal/add-lead-modal"
import { ViewLeadModal } from "../../components/customer-dashboard/studios-modal/view-lead-details"
import AddStaffModal from "../../components/customer-dashboard/studios-modal/add-staff-modal"
import { ViewStaffModal } from "../../components/customer-dashboard/studios-modal/view-staff-details"

export default function Studios() {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
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
  const [isLeadsModalOpen, setIsLeadsModalOpen] = useState(false)
  const [isContractsModalOpen, setIsContractsModalOpen] = useState(false)
  const [isFinancesModalOpen, setIsFinancesModalOpen] = useState(false)
  const [selectedStudioForModal, setSelectedStudioForModal] = useState(null)

  const [isEditStaffModalOpen, setisEditStaffModalOpen] = useState(false)
  const [selectedStaffForEdit, setselectedStaffForEdit] = useState(null)

  const [isEditLeadModalOpen, setIsEditLeadModalOpen] = useState(false)
  const [selectedLeadForEdit, setSelectedLeadForEdit] = useState(null)

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

  const defaultSources = [
    "Website",
    "Google Ads",
    "Social Media Ads",
    "Email Campaign",
    "Cold Call (Outbound)",
    "Inbound Call",
    "Event",
    "Offline Advertising",
    "Other",
  ]

  // New states for view details modals
  const [isMemberDetailsModalOpen, setIsMemberDetailsModalOpen] = useState(false)
  const [isStaffDetailsModalOpen, setIsStaffDetailsModalOpen] = useState(false)
  const [isLeadDetailsModalOpen, setIsLeadDetailsModalOpen] = useState(false)
  const [isContractDetailsModalOpen, setIsContractDetailsModalOpen] = useState(false)
  const [selectedItemForDetails, setSelectedItemForDetails] = useState(null)

  // New states for adding new items
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false)
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false)

  const [financesPeriod, setFinancesPeriod] = useState("month")
  const [showPassword, setShowPassword] = useState({})

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
    iban: "",
    country: "",
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

  const [studioLeads, setStudioLeads] = useState(studioLeadData)

  const [studioContracts, setStudioContracts] = useState(studioContractsData)

  const [studioFinances, setStudioFinances] = useState(studioFinanceData)

  const [memberSearchQuery, setMemberSearchQuery] = useState("")
  const [staffSearchQuery, setStaffSearchQuery] = useState("")
  const [leadSearchQuery, setLeadSearchQuery] = useState("")

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
    } else if (isLeadsModalOpen) {
      setStudioLeads((prev) => ({
        ...prev,
        [selectedStudioForModal.id]: prev[selectedStudioForModal.id].map((lead) =>
          lead.id === selectedMemberForEdit.id ? { ...lead, ...formData, source: formData.membershipType } : lead,
        ),
      }))
    }

    setIsEditMemberModalOpen(false)
    setSelectedMemberForEdit(null)
    toast.success("Details updated successfully")
  }

  const handleLeadEditSubmit = (updatedLead) => {
    setStudioLeads((prev) => ({
      ...prev,
      [selectedStudioForModal.id]: prev[selectedStudioForModal.id].map((lead) =>
        lead.id === selectedLeadForEdit.id ? updatedLead : lead,
      ),
    }))
    setIsEditLeadModalOpen(false)
    setSelectedLeadForEdit(null)
    toast.success("Lead updated successfully")
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

  const handleViewLeadDetails = (lead) => {
    setSelectedItemForDetails(lead)
    setIsLeadDetailsModalOpen(true)
  }

  const handleViewContractDetails = (contract) => {
    setSelectedItemForDetails(contract)
    setIsContractDetailsModalOpen(true)
  }

  // New handlers for adding items
  const handleAddNewStaff = (newStaff) => {
    const staffWithId = {
      ...newStaff,
      id: Math.max(...(studioStaffs[selectedStudioForModal.id] || []).map((s) => s.id), 0) + 1,
      joinDate: new Date().toISOString().split("T")[0],
    }

    setStudioStaffs((prev) => ({
      ...prev,
      [selectedStudioForModal.id]: [...(prev[selectedStudioForModal.id] || []), staffWithId],
    }))

    setIsAddStaffModalOpen(false)
    toast.success("New staff member added successfully")
  }

  const handleAddNewLead = (newLead) => {
    const leadWithId = {
      ...newLead,
      id: Math.max(...(studioLeads[selectedStudioForModal.id] || []).map((l) => l.id), 0) + 1,
      createdAt: new Date().toISOString(),
      status: "new",
    }

    setStudioLeads((prev) => ({
      ...prev,
      [selectedStudioForModal.id]: [...(prev[selectedStudioForModal.id] || []), leadWithId],
    }))

    setIsAddLeadModalOpen(false)
    toast.success("New lead added successfully")
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
      country: "Germany",
      iban: "DE89 3704 0044 0532 0130 00",
      taxId: "DE123456789",
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
      franchiseId: 1,
      openingHours: {
        monday: "6:00 - 22:00",
        tuesday: "6:00 - 22:00",
        wednesday: "6:00 - 22:00",
        thursday: "6:00 - 22:00",
        friday: "6:00 - 22:00",
        saturday: "8:00 - 20:00",
        sunday: "10:00 - 18:00",
      },
      closingDays: "Christmas Day, New Year's Day",
    },
    {
      id: 2,
      name: "PowerGym AG",
      email: "contact@powergym.com",
      phone: "+49987654321",
      street: "Friedrichstraße 45",
      zipCode: "20354",
      city: "Hamburg",
      country: "Germany",
      iban: "DE12 5001 0517 0648 4898 90",
      taxId: "DE987654321",
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
      franchiseId: 1,
      openingHours: {
        monday: "5:00 - 23:00",
        tuesday: "5:00 - 23:00",
        wednesday: "5:00 - 23:00",
        thursday: "5:00 - 23:00",
        friday: "5:00 - 23:00",
        saturday: "7:00 - 21:00",
        sunday: "9:00 - 19:00",
      },
      closingDays: "Easter Sunday, Christmas Day",
    },
    {
      id: 3,
      name: "FlexFit Studio",
      email: "info@flexfit.com",
      phone: "+49555123456",
      street: "Sportstraße 10",
      zipCode: "80331",
      city: "Munich",
      country: "Germany",
      iban: "DE89 7005 0000 0000 1234 56",
      taxId: "DE555123456",
      image: null,
      isActive: true,
      note: "",
      noteStartDate: "",
      noteEndDate: "",
      noteImportance: "unimportant",
      website: "www.flexfit.com",
      about: "Modern fitness studio focusing on flexibility and wellness.",
      joinDate: "2023-01-15",
      contractStart: "2023-01-15",
      contractEnd: "2024-01-15",
      ownerName: "Anna Weber",
      franchiseId: null,
      openingHours: {
        monday: "7:00 - 21:00",
        tuesday: "7:00 - 21:00",
        wednesday: "7:00 - 21:00",
        thursday: "7:00 - 21:00",
        friday: "7:00 - 21:00",
        saturday: "9:00 - 18:00",
        sunday: "Closed",
      },
      closingDays: "Public holidays",
    },
    {
      id: 4,
      name: "StrengthZone",
      email: "contact@strengthzone.de",
      phone: "+49666789012",
      street: "Kraftstraße 25",
      zipCode: "50667",
      city: "Cologne",
      country: "Germany",
      iban: "DE44 5001 0517 5407 3249 31",
      taxId: "DE666789012",
      image: null,
      isActive: true,
      note: "",
      noteStartDate: "",
      noteEndDate: "",
      noteImportance: "unimportant",
      website: "www.strengthzone.de",
      about: "Specialized in strength training and powerlifting.",
      joinDate: "2023-02-01",
      contractStart: "2023-02-01",
      contractEnd: "2024-02-01",
      ownerName: "Michael Klein",
      franchiseId: null,
      openingHours: {
        monday: "6:00 - 22:00",
        tuesday: "6:00 - 22:00",
        wednesday: "6:00 - 22:00",
        thursday: "6:00 - 22:00",
        friday: "6:00 - 22:00",
        saturday: "8:00 - 20:00",
        sunday: "10:00 - 16:00",
      },
      closingDays: "Christmas Eve, Christmas Day, New Year's Day",
    },
  ])

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
      label: `Archived ${viewMode === "studios" ? "Studios" : "Franchises"} (${viewMode === "studios" ? studios.filter((m) => !m.isActive).length : franchises.filter((f) => f.isArchived).length})`,
    },
  ]

  const sortOptions = [
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

  const handleViewFranchiseDetails = (franchise) => {
    setSelectedFranchise(franchise)
    setIsFranchiseDetailsModalOpen(true)
  }

  const handleGoToContract = (studio) => {
    setSelectedStudioForModal(studio)
    setIsContractsModalOpen(true)
    setIsViewDetailsModalOpen(false)
  }

  const handleDeleteFranchise = (franchiseId) => {
    // Unassign all studios from this franchise
    const updatedStudios = studios.map((studio) => {
      if (studio.franchiseId === franchiseId) {
        return { ...studio, franchiseId: null }
      }
      return studio
    })
    setStudios(updatedStudios)

    // Remove the franchise
    const updatedFranchises = franchises.filter((franchise) => franchise.id !== franchiseId)
    setFranchises(updatedFranchises)

    toast.success("Franchise deleted successfully. All studios have been unassigned.")
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
    if (isLeadsModalOpen) {
      setSelectedLeadForEdit(member)
      setIsEditLeadModalOpen(true)
    } else {
      setSelectedMemberForEdit(member)
      setIsEditMemberModalOpen(true)
    }
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

  const getFilteredLeads = () => {
    if (!selectedStudioForModal || !studioLeads[selectedStudioForModal.id]) return []

    return studioLeads[selectedStudioForModal.id].filter(
      (lead) =>
        `${lead.firstName} ${lead.surname}`.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
        lead.phoneNumber.includes(leadSearchQuery),
    )
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

          <div className="flex justify-end items-center mb-4">
          {viewMode === "franchise" && (
                <button
                  onClick={() => setIsCreateFranchiseModalOpen(true)}
                  className="bg-[#3F74FF] md:w-auto w-full  justify-center  hover:bg-[#3F74FF]/90 px-4 py-2 rounded-xl text-sm flex items-center gap-2"
                >
                  <Plus size={16} />
                  Create Franchise
                </button>
              )}  
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
                          <div className="flex gap-2 items-center md:justify-end justify-center">
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
                            <span className="">Staff</span>
                          </button>

                          <button
                            onClick={() => handleOpenLeadsModal(studio)}
                            className="flex items-center md:w-auto w-full justify-center cursor-pointer  gap-2 bg-transparent  border border-slate-700/50 px-4 py-2 rounded-lg text-sm transition-colors"
                          >
                            <FaUserGroup size={16} />
                            <span>{studioStats[studio.id]?.leads || 0}</span>
                            <span className="">Leads</span>
                          </button>

                          <button
                            onClick={() => handleOpenContractsModal(studio)}
                            className="flex items-center md:w-auto w-full justify-center cursor-pointer  gap-2 bg-transparent  border border-slate-700/50 px-4 py-2 rounded-lg text-sm transition-colors"
                          >
                            <RiContractFill size={16} />
                            <span>{studioStats[studio.id]?.contracts || 0}</span>
                            <span className="">Contracts</span>
                          </button>

                          <button
                            onClick={() => handleOpenFinancesModal(studio)}
                            className="flex md:w-auto w-full justify-center items-center cursor-pointer  gap-2 border border-slate-700/50 px-4 py-2 rounded-lg text-sm transition-colors"
                          >
                            <TbReportAnalytics size={16} />
                            <span className="">Finances</span>
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
                    {franchise.specialNote && (
                      <div className="absolute p-2 top-0 left-0 z-10">
                        <div className="relative">
                          <div
                            className={`${
                              franchise.noteImportance === "important" ? "bg-red-500" : "bg-blue-500"
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
                              Owner: {franchise.ownerFirstName} {franchise.ownerLastName}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 items-center md:justify-end justify-center">
                          <button
                            onClick={() => handleViewFranchiseDetails(franchise)}
                            className="text-gray-200 cursor-pointer bg-black  rounded-xl border border-slate-600 py-2 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                          >
                            <Eye size={16} />
                            <span className="hidden sm:inline">View Details</span>
                          </button>
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

      {/* Members Modal with View Details and Edit buttons */}
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
                    setMemberSearchQuery("")
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} className="cursor-pointer" />
                </button>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search members by name, email, or phone..."
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                    className="w-full bg-[#101010] pl-10 pr-4 py-2 text-sm outline-none rounded-lg text-white placeholder-gray-500 border border-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                {getFilteredMembers().map((member) => (
                  <div
                    key={member.id}
                    className="bg-[#161616] rounded-xl lg:p-4 p-3 flex justify-between flex-col md:flex-row gap-2 md:items-center items-start"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <h3 className="font-medium text-white">{member.firstName}</h3>
                        <h3 className="font-medium text-white">{member.lastName}</h3>
                      </div>
                      <div className="text-sm  text-gray-400 mt-2">
                        <p className="flex gap-1">
                          <span className="font-bold text-gray-200">Email:</span>
                          {member.email}
                        </p>
                        <p className="flex gap-1">
                          <span className="font-bold text-gray-200">Phone:</span> {member.phone}
                        </p>
                        <p className="flex gap-1">
                          <span className="font-bold text-gray-200">Joined:</span> {member.joinDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto justify-end flex-col">
                      <button
                        onClick={() => handleViewMemberDetails(member)}
                        className="text-gray-200 cursor-pointer bg-black  rounded-xl border border-slate-600 py-2 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <Eye size={16} />
                        View Details
                      </button>
                      <button
                        onClick={() => handleEditMember(member)}
                        className="text-gray-200 cursor-pointer bg-black  rounded-xl border border-slate-600 py-2 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Staff Modal with View Details, Edit, and Add New buttons */}
      {isStaffsModalOpen && selectedStudioForModal && (
        <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl my-8 relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white open_sans_font_700 text-lg font-semibold">
                  {selectedStudioForModal.name} - Staff ({studioStaffs[selectedStudioForModal.id]?.length || 0})
                </h2>
                <div className="flex gap-2">
                  <div className="md:block hidden">
                    <button
                      onClick={() => setIsAddStaffModalOpen(true)}
                      className="bg-[#FF843E] cursor-pointer text-white px-3 py-2.5 rounded-xl text-sm flex items-center gap-2"
                    >
                      <Plus size={18} />
                      <span className="open_sans_font">Add Staff</span>
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setIsStaffsModalOpen(false)
                      setSelectedStudioForModal(null)
                      setStaffSearchQuery("")
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={20} className="cursor-pointer" />
                  </button>
                </div>
              </div>

              <div className="md:hidden flex justify-end items-center mb-3">
                <button
                  onClick={() => setIsAddStaffModalOpen(true)}
                  className="bg-[#FF843E] cursor-pointer text-white px-3 py-2.5 rounded-xl text-sm flex items-center gap-2"
                >
                  <Plus size={18} />
                  <span className="open_sans_font">Add Staff</span>
                </button>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search staff by name, email, phone, or role..."
                    value={staffSearchQuery}
                    onChange={(e) => setStaffSearchQuery(e.target.value)}
                    className="w-full bg-[#101010] pl-10 pr-4 py-2 text-sm outline-none rounded-lg text-white placeholder-gray-500 border border-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                {getFilteredStaff().map((staff) => (
                  <div
                    key={staff.id}
                    className="bg-[#161616] rounded-xl p-4 flex justify-between md:flex-row flex-col gap-3 items-center"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <h3 className="font-medium text-white">{staff.firstName}</h3>
                        <h3 className="font-medium text-white">{staff.lastName}</h3>
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
                    <div className="flex gap-2 w-full md:w-auto justify-end flex-col">
                      <button
                        onClick={() => handleViewStaffDetails(staff)}
                        className="text-gray-200 cursor-pointer bg-black  rounded-xl border border-slate-600 py-2 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <Eye size={16} />
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          setselectedStaffForEdit(staff)
                          setisEditStaffModalOpen(true)
                        }}
                        className="text-gray-200 cursor-pointer bg-black  rounded-xl border border-slate-600 py-2 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leads Modal with View Details, Edit, and Add New buttons */}
      {isLeadsModalOpen && selectedStudioForModal && (
        <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl my-8 relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white open_sans_font_700 text-lg font-semibold">
                  {selectedStudioForModal.name} - Leads ({studioLeads[selectedStudioForModal.id]?.length || 0})
                </h2>
                <div className="flex gap-2">
                  <div className="md:block hidden">
                    <button
                      onClick={() => setIsAddLeadModalOpen(true)}
                      className="bg-[#FF843E] cursor-pointer text-white px-3 py-2.5 rounded-xl text-sm flex items-center gap-2"
                    >
                      <Plus size={18} />
                      <span className="open_sans_font">Create Lead</span>
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setIsLeadsModalOpen(false)
                      setSelectedStudioForModal(null)
                      setLeadSearchQuery("")
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={20} className="cursor-pointer" />
                  </button>
                </div>
              </div>

              <div className="md:hidden flex justify-end items-center mb-3">
                <button
                  onClick={() => setIsAddLeadModalOpen(true)}
                  className="bg-[#FF843E] cursor-pointer text-white px-3 py-2.5 rounded-xl text-sm flex items-center gap-2"
                >
                  <Plus size={18} />
                  <span className="open_sans_font">Create Lead</span>
                </button>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search leads by name, email, or phone..."
                    value={leadSearchQuery}
                    onChange={(e) => setLeadSearchQuery(e.target.value)}
                    className="w-full bg-[#101010] pl-10 pr-4 py-2 text-sm outline-none rounded-lg text-white placeholder-gray-500 border border-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                {getFilteredLeads().map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-[#161616] rounded-xl p-4 flex justify-between md:flex-row flex-col gap-2 items-start"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-white">
                          {lead.firstName} {lead.surname}
                        </h3>

                        {lead.hasTrialTraining && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-900 text-yellow-300">
                            Trial Scheduled
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400 mt-2">
                        <p className="flex gap-1">
                          <span className="font-bold text-gray-200">Email:</span> {lead.email}
                        </p>
                        <p className="flex gap-1">
                          <span className="font-bold text-gray-200">Phone:</span> {lead.phoneNumber}
                        </p>
                        <p className="flex gap-1">
                          <span className="font-bold text-gray-200">Created:</span>{" "}
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto justify-end flex-col">
                      <button
                        onClick={() => handleViewLeadDetails(lead)}
                        className="text-gray-200 cursor-pointer bg-black  rounded-xl border border-slate-600 py-2 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <Eye size={16} />
                        View Details
                      </button>
                      <button
                        onClick={() => handleEditMember(lead)}
                        className="text-gray-200 cursor-pointer bg-black  rounded-xl border border-slate-600 py-2 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contracts Modal with View Details button */}
      <ContractsModal
        isOpen={isContractsModalOpen}
        onClose={() => setIsContractsModalOpen(false)}
        selectedStudio={selectedStudioForModal}
        studioContracts={studioContracts}
        handleFileUpload={handleFileUpload}
        handleDownloadFile={handleDownloadFile}
        onViewDetails={handleViewContractDetails}
      />

      <StudioFinancesModal
        isOpen={isFinancesModalOpen}
        onClose={() => setIsFinancesModalOpen(false)}
        studio={selectedStudioForModal}
        studioFinances={studioFinances}
        financesPeriod={financesPeriod}
        onPeriodChange={handlePeriodChange}
      />

      <EditMemberModal
        isOpen={isEditMemberModalOpen}
        onClose={() => setIsEditMemberModalOpen(false)}
        selectedMember={selectedMemberForEdit}
        onSave={handleMemberEditSubmit}
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

      {/* Edit Studio Modal */}
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

      {/* Edit Lead Modal */}
      <EditLeadModal
        isVisible={isEditLeadModalOpen}
        onClose={() => {
          setIsEditLeadModalOpen(false)
          setSelectedLeadForEdit(null)
        }}
        onSave={handleLeadEditSubmit}
        leadData={selectedLeadForEdit}
      />

      {/* View Details Modals */}
      {isMemberDetailsModalOpen && selectedItemForDetails && (
        <div className="fixed inset-0 w-full h-full bg-black/50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-2xl relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-lg font-semibold">Member Details</h2>
                <button onClick={() => setIsMemberDetailsModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4 text-white">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm">First Name</label>
                    <p className="text-white">{selectedItemForDetails.firstName}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Last Name</label>
                    <p className="text-white">{selectedItemForDetails.lastName}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Email</label>
                    <p className="text-white">{selectedItemForDetails.email}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Phone</label>
                    <p className="text-white">{selectedItemForDetails.phone}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Join Date</label>
                    <p className="text-white">{selectedItemForDetails.joinDate}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Status</label>
                    <p className="text-white">{selectedItemForDetails.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isStaffDetailsModalOpen && selectedItemForDetails && (
        <ViewStaffModal
          isVisible={isStaffDetailsModalOpen}
          onClose={() => setIsStaffDetailsModalOpen(false)}
          staffData={selectedItemForDetails}
        />
      )}

      {isLeadDetailsModalOpen && selectedItemForDetails && (
        <ViewLeadModal
          isVisible={isLeadDetailsModalOpen}
          onClose={() => setIsLeadDetailsModalOpen(false)}
          leadData={selectedItemForDetails}
        />
      )}

      {isContractDetailsModalOpen && selectedItemForDetails && (
        <div className="fixed inset-0 w-full h-full bg-black/50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-2xl relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-lg font-semibold">Contract Details</h2>
                <button onClick={() => setIsContractDetailsModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4 text-white">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm">Contract Type</label>
                    <p className="text-white">{selectedItemForDetails.type}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Start Date</label>
                    <p className="text-white">{selectedItemForDetails.startDate}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">End Date</label>
                    <p className="text-white">{selectedItemForDetails.endDate}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Status</label>
                    <p className="text-white">{selectedItemForDetails.status}</p>
                  </div>
                </div>
                {selectedItemForDetails.files && selectedItemForDetails.files.length > 0 && (
                  <div>
                    <label className="text-gray-400 text-sm">Attached Files</label>
                    <div className="mt-2 space-y-1">
                      {selectedItemForDetails.files.map((file, index) => (
                        <p key={index} className="text-blue-400">
                          {file}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Staff Modal */}
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

      {/* Add New Lead Modal */}
      {isAddLeadModalOpen && (
        <AddLeadModal
          isVisible={isAddLeadModalOpen}
          onClose={() => setIsAddLeadModalOpen(false)}
          onSave={(newLead) => {
            setStudioLeads((prev) => ({
              ...prev,
              [selectedStudioForModal.id]: [...(prev[selectedStudioForModal.id] || []), newLead],
            }))
            setIsAddLeadModalOpen(false)
            toast.success("Lead added successfully")
          }}
          studioId={selectedStudioForModal.id}
          studioName={selectedStudioForModal.name}
          leadSources={defaultSources}
        />
      )}
    </>
  )
}
