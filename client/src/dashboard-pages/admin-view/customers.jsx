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
    ArrowUp,
    ArrowDown,
    Pencil,
    Filter,
    BadgeDollarSign,
    FileText,
    Shield,
  } from "lucide-react"
  import { BsPersonWorkspace } from "react-icons/bs";
  import { HiOutlineUsers } from "react-icons/hi2";

  import {
    FranchiseData,
    studioappointmentsMainData,
    studioappointmentsStaffData,
    studioappointmentTypeMainData,
    studioappointmentTypeStaffData,
    studioContractHistoryData,
    studioContractsData,
    studioDataNew,
    studioFinanceData,
    studiofreeAppointmentsMainData,
    studiofreeAppointmentsStaffData,
    studioHistoryMainData,
    studioLeadData,
    studioLeadsRelatonData,
    studiomemberHistoryNew,
    studioMembersData,
    studioStaffData,
    studiostaffHistoryNew,
    studioStatsData,
  } from "../../utils/admin-panel-states/customers-states"

  import DefaultStudioImage from "../../../public/gray-avatar-fotor-20250912192528.png"
  import toast, { Toaster } from "react-hot-toast"
  import { RiContractLine } from "react-icons/ri"

  import FranchiseModal from "../../components/admin-dashboard-components/studios-modal/franchise-modal"
  import AssignStudioModal from "../../components/admin-dashboard-components/studios-modal/assign-studios-modal"
  import StudioManagementModal from "../../components/admin-dashboard-components/studios-modal/studio-management-modal"
  import FranchiseDetailsModal from "../../components/admin-dashboard-components/studios-modal/franchise-details-modal"

  import EditMemberModal from "../../components/admin-dashboard-components/studios-modal/members-component/edit-member-modal"
  import EditStaffModal from "../../components/admin-dashboard-components/studios-modal/staff-components/edit-staff-modal"
  import StudioDetailsModal from "../../components/admin-dashboard-components/studios-modal/studios-detail-modal"

  import ContractsModal from "../../components/admin-dashboard-components/studios-modal/contract-components/contract-modal"
  import AddStaffModal from "../../components/admin-dashboard-components/studios-modal/staff-components/add-staff-modal"
  import { ViewStaffModal } from "../../components/admin-dashboard-components/studios-modal/staff-components/view-staff-details"
  import MemberDetailsModal from "../../components/admin-dashboard-components/studios-modal/members-component/members-detail"
  import ContractDetailsModal from "../../components/admin-dashboard-components/studios-modal/contract-components/contract-details"
  import StudioHistoryModalMain from "../../components/admin-dashboard-components/studios-modal/studio-history"
  import StudioMembersModal from "../../components/admin-dashboard-components/studios-modal/members-component/MemberOverviewModal"
  import StudioStaffModal from "../../components/admin-dashboard-components/studios-modal/staff-components/StaffOverviewModal"
  import MemberHistoryModalMain from "../../components/admin-dashboard-components/studios-modal/members-component/member-history-modal"
  import { MemberDocumentModal } from "../../components/admin-dashboard-components/studios-modal/members-component/members-document-modal"
  import AppointmentModalMain from "../../components/admin-dashboard-components/studios-modal/members-component/appointment-modal"
  import EditAppointmentModalMain from "../../components/admin-dashboard-components/studios-modal/members-component/edit-appointment-modal"
  import CreateAppointmentModal from "../../components/admin-dashboard-components/studios-modal/members-component/add-appointment-modal"
  import ContingentModalMain from "../../components/admin-dashboard-components/studios-modal/members-component/show-contigent-modal"
  import AddBillingPeriodModalMain from "../../components/admin-dashboard-components/studios-modal/members-component/add-biling-period-modal"
  import StaffHistoryModalMain from "../../components/admin-dashboard-components/studios-modal/staff-components/staff-history-modal"
  import { StaffDocumentModal } from "../../components/admin-dashboard-components/studios-modal/staff-components/staff-document-modal"

  import { ContractHistoryModal } from "../../components/admin-dashboard-components/studios-modal/contract-components/contract-history-modal"
  import StudioFinancesModal from "../../components/admin-dashboard-components/studios-modal/finances-components/finances-modal";
  import { FaPersonRays } from "react-icons/fa6";
  import StudioLeadsModal from "../../components/admin-dashboard-components/studios-modal/lead-components/lead-overview-modal";
  import { AddLeadModal } from "../../components/admin-dashboard-components/studios-modal/lead-components/add-lead-modal";
  import { ViewLeadModal } from "../../components/admin-dashboard-components/studios-modal/lead-components/view-lead-details";
  import { EditLeadModal } from "../../components/admin-dashboard-components/studios-modal/lead-components/edit-lead-modal";
  import { availableMembersLeadsMain, memberRelationsMainData } from "../../utils/studio-states"
  import {
    DEFAULT_EDIT_FORM,
    DEFAULT_FRANCHISE_FORM,
    DEFAULT_MEMBER_EDIT_FORM,
    DEFAULT_TEMP_MEMBER_FORM,
    DEFAULT_NEW_RELATION,
    AVAILABLE_TRAINING_PLANS,
    DEFAULT_MEMBER_CONTINGENT,
    DEFAULT_BILLING_PERIOD,
    STUDIO_SORT_OPTIONS,
    FRANCHISE_SORT_OPTIONS,
    DEFAULT_LEAD_SOURCES,
    RELATION_OPTIONS,
    ACCESS_ROLE_COLORS,
  } from "../../utils/admin-panel-states/customers-states";
  import EditStudioOptionsModal from "../../components/admin-dashboard-components/studios-modal/edit-studio-options-modal";
  import { useNavigate } from "react-router-dom";
  import CreateTempMemberModal from "../../components/admin-dashboard-components/studios-modal/members-component/create-temporary-member-modal";
  import TrainingPlansModal from "../../components/admin-dashboard-components/studios-modal/members-component/training-plan-modal";
  import { LeadSpecialNoteIcon } from "../../components/admin-dashboard-components/shared/special-note/shared-special-note-icon";
  import StudioDocumentManagementModal from "../../components/admin-dashboard-components/shared/StudioDocumentManagementModal";

  // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Reusable StatusTag (matching members.jsx) Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  const StatusTag = ({ isActive, isArchived, compact = false }) => {
    const getColor = () => {
      if (isArchived) return 'bg-red-600';
      if (isActive) return 'bg-green-600';
      return 'bg-red-500';
    };
    const getText = () => {
      if (isArchived) return 'Archived';
      if (isActive) return 'Active';
      return 'Inactive';
    };
    if (compact) {
      return (
        <div className={`inline-flex items-center gap-1 ${getColor()} text-white px-2 py-1 rounded-lg text-xs font-medium`}>
          <span className="truncate max-w-[140px]">{getText()}</span>
        </div>
      );
    }
    return (
      <div className={`inline-flex items-center gap-2 ${getColor()} text-white px-3 py-1.5 rounded-xl text-xs font-medium`}>
        <span>{getText()}</span>
      </div>
    );
  };

  // Initials Avatar Component - matching members.jsx pattern
  const InitialsAvatar = ({ name, size = "md", variant = "orange", className = "" }) => {
    const getInitials = () => {
      if (!name) return "?"
      const words = name.trim().split(/\s+/)
      if (words.length >= 2) return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase()
      return words[0].charAt(0).toUpperCase()
    }

    const sizeClasses = {
      sm: "w-9 h-9 text-sm",
      md: "w-11 h-11 text-base",
      lg: "w-12 h-12 text-lg",
    }

    const variantClasses = {
      orange: "bg-orange-500",
      blue: "bg-blue-600",
    }

    return (
      <div
        className={`${variantClasses[variant] || variantClasses.orange} rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0 ${sizeClasses[size]} ${className}`}
        style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
      >
        {getInitials()}
      </div>
    )
  };

  // Helper: check if entity has a real custom image (not empty, not default placeholder)
  const hasCustomImage = (imageUrl) => {
    if (!imageUrl) return false
    if (imageUrl === DefaultStudioImage) return false
    if (imageUrl.includes("gray-avatar")) return false
    return true
  }

  export default function Studios() {
    const navigate = useNavigate();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false)
    const [selectedStudio, setSelectedStudio] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [franchiseSearchQuery, setFranchiseSearchQuery] = useState("")
    const [unassignedStudioSearchQuery, setUnassignedStudioSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")

    // ——— Chip-based search filters (matching members.jsx) ———
    const [studioFilters, setStudioFilters] = useState([])
    // [{ itemId: number, itemName: string }, ...]
    const [franchiseFilters, setFranchiseFilters] = useState([])
    const [showSearchDropdown, setShowSearchDropdown] = useState(false)
    const searchDropdownRef = useRef(null)
    const searchInputRef = useRef(null)

    // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ View controls (matching members.jsx) Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    const [viewMode, setViewMode] = useState("studios")
    const [expandedMobileRowId, setExpandedMobileRowId] = useState(null)

    // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Sort controls (matching members.jsx) Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    const [sortBy, setSortBy] = useState("alphabetical")
    const [sortDirection, setSortDirection] = useState("asc")
    const [showSortDropdown, setShowSortDropdown] = useState(false)
    const [showMobileSortDropdown, setShowMobileSortDropdown] = useState(false)
    const sortDropdownRef = useRef(null)
    const mobileSortDropdownRef = useRef(null)

    // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Filter controls (matching members.jsx) Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    const [filtersExpanded, setFiltersExpanded] = useState(false)

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

    const [isFinancesModalOpen, setisFinancesModalOpen] = useState(false)
    const [isStudioDocumentModalOpen, setIsStudioDocumentModalOpen] = useState(false)

    const [isEditStaffModalOpen, setisEditStaffModalOpen] = useState(false)
    const [selectedStaffForEdit, setselectedStaffForEdit] = useState(null)

    const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false)
    const [selectedMemberForEdit, setSelectedMemberForEdit] = useState(null)
    const [memberEditForm, setMemberEditForm] = useState({ ...DEFAULT_MEMBER_EDIT_FORM })

    const [isEditOptionsModalOpen, setIsEditOptionsModalOpen] = useState(false)

    const [isMemberDetailsModalOpen, setIsMemberDetailsModalOpen] = useState(false)
    const [isStaffDetailsModalOpen, setIsStaffDetailsModalOpen] = useState(false)
    const [isContractDetailsModalOpen, setIsContractDetailsModalOpen] = useState(false)
    const [selectedItemForDetails, setSelectedItemForDetails] = useState(null)

    const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false)

    const [financesPeriod, setFinancesPeriod] = useState("month")
    const [showPassword, setShowPassword] = useState({})

    const [editForm, setEditForm] = useState({ ...DEFAULT_EDIT_FORM })

    const [franchiseForm, setFranchiseForm] = useState({ ...DEFAULT_FRANCHISE_FORM })

    const [franchises, setFranchises] = useState(FranchiseData)
    const [studioStats, setStudioStats] = useState(studioStatsData)
    const [studioMembers, setStudioMembers] = useState(studioMembersData)
    const [studioStaffs, setStudioStaffs] = useState(studioStaffData)
    const [studioContracts, setStudioContracts] = useState(studioContractsData)
    const [studios, setStudios] = useState(studioDataNew)

    const [showHistory, setShowHistory] = useState(false)
    const [historyTabMain, setHistoryTabMain] = useState("general")
    const [memberSearchQuery, setMemberSearchQuery] = useState("")
    const [staffSearchQuery, setStaffSearchQuery] = useState("")

    const [showHistoryModal, setShowHistoryModal] = useState(false)
    const [memberHistory, setMemberHistory] = useState(studiomemberHistoryNew)
    const [showDocumentModal, setShowDocumentModal] = useState(false)
    const [showAppointmentModalMain, setShowAppointmentModalMain] = useState(false)
    const [appointmentsMain, setAppointmentsMain] = useState(studioappointmentsMainData)
    const [appointmentTypesMain, setAppointmentTypesMain] = useState(studioappointmentTypeMainData)
    const [freeAppointmentsMain, setFreeAppointmentsMain] = useState(studiofreeAppointmentsMainData)
    const [selectedAppointmentDataMain, setSelectedAppointmentDataMain] = useState(null)
    const [showCreateAppointmentModalMain, setShowCreateAppointmentModalMain] = useState(false)
    const [showSelectedAppointmentModalMain, setShowSelectedAppointmentModalMain] = useState(false)
    const [appointmentToDelete, setAppointmentToDelete] = useState(null)
    const [memberRelations, setMemberRelations] = useState(memberRelationsMainData)

    const [isCreateTempMemberModalOpen, setIsCreateTempMemberModalOpen] = useState(false)
    const [tempMemberModalTab, setTempMemberModalTab] = useState("details")
    const [editingRelationsMain, setEditingRelationsMain] = useState(false)
    const [newRelationMain, setNewRelationMain] = useState({ ...DEFAULT_NEW_RELATION })

    const [tempMemberForm, setTempMemberForm] = useState({ ...DEFAULT_TEMP_MEMBER_FORM })

    const [showTrainingPlansModalMain, setShowTrainingPlansModalMain] = useState(false)
    const [memberTrainingPlansMain, setMemberTrainingPlansMain] = useState({})
    const [availableTrainingPlansMain, setAvailableTrainingPlansMain] = useState([...AVAILABLE_TRAINING_PLANS])

    const [isNotifyMemberOpenMain, setIsNotifyMemberOpenMain] = useState(false)
    const [notifyActionMain, setNotifyActionMain] = useState("")
    const [memberContingent, setMemberContingent] = useState({ ...DEFAULT_MEMBER_CONTINGENT })

    const calculateAge = (dateOfBirth) => {
      if (!dateOfBirth) return 'Unknown';
      const today = new Date(); const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
      return age;
    };

    const [showContingentModalMain, setShowContingentModalMain] = useState(false)
    const [tempContingentMain, setTempContingentMain] = useState({ used: 0, total: 0 })
    const [currentBillingPeriodMain, setCurrentBillingPeriodMain] = useState(DEFAULT_BILLING_PERIOD)
    const [selectedBillingPeriodMain, setSelectedBillingPeriodMain] = useState("current")
    const [showAddBillingPeriodModalMain, setShowAddBillingPeriodModalMain] = useState(false)
    const [newBillingPeriodMain, setNewBillingPeriodMain] = useState("")

    const getBillingPeriodsMain = (memberId) => {
      const memberData = memberContingent[memberId]; if (!memberData) return []
      const periods = [{ id: "current", label: `Current (${currentBillingPeriodMain})`, data: memberData.current }]
      if (memberData.future) { Object.entries(memberData.future).forEach(([period, data]) => { periods.push({ id: period, label: `Future (${period})`, data }) }) }
      return periods
    }

    const [showStaffHistoryModal, setShowStaffHistoryModal] = useState(false)
    const [staffHistory, setstaffHistory] = useState(studiostaffHistoryNew)
    const [historyTabStaff, setHistoryTabStaff] = useState("general")
    const [showDocumentModalStaff, setShowDocumentModalStaff] = useState(false)
    const [showAppointmentModalStaff, setShowAppointmentModalStaff] = useState(false)
    const [selectedAppointmentDataStaff, setSelectedAppointmentDataStaff] = useState(null)

    const [contractHistory, setcontractHistory] = useState(studioContractHistoryData)
    const [isContractHistoryModalOpen, setIsContractHistoryModalOpen] = useState(false)
    const [selectedContractForHistory, setSelectedContractForHistory] = useState(null)

    const [isLeadsModalOpen, setIsLeadsModalOpen] = useState(false)
    const [leadSearchQuery, setLeadSearchQuery] = useState("")
    const [studioLeads, setStudioLeads] = useState(studioLeadData)
    const [isViewLeadModalOpen, setIsViewLeadModalOpen] = useState(false)
    const [isEditLeadModalOpen, setIsEditLeadModalOpen] = useState(false)
    const [selectedLead, setSelectedLead] = useState(null)
    const [leadRelations, setLeadRelations] = useState(studioLeadsRelatonData)
    const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false)
    const [leadSources, setLeadSources] = useState([...DEFAULT_LEAD_SOURCES])

    // Access role mapping for studios (from Access Templates)
    const getStudioAccessRole = (studio) => studio.accessRole || ["Premium", "Standard", "Basic"][studio.id % 3]

    // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Sort options (matching members.jsx pattern) Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    const currentSortOptions = viewMode === "studios" ? STUDIO_SORT_OPTIONS : FRANCHISE_SORT_OPTIONS
    const currentSortLabel = currentSortOptions.find((opt) => opt.value === sortBy)?.label || "Name"
    const getSortIcon = () => sortDirection === "asc" ? <ArrowUp size={14} className="text-white" /> : <ArrowDown size={14} className="text-white" />
    const handleSortOptionClick = (newSortBy) => { if (sortBy === newSortBy) { setSortDirection(sortDirection === "asc" ? "desc" : "asc") } else { setSortBy(newSortBy); setSortDirection("asc") } }
    const handleMobileSortOptionClick = (newSortBy) => { handleSortOptionClick(newSortBy); setShowMobileSortDropdown(false) }

    // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ All handlers (preserved from original) Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    const handleOpenLeadsModal = (studio) => { setSelectedStudioForModal(studio); setIsLeadsModalOpen(true) }
    const getFilteredLeads = () => { if (!selectedStudioForModal || !studioLeads[selectedStudioForModal.id]) return []; return studioLeads[selectedStudioForModal.id].filter((lead) => `${lead.firstName} ${lead.surname}`.toLowerCase().includes(leadSearchQuery.toLowerCase()) || lead.email.toLowerCase().includes(leadSearchQuery.toLowerCase()) || lead.phoneNumber.includes(leadSearchQuery) || lead.about?.toLowerCase().includes(leadSearchQuery.toLowerCase())) }
    const handleViewLead = (lead) => { setSelectedLead(lead); setIsViewLeadModalOpen(true) }
    const handleEditLead = (lead) => { setSelectedLead(lead); setIsEditLeadModalOpen(true) }
    const handleSaveEditedLead = (updatedLeadData) => { if (!selectedStudioForModal || !selectedLead) return; setStudioLeads(prev => ({ ...prev, [selectedStudioForModal.id]: prev[selectedStudioForModal.id].map(lead => lead.id === selectedLead.id ? updatedLeadData : lead) })); toast.success("Lead updated successfully!"); setIsEditLeadModalOpen(false); setSelectedLead(null) }
    const handleAddLead = () => { setIsAddLeadModalOpen(true) }
    const handleSaveLead = (newLeadData) => { if (!selectedStudioForModal) return; setStudioLeads(prev => ({ ...prev, [selectedStudioForModal.id]: [...(prev[selectedStudioForModal.id] || []), { ...newLeadData, trialPeriod: newLeadData.hasTrialTraining ? "Trial Period" : "", avatar: "", source: newLeadData.source || "hardcoded" }] })); toast.success("Lead added successfully!") }
    const handleCloseModal = () => { setIsEditFranchiseModalOpen(false); setIsCreateFranchiseModalOpen(false) }
    const handleAssignStudioCloseModal = () => { setIsAssignStudioModalOpen(false) }
    const handleStudioManagementCloseModal = () => { setIsStudioManagementModalOpen(false); setSelectedFranchiseForManagement(null) }
    const togglePasswordVisibility = (franchiseId) => { setShowPassword((prev) => ({ ...prev, [franchiseId]: !prev[franchiseId] })) }

    useEffect(() => { if (selectedStudio) { setEditForm(prev => ({ ...prev, name: selectedStudio.name, email: selectedStudio.email, phone: selectedStudio.phone, street: selectedStudio.street, zipCode: selectedStudio.zipCode, city: selectedStudio.city, website: selectedStudio.website, about: selectedStudio.about, note: selectedStudio.note, noteStartDate: selectedStudio.noteStartDate, noteEndDate: selectedStudio.noteEndDate, noteImportance: selectedStudio.noteImportance, contractStart: selectedStudio.contractStart, contractEnd: selectedStudio.contractEnd, ownerName: selectedStudio.ownerName, taxId: selectedStudio.taxId || "", iban: selectedStudio.iban || "", country: selectedStudio.country || "", openingHours: selectedStudio.openingHours || { monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", saturday: "", sunday: "" }, closingDays: selectedStudio.closingDays || "" })) } }, [selectedStudio])
    useEffect(() => { if (selectedFranchise) { setFranchiseForm({ name: selectedFranchise.name, email: selectedFranchise.email, phone: selectedFranchise.phone, street: selectedFranchise.street, zipCode: selectedFranchise.zipCode, city: selectedFranchise.city, website: selectedFranchise.website, about: selectedFranchise.about, ownerFirstName: selectedFranchise.ownerFirstName || "", ownerLastName: selectedFranchise.ownerLastName || "", country: selectedFranchise.country || "", specialNote: selectedFranchise.specialNote || "", noteImportance: selectedFranchise.noteImportance || "unimportant", noteStartDate: selectedFranchise.noteStartDate || "", noteEndDate: selectedFranchise.noteEndDate || "", loginEmail: selectedFranchise.loginEmail, loginPassword: selectedFranchise.loginPassword, confirmPassword: selectedFranchise.loginPassword, logo: selectedFranchise.logo || null }) } }, [selectedFranchise])
    useEffect(() => { if (selectedMemberForEdit) { setMemberEditForm({ name: selectedMemberForEdit.name, email: selectedMemberForEdit.email, phone: selectedMemberForEdit.phone, membershipType: selectedMemberForEdit.membershipType || selectedMemberForEdit.role || "", joinDate: selectedMemberForEdit.joinDate, status: selectedMemberForEdit.status }) } }, [selectedMemberForEdit])

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) setShowSortDropdown(false)
        if (mobileSortDropdownRef.current && !mobileSortDropdownRef.current.contains(event.target)) setShowMobileSortDropdown(false)
        if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) setShowSearchDropdown(false)
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => { if (!showSortDropdown && !showMobileSortDropdown) return; const h = () => { setShowSortDropdown(false); setShowMobileSortDropdown(false) }; window.addEventListener('scroll', h, { capture: true, passive: true }); return () => window.removeEventListener('scroll', h, { capture: true, passive: true }) }, [showSortDropdown, showMobileSortDropdown])
    useEffect(() => { if (!expandedMobileRowId) return; const h = () => setExpandedMobileRowId(null); window.addEventListener('scroll', h, { capture: true, passive: true }); return () => window.removeEventListener('scroll', h, { capture: true, passive: true }) }, [expandedMobileRowId])
    useEffect(() => { const h = () => setFiltersExpanded(window.innerWidth >= 768); h(); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h) }, [])

    // ——— Chip-based search: suggestions, select, remove, keyboard (matching members.jsx) ———
    const getSearchSuggestions = () => {
      const query = viewMode === "studios" ? searchQuery : franchiseSearchQuery
      if (!query.trim()) return []
      const q = query.toLowerCase()
      if (viewMode === "studios") {
        return studios.filter((s) => {
          if (studioFilters.some(f => f.itemId === s.id)) return false
          return s.name.toLowerCase().includes(q) || s.ownerName?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q) || s.city?.toLowerCase().includes(q) || String(s.studioNumber).includes(q)
        }).slice(0, 6)
      } else {
        return franchises.filter((f) => {
          if (franchiseFilters.some(ff => ff.itemId === f.id)) return false
          return f.name.toLowerCase().includes(q) || `${f.ownerFirstName} ${f.ownerLastName}`.toLowerCase().includes(q) || f.email?.toLowerCase().includes(q) || f.city?.toLowerCase().includes(q)
        }).slice(0, 6)
      }
    }

    const handleSelectSearchItem = (item) => {
      if (viewMode === "studios") { setStudioFilters([...studioFilters, { itemId: item.id, itemName: item.name }]); setSearchQuery("") }
      else { setFranchiseFilters([...franchiseFilters, { itemId: item.id, itemName: item.name }]); setFranchiseSearchQuery("") }
      setShowSearchDropdown(false)
      searchInputRef.current?.focus()
    }

    const handleRemoveSearchFilter = (itemId) => {
      if (viewMode === "studios") setStudioFilters(studioFilters.filter(f => f.itemId !== itemId))
      else setFranchiseFilters(franchiseFilters.filter(f => f.itemId !== itemId))
    }

    const handleSearchKeyDown = (e) => {
      const currentFilters = viewMode === "studios" ? studioFilters : franchiseFilters
      const currentQuery = viewMode === "studios" ? searchQuery : franchiseSearchQuery
      if (e.key === 'Backspace' && !currentQuery && currentFilters.length > 0) {
        if (viewMode === "studios") setStudioFilters(studioFilters.slice(0, -1))
        else setFranchiseFilters(franchiseFilters.slice(0, -1))
      } else if (e.key === 'Escape') { setShowSearchDropdown(false) }
    }

    const handleInputChange = (e) => { const { name, value } = e.target; setEditForm((prev) => ({ ...prev, [name]: value })) }
    const handleFranchiseInputChange = (e) => { const { name, value } = e.target; setFranchiseForm((prev) => ({ ...prev, [name]: value })) }
    const handleLogoUpload = (e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = (e) => { setFranchiseForm((prev) => ({ ...prev, logo: e.target.result })) }; reader.readAsDataURL(file) } }

    const handleFranchiseSubmit = (e) => {
      e.preventDefault()
      if (franchiseForm.loginPassword !== franchiseForm.confirmPassword) { toast.error("Passwords do not match"); return }
      if (selectedFranchise) {
        setFranchises(franchises.map((f) => f.id === selectedFranchise.id ? { ...f, ...franchiseForm } : f))
        setIsEditFranchiseModalOpen(false); setSelectedFranchise(null); toast.success("Franchise updated successfully")
      } else {
        setFranchises([...franchises, { id: Math.max(...franchises.map((f) => f.id), 0) + 1, ...franchiseForm, createdDate: new Date().toISOString().split("T")[0], studioCount: 0 }])
        setIsCreateFranchiseModalOpen(false); toast.success("Franchise created successfully")
      }
      setFranchiseForm({ ...DEFAULT_FRANCHISE_FORM })
    }

    const handleMemberEditSubmit = (e, formData) => {
      e.preventDefault()
      if (isMembersModalOpen) { setStudioMembers((prev) => ({ ...prev, [selectedStudioForModal.id]: prev[selectedStudioForModal.id].map((m) => m.id === selectedMemberForEdit.id ? { ...m, ...formData } : m) })) }
      else if (isStaffsModalOpen) { setStudioStaffs((prev) => ({ ...prev, [selectedStudioForModal.id]: prev[selectedStudioForModal.id].map((s) => s.id === selectedMemberForEdit.id ? { ...s, ...formData, role: formData.membershipType } : s) })) }
      setIsEditMemberModalOpen(false); setSelectedMemberForEdit(null); toast.success("Details updated successfully")
    }

    const handleViewMemberDetails = (member) => { setSelectedItemForDetails(member); setIsMemberDetailsModalOpen(true) }
    const handleViewStaffDetails = (staff) => { setSelectedItemForDetails(staff); setIsStaffDetailsModalOpen(true) }
    const handleViewContractDetails = (contract) => { setSelectedItemForDetails(contract); setIsContractDetailsModalOpen(true) }

    const isContractExpiringSoon = (contractEnd) => { if (!contractEnd) return false; const today = new Date(); const endDate = new Date(contractEnd); const oneMonth = new Date(); oneMonth.setMonth(today.getMonth() + 1); return endDate <= oneMonth && endDate >= today }

    const filteredAndSortedStudios = () => {
      // If chip filters are active, show only those studios
      if (studioFilters.length > 0) {
        const filterIds = studioFilters.map(f => f.itemId)
        return studios.filter((s) => filterIds.includes(s.id))
      }
      // No live filtering while typing - list only changes when chips are selected
      let filtered = [...studios]
      if (filterStatus === "active") filtered = filtered.filter((s) => s.isActive)
      else if (filterStatus === "archived") filtered = filtered.filter((s) => !s.isActive)
      filtered.sort((a, b) => { let c = 0; if (sortBy === "alphabetical") c = a.name.localeCompare(b.name); else if (sortBy === "memberCount") c = (studioStats[a.id]?.members || 0) - (studioStats[b.id]?.members || 0); else if (sortBy === "staffCount") c = (studioStats[a.id]?.trainers || 0) - (studioStats[b.id]?.trainers || 0); else if (sortBy === "contractCount") c = (studioStats[a.id]?.contracts || 0) - (studioStats[b.id]?.contracts || 0); else if (sortBy === "leadCount") c = (studioLeads[a.id]?.length || 0) - (studioLeads[b.id]?.length || 0); return sortDirection === "asc" ? c : -c })
      return filtered
    }

    const filteredAndSortedFranchises = () => {
      // If chip filters are active, show only those franchises
      if (franchiseFilters.length > 0) {
        const filterIds = franchiseFilters.map(f => f.itemId)
        return franchises.filter((f) => filterIds.includes(f.id))
      }
      // No live filtering while typing
      let filtered = [...franchises]
      if (filterStatus === "active") filtered = filtered.filter((f) => !f.isArchived)
      else if (filterStatus === "archived") filtered = filtered.filter((f) => f.isArchived)
      filtered.sort((a, b) => { let c = 0; if (sortBy === "alphabetical") c = a.name.localeCompare(b.name); else if (sortBy === "studioCount") c = getStudiosByFranchise(a.id).length - getStudiosByFranchise(b.id).length; return sortDirection === "asc" ? c : -c })
      return filtered
    }

    const getStudiosByFranchise = (fId) => studios.filter((s) => s.franchiseId === fId)
    const getUnassignedStudios = () => studios.filter((s) => !s.franchiseId)
    const getFilteredUnassignedStudios = () => getUnassignedStudios().filter((s) => s.name.toLowerCase().includes(unassignedStudioSearchQuery.toLowerCase()))

    const handleEditStudio = (studio) => { setSelectedStudio(studio); setIsEditOptionsModalOpen(true) }
    const handleStudioConfig = (studio) => { navigate(`/admin-dashboard/edit-studio-configuration/${studio.id}`); setIsEditOptionsModalOpen(false) }
    const handleEditFranchise = (franchise) => { setSelectedFranchise(franchise); setIsEditFranchiseModalOpen(true) }
    const handleViewDetails = (studio) => { setSelectedStudio(studio); setIsViewDetailsModalOpen(true) }
    const handleViewFranchiseDetails = (franchise) => { setSelectedFranchise(franchise); setIsFranchiseDetailsModalOpen(true) }
    const handleGoToContract = (studio) => { setSelectedStudioForModal(studio); setIsContractsModalOpen(true); setIsViewDetailsModalOpen(false) }
    const handleArchiveFranchise = (fId) => { setFranchises(franchises.map((f) => f.id === fId ? { ...f, isArchived: !f.isArchived } : f)); toast.success("Franchise archived successfully") }

    const handleAssignStudio = (franchiseId, studioId) => {
      setStudios(studios.map((s) => s.id === studioId ? { ...s, franchiseId } : s))
      setFranchises(franchises.map((f) => f.id === franchiseId ? { ...f, studioCount: f.studioCount + 1 } : f))
      setIsAssignStudioModalOpen(false); toast.success("Studio assigned to franchise successfully")
    }

    const handleUnassignStudio = (studioId) => {
      const studio = studios.find((s) => s.id === studioId)
      setStudios(studios.map((s) => s.id === studioId ? { ...s, franchiseId: null } : s))
      if (studio.franchiseId) { setFranchises(franchises.map((f) => f.id === studio.franchiseId ? { ...f, studioCount: Math.max(0, f.studioCount - 1) } : f)) }
      toast.success("Studio unassigned from franchise")
    }

    const handleOpenStudioManagement = (franchise) => { setSelectedFranchiseForManagement(franchise); setIsStudioManagementModalOpen(true) }
    const handleOpenMembersModal = (studio) => { setSelectedStudioForModal(studio); setIsMembersModalOpen(true) }
    const handleOpenStaffsModal = (studio) => { setSelectedStudioForModal(studio); setIsStaffsModalOpen(true) }
    const handleOpenContractsModal = (studio) => { setSelectedStudioForModal(studio); setIsContractsModalOpen(true) }
    const handleEditMember = (member) => { setSelectedMemberForEdit(member); setIsEditMemberModalOpen(true) }
    const handleDownloadFile = (fileName) => { toast.success(`Downloading ${fileName}`) }
    const handleFileUpload = (contractId, files) => { if (files && files.length > 0) { const newFiles = Array.from(files).map((f) => f.name); setStudioContracts((prev) => ({ ...prev, [selectedStudioForModal.id]: prev[selectedStudioForModal.id].map((c) => c.id === contractId ? { ...c, files: [...c.files, ...newFiles] } : c) })); toast.success(`${newFiles.length} file(s) uploaded successfully`) } }

    const getFilteredMembers = () => { if (!selectedStudioForModal || !studioMembers[selectedStudioForModal.id]) return []; return studioMembers[selectedStudioForModal.id].filter((m) => `${m.firstName} ${m.lastName}`.toLowerCase().includes(memberSearchQuery.toLowerCase()) || m.email.toLowerCase().includes(memberSearchQuery.toLowerCase()) || m.phone.includes(memberSearchQuery)) }
    const getFilteredStaff = () => { if (!selectedStudioForModal || !studioStaffs[selectedStudioForModal.id]) return []; return studioStaffs[selectedStudioForModal.id].filter((s) => `${s.firstName} ${s.lastName}`.toLowerCase().includes(staffSearchQuery.toLowerCase()) || s.email.toLowerCase().includes(staffSearchQuery.toLowerCase()) || s.phone.includes(staffSearchQuery) || s.role.toLowerCase().includes(staffSearchQuery.toLowerCase())) }

    const handleHistoryFromOverview = (member) => { setSelectedMemberForEdit(member); setShowHistoryModal(true) }
    const handleDocumentFromOverview = (member) => { setSelectedMemberForEdit(member); setShowDocumentModal(true) }
    const handleCalendarFromOverview = (member) => { setSelectedMemberForEdit(member); setShowAppointmentModalMain(true) }
    const getMemberAppointmentsMain = (memberId) => appointmentsMain.filter((a) => a.memberId === memberId)
    const handleEditAppointmentMain = (appointment) => { setSelectedAppointmentDataMain({ ...appointment, name: selectedMemberForEdit?.title || "Member", specialNote: appointment.specialNote || { text: "", isImportant: false, startDate: "", endDate: "" } }); setShowSelectedAppointmentModalMain(true); setShowAppointmentModalMain(false) }
    const handleDeleteAppointmentMain = (id) => { setAppointmentToDelete(id) }
    const handleCreateNewAppointmentMain = () => { setShowCreateAppointmentModalMain(true); setShowAppointmentModalMain(false) }
    const handleManageContingentMain = (memberId) => { const d = memberContingent[memberId]; if (d) { setTempContingentMain(d.current); setSelectedBillingPeriodMain("current") } else { setTempContingentMain({ used: 0, total: 0 }) }; setShowContingentModalMain(true) }
    const handleBillingPeriodChange = (periodId) => { setSelectedBillingPeriodMain(periodId); const d = memberContingent[selectedMemberForEdit.id]; if (periodId === "current") setTempContingentMain(d.current); else setTempContingentMain(d.future[periodId] || { used: 0, total: 0 }) }
    const handleSaveContingentMain = () => { if (selectedMemberForEdit) { const u = { ...memberContingent }; if (selectedBillingPeriodMain === "current") u[selectedMemberForEdit.id].current = { ...tempContingentMain }; else { if (!u[selectedMemberForEdit.id].future) u[selectedMemberForEdit.id].future = {}; u[selectedMemberForEdit.id].future[selectedBillingPeriodMain] = { ...tempContingentMain } }; setMemberContingent(u); toast.success("Contingent updated successfully") }; setShowContingentModalMain(false) }
    const handleAddBillingPeriodMain = () => { if (newBillingPeriodMain.trim() && selectedMemberForEdit) { const u = { ...memberContingent }; if (!u[selectedMemberForEdit.id].future) u[selectedMemberForEdit.id].future = {}; u[selectedMemberForEdit.id].future[newBillingPeriodMain] = { used: 0, total: 0 }; setMemberContingent(u); setNewBillingPeriodMain(""); setShowAddBillingPeriodModalMain(false); toast.success("New billing period added successfully") } }
    const handleAddAppointmentSubmit = (data) => { setAppointmentsMain([...appointmentsMain, { id: Math.max(0, ...appointmentsMain.map((a) => a.id)) + 1, ...data, memberId: selectedMemberForEdit?.id }]); setShowCreateAppointmentModalMain(false) }
    const handleAppointmentChange = (changes) => { if (selectedAppointmentDataMain) setSelectedAppointmentDataMain({ ...selectedAppointmentDataMain, ...changes }) }
    const handleStaffHistoryFromOverview = (staff) => { setselectedStaffForEdit(staff); setShowStaffHistoryModal(true) }
    const handleStaffDocumentFromOverview = (staff) => { setselectedStaffForEdit(staff); setShowDocumentModalStaff(true) }
    const handleViewContractHistory = (contract) => { setSelectedContractForHistory(contract); setIsContractHistoryModalOpen(true) }

    const handleCreateTempMember = (e) => {
      e.preventDefault(); if (!selectedStudioForModal) return
      const newTempMember = { id: Math.max(0, ...(studioMembers[selectedStudioForModal.id] || []).map(m => m.id)) + 1, firstName: tempMemberForm.firstName, lastName: tempMemberForm.lastName, email: tempMemberForm.email, phone: tempMemberForm.phone, gender: tempMemberForm.gender, country: tempMemberForm.country, street: tempMemberForm.street, zipCode: tempMemberForm.zipCode, city: tempMemberForm.city, dateOfBirth: tempMemberForm.dateOfBirth, about: tempMemberForm.about, joinDate: new Date().toISOString().split('T')[0], status: "active", isTemporary: true, note: tempMemberForm.note, noteImportance: tempMemberForm.noteImportance, noteStartDate: tempMemberForm.noteStartDate, noteEndDate: tempMemberForm.noteEndDate, autoArchiveDate: tempMemberForm.autoArchivePeriod ? new Date(Date.now() + tempMemberForm.autoArchivePeriod * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null }
      setStudioMembers(prev => ({ ...prev, [selectedStudioForModal.id]: [...(prev[selectedStudioForModal.id] || []), newTempMember] }))
      setTempMemberForm({ ...DEFAULT_TEMP_MEMBER_FORM })
      setTempMemberModalTab("details"); setIsCreateTempMemberModalOpen(false); toast.success("Temporary member created successfully!")
    }

    const handleTempMemberInputChange = (e) => { const { name, value } = e.target; setTempMemberForm(prev => ({ ...prev, [name]: value })) }
    const handleImgUpload = (e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => { setTempMemberForm(prev => ({ ...prev, img: ev.target.result })) }; reader.readAsDataURL(file) } }
    const relationOptionsMain = RELATION_OPTIONS
    const handleTrainingPlanFromOverview = (member) => { setSelectedMemberForEdit(member); setShowTrainingPlansModalMain(true) }
    const handleAssignPlanMain = (memberId, planId) => { const plan = availableTrainingPlansMain.find(p => p.id === parseInt(planId)); if (!plan) return; setMemberTrainingPlansMain(prev => ({ ...prev, [memberId]: [...(prev[memberId] || []), { ...plan, assignedDate: new Date().toISOString().split('T')[0] }] })); toast.success("Training plan assigned successfully!"); setShowTrainingPlansModalMain(false) }
    const handleRemovePlanMain = (memberId, planId) => { setMemberTrainingPlansMain(prev => ({ ...prev, [memberId]: (prev[memberId] || []).filter(p => p.id !== planId) })); toast.success("Training plan removed successfully!") }

    // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
    // RENDER
    // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
    return (
      <>
        <Toaster position="top-right" toastOptions={{ duration: 2000, style: { background: "#333", color: "#fff" } }} />

        <div className="flex flex-col lg:flex-row rounded-3xl bg-[#1C1C1C] transition-all duration-500 text-white relative select-none" onDragStart={(e) => e.preventDefault()}>
          <div className="flex-1 min-w-0 md:p-6 p-4 pb-36">

            {/* Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Header (matching members.jsx) Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
            <div className="flex sm:items-center justify-between mb-6 sm:mb-8 gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-white oxanium_font text-xl md:text-2xl">
                  {viewMode === "studios" ? "Studios" : "Franchises"}
                </h1>

                {/* Sort Button - Mobile */}
                <div className="lg:hidden relative" ref={mobileSortDropdownRef}>
                  <button onClick={(e) => { e.stopPropagation(); setShowMobileSortDropdown(!showMobileSortDropdown) }} className="px-3 py-2 bg-[#2F2F2F] text-gray-300 rounded-xl text-xs hover:bg-[#3F3F3F] transition-colors flex items-center gap-2">
                    {getSortIcon()}<span>{currentSortLabel}</span>
                  </button>
                  {showMobileSortDropdown && (
                    <div className="absolute left-0 mt-1 bg-[#1F1F1F] border border-gray-700 rounded-lg shadow-lg z-50 min-w-[180px]">
                      <div className="py-1">
                        <div className="px-3 py-1.5 text-xs text-gray-500 font-medium border-b border-gray-700">Sort by</div>
                        {currentSortOptions.map((opt) => (
                          <button key={opt.value} onClick={(e) => { e.stopPropagation(); handleMobileSortOptionClick(opt.value) }} className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-800 transition-colors flex items-center justify-between ${sortBy === opt.value ? 'text-white bg-gray-800/50' : 'text-gray-300'}`}>
                            <span>{opt.label}</span>
                            {sortBy === opt.value && <span className="text-gray-400">{sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>

              <div className="flex items-center gap-2">
                {viewMode === "studios" ? (
                  <button onClick={() => setIsAssignStudioModalOpen(true)} className="hidden lg:flex bg-[#FF843E] hover:bg-[#FF843E]/90 text-xs sm:text-sm text-white px-3 sm:px-4 py-2 rounded-xl items-center gap-2 justify-center transition-colors"><Network size={14} /><span className="hidden sm:inline">Assign to Franchise</span></button>
                ) : (
                  <button onClick={() => setIsCreateFranchiseModalOpen(true)} className="hidden lg:flex bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm text-white px-3 sm:px-4 py-2 rounded-xl items-center gap-2 justify-center transition-colors"><Plus size={14} /><span className="hidden sm:inline">Create Franchise</span></button>
                )}
              </div>
            </div>

            {/* ——— Search Bar with Inline Filter Chips (matching members.jsx) ——— */}
            <div className="mb-4" ref={searchDropdownRef}>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <div
                    className="bg-[#141414] rounded-xl px-3 py-2 min-h-[42px] flex flex-wrap items-center gap-1.5 border border-[#333333] focus-within:border-[#3F74FF] transition-colors cursor-text"
                    onClick={() => searchInputRef.current?.focus()}
                  >
                    <Search className="text-gray-400 flex-shrink-0" size={16} />

                    {/* Filter Chips */}
                    {(viewMode === "studios" ? studioFilters : franchiseFilters).map((filter) => (
                      <div
                        key={filter.itemId}
                        className="flex items-center gap-1.5 bg-[#3F74FF]/20 border border-[#3F74FF]/40 rounded-lg px-2 py-1 text-sm"
                      >
                        <div className={`w-5 h-5 rounded flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0 ${viewMode === "studios" ? "bg-orange-500" : "bg-blue-600"}`}>
                          {filter.itemName.split(' ')[0]?.charAt(0)}{filter.itemName.split(' ')[1]?.charAt(0) || ''}
                        </div>
                        <span className="text-white text-xs whitespace-nowrap">{filter.itemName}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRemoveSearchFilter(filter.itemId) }}
                          className="p-0.5 hover:bg-[#3F74FF]/30 rounded transition-colors"
                        >
                          <X size={12} className="text-gray-400 hover:text-white" />
                        </button>
                      </div>
                    ))}

                    {/* Search Input */}
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder={(viewMode === "studios" ? studioFilters : franchiseFilters).length > 0 ? "Add more..." : `Search ${viewMode === "studios" ? "studios" : "franchises"}...`}
                      value={viewMode === "studios" ? searchQuery : franchiseSearchQuery}
                      onChange={(e) => {
                        if (viewMode === "studios") setSearchQuery(e.target.value)
                        else setFranchiseSearchQuery(e.target.value)
                        setShowSearchDropdown(true)
                      }}
                      onFocus={() => (viewMode === "studios" ? searchQuery : franchiseSearchQuery) && setShowSearchDropdown(true)}
                      onKeyDown={handleSearchKeyDown}
                      className="flex-1 min-w-[100px] bg-transparent outline-none text-sm text-white placeholder-gray-500"
                    />

                    {/* Clear All Button */}
                    {(viewMode === "studios" ? studioFilters : franchiseFilters).length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (viewMode === "studios") setStudioFilters([])
                          else setFranchiseFilters([])
                        }}
                        className="p-1 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                        title="Clear all filters"
                      >
                        <X size={14} className="text-gray-400 hover:text-white" />
                      </button>
                    )}
                  </div>

                  {/* Autocomplete Dropdown */}
                  {showSearchDropdown && (viewMode === "studios" ? searchQuery : franchiseSearchQuery).trim() && getSearchSuggestions().length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-[#333333] rounded-xl shadow-lg z-50 overflow-hidden">
                      {getSearchSuggestions().map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleSelectSearchItem(item)}
                          className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-[#252525] transition-colors text-left"
                        >
                          <InitialsAvatar name={item.name || `${item.ownerFirstName} ${item.ownerLastName}`} size="sm" variant={viewMode === "studios" ? "orange" : "blue"} className="!w-8 !h-8 !text-xs" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{item.name}</p>
                            <p className="text-xs text-gray-500 truncate">
                              {viewMode === "studios"
                                ? `${item.city || ""}${item.ownerName ? ` · ${item.ownerName}` : ""}`
                                : `${item.city || ""}${item.ownerFirstName ? ` · ${item.ownerFirstName} ${item.ownerLastName}` : ""}`
                              }
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* No results message */}
                  {showSearchDropdown && (viewMode === "studios" ? searchQuery : franchiseSearchQuery).trim() && getSearchSuggestions().length === 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-[#333333] rounded-xl shadow-lg z-50 p-3">
                      <p className="text-sm text-gray-500 text-center">No {viewMode === "studios" ? "studios" : "franchises"} found</p>
                    </div>
                  )}
                </div>
                <div className="flex bg-black rounded-xl border border-[#333333] p-1">
                  <button onClick={() => { setViewMode("studios"); setFilterStatus("all"); setSortBy("alphabetical"); setSearchQuery(""); setFranchiseSearchQuery(""); setShowSearchDropdown(false) }} className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${viewMode === "studios" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white"}`}><Building size={16} /><span className="hidden sm:inline">Studios</span></button>
                  <button onClick={() => { setViewMode("franchise"); setFilterStatus("all"); setSortBy("alphabetical"); setSearchQuery(""); setFranchiseSearchQuery(""); setShowSearchDropdown(false) }} className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${viewMode === "franchise" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white"}`}><Network size={16} /><span className="hidden sm:inline">Franchise</span></button>
                </div>
              </div>
            </div>

            {/* Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Filters (matching members.jsx) Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center justify-between mb-2">
                <button onClick={() => setFiltersExpanded(!filtersExpanded)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                  <Filter size={14} /><span className="text-xs sm:text-sm font-medium">Filters</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${filtersExpanded ? 'rotate-180' : ''}`} />
                  {!filtersExpanded && filterStatus !== 'all' && <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">1</span>}
                </button>
                <div className="hidden lg:block relative" ref={sortDropdownRef}>
                  <button onClick={(e) => { e.stopPropagation(); setShowSortDropdown(!showSortDropdown) }} className="px-3 sm:px-4 py-1.5 bg-[#2F2F2F] text-gray-300 rounded-xl text-xs sm:text-sm hover:bg-[#3F3F3F] transition-colors flex items-center gap-2">
                    {getSortIcon()}<span>{currentSortLabel}</span>
                  </button>
                  {showSortDropdown && (
                    <div className="absolute top-full right-0 mt-1 bg-[#1F1F1F] border border-gray-700 rounded-lg shadow-lg z-50 min-w-[180px]">
                      <div className="py-1">
                        <div className="px-3 py-1.5 text-xs text-gray-500 font-medium border-b border-gray-700">Sort by</div>
                        {currentSortOptions.map((opt) => (
                          <button key={opt.value} onClick={(e) => { e.stopPropagation(); handleSortOptionClick(opt.value) }} className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-800 transition-colors flex items-center justify-between ${sortBy === opt.value ? 'text-white bg-gray-800/50' : 'text-gray-300'}`}>
                            <span>{opt.label}</span>
                            {sortBy === opt.value && <span className="text-gray-400">{sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className={`overflow-hidden transition-all duration-300 ${filtersExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-wrap gap-1.5 sm:gap-3">
                  <button onClick={() => setFilterStatus('all')} className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${filterStatus === 'all' ? "bg-blue-600 text-white" : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"}`}>
                    All ({viewMode === "studios" ? studios.length : franchises.length})
                  </button>
                  <button onClick={() => setFilterStatus('active')} className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${filterStatus === 'active' ? "bg-blue-600 text-white" : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"}`}>
                    Active ({viewMode === "studios" ? studios.filter((s) => s.isActive).length : franchises.filter((f) => !f.isArchived).length})
                  </button>
                  <button onClick={() => setFilterStatus('archived')} className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${filterStatus === 'archived' ? "bg-blue-600 text-white" : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"}`}>
                    {viewMode === "studios" ? "Inactive" : "Archived"} ({viewMode === "studios" ? studios.filter((s) => !s.isActive).length : franchises.filter((f) => f.isArchived).length})
                  </button>
                </div>
              </div>
            </div>

            {/* Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Content Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
            <div className="open_sans_font">
              {viewMode === "studios" ? (
                  /* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â STUDIOS LIST VIEW Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */
                  <div className="bg-[#141414] rounded-xl overflow-hidden">
                    <div className="hidden lg:grid lg:grid-cols-12 gap-3 px-4 bg-[#0f0f0f] border-b border-gray-800 text-xs text-gray-500 font-medium py-3">
                      <div className="col-span-3">Studio Name</div>
                      <div className="col-span-1">No.</div>
                      <div className="col-span-2">Owner</div>
                      <div className="col-span-1">Status</div>
                      <div className="col-span-1">Access Role</div>
                      <div className="col-span-2">Stats</div>
                      <div className="col-span-2 text-right">Actions</div>
                    </div>
                    {filteredAndSortedStudios().length > 0 ? filteredAndSortedStudios().map((studio, i) => {
                      const total = filteredAndSortedStudios().length
                      return (
                        <div key={studio.id} className={`group hover:bg-[#1a1a1a] transition-colors ${i !== total - 1 ? 'border-b border-gray-800/50' : ''}`}>
                          {/* Desktop Row */}
                          <div className="hidden lg:grid lg:grid-cols-12 gap-3 px-4 items-center py-4">
                            <div className="col-span-3 flex items-center gap-3 min-w-0 relative">
                              <LeadSpecialNoteIcon
                                lead={studio}
                                onEditLead={handleEditStudio}
                                size="md"
                                position="relative"
                              />
                              {hasCustomImage(studio.image) ? (
                                <img src={studio.image} className="h-12 w-12 rounded-xl flex-shrink-0 object-cover pointer-events-none" alt="" draggable={false} />
                              ) : (
                                <InitialsAvatar name={studio.name} size="lg" variant="orange" />
                              )}
                              <div className="min-w-0 flex-1">
                                <span className="text-white font-medium text-base truncate block">{studio.name}</span>
                                <div className="flex items-center gap-1 mt-0.5"><MapPin size={12} className="text-gray-500 flex-shrink-0" /><span className="text-sm text-gray-500 truncate">{studio.city}, {studio.zipCode}</span></div>
                              </div>
                            </div>
                            <div className="col-span-1 flex items-center">
                              <span className="text-white text-sm font-mono">{String(studio.studioNumber || studio.id).padStart(5, '0')}</span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-sm text-gray-400 truncate block">{studio.ownerName || '-'}</span>
                            </div>
                            <div className="col-span-1"><StatusTag isActive={studio.isActive} /></div>
                            <div className="col-span-1">
                              {(() => { const role = getStudioAccessRole(studio); const colors = ACCESS_ROLE_COLORS[role] || ACCESS_ROLE_COLORS.Basic; return (
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${colors}`}>
                                  <Shield size={11} className="flex-shrink-0" />{role}
                                </span>
                              ) })()}
                            </div>
                            <div className="col-span-2 flex items-center gap-1.5">
                              <button onClick={() => handleOpenMembersModal(studio)} className="text-sm text-white hover:text-gray-300 inline-flex items-center gap-1 hover:scale-110 transition-transform"><HiOutlineUsers size={14} />{studioStats[studio.id]?.members || 0}</button>
                              <div className="w-px h-4 bg-gray-700/50" />
                              <button onClick={() => handleOpenStaffsModal(studio)} className="text-sm text-white hover:text-gray-300 inline-flex items-center gap-1 hover:scale-110 transition-transform"><BsPersonWorkspace size={14} />{studioStats[studio.id]?.trainers || 0}</button>
                              <div className="w-px h-4 bg-gray-700/50" />
                              <button onClick={() => handleOpenContractsModal(studio)} className="text-sm text-white hover:text-gray-300 inline-flex items-center gap-1 hover:scale-110 transition-transform"><RiContractLine size={14} />{studioStats[studio.id]?.contracts || 0}</button>
                              <div className="w-px h-4 bg-gray-700/50" />
                              <button onClick={() => handleOpenLeadsModal(studio)} className="text-sm text-white hover:text-gray-300 inline-flex items-center gap-1 hover:scale-110 transition-transform"><FaPersonRays size={14} />{studioLeads[studio.id]?.length || 0}</button>
                              <div className="w-px h-4 bg-gray-700/50" />
                              <button onClick={() => { setSelectedStudioForModal(studio); setisFinancesModalOpen(true) }} className="text-sm text-white hover:text-gray-300 inline-flex items-center gap-1 hover:scale-110 transition-transform"><BadgeDollarSign size={14} /></button>
                            </div>
                            <div className="col-span-2 flex items-center justify-end gap-0.5">
                              <button onClick={() => { setSelectedStudioForModal(studio); setIsStudioDocumentModalOpen(true) }} className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="Documents"><FileText size={18} /></button>
                              <button onClick={() => { setSelectedStudio(studio); setShowHistory(true) }} className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="History"><HistoryIcon size={18} /></button>
                              <div className="w-px h-5 bg-gray-700/50 mx-1" />
                              <button onClick={() => handleViewDetails(studio)} className="p-2 text-blue-400 hover:text-blue-300 hover:bg-white/5 rounded-lg transition-colors" title="View Details"><Eye size={18} /></button>
                              <button onClick={() => handleEditStudio(studio)} className="p-2 text-orange-400 hover:text-orange-300 hover:bg-white/5 rounded-lg transition-colors" title="Edit"><Pencil size={18} /></button>
                            </div>
                          </div>
                          {/* Mobile Row */}
                          <div className="lg:hidden">
                            <div className={`px-3 py-3 cursor-pointer active:bg-[#252525] transition-colors`} onClick={() => setExpandedMobileRowId(expandedMobileRowId === studio.id ? null : studio.id)}>
                              <div className="flex items-center gap-3">
                                <LeadSpecialNoteIcon
                                  lead={studio}
                                  onEditLead={handleEditStudio}
                                  size="sm"
                                  position="relative"
                                />
                                {hasCustomImage(studio.image) ? (
                                  <img src={studio.image} className="w-11 h-11 rounded-xl object-cover flex-shrink-0 pointer-events-none" alt="" draggable={false} />
                                ) : (
                                  <InitialsAvatar name={studio.name} size="md" variant="orange" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-white font-medium text-base truncate">{studio.name}</span>
                                    <span className="text-gray-500 text-xs font-mono flex-shrink-0">#{String(studio.studioNumber || studio.id).padStart(5, '0')}</span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5 flex-wrap"><StatusTag isActive={studio.isActive} compact={true} />{(() => { const role = getStudioAccessRole(studio); const colors = ACCESS_ROLE_COLORS[role] || ACCESS_ROLE_COLORS.Basic; return (<span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium border ${colors}`}><Shield size={9} />{role}</span>) })()}<span className="text-xs text-gray-500">{studio.city}</span></div>
                                </div>
                                <ChevronDown size={18} className={`text-gray-500 transition-transform duration-200 flex-shrink-0 ${expandedMobileRowId === studio.id ? 'rotate-180' : ''}`} />
                              </div>
                            </div>
                            <div className={`overflow-hidden transition-all duration-200 ease-in-out ${expandedMobileRowId === studio.id ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                              <div className="px-3 pb-3 pt-1">
                                <div className="bg-[#0f0f0f] rounded-xl p-2">
                                  <div className="grid grid-cols-4 gap-1 mb-1">
                                    <button onClick={(e) => { e.stopPropagation(); handleOpenMembersModal(studio) }} className="flex flex-col items-center gap-1 p-2 text-white hover:text-gray-300 hover:bg-white/5 rounded-lg transition-all hover:scale-105"><HiOutlineUsers size={18} /><span className="text-[10px]">{studioStats[studio.id]?.members || 0} Members</span></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleOpenStaffsModal(studio) }} className="flex flex-col items-center gap-1 p-2 text-white hover:text-gray-300 hover:bg-white/5 rounded-lg transition-all hover:scale-105"><BsPersonWorkspace size={18} /><span className="text-[10px]">{studioStats[studio.id]?.trainers || 0} Staff</span></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleOpenContractsModal(studio) }} className="flex flex-col items-center gap-1 p-2 text-white hover:text-gray-300 hover:bg-white/5 rounded-lg transition-all hover:scale-105"><RiContractLine size={18} /><span className="text-[10px]">{studioStats[studio.id]?.contracts || 0} Contracts</span></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleOpenLeadsModal(studio) }} className="flex flex-col items-center gap-1 p-2 text-white hover:text-gray-300 hover:bg-white/5 rounded-lg transition-all hover:scale-105"><FaPersonRays size={18} /><span className="text-[10px]">{studioLeads[studio.id]?.length || 0} Leads</span></button>
                                  </div>
                                  <div className="grid grid-cols-5 gap-1">
                                    <button onClick={(e) => { e.stopPropagation(); setSelectedStudioForModal(studio); setisFinancesModalOpen(true) }} className="flex flex-col items-center gap-1 p-2 text-white hover:text-gray-300 hover:bg-white/5 rounded-lg transition-all hover:scale-105"><BadgeDollarSign size={18} /><span className="text-[10px]">Finances</span></button>
                                    <button onClick={(e) => { e.stopPropagation(); setSelectedStudioForModal(studio); setIsStudioDocumentModalOpen(true) }} className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><FileText size={18} /><span className="text-[10px]">Docs</span></button>
                                    <button onClick={(e) => { e.stopPropagation(); setSelectedStudio(studio); setShowHistory(true) }} className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><HistoryIcon size={18} /><span className="text-[10px]">History</span></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleViewDetails(studio) }} className="flex flex-col items-center gap-1 p-2 text-blue-400 hover:text-blue-300 hover:bg-white/5 rounded-lg transition-colors"><Eye size={18} /><span className="text-[10px]">Details</span></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleEditStudio(studio) }} className="flex flex-col items-center gap-1 p-2 text-orange-400 hover:text-orange-300 hover:bg-white/5 rounded-lg transition-colors"><Pencil size={18} /><span className="text-[10px]">Edit</span></button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }) : (
                      <div className="text-center py-8"><p className="text-gray-400 text-sm">{filterStatus === "active" ? "No active studios found." : filterStatus === "archived" ? "No inactive studios found." : "No studios found."}</p></div>
                    )}
                  </div>
              ) : (
                /* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â FRANCHISES VIEW Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */
                  <div className="bg-[#141414] rounded-xl overflow-hidden">
                    <div className={`hidden lg:grid lg:grid-cols-12 gap-3 px-4 bg-[#0f0f0f] border-b border-gray-800 text-xs text-gray-500 font-medium py-3`}>
                      <div className="col-span-3">Franchise</div>
                      <div className="col-span-1">Status</div>
                      <div className="col-span-2">Owner</div>
                      <div className="col-span-1">Studios</div>
                      <div className="col-span-2">Login</div>
                      <div className="col-span-3 text-right">Actions</div>
                    </div>
                    {filteredAndSortedFranchises().length > 0 ? filteredAndSortedFranchises().map((franchise, i) => {
                      const total = filteredAndSortedFranchises().length
                      return (
                        <div key={franchise.id} className={`group hover:bg-[#1a1a1a] transition-colors ${i !== total - 1 ? 'border-b border-gray-800/50' : ''}`}>
                          <div className={`hidden lg:grid lg:grid-cols-12 gap-3 px-4 items-center py-4`}>
                            <div className="col-span-3 flex items-center gap-3 min-w-0">
                              <LeadSpecialNoteIcon
                                lead={franchise}
                                onEditLead={handleEditFranchise}
                                size="md"
                                position="relative"
                              />
                              {hasCustomImage(franchise.img) ? (
                                <div className="h-12 w-12 rounded-xl flex-shrink-0 overflow-hidden">
                                  <img src={franchise.img} alt="" className="w-full h-full object-cover pointer-events-none" draggable={false} />
                                </div>
                              ) : (
                                <InitialsAvatar name={franchise.name} size="lg" variant="blue" />
                              )}
                              <div className="min-w-0 flex-1">
                                <span className={`text-white font-medium text-base truncate block`}>{franchise.name}</span>
                                <div className="flex items-center gap-1 mt-0.5"><MapPin size={12} className="text-gray-500 flex-shrink-0" /><span className={`text-sm text-gray-500 truncate`}>{franchise.city}, {franchise.zipCode}</span></div>
                              </div>
                            </div>
                            <div className="col-span-1"><StatusTag isActive={!franchise.isArchived} isArchived={franchise.isArchived} /></div>
                            <div className="col-span-2"><span className={`text-sm text-gray-400`}>{franchise.ownerFirstName} {franchise.ownerLastName}</span></div>
                            <div className="col-span-1"><button onClick={() => handleOpenStudioManagement(franchise)} className={`text-sm text-blue-400 hover:text-blue-300 inline-flex items-center gap-1`}><Building size={14} />{getStudiosByFranchise(franchise.id).length}</button></div>
                            <div className="col-span-2"><span className={`text-sm text-gray-500 truncate block`}>{franchise.loginEmail}</span></div>
                            <div className="col-span-3 flex items-center justify-end gap-0.5">
                              <button onClick={() => handleOpenStudioManagement(franchise)} className={`p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors`} title="Studios"><Building size={18} /></button>
                              <div className={`w-px h-5 bg-gray-700/50 mx-1`} />
                              <button onClick={() => handleViewFranchiseDetails(franchise)} className={`p-2 text-blue-400 hover:text-blue-300 hover:bg-white/5 rounded-lg transition-colors`} title="Details"><Eye size={18} /></button>
                              <button onClick={() => handleEditFranchise(franchise)} className={`p-2 text-orange-400 hover:text-orange-300 hover:bg-white/5 rounded-lg transition-colors`} title="Edit"><Pencil size={18} /></button>
                            </div>
                          </div>
                          {/* Mobile Row */}
                          <div className="lg:hidden">
                            <div className={`px-3 py-3 cursor-pointer active:bg-[#252525]`} onClick={() => setExpandedMobileRowId(expandedMobileRowId === `f-${franchise.id}` ? null : `f-${franchise.id}`)}>
                              <div className="flex items-center gap-3">
                                <LeadSpecialNoteIcon
                                  lead={franchise}
                                  onEditLead={handleEditFranchise}
                                  size="sm"
                                  position="relative"
                                />
                                {hasCustomImage(franchise.img) ? (
                                  <div className="h-11 w-11 rounded-xl flex-shrink-0 overflow-hidden">
                                    <img src={franchise.img} alt="" className="w-full h-full object-cover pointer-events-none" draggable={false} />
                                  </div>
                                ) : (
                                  <InitialsAvatar name={franchise.name} size="md" variant="blue" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <span className={`text-white font-medium text-base truncate block`}>{franchise.name}</span>
                                  <div className="flex items-center gap-2 mt-0.5 flex-wrap"><StatusTag isActive={!franchise.isArchived} isArchived={franchise.isArchived} compact={true} /><span className="text-xs text-gray-500">{franchise.city}</span></div>
                                </div>
                                <ChevronDown size={18} className={`text-gray-500 transition-transform duration-200 flex-shrink-0 ${expandedMobileRowId === `f-${franchise.id}` ? 'rotate-180' : ''}`} />
                              </div>
                            </div>
                            <div className={`overflow-hidden transition-all duration-200 ${expandedMobileRowId === `f-${franchise.id}` ? 'max-h-56 opacity-100' : 'max-h-0 opacity-0'}`}>
                              <div className="px-3 pb-3 pt-1">
                                <div className="bg-[#0f0f0f] rounded-xl p-2">
                                  <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-300">Owner: {franchise.ownerFirstName} {franchise.ownerLastName}</span>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-300">{getStudiosByFranchise(franchise.id).length} Studios</span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-1">
                                    <button onClick={(e) => { e.stopPropagation(); handleOpenStudioManagement(franchise) }} className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><Building size={18} /><span className="text-[10px]">Studios</span></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleViewFranchiseDetails(franchise) }} className="flex flex-col items-center gap-1 p-2 text-blue-400 hover:text-blue-300 hover:bg-white/5 rounded-lg transition-colors"><Eye size={18} /><span className="text-[10px]">Details</span></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleEditFranchise(franchise) }} className="flex flex-col items-center gap-1 p-2 text-orange-400 hover:text-orange-300 hover:bg-white/5 rounded-lg transition-colors"><Pencil size={18} /><span className="text-[10px]">Edit</span></button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }) : (
                      <div className="text-center py-8"><Building2 size={48} className="mx-auto mb-4 text-gray-600" /><p className="text-gray-400">No franchises found.</p><button onClick={() => setIsCreateFranchiseModalOpen(true)} className="mt-4 bg-[#3F74FF] hover:bg-[#3F74FF]/90 px-4 py-2 rounded-xl text-sm">Create Your First Franchise</button></div>
                    )}
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating Action Button - Mobile */}
        {viewMode === "studios" ? (
          <button onClick={() => setIsAssignStudioModalOpen(true)} className="lg:hidden fixed bottom-4 right-4 bg-[#FF843E] hover:bg-[#FF843E]/90 text-white p-4 rounded-xl shadow-lg transition-all active:scale-95 z-30" aria-label="Assign to Franchise"><Network size={22} /></button>
        ) : (
          <button onClick={() => setIsCreateFranchiseModalOpen(true)} className="lg:hidden fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl shadow-lg transition-all active:scale-95 z-30" aria-label="Create Franchise"><Plus size={22} /></button>
        )}

        {/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â MODALS (all preserved) Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */}
        <StudioMembersModal isOpen={isMembersModalOpen} studio={selectedStudioForModal} studioMembers={studioMembers} memberSearchQuery={memberSearchQuery} setMemberSearchQuery={setMemberSearchQuery} getFilteredMembers={getFilteredMembers} onClose={() => { setIsMembersModalOpen(false); setSelectedStudioForModal(null); setMemberSearchQuery("") }} onViewMember={handleViewMemberDetails} onEditMember={handleEditMember} handleHistoryFromOverview={handleHistoryFromOverview} handleDocumentFromOverview={handleDocumentFromOverview} handleCalendarFromOverview={handleCalendarFromOverview} onCreateTempMember={() => setIsCreateTempMemberModalOpen(true)} handleTrainingPlanFromOverview={handleTrainingPlanFromOverview} />
        <EditMemberModal isOpen={isEditMemberModalOpen} onClose={() => setIsEditMemberModalOpen(false)} selectedMember={selectedMemberForEdit} onSave={handleMemberEditSubmit} memberRelations={memberRelations} availableMembersLeads={availableMembersLeadsMain} onArchiveMember={() => toast.success("Member archived successfully")} onUnarchiveMember={() => toast.success("Member unarchived successfully")} />
        {showTrainingPlansModalMain && selectedMemberForEdit && <TrainingPlansModal isOpen={showTrainingPlansModalMain} onClose={() => { setShowTrainingPlansModalMain(false); setSelectedMemberForEdit(null) }} selectedMemberMain={selectedMemberForEdit} memberTrainingPlansMain={memberTrainingPlansMain[selectedMemberForEdit.id] || []} availableTrainingPlansMain={availableTrainingPlansMain} onAssignPlanMain={handleAssignPlanMain} onRemovePlanMain={handleRemovePlanMain} />}
        <CreateTempMemberModal show={isCreateTempMemberModalOpen} onClose={() => { setIsCreateTempMemberModalOpen(false); setTempMemberForm({ ...DEFAULT_TEMP_MEMBER_FORM }); setTempMemberModalTab("details") }} tempMemberForm={tempMemberForm} setTempMemberForm={setTempMemberForm} tempMemberModalTab={tempMemberModalTab} setTempMemberModalTab={setTempMemberModalTab} handleCreateTempMember={handleCreateTempMember} handleTempMemberInputChange={handleTempMemberInputChange} handleImgUpload={handleImgUpload} editingRelationsMain={editingRelationsMain} setEditingRelationsMain={setEditingRelationsMain} newRelationMain={newRelationMain} setNewRelationMain={setNewRelationMain} availableMembersLeadsMain={availableMembersLeadsMain} relationOptionsMain={relationOptionsMain} />
        <MemberDetailsModal isOpen={isMemberDetailsModalOpen} onClose={() => setIsMemberDetailsModalOpen(false)} member={selectedItemForDetails} calculateAge={calculateAge} isContractExpiringSoon={isContractExpiringSoon} memberRelations={memberRelations[selectedItemForDetails?.id]} />
        <MemberHistoryModalMain isOpen={showHistoryModal} onClose={() => { setShowHistoryModal(false); setSelectedMemberForEdit(null) }} selectedMember={selectedMemberForEdit} memberHistory={memberHistory} historyTabMain={historyTabMain} setHistoryTabMain={setHistoryTabMain} />
        <MemberDocumentModal member={selectedMemberForEdit} isOpen={showDocumentModal} onClose={() => { setShowDocumentModal(false); setSelectedMemberForEdit(null) }} />
        <AppointmentModalMain isOpen={showAppointmentModalMain} onClose={() => { setShowAppointmentModalMain(false); setSelectedMemberForEdit(null) }} selectedMemberMain={selectedMemberForEdit} getMemberAppointmentsMain={getMemberAppointmentsMain} appointmentTypesMain={appointmentTypesMain} handleEditAppointmentMain={handleEditAppointmentMain} handleDeleteAppointmentMain={handleDeleteAppointmentMain} memberContingent={memberContingent} currentBillingPeriodMain={currentBillingPeriodMain} handleManageContingentMain={handleManageContingentMain} handleCreateNewAppointmentMain={handleCreateNewAppointmentMain} />
        {showCreateAppointmentModalMain && <CreateAppointmentModal isOpen={showCreateAppointmentModalMain} onClose={() => setShowCreateAppointmentModalMain(false)} appointmentTypesMain={appointmentTypesMain} onSubmit={handleAddAppointmentSubmit} setIsNotifyMemberOpenMain={setIsNotifyMemberOpenMain} setNotifyActionMain={setNotifyActionMain} freeAppointmentsMain={freeAppointmentsMain} />}
        {showSelectedAppointmentModalMain && selectedAppointmentDataMain && <EditAppointmentModalMain selectedAppointmentMain={selectedAppointmentDataMain} setSelectedAppointmentMain={setSelectedAppointmentDataMain} appointmentTypesMain={appointmentTypesMain} freeAppointmentsMain={freeAppointmentsMain} handleAppointmentChange={handleAppointmentChange} appointmentsMain={appointmentsMain} setAppointmentsMain={setAppointmentsMain} setIsNotifyMemberOpenMain={setIsNotifyMemberOpenMain} setNotifyActionMain={setNotifyActionMain} onDelete={handleDeleteAppointmentMain} />}
        <ContingentModalMain showContingentModalMain={showContingentModalMain} setShowContingentModalMain={setShowContingentModalMain} selectedMemberForAppointmentsMain={selectedMemberForEdit} getBillingPeriodsMain={getBillingPeriodsMain} selectedBillingPeriodMain={selectedBillingPeriodMain} handleBillingPeriodChange={handleBillingPeriodChange} setShowAddBillingPeriodModalMain={setShowAddBillingPeriodModalMain} currentBillingPeriodMain={currentBillingPeriodMain} tempContingentMain={tempContingentMain} setTempContingentMain={setTempContingentMain} handleSaveContingentMain={handleSaveContingentMain} />
        <AddBillingPeriodModalMain open={showAddBillingPeriodModalMain} newBillingPeriodMain={newBillingPeriodMain} setNewBillingPeriodMain={setNewBillingPeriodMain} onClose={() => setShowAddBillingPeriodModalMain(false)} onAdd={handleAddBillingPeriodMain} />
        <StudioStaffModal isOpen={isStaffsModalOpen} studio={selectedStudioForModal} studioStaffs={studioStaffs} staffSearchQuery={staffSearchQuery} setStaffSearchQuery={setStaffSearchQuery} getFilteredStaff={getFilteredStaff} onClose={() => { setIsStaffsModalOpen(false); setSelectedStudioForModal(null); setStaffSearchQuery("") }} onAddStaff={() => setIsAddStaffModalOpen(true)} onViewStaff={handleViewStaffDetails} onEditStaff={(staff) => { setselectedStaffForEdit(staff); setisEditStaffModalOpen(true) }} handleHistoryFromOverview={handleStaffHistoryFromOverview} handleDocumentFromOverview={handleStaffDocumentFromOverview} />
        <EditStaffModal isOpen={isEditStaffModalOpen} onClose={() => { setisEditStaffModalOpen(false); setselectedStaffForEdit(null) }} onSave={(updatedStaff) => { setStudioStaffs((prev) => ({ ...prev, [selectedStudioForModal.id]: prev[selectedStudioForModal.id].map((s) => s.id === updatedStaff.id ? updatedStaff : s) })); setisEditStaffModalOpen(false); toast.success("Staff member updated successfully") }} staff={selectedStaffForEdit} handleRemovalStaff={(staff) => { setStudioStaffs((prev) => ({ ...prev, [selectedStudioForModal.id]: prev[selectedStudioForModal.id].filter((s) => s.id !== staff.id) })); setisEditStaffModalOpen(false); toast.success("Staff member removed successfully") }} />
        {isStaffDetailsModalOpen && selectedItemForDetails && <ViewStaffModal isVisible={isStaffDetailsModalOpen} onClose={() => setIsStaffDetailsModalOpen(false)} staffData={selectedItemForDetails} />}
        {isAddStaffModalOpen && <AddStaffModal isOpen={isAddStaffModalOpen} onClose={() => setIsAddStaffModalOpen(false)} onSave={(newStaff) => { setStudioStaffs((prev) => ({ ...prev, [selectedStudioForModal.id]: [...(prev[selectedStudioForModal.id] || []), newStaff] })); setIsAddStaffModalOpen(false); toast.success("Staff member added successfully") }} />}
        <StaffHistoryModalMain isOpen={showStaffHistoryModal} onClose={() => { setShowStaffHistoryModal(false); setselectedStaffForEdit(null) }} selectedStaff={selectedStaffForEdit} staffHistory={staffHistory} historyTabMain={historyTabStaff} setHistoryTabMain={setHistoryTabStaff} />
        <StaffDocumentModal staff={selectedStaffForEdit} isOpen={showDocumentModalStaff} onClose={() => { setShowDocumentModalStaff(false); setselectedStaffForEdit(null) }} />
        <ContractsModal isOpen={isContractsModalOpen} onClose={() => setIsContractsModalOpen(false)} selectedStudio={selectedStudioForModal} studioContracts={studioContracts} handleFileUpload={handleFileUpload} handleDownloadFile={handleDownloadFile} onViewDetails={handleViewContractDetails} handleViewContractHistory={handleViewContractHistory} />
        <ContractDetailsModal isOpen={isContractDetailsModalOpen} onClose={() => setIsContractDetailsModalOpen(false)} contract={selectedItemForDetails} />
        {isContractHistoryModalOpen && selectedContractForHistory && <ContractHistoryModal contract={selectedContractForHistory} history={contractHistory[selectedStudioForModal?.id] || []} onClose={() => { setIsContractHistoryModalOpen(false); setSelectedContractForHistory(null) }} />}
        <StudioLeadsModal isOpen={isLeadsModalOpen} studio={selectedStudioForModal} studioLeads={studioLeads} leadSearchQuery={leadSearchQuery} setLeadSearchQuery={setLeadSearchQuery} getFilteredLeads={getFilteredLeads} onClose={() => { setIsLeadsModalOpen(false); setSelectedStudioForModal(null); setLeadSearchQuery("") }} onViewLead={handleViewLead} onEditLead={handleEditLead} onAddLead={handleAddLead} />
        <AddLeadModal isVisible={isAddLeadModalOpen} onClose={() => setIsAddLeadModalOpen(false)} onSave={handleSaveLead} leadSources={leadSources} />
        <ViewLeadModal isVisible={isViewLeadModalOpen} onClose={() => { setIsViewLeadModalOpen(false); setSelectedLead(null) }} leadData={selectedLead} onEditLead={handleEditLead} leadRelations={leadRelations} />
        <EditLeadModal isVisible={isEditLeadModalOpen} onClose={() => { setIsEditLeadModalOpen(false); setSelectedLead(null) }} onSave={handleSaveEditedLead} leadData={selectedLead} leadSources={leadSources} leadRelations={leadRelations} setLeadRelations={setLeadRelations} availableMembersLeads={availableMembersLeadsMain} initialTab="details" />
        <StudioDetailsModal isOpen={isViewDetailsModalOpen} onClose={() => setIsViewDetailsModalOpen(false)} studio={selectedStudio} franchises={franchises} studioStats={studioStats} DefaultStudioImage={DefaultStudioImage} isContractExpiringSoon={isContractExpiringSoon} onEditStudio={handleEditStudio} onGoToContract={handleGoToContract} onViewFranchiseDetails={handleViewFranchiseDetails} />
        <StudioHistoryModalMain show={showHistory} studio={selectedStudio} studioHistoryMain={studioHistoryMainData} historyTabMain={historyTabMain} setHistoryTabMain={setHistoryTabMain} onClose={() => { setShowHistory(false); setSelectedStudio(null) }} />
        <FranchiseModal isCreateModalOpen={isCreateFranchiseModalOpen} isEditModalOpen={isEditFranchiseModalOpen} onClose={handleCloseModal} franchiseForm={franchiseForm} onInputChange={handleFranchiseInputChange} onSubmit={handleFranchiseSubmit} onLogoUpload={handleLogoUpload} onArchive={handleArchiveFranchise} selectedFranchise={selectedFranchise} />
        <FranchiseDetailsModal isOpen={isFranchiseDetailsModalOpen} onClose={() => setIsFranchiseDetailsModalOpen(false)} franchise={selectedFranchise} onEditFranchise={handleEditFranchise} assignedStudios={selectedFranchise ? getStudiosByFranchise(selectedFranchise.id) : []} onArchiveFranchise={handleArchiveFranchise} />
        <AssignStudioModal isOpen={isAssignStudioModalOpen} onClose={handleAssignStudioCloseModal} franchises={franchises} selectedFranchiseForAssignment={selectedFranchiseForAssignment} onFranchiseSelect={setSelectedFranchiseForAssignment} unassignedStudios={getFilteredUnassignedStudios()} onAssignStudio={handleAssignStudio} toast={toast} searchQuery={unassignedStudioSearchQuery} onSearchChange={setUnassignedStudioSearchQuery} />
        <StudioManagementModal isOpen={isStudioManagementModalOpen} onClose={handleStudioManagementCloseModal} franchise={selectedFranchiseForManagement} assignedStudios={selectedFranchiseForManagement ? getStudiosByFranchise(selectedFranchiseForManagement.id) : []} unassignedStudios={getUnassignedStudios()} onAssignStudio={handleAssignStudio} onUnassignStudio={handleUnassignStudio} onEditStudio={handleEditStudio} toast={toast} />
        <StudioFinancesModal isOpen={isFinancesModalOpen} onClose={() => setisFinancesModalOpen(false)} studio={selectedStudioForModal} studioFinances={studioFinanceData} financesPeriod={financesPeriod} onPeriodChange={setFinancesPeriod} />

        <StudioDocumentManagementModal
          studio={selectedStudioForModal}
          isOpen={isStudioDocumentModalOpen}
          onClose={() => {
            setIsStudioDocumentModalOpen(false)
            setSelectedStudioForModal(null)
          }}
          onDocumentsUpdate={(studioId, documents) => {
            setStudios(prev => prev.map(s => s.id === studioId ? { ...s, documents } : s))
          }}
        />
        <EditStudioOptionsModal isOpen={isEditOptionsModalOpen} onClose={() => setIsEditOptionsModalOpen(false)} studio={selectedStudio} onStudioConfig={handleStudioConfig} />
      </>
    )
  }
