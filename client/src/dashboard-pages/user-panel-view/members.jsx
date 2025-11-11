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
  FileText,
  Plus,
  ChevronUp,
} from "lucide-react"
import DefaultAvatar1 from "../../../public/gray-avatar-fotor-20250912192528.png"
import toast, { Toaster } from "react-hot-toast"
import { IoIosMenu } from "react-icons/io"
import { useNavigate } from "react-router-dom"

import HistoryModalMain from "../../components/user-panel-components/members-components/HistoryModal"
import NotifyMemberModalMain from "../../components/user-panel-components/members-components/NotifyMemberModal"
import CreateTempMemberModal from "../../components/user-panel-components/members-components/CreateTempMemberModal"
import EditMemberModalMain from "../../components/user-panel-components/members-components/EditMemberModal"
import AddBillingPeriodModalMain from "../../components/user-panel-components/members-components/AddBillingPeriodModal"
import ContingentModalMain from "../../components/user-panel-components/members-components/ShowContigentModal"
import ViewDetailsModal from "../../components/user-panel-components/members-components/ViewDetailsModal"
import AppointmentModalMain from "../../components/user-panel-components/members-components/AppointmentModal"
import FilterModal from "../../components/user-panel-components/members-components/FilterModal"
import { MemberDocumentModal } from "../../components/user-panel-components/members-components/MemberDocumentModal"
import { appointmentsMainData, appointmentTypeMainData, availableMembersLeadsMain, freeAppointmentsMainData, memberHistoryMainData, memberRelationsMainData, membersData, relationOptionsMain } from "../../utils/user-panel-states/members-states"
import AddAppointmentModal from "../../components/user-panel-components/members-components/AddAppointmentModal"
import EditAppointmentModalMain from "../../components/user-panel-components/members-components/EditAppointmentModal"


// sidebar related import
import EditTaskModal from "../../components/user-panel-components/task-components/edit-task-modal"
import EditMemberModal from "../../components/myarea-components/EditMemberModal"
import AddBillingPeriodModal from "../../components/myarea-components/AddBillingPeriodModal"
import ContingentModal from "../../components/myarea-components/ContigentModal"
import MemberDetailsModal from "../../components/myarea-components/MemberDetailsModal"
import HistoryModal from "../../components/myarea-components/HistoryModal"
import AppointmentModal from "../../components/myarea-components/AppointmentModal"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"
import EditAppointmentModal from "../../components/user-panel-components/appointments-components/selected-appointment-modal"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import AppointmentActionModal from "../../components/user-panel-components/appointments-components/appointment-action-modal"
import TrainingPlanModal from "../../components/myarea-components/TrainingPlanModal"
import Sidebar from "../../components/central-sidebar"
import DefaultAvatar from '../../../public/gray-avatar-fotor-20250912192528.png'
import { MemberOverviewModal } from "../../components/myarea-components/MemberOverviewModal"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"

import { useSidebarSystem } from "../../hooks/useSidebarSystem"
import { trainingVideosData } from "../../utils/user-panel-states/training-states"
import ChatPopup from "../../components/user-panel-components/members-components/ChatPopup"
import TrainingPlansModalMain from "../../components/user-panel-components/members-components/TrainingPlanModal"
import TrainingPlansModal from "../../components/myarea-components/TrainingPlanModal"

export default function Members() {

  const sidebarSystem = useSidebarSystem()
  const trainingVideos = trainingVideosData
  const navigate = useNavigate()
  const [isEditModalOpenMain, setIsEditModalOpenMain] = useState(false)
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false)
  const [selectedMemberMain, setSelectedMemberMain] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  // 
  const [isCompactView, setIsCompactView] = useState(false);
  const [expandedMemberId, setExpandedMemberId] = useState(null);

  const [activeNoteIdMain, setActiveNoteIdMain] = useState(null)
  const [activeTab, setActiveTab] = useState("details")
  const [tempMemberModalTab, setTempMemberModalTab] = useState("details")
  // 
  const [editModalTabMain, setEditModalTabMain] = useState("details")
  const [isDirectionDropdownOpen, setIsDirectionDropdownOpen] = useState(false)
  const [viewDetailsInitialTab, setViewDetailsInitialTab] = useState("details")

  const [chatPopup, setChatPopup] = useState({
    isOpen: false,
    member: null
  });


  const [sortBy, setSortBy] = useState("alphabetical-asc");
  const [sortDirection, setSortDirection] = useState("asc")

  const sortOptions = [
    { id: "alphabetical", label: "Alphabetical" },
    { id: "status", label: "Status" },
    { id: "relations", label: "Relations Count" },
    // { id: "age", label: "Age" },
    { id: "expiring", label: "Contracts Expiring Soon" },
  ]

  const [showCreateTempMemberModal, setShowCreateTempMemberModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [memberTypeFilter, setMemberTypeFilter] = useState("all")
  const [archivedFilter, setArchivedFilter] = useState("active")
  const [filterStatus, setFilterStatus] = useState("all")


  const [appointmentToDelete, setAppointmentToDelete] = useState(null)


  // 
  const [showAppointmentModalMain, setShowAppointmentModalMain] = useState(false)
  const [selectedMemberForAppointmentsMain, setSelectedMemberForAppointmentsMain] = useState(null)
  const [showAddAppointmentModalMain, setShowAddAppointmentModalMain] = useState(false)
  const [showSelectedAppointmentModalMain, setShowSelectedAppointmentModalMain] = useState(false)
  const [selectedAppointmentDataMain, setSelectedAppointmentDataMain] = useState(null)
  // 
  const [isNotifyMemberOpenMain, setIsNotifyMemberOpenMain] = useState(false)
  // 
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
  //  all
  const [showContingentModalMain, setShowContingentModalMain] = useState(false)
  const [tempContingentMain, setTempContingentMain] = useState({ used: 0, total: 0 })
  const [currentBillingPeriodMain, setCurrentBillingPeriodMain] = useState("04.14.25 - 04.18.2025")
  const [selectedBillingPeriodMain, setSelectedBillingPeriodMain] = useState("current")
  const [showAddBillingPeriodModalMain, setShowAddBillingPeriodModalMain] = useState(false)
  const [newBillingPeriodMain, setNewBillingPeriodMain] = useState("")

  const [availableBillingPeriods, setAvailableBillingPeriods] = useState([
    "07.14.25 - 07.18.2025",
    "08.14.25 - 08.18.2025",
    "09.14.25 - 09.18.2025",
    "10.14.25 - 10.18.2025"
  ]);

  // 
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

  // 
  const [showHistoryModalMain, setShowHistoryModalMain] = useState(false)
  // 
  const [historyTabMain, setHistoryTabMain] = useState("general")

  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [selectedMemberForDocuments, setSelectedMemberForDocuments] = useState(null)


  const handleDocumentClick = (member) => {
    setSelectedMemberForDocuments(member)
    setShowDocumentModal(true)
  }

  //  
  const [editingRelationsMain, setEditingRelationsMain] = useState(false)
  // 
  const [newRelationMain, setNewRelationMain] = useState({
    name: "",
    relation: "",
    category: "family",
    type: "manual",
    selectedMemberId: null,
  })
  // 
  const [memberRelationsMain, setMemberRelationsMain] = useState(memberRelationsMainData)

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
    gender: "",
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
  // 
  const [editFormMain, setEditFormMain] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    zipCode: "",
    gender: "",
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

  const [viewMode, setViewMode] = useState("list")

  const getRelationsCount = (memberId) => {
    const relations = memberRelationsMain[memberId]
    if (!relations) return 0
    return Object.values(relations).reduce((total, categoryRelations) => total + categoryRelations.length, 0)
  }
  const [members, setMembers] = useState(membersData)

  //  all
  const [appointmentsMain, setAppointmentsMain] = useState(appointmentsMainData)
  const [appointmentTypesMain, setAppointmentTypesMain] = useState(appointmentTypeMainData)
  const [freeAppointmentsMain, setFreeAppointmentsMain] = useState(freeAppointmentsMainData)

  const [memberHistoryMain, setMemberHistoryMain] = useState(memberHistoryMainData)

  const getActiveFiltersText = () => {
    const statusText = filterOptions.find(opt => opt.id === filterStatus)?.label.split(' (')[0] || 'All Members';
    const typeText = memberTypeFilter === 'all' ? 'All Types' :
      memberTypeFilter === 'full' ? 'Full Members' : 'Temporary Members';
    return `${statusText} & ${typeText}`;
  };


  useEffect(() => {
    if (selectedMemberMain) {
      setEditFormMain({
        firstName: selectedMemberMain.firstName,
        lastName: selectedMemberMain.lastName,
        email: selectedMemberMain.email,
        phone: selectedMemberMain.phone,
        street: selectedMemberMain.street,
        zipCode: selectedMemberMain.zipCode,
        city: selectedMemberMain.city,
        dateOfBirth: selectedMemberMain.dateOfBirth,
        about: selectedMemberMain.about,
        note: selectedMemberMain.note,
        noteStartDate: selectedMemberMain.noteStartDate,
        noteEndDate: selectedMemberMain.noteEndDate,
        noteImportance: selectedMemberMain.noteImportance,
        contractStart: selectedMemberMain.contractStart,
        contractEnd: selectedMemberMain.contractEnd,
      })
    }
  }, [selectedMemberMain])

  // 
  const handleInputChangeMain = (e) => {
    const { name, value } = e.target
    setEditFormMain((prev) => ({
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

  // 
  const handleEditSubmitMain = (e) => {
    e.preventDefault()
    const updatedMembers = members.map((member) => {
      if (member.id === selectedMemberMain.id) {
        return {
          ...member,
          ...editFormMain,
          title: `${editFormMain.firstName} ${editFormMain.lastName}`,
        }
      }
      return member
    })
    setMembers(updatedMembers)
    setIsEditModalOpenMain(false)
    setSelectedMemberMain(null)
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

  // 
  const handleArchiveMemberMain = (memberId) => {
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

  const getFirstAndLastName = (fullName) => {
    const names = fullName.split(' ');
    return {
      firstName: names[0] || '',
      lastName: names.slice(1).join(' ') || ''
    };
  };

  // 
  const handleUnarchiveMemberMain = (memberId) => {
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

  // 
  const notePopoverRefMain = useRef(null)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notePopoverRefMain.current && !notePopoverRefMain.current.contains(event.target)) {
        setActiveNoteIdMain(null)
      }

      // Fix the dropdown close logic
      if (!event.target.closest(".sort-dropdown")) {
        setIsSortDropdownOpen(false)
      }

      if (!event.target.closest(".direction-dropdown")) {
        setIsDirectionDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeNoteIdMain])


  const filterOptions = [
    { id: "all", label: `All Members (${members.length})` },
    { id: "active", label: `Active Members (${members.filter((m) => m.isActive && !m.isArchived).length})` },
    { id: "paused", label: `Paused Members (${members.filter((m) => !m.isActive && !m.isArchived).length})` },
    { id: "archived", label: `Archived Members (${members.filter((m) => m.isArchived).length})` },
  ]

  // 
  const isContractExpiringSoonMain = (contractEnd) => {
    if (!contractEnd) return false
    const today = new Date()
    const endDate = new Date(contractEnd)
    const oneMonthFromNow = new Date()
    oneMonthFromNow.setMonth(today.getMonth() + 1)
    return endDate <= oneMonthFromNow && endDate >= today
  }

  const filteredAndSortedMembers = () => {
    let filtered = members.filter((member) => member.title.toLowerCase().includes(searchQuery.toLowerCase()))

    // Apply filters
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

    // Extract field and direction from sortBy
    const [field, direction] = sortBy.split("-");

    // Apply sorting
    if (field === "alphabetical") {
      filtered.sort((a, b) => {
        const comparison = a.title.localeCompare(b.title)
        return direction === "asc" ? comparison : -comparison
      })
    } else if (field === "status") {
      filtered.sort((a, b) => {
        const getStatusPriority = (member) => {
          if (member.isArchived) return 3
          if (!member.isActive) return 2
          return 1
        }
        const comparison = getStatusPriority(a) - getStatusPriority(b)
        return direction === "asc" ? comparison : -comparison
      })
    } else if (field === "relations") {
      filtered.sort((a, b) => {
        const comparison = getRelationsCount(a.id) - getRelationsCount(b.id)
        return direction === "asc" ? comparison : -comparison
      })
    } else if (field === "age") {
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
        return direction === "asc" ? comparison : -comparison
      })
    } else if (field === "expiring") {
      // Sort members with contracts expiring first, then by expiration date
      filtered.sort((a, b) => {
        const aExpiring = isContractExpiringSoonMain(a.contractEnd)
        const bExpiring = isContractExpiringSoonMain(b.contractEnd)

        // If both are expiring or both are not expiring, sort by contract end date
        if (aExpiring === bExpiring) {
          if (!a.contractEnd && !b.contractEnd) return 0
          if (!a.contractEnd) return direction === "asc" ? 1 : -1
          if (!b.contractEnd) return direction === "asc" ? -1 : 1

          const comparison = new Date(a.contractEnd) - new Date(b.contractEnd)
          return direction === "asc" ? comparison : -comparison
        }

        // Prioritize expiring contracts
        if (direction === "asc") {
          return bExpiring ? 1 : -1
        } else {
          return aExpiring ? 1 : -1
        }
      })
    }

    return filtered
  }


  const handleEditMember = (member) => {
    setSelectedMemberMain(member)
    setIsEditModalOpenMain(true)
    setEditModalTabMain("details")
  }

  const handleViewDetails = (member) => {
    setSelectedMemberMain(member)
    setViewDetailsInitialTab("details")
    setIsViewDetailsModalOpen(true)
  }

  // 
  const calculateAgeMain = (dateOfBirth) => {
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

  const [showTrainingPlansModalMain, setShowTrainingPlansModalMain] = useState(false)
  const [selectedMemberForTrainingPlansMain, setSelectedMemberForTrainingPlansMain] = useState(null)
  const [memberTrainingPlansMain, setMemberTrainingPlansMain] = useState({})
  const [availableTrainingPlansMain, setAvailableTrainingPlansMain] = useState([
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
    setSelectedMemberForAppointmentsMain(member)
    setShowAppointmentModalMain(true)
  }

  const handleTrainingPlansClickMain = (member) => {
    setSelectedMemberForTrainingPlansMain(member)
    setShowTrainingPlansModalMain(true)
  }

  const handleAssignTrainingPlanMain = (memberId, planId) => {
    const plan = availableTrainingPlansMain.find((p) => p.id === Number.parseInt(planId))
    if (plan) {
      const assignedPlan = {
        ...plan,
        assignedDate: new Date().toLocaleDateString(),
      }

      setMemberTrainingPlansMain((prev) => ({
        ...prev,
        [memberId]: [...(prev[memberId] || []), assignedPlan],
      }))

      toast.success(`Training plan "${plan.name}" assigned successfully!`)
    }
  }

  const handleRemoveTrainingPlanMain = (memberId, planId) => {
    setMemberTrainingPlansMain((prev) => ({
      ...prev,
      [memberId]: (prev[memberId] || []).filter((plan) => plan.id !== planId),
    }))

    toast.success("Training plan removed successfully!")
  }
  // 
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
    const memberData = memberContingent[selectedMemberForAppointmentsMain.id]
    if (periodId === "current") {
      setTempContingentMain(memberData.current)
    } else {
      setTempContingentMain(memberData.future[periodId] || { used: 0, total: 0 })
    }
  }

  // 
  const handleSaveContingentMain = () => {
    if (selectedMemberForAppointmentsMain) {
      const updatedContingent = { ...memberContingent }
      if (selectedBillingPeriodMain === "current") {
        updatedContingent[selectedMemberForAppointmentsMain.id].current = { ...tempContingentMain }
      } else {
        if (!updatedContingent[selectedMemberForAppointmentsMain.id].future) {
          updatedContingent[selectedMemberForAppointmentsMain.id].future = {}
        }
        updatedContingent[selectedMemberForAppointmentsMain.id].future[selectedBillingPeriodMain] = { ...tempContingentMain }
      }
      setMemberContingent(updatedContingent)
      toast.success("Contingent updated successfully")
    }
    setShowContingentModalMain(false)
  }

  // 
  const handleAddBillingPeriodMain = () => {
    if (newBillingPeriodMain.trim() && selectedMemberForAppointmentsMain) {
      const updatedContingent = { ...memberContingent };
      if (!updatedContingent[selectedMemberForAppointmentsMain.id].future) {
        updatedContingent[selectedMemberForAppointmentsMain.id].future = {};
      }
      updatedContingent[selectedMemberForAppointmentsMain.id].future[newBillingPeriodMain] = { used: 0, total: 0 };
      setMemberContingent(updatedContingent);

      // Remove the used period from available periods
      setAvailableBillingPeriods(prev =>
        prev.filter(period => period !== newBillingPeriodMain)
      );

      setNewBillingPeriodMain("");
      setShowAddBillingPeriodModalMain(false);
      toast.success("New billing period added successfully");
    }
  };

  // 
  const handleEditAppointmentMain = (appointment) => {
    const fullAppointment = {
      ...appointment,
      name: selectedMemberForAppointmentsMain?.title || "Member",
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

  // 
  const handleCreateNewAppointmentMain = () => {
    setShowAddAppointmentModalMain(true)
    setShowAppointmentModalMain(false)
  }

  const handleAddAppointmentSubmit = (data) => {
    const newAppointment = {
      id: Math.max(0, ...appointmentsMain.map((a) => a.id)) + 1,
      ...data,
      memberId: selectedMemberForAppointmentsMain?.id,
    }
    setAppointmentsMain([...appointmentsMain, newAppointment])
    setShowAddAppointmentModalMain(false)
  }

  // 
  const handleDeleteAppointmentMain = (id) => {
    setAppointmentToDelete(id)
  }

  const confirmDeleteAppointment = () => {
    setAppointmentsMain(appointmentsMain.filter((app) => app.id !== appointmentToDelete))
    setSelectedAppointmentDataMain(null)
    setShowSelectedAppointmentModalMain(false)
    setIsNotifyMemberOpenMain(true)
    setNotifyActionMain("delete")
    setAppointmentToDelete(null)
  }
  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid")
  }

  const handleAppointmentChange = (changes) => {
    if (selectedAppointmentDataMain) {
      setSelectedAppointmentDataMain({
        ...selectedAppointmentDataMain,
        ...changes,
      })
    }
  }

  const handleHistoryClick = (member) => {
    setSelectedMemberMain(member)
    setShowHistoryModalMain(true)
  }

  const handleChatClick = (member) => {
    setChatPopup({
      isOpen: true,
      member: member
    });
  };

  const handleOpenFullMessenger = (member) => {
    setChatPopup({ isOpen: false, member: null });
    window.location.href = `/dashboard/communication`;
  };

  const handleRelationClick = (member) => {
    setSelectedMemberMain(member)
    setViewDetailsInitialTab("relations")
    setIsViewDetailsModalOpen(true)
  }

  // 
  const handleAddRelationMain = () => {
    if (!newRelationMain.name || !newRelationMain.relation) {
      toast.error("Please fill in all fields")
      return
    }
    const relationId = Date.now()
    const updatedRelations = { ...memberRelationsMain }
    if (!updatedRelations[selectedMemberMain.id]) {
      updatedRelations[selectedMemberMain.id] = {
        family: [],
        friendship: [],
        relationship: [],
        work: [],
        other: [],
      }
    }
    updatedRelations[selectedMemberMain.id][newRelationMain.category].push({
      id: relationId,
      name: newRelationMain.name,
      relation: newRelationMain.relation,
      type: newRelationMain.type,
    })
    setMemberRelationsMain(updatedRelations)
    setNewRelationMain({ name: "", relation: "", category: "family", type: "manual", selectedMemberId: null })
    toast.success("Relation added successfully")
  }

  // 
  const handleDeleteRelationMain = (category, relationId) => {
    const updatedRelations = { ...memberRelationsMain }
    updatedRelations[selectedMemberMain.id][category] = updatedRelations[selectedMemberMain.id][category].filter(
      (rel) => rel.id !== relationId,
    )
    setMemberRelationsMain(updatedRelations)
    toast.success("Relation deleted successfully")
  }

  // 
  const getMemberAppointmentsMain = (memberId) => {
    return appointmentsMain.filter((app) => app.memberId === memberId)
  }


  // Extract all states and functions from the hook
  const {
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
    customLinks, setCustomLinks, communications, setCommunications,
    todos, setTodos, expiringContracts, setExpiringContracts,
    birthdays, setBirthdays, notifications, setNotifications,
    appointments, setAppointments,
    memberContingentData, setMemberContingentData,
    memberRelations, setMemberRelations,

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
  } = sidebarSystem;

  // more sidebar related functions

  // Chart configuration
  const chartSeries = [
    { name: "Comp1", data: memberTypes[selectedMemberType].data[0] },
    { name: "Comp2", data: memberTypes[selectedMemberType].data[1] },
  ];

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
  };


  // Wrapper functions to pass local state to hook functions
  const handleTaskCompleteWrapper = (taskId) => {
    handleTaskComplete(taskId, todos, setTodos);
  };

  const handleUpdateTaskWrapper = (updatedTask) => {
    handleUpdateTask(updatedTask, setTodos);
  };

  const handleCancelTaskWrapper = (taskId) => {
    handleCancelTask(taskId, setTodos);
  };

  const handleDeleteTaskWrapper = (taskId) => {
    handleDeleteTask(taskId, setTodos);
  };

  const handleEditNoteWrapper = (appointmentId, currentNote) => {
    handleEditNote(appointmentId, currentNote, appointments);
  };

  const handleCheckInWrapper = (appointmentId) => {
    handleCheckIn(appointmentId, appointments, setAppointments);
  };

  const handleSaveSpecialNoteWrapper = (appointmentId, updatedNote) => {
    handleSaveSpecialNote(appointmentId, updatedNote, setAppointments);
  };

  const actuallyHandleCancelAppointmentWrapper = (shouldNotify) => {
    actuallyHandleCancelAppointment(shouldNotify, appointments, setAppointments);
  };

  const handleDeleteAppointmentWrapper = (id) => {
    handleDeleteAppointment(id, appointments, setAppointments);
  };

  const getMemberAppointmentsWrapper = (memberId) => {
    return getMemberAppointments(memberId, appointments);
  };

  const handleAddBillingPeriodWrapper = () => {
    handleAddBillingPeriod(memberContingentData, setMemberContingentData);
  };

  const handleSaveContingentWrapper = () => {
    handleSaveContingent(memberContingentData, setMemberContingentData);
  };

  const handleEditSubmitWrapper = (e) => {
    handleEditSubmit(e, appointments, setAppointments);
  };

  const handleAddRelationWrapper = () => {
    handleAddRelation(memberRelations, setMemberRelations);
  };

  const handleDeleteRelationWrapper = (category, relationId) => {
    handleDeleteRelation(category, relationId, memberRelations, setMemberRelations);
  };

  const handleArchiveMemberWrapper = (memberId) => {
    handleArchiveMember(memberId, appointments, setAppointments);
  };

  const handleUnarchiveMemberWrapper = (memberId) => {
    handleUnarchiveMember(memberId, appointments, setAppointments);
  };

  const getBillingPeriodsWrapper = (memberId) => {
    return getBillingPeriods(memberId, memberContingentData);
  };




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
      <div
        className={`flex flex-col lg:flex-row rounded-3xl bg-[#1C1C1C] transition-all duration-500 text-white relative ${isRightSidebarOpen ? "lg:mr-96 mr-0" : "mr-0"
          }`}
      >
        <div className="flex-1 min-w-0 md:p-6 p-4 pb-36">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 w-full">
            {/* Left Section (Members + View Mode) */}
            <div className="flex w-full lg:w-auto justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl oxanium_font text-white">Members</h1>


              </div>


              {isRightSidebarOpen ? (<div onClick={toggleRightSidebar} className="md:hidden block ">
                <img src='/expand-sidebar mirrored.svg' className="h-5 w-5 cursor-pointer" alt="" />
              </div>
              ) : (<div onClick={toggleRightSidebar} className="md:hidden block ">
                <img src="/icon.svg" className="h-5 w-5 cursor-pointer" alt="" />
              </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <div className="flex gap-2">


                {/* View Mode Switch (only visible on small + tablet, left beside heading) */}
                <div className="flex items-center gap-1 bg-black rounded-xl p-1 lg:hidden">
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

                {/* Desktop View Mode (only visible on lg+) */}
                <div className="hidden lg:flex items-center gap-1 bg-black rounded-xl p-1">
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

                {/* Display Mode Switch */}
                <div className="flex bg-black items-center rounded-xl border border-gray-800 p-1 w-fit">
                  <span className="text-xs text-gray-400 px-2">Display</span>
                  <button
                    onClick={() => setIsCompactView(false)}
                    className={`p-2 rounded-lg transition-colors ${!isCompactView ? "bg-[#F27A30] text-white" : "text-gray-400 hover:text-white"
                      }`}
                    title="Detailed View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsCompactView(true)}
                    className={`p-2 rounded-lg transition-colors ${isCompactView ? "bg-[#F27A30] text-white" : "text-gray-400 hover:text-white"
                      }`}
                    title="Compact View"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowCreateTempMemberModal(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm"
              >
                <Plus size={16} />
                Create Temp Member
              </button>

              <button
                onClick={() => setShowFilterModal(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm border border-slate-300/30 bg-black min-w-[160px]"
              >
                <Filter size={16} />
                <span className="truncate">
                  {(filterStatus !== 'all' || memberTypeFilter !== 'all')
                    ? getActiveFiltersText()
                    : 'Filter'}
                </span>
              </button>



              {isRightSidebarOpen ? (<div onClick={toggleRightSidebar} className="md:block hidden ">
                <img src='/expand-sidebar mirrored.svg' className="h-5 w-5 cursor-pointer" alt="" />
              </div>
              ) : (<div onClick={toggleRightSidebar} className="md:block hidden ">
                <img src="/icon.svg" className="h-5 w-5 cursor-pointer" alt="" />
              </div>
              )}
            </div>
          </div>

          <div className="flex justify-end items-center mb-4">
            <div className="flex items-center justify-end gap-2 w-full">
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm whitespace-nowrap">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="cursor-pointer px-4 py-2 rounded-xl text-sm border border-slate-300/30 bg-black min-w-[200px]"
                >
                  <option value="alphabetical-asc">Alphabetical (A-Z)</option>
                  <option value="alphabetical-desc">Alphabetical (Z-A)</option>
                  <option value="status-asc">Status (Active First)</option>
                  <option value="status-desc">Status (Archived First)</option>
                  <option value="relations-asc">Relations Count (Low to High)</option>
                  <option value="relations-desc">Relations Count (High to Low)</option>
                  <option value="expiring-asc">Contracts Expiring Soon</option>
                  <option value="expiring-desc">Contracts Expiring Last</option>
                </select>
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

          <div className="open_sans_font">
            {viewMode === "list" ? (
              // LIST VIEW
              isCompactView ? (
                // COMPACT LIST VIEW
                <div className="space-y-2">
                  {filteredAndSortedMembers().length > 0 ? (
                    filteredAndSortedMembers().map((member) => (
                      <div key={member.id}>
                        {expandedMemberId === member.id ? (
                          // Expanded compact view - shows full details
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between bg-[#141414] p-4 rounded-xl hover:bg-[#1a1a1a] transition-colors gap-4 relative">
                            {/* Note indicator */}
                            {member.note && (
                              <div className="absolute top-3 left-3 z-10">
                                <div className="relative">
                                  <div
                                    className={`${member.noteImportance === "important" ? "bg-red-500" : "bg-blue-500"
                                      } rounded-full p-0.5 shadow-[0_0_0_1.5px_white] cursor-pointer`}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setActiveNoteIdMain(activeNoteIdMain === member.id ? null : member.id)
                                    }}
                                  >
                                    {member.noteImportance === "important" ? (
                                      <AlertTriangle size={18} className="text-white" />
                                    ) : (
                                      <Info size={18} className="text-white" />
                                    )}
                                  </div>
                                  {activeNoteIdMain === member.id && (
                                    <div
                                      ref={notePopoverRefMain}
                                      className="absolute left-6 top-4 w-72 bg-black/90 backdrop-blur-xl rounded-lg border border-gray-700 shadow-lg z-[10000000]"
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
                                            {member.noteImportance === "important" ? "(Important)" : ""}
                                          </div>
                                        </h4>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            setActiveNoteIdMain(null)
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

                            <div className="flex items-center gap-4 flex-1 min-w-0 pl-4">
                              <img
                                src={member.image || DefaultAvatar1}
                                className="h-12 w-12 rounded-2xl flex-shrink-0 object-cover"
                                alt=""
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                  <h3 className="text-white font-medium text-base sm:text-lg truncate">
                                    {member.title}
                                  </h3>

                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {member.isArchived ? (
                                      <span className="px-2 py-0.5 text-xs rounded-full bg-red-600 text-white">Archived</span>
                                    ) : (
                                      <span
                                        className={`px-2 py-0.5 text-xs rounded-full ${member.isActive ? "bg-green-900 text-green-300" : "bg-yellow-600 text-white"
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
                                        <span className={isContractExpiringSoonMain(member.contractEnd) ? "text-red-500" : ""}>
                                          {member.contractEnd}
                                        </span>
                                        {isContractExpiringSoonMain(member.contractEnd) && (
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
                                    Relations ({Object.values(memberRelationsMain[member.id] || {}).flat().length})
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex flex-col gap-2 flex-shrink-0 w-full sm:w-auto">
                              <div className="grid grid-cols-5 gap-2">
                                <button
                                  onClick={() => handleCalendarClick(member)}
                                  className="text-white bg-black rounded-xl border border-slate-600 py-2 px-1 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                                  title="View Appointments"
                                >
                                  <Calendar size={16} />
                                </button>
                                <button
                                  onClick={() => handleTrainingPlansClickMain(member)}
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
                                  <FileText size={16} />
                                </button>
                                <button
                                  onClick={() => handleChatClick(member)}
                                  className="text-white bg-black rounded-xl border border-slate-600 py-2 px-1 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                                  title="Start Chat"
                                >
                                  <MessageCircle size={16} />
                                </button>
                              </div>

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

                            <button
                              onClick={() => setExpandedMemberId(null)}
                              className="p-2 bg-black rounded-xl border border-slate-600 hover:border-slate-400 transition-colors"
                              title="Collapse"
                            >
                              <ChevronUp className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        ) : (
                          // Collapsed compact view - minimal info
                          <div className="flex items-center justify-between bg-[#141414] p-3 rounded-xl hover:bg-[#1a1a1a] transition-colors gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <img
                                src={member.image || DefaultAvatar1}
                                alt={member.title}
                                className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-white font-medium text-sm truncate">
                                    {getFirstAndLastName(member.title).firstName}
                                  </span>
                                  <span className="text-white font-medium text-sm truncate">
                                    {getFirstAndLastName(member.title).lastName}
                                  </span>
                                  <span
                                    className={`px-1.5 py-0.5 text-xs font-medium rounded flex-shrink-0 ${member.isArchived
                                      ? "bg-red-600 text-white"
                                      : member.isActive
                                        ? "bg-green-600 text-white"
                                        : "bg-yellow-600 text-white"
                                      }`}
                                  >
                                    {member.isArchived ? "A" : member.isActive ? "A" : "P"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => setExpandedMemberId(member.id)}
                              className="p-2 bg-black rounded-xl border border-slate-600 hover:border-slate-400 transition-colors flex-shrink-0"
                              title="Expand"
                            >
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))
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
              ) : (
                // DETAILED LIST VIEW
                <div className="flex flex-col gap-3">
                  {filteredAndSortedMembers().length > 0 ? (
                    filteredAndSortedMembers().map((member) => (
                      <div
                        key={member.id}
                        className="bg-[#161616] rounded-xl relative p-4 sm:p-6"
                      >
                        {/* Note indicator */}
                        {member.note && (
                          <div className="absolute top-3 left-3 z-10">
                            <div className="relative">
                              <div
                                className={`${member.noteImportance === "important" ? "bg-red-500" : "bg-blue-500"
                                  } rounded-full p-0.5 shadow-[0_0_0_1.5px_white] cursor-pointer`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setActiveNoteIdMain(activeNoteIdMain === member.id ? null : member.id)
                                }}
                              >
                                {member.noteImportance === "important" ? (
                                  <AlertTriangle size={18} className="text-white" />
                                ) : (
                                  <Info size={18} className="text-white" />
                                )}
                              </div>
                              {activeNoteIdMain === member.id && (
                                <div
                                  ref={notePopoverRefMain}
                                  className="absolute left-6 top-4 w-72 bg-black/90 backdrop-blur-xl rounded-lg border border-gray-700 shadow-lg z-[10000000]"
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
                                        {member.noteImportance === "important" ? "(Important)" : ""}
                                      </div>
                                    </h4>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setActiveNoteIdMain(null)
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

                        <div className="flex flex-col lg:flex-row lg:items-center gap-4 pl-4">
                          {/* Left side - Profile info */}
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <img
                              src={member.image || DefaultAvatar1}
                              className="h-12 w-12 sm:h-20 sm:w-20 rounded-2xl flex-shrink-0 object-cover"
                              alt=""
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <h3 className="text-white font-medium text-base sm:text-lg truncate">
                                  {member.title}
                                </h3>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {member.isArchived ? (
                                    <span className="px-2 py-0.5 text-xs rounded-full bg-red-600 text-white">Archived</span>
                                  ) : (
                                    <span
                                      className={`px-2 py-0.5 text-xs rounded-full ${member.isActive ? "bg-green-900 text-green-300" : "bg-yellow-600 text-white"
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
                                      <span className={isContractExpiringSoonMain(member.contractEnd) ? "text-red-500" : ""}>
                                        {member.contractEnd}
                                      </span>
                                      {isContractExpiringSoonMain(member.contractEnd) && (
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
                                  Relations ({Object.values(memberRelationsMain[member.id] || {}).flat().length})
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
                                onClick={() => handleTrainingPlansClickMain(member)}
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
                                <FileText size={16} />
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
                      </div>
                    ))
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
              )
            ) : // GRID VIEW
              isCompactView ? (
                // COMPACT GRID VIEW
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {filteredAndSortedMembers().length > 0 ? (
                    filteredAndSortedMembers().map((member) => (
                      <div key={member.id}>
                        {expandedMemberId === member.id ? (
                          // Expanded view within grid
                          <div className="bg-[#141414] p-4 rounded-xl hover:bg-[#1a1a1a] transition-colors flex flex-col h-full col-span-2 md:col-span-2 lg:col-span-2 relative">
                            {/* Note indicator */}
                            {member.note && (
                              <div className="absolute top-3 left-3 z-10">
                                <div className="relative">
                                  <div
                                    className={`${member.noteImportance === "important" ? "bg-red-500" : "bg-blue-500"
                                      } rounded-full p-0.5 shadow-[0_0_0_1.5px_white] cursor-pointer`}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setActiveNoteIdMain(activeNoteIdMain === member.id ? null : member.id)
                                    }}
                                  >
                                    {member.noteImportance === "important" ? (
                                      <AlertTriangle size={18} className="text-white" />
                                    ) : (
                                      <Info size={18} className="text-white" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Header section */}
                            <div className="flex justify-between items-start mb-3 pl-4">
                              <span
                                className={`px-2 py-0.5 text-xs font-medium rounded-lg ${member.isArchived
                                  ? "bg-red-600 text-white"
                                  : member.isActive
                                    ? "bg-green-600 text-white"
                                    : "bg-yellow-600 text-white"
                                  }`}
                              >
                                {member.isArchived ? "Archived" : member.isActive ? "Active" : `Paused${member.reason ? ` (${member.reason})` : ""}`}
                              </span>
                            </div>

                            {/* Content section */}
                            <div className="flex-1 mb-4 flex flex-col gap-1.5 pl-4">
                              <div className="flex items-center gap-3 mb-3">
                                <img
                                  src={member.image || DefaultAvatar1}
                                  className="h-16 w-16 rounded-2xl flex-shrink-0 object-cover"
                                  alt=""
                                />
                                <div>
                                  <h3 className="text-white font-medium text-lg leading-tight">{member.title}</h3>
                                  <p className="text-gray-400 text-sm">
                                    {member.memberType === "full" ? "Full Member" : "Temporary Member"}
                                  </p>
                                </div>
                              </div>

                              <p className="text-gray-400 text-sm leading-snug">
                                {member.memberType === "full" ? (
                                  <>
                                    Contract: {member.contractStart} -{" "}
                                    <span className={isContractExpiringSoonMain(member.contractEnd) ? "text-red-500" : ""}>
                                      {member.contractEnd}
                                    </span>
                                    {isContractExpiringSoonMain(member.contractEnd) && (
                                      <Info size={14} className="text-red-500 ml-1" />
                                    )}
                                  </>
                                ) : (
                                  <>
                                    No Contract - Auto-archive: {member.autoArchiveDate}
                                    {member.autoArchiveDate && new Date(member.autoArchiveDate) <= new Date() && (
                                      <Clock size={14} className="text-orange-500 ml-1" />
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
                                  Relations ({Object.values(memberRelationsMain[member.id] || {}).flat().length})
                                </button>
                              </div>
                            </div>

                            {/* Button section */}
                            <div className="flex flex-col gap-2 mt-auto">
                              <div className="grid grid-cols-5 gap-2">
                                <button
                                  onClick={() => handleCalendarClick(member)}
                                  className="text-white bg-black rounded-xl border border-slate-600 py-2 px-1 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                                  title="View Appointments"
                                >
                                  <Calendar size={16} />
                                </button>
                                <button
                                  onClick={() => handleTrainingPlansClickMain(member)}
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
                                  <FileText size={16} />
                                </button>
                                <button
                                  onClick={() => handleChatClick(member)}
                                  className="text-white bg-black rounded-xl border border-slate-600 py-2 px-1 hover:border-slate-400 transition-colors text-sm flex items-center justify-center"
                                  title="Start Chat"
                                >
                                  <MessageCircle size={16} />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 gap-2">
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

                              <button
                                onClick={() => setExpandedMemberId(null)}
                                className="px-3 py-1.5 bg-black text-sm cursor-pointer text-white border border-gray-800 rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                                title="Collapse"
                              >
                                <ChevronUp size={16} />
                                Collapse
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Compact tile view
                          <div className="bg-[#141414] p-3 rounded-xl hover:bg-[#1a1a1a] transition-colors flex flex-col items-center justify-center gap-2 h-full relative">
                            {/* Note indicator - positioned inside the card */}
                            {member.note && (
                              <div className="absolute top-2 left-2 z-10">
                                <div className="relative">
                                  <div
                                    className={`${member.noteImportance === "important" ? "bg-red-500" : "bg-blue-500"
                                      } rounded-full p-0.5 shadow-[0_0_0_1.5px_white] cursor-pointer`}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setActiveNoteIdMain(activeNoteIdMain === member.id ? null : member.id)
                                    }}
                                  >
                                    {member.noteImportance === "important" ? (
                                      <AlertTriangle size={14} className="text-white" />
                                    ) : (
                                      <Info size={14} className="text-white" />
                                    )}
                                  </div>
                                  {activeNoteIdMain === member.id && (
                                    <div
                                      ref={notePopoverRefMain}
                                      className="absolute left-6 top-0 w-72 bg-black/90 backdrop-blur-xl rounded-lg border border-gray-700 shadow-lg z-[10000000]"
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
                                            setActiveNoteIdMain(null)
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

                            <div className="relative w-full">
                              <img
                                src={member.image || DefaultAvatar1}
                                alt={member.title}
                                className="w-12 h-12 rounded-full mx-auto object-cover"
                              />
                              <span
                                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white ${member.isArchived
                                  ? "bg-red-600"
                                  : member.isActive
                                    ? "bg-green-600"
                                    : "bg-yellow-600"
                                  }`}
                              >
                                {member.isArchived ? "A" : member.isActive ? "A" : "P"}
                              </span>
                            </div>

                            <div className="text-center w-full min-w-0">
                              <p className="text-white font-medium text-xs truncate">
                                {getFirstAndLastName(member.title).firstName}
                              </p>
                              <p className="text-gray-400 text-xs truncate">
                                {getFirstAndLastName(member.title).lastName}
                              </p>
                            </div>

                            <button
                              onClick={() => setExpandedMemberId(member.id)}
                              className="p-1.5 bg-black rounded-lg border border-slate-600 hover:border-slate-400 transition-colors w-full flex items-center justify-center"
                              title="Expand"
                            >
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>
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
              ) : (
                // DETAILED GRID VIEW
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAndSortedMembers().length > 0 ? (
                    filteredAndSortedMembers().map((member) => (
                      <div
                        key={member.id}
                        className="bg-[#161616] rounded-xl relative p-4"
                      >
                        {/* Note indicator */}
                        {member.note && (
                          <div className="absolute top-3 left-3 z-10">
                            <div className="relative">
                              <div
                                className={`${member.noteImportance === "important" ? "bg-red-500" : "bg-blue-500"
                                  } rounded-full p-0.5 shadow-[0_0_0_1.5px_white] cursor-pointer`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setActiveNoteIdMain(activeNoteIdMain === member.id ? null : member.id)
                                }}
                              >
                                {member.noteImportance === "important" ? (
                                  <AlertTriangle size={18} className="text-white" />
                                ) : (
                                  <Info size={18} className="text-white" />
                                )}
                              </div>
                              {activeNoteIdMain === member.id && (
                                <div
                                  ref={notePopoverRefMain}
                                  className="absolute left-6 top-4 w-72 bg-black/90 backdrop-blur-xl rounded-lg border border-gray-700 shadow-lg z-[10000000]"
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
                                        setActiveNoteIdMain(null)
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

                        <div className="flex flex-col">
                          <div className="flex flex-col items-center mb-4">
                            <img
                              src={member.image || DefaultAvatar1}
                              className="h-20 w-20 rounded-2xl flex-shrink-0 object-cover mb-3"
                              alt=""
                            />
                            <div className="flex flex-col items-center">
                              <div className="flex flex-col sm:flex-row items-center gap-2">
                                <h3 className="text-white font-medium truncate text-lg">
                                  {member.title}
                                </h3>

                                <div className="flex items-center gap-2">
                                  {member.isArchived ? (
                                    <span className="px-2 py-0.5 text-xs rounded-full bg-red-600 text-white">Archived</span>
                                  ) : (
                                    <span
                                      className={`px-2 py-0.5 text-xs rounded-full ${member.isActive ? "bg-green-900 text-green-300" : "bg-yellow-600 text-white"
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
                                    <span className={isContractExpiringSoonMain(member.contractEnd) ? "text-red-500" : ""}>
                                      {member.contractEnd}
                                    </span>
                                    {isContractExpiringSoonMain(member.contractEnd) && (
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
                                  Relations ({Object.values(memberRelationsMain[member.id] || {}).flat().length})
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
                              onClick={() => handleTrainingPlansClickMain(member)}
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
                              className="text-white flex-1 sm:flex-none bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2 relative"
                              title="Document Management"
                            >
                              <FileText size={16} />
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
              )}
          </div>

          {/* Your existing modals */}
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
            editingRelationsMain={editingRelationsMain}
            setEditingRelationsMain={setEditingRelationsMain}
            newRelationMain={newRelationMain}
            setNewRelationMain={setNewRelationMain}
            availableMembersLeadsMain={availableMembersLeadsMain}
            relationOptionsMain={relationOptionsMain}
          />

          <EditMemberModalMain
            isOpen={isEditModalOpenMain}
            onClose={() => {
              setIsEditModalOpenMain(false)
              setSelectedMemberMain(null)
            }}
            selectedMemberMain={selectedMemberMain}
            editModalTabMain={editModalTabMain}
            setEditModalTabMain={setEditModalTabMain}
            editFormMain={editFormMain}
            handleInputChangeMain={handleInputChangeMain}
            handleEditSubmitMain={handleEditSubmitMain}
            editingRelationsMain={editingRelationsMain}
            setEditingRelationsMain={setEditingRelationsMain}
            newRelationMain={newRelationMain}
            setNewRelationMain={setNewRelationMain}
            availableMembersLeadsMain={availableMembersLeadsMain}
            relationOptionsMain={relationOptionsMain}
            handleAddRelationMain={handleAddRelationMain}
            memberRelationsMain={memberRelationsMain}
            handleDeleteRelationMain={handleDeleteRelationMain}
            handleArchiveMemberMain={handleArchiveMemberMain}
            handleUnarchiveMemberMain={handleUnarchiveMemberMain}
          />
        </div>
      </div>

      {appointmentToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000000]">
          <div className="bg-[#181818] text-white rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Appointment</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this appointment? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setAppointmentToDelete(null)}
                className="px-4 py-2 bg-[#2F2F2F] text-sm text-white rounded-xl hover:bg-[#2F2F2F]/90"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAppointment}
                className="px-4 py-2 bg-red-600 text-sm text-white rounded-xl hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <ViewDetailsModal
        isOpen={isViewDetailsModalOpen}
        onClose={() => {
          setIsViewDetailsModalOpen(false)
          setSelectedMemberMain(null)
        }}
        selectedMemberMain={selectedMemberMain}
        memberRelationsMain={memberRelationsMain}
        calculateAgeMain={calculateAgeMain}
        isContractExpiringSoonMain={isContractExpiringSoonMain}
        redirectToContract={redirectToContract}
        handleEditMember={handleEditMember}
        setEditModalTabMain={setEditModalTabMain}
        DefaultAvatar1={DefaultAvatar1}
        initialTab={viewDetailsInitialTab}
      />
      <AppointmentModalMain
        isOpen={showAppointmentModalMain}
        onClose={() => {
          setShowAppointmentModalMain(false)
          setSelectedMemberForAppointmentsMain(null)
        }}
        selectedMemberMain={selectedMemberForAppointmentsMain}
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
      <MemberDocumentModal
        member={selectedMemberForDocuments}
        isOpen={showDocumentModal}
        onClose={() => {
          setShowDocumentModal(false)
          setSelectedMemberForDocuments(null)
        }}
      />
      <ContingentModalMain
        showContingentModalMain={showContingentModalMain}
        setShowContingentModalMain={setShowContingentModalMain}
        selectedMemberForAppointmentsMain={selectedMemberForAppointmentsMain}
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
        availableBillingPeriods={availableBillingPeriods}
      />
      <TrainingPlansModalMain
        isOpen={showTrainingPlansModalMain}
        onClose={() => {
          setShowTrainingPlansModalMain(false)
          setSelectedMemberForTrainingPlansMain(null)
        }}
        selectedMemberMain={selectedMemberForTrainingPlansMain}
        memberTrainingPlansMain={memberTrainingPlansMain[selectedMemberForTrainingPlansMain?.id] || []}
        availableTrainingPlansMain={availableTrainingPlansMain}
        onAssignPlanMain={handleAssignTrainingPlanMain}
        onRemovePlanMain={handleRemoveTrainingPlanMain}
      />
      <HistoryModalMain
        show={showHistoryModalMain}
        member={selectedMemberMain}
        memberHistoryMain={memberHistoryMain}
        historyTabMain={historyTabMain}
        setHistoryTabMain={setHistoryTabMain}
        onClose={() => setShowHistoryModalMain(false)}
      />
      <NotifyMemberModalMain open={isNotifyMemberOpenMain} action={notifyActionMain} onClose={() => setIsNotifyMemberOpenMain(false)} />


      {chatPopup.isOpen && chatPopup.member && (
        <ChatPopup
          member={chatPopup.member}
          isOpen={chatPopup.isOpen}
          onClose={() => setChatPopup({ isOpen: false, member: null })}
          onOpenFullMessenger={() => handleOpenFullMessenger(chatPopup.member)}
        />
      )}
      {/* sidebar related modal  */}

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
        handleTaskComplete={handleTaskCompleteWrapper}
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
        handleCheckIn={handleCheckInWrapper}
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
        hasUnreadNotifications={2}
        setIsWidgetModalOpen={setIsWidgetModalOpen}
        handleEditNote={handleEditNoteWrapper}
        activeNoteId={activeNoteId}
        setActiveNoteId={setActiveNoteId}
        isSpecialNoteModalOpen={isSpecialNoteModalOpen}
        setIsSpecialNoteModalOpen={setIsSpecialNoteModalOpen}
        selectedAppointmentForNote={selectedAppointmentForNote}
        setSelectedAppointmentForNote={setSelectedAppointmentForNote}
        handleSaveSpecialNote={handleSaveSpecialNoteWrapper}
        onSaveSpecialNote={handleSaveSpecialNoteWrapper}
        notifications={notifications}
        setTodos={setTodos}
      />

      {/* Sidebar related modals */}
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

      <AppointmentActionModalV2
        isOpen={showAppointmentOptionsModal}
        onClose={() => {
          setShowAppointmentOptionsModal(false);
          setSelectedAppointment(null);
        }}
        appointment={selectedAppointment}
        isEventInPast={isEventInPast}
        onEdit={() => {
          setShowAppointmentOptionsModal(false);
          setIsEditAppointmentModalOpen(true);
        }}
        onCancel={handleCancelAppointment}
        onViewMember={handleViewMemberDetails}
      />

      <NotifyMemberModal
        isOpen={isNotifyMemberOpen}
        onClose={() => setIsNotifyMemberOpen(false)}
        notifyAction={notifyAction}
        actuallyHandleCancelAppointment={actuallyHandleCancelAppointmentWrapper}
        handleNotifyMember={handleNotifyMember}
      />

      {isEditAppointmentModalOpen && selectedAppointment && (
        <EditAppointmentModalV2
          selectedAppointment={selectedAppointment}
          setSelectedAppointment={setSelectedAppointment}
          appointmentTypes={appointmentTypes}
          freeAppointments={freeAppointments}
          handleAppointmentChange={(changes) => {
            setSelectedAppointment({ ...selectedAppointment, ...changes });
          }}
          appointments={appointments}
          setAppointments={setAppointments}
          setIsNotifyMemberOpen={setIsNotifyMemberOpen}
          setNotifyAction={setNotifyAction}
          onDelete={handleDeleteAppointmentWrapper}
          onClose={() => {
            setIsEditAppointmentModalOpen(false);
            setSelectedAppointment(null);
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
          setIsMemberOverviewModalOpen(false);
          setSelectedMember(null);
        }}
        selectedMember={selectedMember}
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
          setShowAppointmentModal(false);
          setSelectedMember(null);
        }}
        getMemberAppointments={getMemberAppointmentsWrapper}
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
          setIsMemberDetailsModalOpen(false);
          setSelectedMember(null);
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
        getBillingPeriods={getBillingPeriodsWrapper}
        selectedBillingPeriod={selectedBillingPeriod}
        handleBillingPeriodChange={setSelectedBillingPeriod}
        setShowAddBillingPeriodModal={setShowAddBillingPeriodModal}
        tempContingent={tempContingent}
        setTempContingent={setTempContingent}
        currentBillingPeriod={currentBillingPeriod}
        handleSaveContingent={handleSaveContingentWrapper}
      />

      <AddBillingPeriodModal
        show={showAddBillingPeriodModal}
        setShow={setShowAddBillingPeriodModal}
        newBillingPeriod={newBillingPeriod}
        setNewBillingPeriod={setNewBillingPeriod}
        handleAddBillingPeriod={handleAddBillingPeriodWrapper}
      />

      <EditMemberModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMember(null);
        }}
        selectedMember={selectedMember}
        editModalTab={editModalTab}
        setEditModalTab={setEditModalTab}
        editForm={editForm}
        handleInputChange={handleInputChange}
        handleEditSubmit={handleEditSubmitWrapper}
        editingRelations={editingRelations}
        setEditingRelations={setEditingRelations}
        newRelation={newRelation}
        setNewRelation={setNewRelation}
        availableMembersLeads={availableMembersLeads}
        relationOptions={relationOptions}
        handleAddRelation={handleAddRelationWrapper}
        memberRelations={memberRelations}
        handleDeleteRelation={handleDeleteRelationWrapper}
        handleArchiveMember={handleArchiveMemberWrapper}
        handleUnarchiveMember={handleUnarchiveMemberWrapper}
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
            setIsEditTaskModalOpen(false);
            setEditingTask(null);
          }}
          onUpdateTask={handleUpdateTaskWrapper}
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
                onClick={() => handleDeleteTaskWrapper(taskToDelete)}
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
                onClick={() => handleCancelTaskWrapper(taskToCancel)}
                className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700"
              >
                Cancel Task
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
