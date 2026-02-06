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
  } from "../../utils/admin-panel-states/states"

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
  import { availableMembersLeadsMain, memberRelationsMainData } from "../../utils/studio-states";
  import EditStudioOptionsModal from "../../components/admin-dashboard-components/studios-modal/edit-studio-options-modal";
  import { useNavigate } from "react-router-dom";
  import CreateTempMemberModal from "../../components/admin-dashboard-components/studios-modal/members-component/create-temporary-member-modal";
  import TrainingPlansModal from "../../components/admin-dashboard-components/studios-modal/members-component/training-plan-modal";
  import { LeadSpecialNoteIcon } from "../../components/admin-dashboard-components/shared/special-note/shared-special-note-icon";
  import StudioDocumentManagementModal from "../../components/admin-dashboard-components/shared/StudioDocumentManagementModal";

  // â”€â”€â”€ Reusable StatusTag (matching members.jsx) â”€â”€â”€
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

  export default function Studios() {
    const navigate = useNavigate();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false)
    const [selectedStudio, setSelectedStudio] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [franchiseSearchQuery, setFranchiseSearchQuery] = useState("")
    const [unassignedStudioSearchQuery, setUnassignedStudioSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")

    // â”€â”€â”€ View controls (matching members.jsx) â”€â”€â”€
    const [viewMode, setViewMode] = useState("studios")
    const [expandedMobileRowId, setExpandedMobileRowId] = useState(null)

    // â”€â”€â”€ Sort controls (matching members.jsx) â”€â”€â”€
    const [sortBy, setSortBy] = useState("alphabetical")
    const [sortDirection, setSortDirection] = useState("asc")
    const [showSortDropdown, setShowSortDropdown] = useState(false)
    const [showMobileSortDropdown, setShowMobileSortDropdown] = useState(false)
    const sortDropdownRef = useRef(null)
    const mobileSortDropdownRef = useRef(null)

    // â”€â”€â”€ Filter controls (matching members.jsx) â”€â”€â”€
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
    const [memberEditForm, setMemberEditForm] = useState({
      name: "", email: "", phone: "", membershipType: "", joinDate: "", status: "active",
    })

    const [isEditOptionsModalOpen, setIsEditOptionsModalOpen] = useState(false)

    const [isMemberDetailsModalOpen, setIsMemberDetailsModalOpen] = useState(false)
    const [isStaffDetailsModalOpen, setIsStaffDetailsModalOpen] = useState(false)
    const [isContractDetailsModalOpen, setIsContractDetailsModalOpen] = useState(false)
    const [selectedItemForDetails, setSelectedItemForDetails] = useState(null)

    const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false)

    const [financesPeriod, setFinancesPeriod] = useState("month")
    const [showPassword, setShowPassword] = useState({})

    const [editForm, setEditForm] = useState({
      name: "", email: "", phone: "", street: "", zipCode: "", city: "", country: "", website: "", about: "",
      note: "", noteStartDate: "", noteEndDate: "", noteImportance: "unimportant", ownerName: "",
      openingHours: { monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", saturday: "", sunday: "" },
      closingDays: "", openingHoursList: [], closingDaysList: [], logoUrl: "", logoFile: null,
      maxCapacity: 10, appointmentTypes: [],
      trialTraining: { name: "Trial Training", duration: 60, capacity: 1, color: "#1890ff" },
      contractTypes: [],
      contractSections: [
        { title: "Personal Information", content: "", editable: false, requiresAgreement: true },
        { title: "Contract Terms", content: "", editable: false, requiresAgreement: true },
      ],
      contractPauseReasons: [{ name: "Vacation", maxDays: 30 }, { name: "Medical", maxDays: 90 }],
      noticePeriod: 30, extensionPeriod: 12, allowMemberSelfCancellation: false,
      autoArchiveDuration: 30, emailNotifications: true, chatNotifications: true,
      studioChatNotifications: true, memberChatNotifications: true,
      emailSignature: "Best regards,\n{Studio_Name} Team",
      appointmentNotifications: [
        { type: "booking", title: "Appointment Confirmation", message: "Hello {Member_Name}, your {Appointment_Type} has been booked for {Booked_Time}.", sendVia: ["email", "platform"], enabled: true },
        { type: "cancellation", title: "Appointment Cancellation", message: "Hello {Member_Name}, your {Appointment_Type} scheduled for {Booked_Time} has been cancelled.", sendVia: ["email", "platform"], enabled: true },
        { type: "rescheduled", title: "Appointment Rescheduled", message: "Hello {Member_Name}, your {Appointment_Type} has been rescheduled to {Booked_Time}.", sendVia: ["email", "platform"], enabled: true },
      ],
      broadcastMessages: [],
      emailConfig: { smtpServer: "", smtpPort: 587, emailAddress: "", password: "", useSSL: false, senderName: "", smtpUser: "", smtpPass: "" },
      birthdayMessages: { enabled: false, subject: "Happy Birthday from {Studio_Name}", message: "Dear {Member_Name},\nWishing you a wonderful birthday!", sendVia: ["email"], sendTime: "09:00" },
      appearance: { theme: "dark", primaryColor: "#FF843E", secondaryColor: "#1890ff", allowUserThemeToggle: true },
      roles: [], permissionTemplates: [], leadSources: [], tags: [],
      currency: "EUR", vatRates: [{ name: "Standard", rate: 19 }, { name: "Reduced", rate: 7 }],
      additionalContractDocuments: [], additionalDocs: [],
    })

    const [franchiseForm, setFranchiseForm] = useState({
      name: "", email: "", phone: "", street: "", zipCode: "", city: "", website: "", about: "",
      ownerFirstName: "", ownerLastName: "", country: "", specialNote: "", noteImportance: "unimportant",
      noteStartDate: "", noteEndDate: "", loginEmail: "", loginPassword: "", confirmPassword: "", logo: null,
    })

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
    const [newRelationMain, setNewRelationMain] = useState({ name: "", relation: "", category: "family", type: "manual", selectedMemberId: null })

    const [tempMemberForm, setTempMemberForm] = useState({
      img: "", firstName: "", lastName: "", email: "", phone: "", gender: "", country: "", street: "",
      zipCode: "", city: "", dateOfBirth: "", about: "", note: "", noteImportance: "unimportant",
      noteStartDate: "", noteEndDate: "", autoArchivePeriod: 4,
      relations: { family: [], friendship: [], relationship: [], work: [], other: [] },
    })

    const [showTrainingPlansModalMain, setShowTrainingPlansModalMain] = useState(false)
    const [memberTrainingPlansMain, setMemberTrainingPlansMain] = useState({})
    const [availableTrainingPlansMain, setAvailableTrainingPlansMain] = useState([
      { id: 1, name: "Beginner Strength Program", description: "8-week beginner strength training program", duration: "8 weeks", difficulty: "Beginner", assignedDate: "2024-01-15" },
      { id: 2, name: "Advanced HIIT Program", description: "High-intensity interval training for advanced users", duration: "6 weeks", difficulty: "Advanced", assignedDate: "2024-01-20" },
      { id: 3, name: "Cardio Endurance Plan", description: "12-week cardiovascular endurance program", duration: "12 weeks", difficulty: "Intermediate", assignedDate: "2024-02-01" },
    ])

    const [isNotifyMemberOpenMain, setIsNotifyMemberOpenMain] = useState(false)
    const [notifyActionMain, setNotifyActionMain] = useState("")
    const [memberContingent, setMemberContingent] = useState({
      1: { current: { used: 2, total: 7 }, future: { "05.14.25 - 05.18.2025": { used: 0, total: 8 }, "06.14.25 - 06.18.2025": { used: 0, total: 8 } } },
      2: { current: { used: 1, total: 8 }, future: { "05.14.25 - 05.18.2025": { used: 0, total: 8 }, "06.14.25 - 06.18.2025": { used: 0, total: 8 } } },
    })

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
    const [currentBillingPeriodMain, setCurrentBillingPeriodMain] = useState("04.14.25 - 04.18.2025")
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
    const [leadSources, setLeadSources] = useState(["Website","Referral","Social Media","Walk-in","Phone Call","Email","Event","Other"])

    // â”€â”€â”€ Sort options (matching members.jsx pattern) â”€â”€â”€
    const studioSortOptions = [{ value: "alphabetical", label: "Name" }, { value: "memberCount", label: "Members" }, { value: "staffCount", label: "Staff" }, { value: "contractCount", label: "Contracts" }, { value: "leadCount", label: "Leads" }]
    const franchiseSortOptions = [{ value: "alphabetical", label: "Name" }, { value: "studioCount", label: "Studios" }]
    const currentSortOptions = viewMode === "studios" ? studioSortOptions : franchiseSortOptions
    const currentSortLabel = currentSortOptions.find((opt) => opt.value === sortBy)?.label || "Name"
    const getSortIcon = () => sortDirection === "asc" ? <ArrowUp size={14} className="text-white" /> : <ArrowDown size={14} className="text-white" />
    const handleSortOptionClick = (newSortBy) => { if (sortBy === newSortBy) { setSortDirection(sortDirection === "asc" ? "desc" : "asc") } else { setSortBy(newSortBy); setSortDirection("asc") } }
    const handleMobileSortOptionClick = (newSortBy) => { handleSortOptionClick(newSortBy); setShowMobileSortDropdown(false) }

    // â”€â”€â”€ All handlers (preserved from original) â”€â”€â”€
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
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => { if (!showSortDropdown && !showMobileSortDropdown) return; const h = () => { setShowSortDropdown(false); setShowMobileSortDropdown(false) }; window.addEventListener('scroll', h, { capture: true, passive: true }); return () => window.removeEventListener('scroll', h, { capture: true, passive: true }) }, [showSortDropdown, showMobileSortDropdown])
    useEffect(() => { if (!expandedMobileRowId) return; const h = () => setExpandedMobileRowId(null); window.addEventListener('scroll', h, { capture: true, passive: true }); return () => window.removeEventListener('scroll', h, { capture: true, passive: true }) }, [expandedMobileRowId])
    useEffect(() => { const h = () => setFiltersExpanded(window.innerWidth >= 768); h(); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h) }, [])

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
      setFranchiseForm({ name: "", email: "", phone: "", street: "", zipCode: "", city: "", website: "", about: "", ownerFirstName: "", ownerLastName: "", country: "", specialNote: "", noteImportance: "unimportant", noteStartDate: "", noteEndDate: "", loginEmail: "", loginPassword: "", confirmPassword: "", logo: null })
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
      let filtered = studios.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
      if (filterStatus === "active") filtered = filtered.filter((s) => s.isActive)
      else if (filterStatus === "archived") filtered = filtered.filter((s) => !s.isActive)
      filtered.sort((a, b) => { let c = 0; if (sortBy === "alphabetical") c = a.name.localeCompare(b.name); else if (sortBy === "memberCount") c = (studioStats[a.id]?.members || 0) - (studioStats[b.id]?.members || 0); else if (sortBy === "staffCount") c = (studioStats[a.id]?.trainers || 0) - (studioStats[b.id]?.trainers || 0); else if (sortBy === "contractCount") c = (studioStats[a.id]?.contracts || 0) - (studioStats[b.id]?.contracts || 0); else if (sortBy === "leadCount") c = (studioLeads[a.id]?.length || 0) - (studioLeads[b.id]?.length || 0); return sortDirection === "asc" ? c : -c })
      return filtered
    }

    const filteredAndSortedFranchises = () => {
      let filtered = franchises.filter((f) => f.name.toLowerCase().includes(franchiseSearchQuery.toLowerCase()))
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
      setTempMemberForm({ img: "", firstName: "", lastName: "", email: "", phone: "", gender: "", country: "", street: "", zipCode: "", city: "", dateOfBirth: "", about: "", note: "", noteImportance: "unimportant", noteStartDate: "", noteEndDate: "", autoArchivePeriod: 4, relations: { family: [], friendship: [], relationship: [], work: [], other: [] } })
      setTempMemberModalTab("details"); setIsCreateTempMemberModalOpen(false); toast.success("Temporary member created successfully!")
    }

    const handleTempMemberInputChange = (e) => { const { name, value } = e.target; setTempMemberForm(prev => ({ ...prev, [name]: value })) }
    const handleImgUpload = (e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => { setTempMemberForm(prev => ({ ...prev, img: ev.target.result })) }; reader.readAsDataURL(file) } }
    const relationOptionsMain = { family: ["Parent","Child","Sibling","Spouse","Grandparent","Grandchild","Cousin","Aunt/Uncle","Nephew/Niece"], friendship: ["Friend","Close Friend","Best Friend","Acquaintance"], relationship: ["Partner","FiancÃ©(e)","Girlfriend/Boyfriend","Ex-partner"], work: ["Colleague","Boss","Employee","Business Partner","Client"], other: ["Neighbor","Mentor","Teammate","Classmate","Other"] }
    const handleTrainingPlanFromOverview = (member) => { setSelectedMemberForEdit(member); setShowTrainingPlansModalMain(true) }
    const handleAssignPlanMain = (memberId, planId) => { const plan = availableTrainingPlansMain.find(p => p.id === parseInt(planId)); if (!plan) return; setMemberTrainingPlansMain(prev => ({ ...prev, [memberId]: [...(prev[memberId] || []), { ...plan, assignedDate: new Date().toISOString().split('T')[0] }] })); toast.success("Training plan assigned successfully!"); setShowTrainingPlansModalMain(false) }
    const handleRemovePlanMain = (memberId, planId) => { setMemberTrainingPlansMain(prev => ({ ...prev, [memberId]: (prev[memberId] || []).filter(p => p.id !== planId) })); toast.success("Training plan removed successfully!") }

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    // RENDER
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    return (
      <>
        <Toaster position="top-right" toastOptions={{ duration: 2000, style: { background: "#333", color: "#fff" } }} />

        <div className="flex flex-col lg:flex-row rounded-3xl bg-[#1C1C1C] transition-all duration-500 text-white relative">
          <div className="flex-1 min-w-0 md:p-6 p-4 pb-36">

            {/* â”€â”€â”€ Header (matching members.jsx) â”€â”€â”€ */}
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

            {/* â”€â”€â”€ Search Bar â”€â”€â”€ */}
            <div className="mb-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <div className="bg-[#141414] rounded-xl px-3 py-2 min-h-[42px] flex items-center gap-1.5 border border-[#333333] focus-within:border-[#3F74FF] transition-colors">
                    <Search className="text-gray-400 flex-shrink-0" size={16} />
                    <input type="text" placeholder={`Search ${viewMode === "studios" ? "studios" : "franchises"}...`} value={viewMode === "studios" ? searchQuery : franchiseSearchQuery} onChange={(e) => { if (viewMode === "studios") setSearchQuery(e.target.value); else setFranchiseSearchQuery(e.target.value) }} className="flex-1 min-w-[100px] bg-transparent outline-none text-sm text-white placeholder-gray-500" />
                  </div>
                </div>
                <div className="flex bg-black rounded-xl border border-[#333333] p-1">
                  <button onClick={() => { setViewMode("studios"); setFilterStatus("all"); setSortBy("alphabetical") }} className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${viewMode === "studios" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white"}`}><Building size={16} /><span className="hidden sm:inline">Studios</span></button>
                  <button onClick={() => { setViewMode("franchise"); setFilterStatus("all"); setSortBy("alphabetical") }} className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${viewMode === "franchise" ? "bg-[#3F74FF] text-white" : "text-gray-400 hover:text-white"}`}><Network size={16} /><span className="hidden sm:inline">Franchise</span></button>
                </div>
              </div>
            </div>

            {/* â”€â”€â”€ Filters (matching members.jsx) â”€â”€â”€ */}
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

            {/* â”€â”€â”€ Content â”€â”€â”€ */}
            <div className="open_sans_font">
              {viewMode === "studios" ? (
                  /* â•â•â• STUDIOS LIST VIEW â•â•â• */
                  <div className="bg-[#141414] rounded-xl overflow-hidden">
                    <div className="hidden lg:grid lg:grid-cols-12 gap-3 px-4 bg-[#0f0f0f] border-b border-gray-800 text-xs text-gray-500 font-medium py-3">
                      <div className="col-span-3">Studio Name</div>
                      <div className="col-span-1">No.</div>
                      <div className="col-span-1">Owner</div>
                      <div className="col-span-1">Status</div>
                      <div className="col-span-3">Stats</div>
                      <div className="col-span-3 text-right">Actions</div>
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
                              <img src={studio.image || DefaultStudioImage} className="h-12 w-12 rounded-lg flex-shrink-0 object-cover" alt="" />
                              <div className="min-w-0 flex-1">
                                <span className="text-white font-medium text-base truncate block">{studio.name}</span>
                                <div className="flex items-center gap-1 mt-0.5"><MapPin size={12} className="text-gray-500 flex-shrink-0" /><span className="text-sm text-gray-500 truncate">{studio.city}, {studio.zipCode}</span></div>
                              </div>
                            </div>
                            <div className="col-span-1 flex items-center">
                              <span className="text-white text-sm font-mono">{String(studio.studioNumber || studio.id).padStart(5, '0')}</span>
                            </div>
                            <div className="col-span-1">
                              <span className="text-sm text-gray-400 truncate block">{studio.ownerName || '-'}</span>
                            </div>
                            <div className="col-span-1"><StatusTag isActive={studio.isActive} /></div>
                            <div className="col-span-3 flex items-center gap-1.5">
                              <button onClick={() => handleOpenMembersModal(studio)} className="text-sm text-white hover:text-gray-300 inline-flex items-center gap-1"><HiOutlineUsers size={14} />{studioStats[studio.id]?.members || 0}</button>
                              <div className="w-px h-4 bg-gray-700/50" />
                              <button onClick={() => handleOpenStaffsModal(studio)} className="text-sm text-white hover:text-gray-300 inline-flex items-center gap-1"><BsPersonWorkspace size={14} />{studioStats[studio.id]?.trainers || 0}</button>
                              <div className="w-px h-4 bg-gray-700/50" />
                              <button onClick={() => handleOpenContractsModal(studio)} className="text-sm text-white hover:text-gray-300 inline-flex items-center gap-1"><RiContractLine size={14} />{studioStats[studio.id]?.contracts || 0}</button>
                              <div className="w-px h-4 bg-gray-700/50" />
                              <button onClick={() => handleOpenLeadsModal(studio)} className="text-sm text-white hover:text-gray-300 inline-flex items-center gap-1"><FaPersonRays size={14} />{studioLeads[studio.id]?.length || 0}</button>
                              <div className="w-px h-4 bg-gray-700/50" />
                              <button onClick={() => { setSelectedStudioForModal(studio); setisFinancesModalOpen(true) }} className="text-sm text-white hover:text-gray-300 inline-flex items-center gap-1"><BadgeDollarSign size={14} /></button>
                            </div>
                            <div className="col-span-3 flex items-center justify-end gap-0.5">
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
                                <img src={studio.image || DefaultStudioImage} className="w-11 h-11 rounded-lg object-cover flex-shrink-0" alt="" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-white font-medium text-base truncate">{studio.name}</span>
                                    <span className="text-gray-500 text-xs font-mono flex-shrink-0">#{String(studio.studioNumber || studio.id).padStart(5, '0')}</span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5 flex-wrap"><StatusTag isActive={studio.isActive} compact={true} /><span className="text-xs text-gray-500">{studio.city}</span></div>
                                </div>
                                <ChevronDown size={18} className={`text-gray-500 transition-transform duration-200 flex-shrink-0 ${expandedMobileRowId === studio.id ? 'rotate-180' : ''}`} />
                              </div>
                            </div>
                            <div className={`overflow-hidden transition-all duration-200 ease-in-out ${expandedMobileRowId === studio.id ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                              <div className="px-3 pb-3 pt-1">
                                <div className="bg-[#0f0f0f] rounded-xl p-2">
                                  <div className="grid grid-cols-4 gap-1 mb-1">
                                    <button onClick={(e) => { e.stopPropagation(); handleOpenMembersModal(studio) }} className="flex flex-col items-center gap-1 p-2 text-white hover:text-gray-300 hover:bg-white/5 rounded-lg transition-colors"><HiOutlineUsers size={18} /><span className="text-[10px]">{studioStats[studio.id]?.members || 0} Members</span></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleOpenStaffsModal(studio) }} className="flex flex-col items-center gap-1 p-2 text-white hover:text-gray-300 hover:bg-white/5 rounded-lg transition-colors"><BsPersonWorkspace size={18} /><span className="text-[10px]">{studioStats[studio.id]?.trainers || 0} Staff</span></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleOpenContractsModal(studio) }} className="flex flex-col items-center gap-1 p-2 text-white hover:text-gray-300 hover:bg-white/5 rounded-lg transition-colors"><RiContractLine size={18} /><span className="text-[10px]">{studioStats[studio.id]?.contracts || 0} Contracts</span></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleOpenLeadsModal(studio) }} className="flex flex-col items-center gap-1 p-2 text-white hover:text-gray-300 hover:bg-white/5 rounded-lg transition-colors"><FaPersonRays size={18} /><span className="text-[10px]">{studioLeads[studio.id]?.length || 0} Leads</span></button>
                                  </div>
                                  <div className="grid grid-cols-5 gap-1">
                                    <button onClick={(e) => { e.stopPropagation(); setSelectedStudioForModal(studio); setisFinancesModalOpen(true) }} className="flex flex-col items-center gap-1 p-2 text-white hover:text-gray-300 hover:bg-white/5 rounded-lg transition-colors"><BadgeDollarSign size={18} /><span className="text-[10px]">Finances</span></button>
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
                /* â•â•â• FRANCHISES VIEW â•â•â• */
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
                              <div className={`h-12 w-12 rounded-lg flex-shrink-0 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center overflow-hidden`}>
                                {franchise.img ? <img src={franchise.img} alt="" className="w-full h-full object-cover" /> : <Building2 size={20} className="text-white" />}
                              </div>
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
                                <div className={`h-11 w-11 rounded-lg flex-shrink-0 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center overflow-hidden`}>
                                  {franchise.img ? <img src={franchise.img} alt="" className="w-full h-full object-cover" /> : <Building2 size={16} className="text-white" />}
                                </div>
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

        {/* â•â•â• MODALS (all preserved) â•â•â• */}
        <StudioMembersModal isOpen={isMembersModalOpen} studio={selectedStudioForModal} studioMembers={studioMembers} memberSearchQuery={memberSearchQuery} setMemberSearchQuery={setMemberSearchQuery} getFilteredMembers={getFilteredMembers} onClose={() => { setIsMembersModalOpen(false); setSelectedStudioForModal(null); setMemberSearchQuery("") }} onViewMember={handleViewMemberDetails} onEditMember={handleEditMember} handleHistoryFromOverview={handleHistoryFromOverview} handleDocumentFromOverview={handleDocumentFromOverview} handleCalendarFromOverview={handleCalendarFromOverview} onCreateTempMember={() => setIsCreateTempMemberModalOpen(true)} handleTrainingPlanFromOverview={handleTrainingPlanFromOverview} />
        <EditMemberModal isOpen={isEditMemberModalOpen} onClose={() => setIsEditMemberModalOpen(false)} selectedMember={selectedMemberForEdit} onSave={handleMemberEditSubmit} memberRelations={memberRelations} availableMembersLeads={availableMembersLeadsMain} onArchiveMember={() => toast.success("Member archived successfully")} onUnarchiveMember={() => toast.success("Member unarchived successfully")} />
        {showTrainingPlansModalMain && selectedMemberForEdit && <TrainingPlansModal isOpen={showTrainingPlansModalMain} onClose={() => { setShowTrainingPlansModalMain(false); setSelectedMemberForEdit(null) }} selectedMemberMain={selectedMemberForEdit} memberTrainingPlansMain={memberTrainingPlansMain[selectedMemberForEdit.id] || []} availableTrainingPlansMain={availableTrainingPlansMain} onAssignPlanMain={handleAssignPlanMain} onRemovePlanMain={handleRemovePlanMain} />}
        <CreateTempMemberModal show={isCreateTempMemberModalOpen} onClose={() => { setIsCreateTempMemberModalOpen(false); setTempMemberForm({ img: "", firstName: "", lastName: "", email: "", phone: "", gender: "", country: "", street: "", zipCode: "", city: "", dateOfBirth: "", about: "", note: "", noteImportance: "unimportant", noteStartDate: "", noteEndDate: "", autoArchivePeriod: 4, relations: { family: [], friendship: [], relationship: [], work: [], other: [] } }); setTempMemberModalTab("details") }} tempMemberForm={tempMemberForm} setTempMemberForm={setTempMemberForm} tempMemberModalTab={tempMemberModalTab} setTempMemberModalTab={setTempMemberModalTab} handleCreateTempMember={handleCreateTempMember} handleTempMemberInputChange={handleTempMemberInputChange} handleImgUpload={handleImgUpload} editingRelationsMain={editingRelationsMain} setEditingRelationsMain={setEditingRelationsMain} newRelationMain={newRelationMain} setNewRelationMain={setNewRelationMain} availableMembersLeadsMain={availableMembersLeadsMain} relationOptionsMain={relationOptionsMain} />
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
