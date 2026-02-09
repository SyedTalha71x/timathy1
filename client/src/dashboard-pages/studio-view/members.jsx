/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react"
import {
  X,
  Search,
  ChevronDown,
  Eye,
  Info,
  AlertTriangle,
  Calendar,
  History,
  MessageCircle,
  UserPlus,
  Clock,
  Users,
  User,
  Filter,
  Grid3X3,
  List,
  File,
  Dumbbell,
  FileText,
  Plus,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  StickyNote,
  Edit,
  Pencil,
  ClipboardList,
} from "lucide-react"
import DefaultAvatar1 from "../../../public/gray-avatar-fotor-20250912192528.png"
import toast, { Toaster } from "react-hot-toast"
import { IoIosMenu } from "react-icons/io"
import { useNavigate, useLocation } from "react-router-dom"

import BirthdayBadge from "../../components/shared/BirthdayBadge"
import HistoryModalMain from "../../components/studio-components/members-components/HistoryModal"
import NotifyMemberModalMain from "../../components/shared/appointments/NotifyMemberModal"
import CreateTempMemberModal from "../../components/shared/members/CreateTempMemberModal"
import useCountries from "../../hooks/useCountries"
import EditMemberModalMain from "../../components/studio-components/members-components/EditMemberModal"
import AddBillingPeriodModalMain from "../../components/shared/appointments/AddBillingPeriodModal"
import ContingentModalMain from "../../components/shared/appointments/ShowContigentModal"
import ViewDetailsModal from "../../components/studio-components/members-components/ViewDetailsModal"
import { MemberSpecialNoteModal } from '../../components/shared/special-note/shared-special-note-modal'
import AppointmentModalMain from "../../components/shared/appointments/ShowAppointmentModal"
import DocumentManagementModal from "../../components/shared/DocumentManagementModal"
import AssessmentFormModal from "../../components/shared/medical-history/medical-history-form-modal"
import AssessmentSelectionModal from "../../components/shared/medical-history/medical-history-selection-modal"
import { staffData, communicationSettingsData, relationOptionsMain, availableMembersLeadsMain } from "../../utils/studio-states"
import CreateAppointmentModal from "../../components/shared/appointments/CreateAppointmentModal"
import EditAppointmentModalMain from "../../components/shared/appointments/EditAppointmentModal"
import { useStudioMembers } from "../../hooks/useStudioMembers"

// sidebar related import
import { trainingVideosData } from "../../utils/studio-states/training-states"
import ChatPopup from "../../components/shared/communication/ChatPopup"
import MessageTypeSelectionModal from "../../components/shared/communication/MessageTypeSelectionModal"
import SendEmailModal from "../../components/shared/communication/SendEmailModal"
import TrainingPlansModalMain from "../../components/shared/training/TrainingPlanModal"
import { MemberSpecialNoteIcon } from '../../components/shared/special-note/shared-special-note-icon'

const StatusTag = ({ status, reason = "", compact = false }) => {
  const getStatusColor = (status, isArchived) => {
    if (isArchived) return 'bg-red-600';
    if (status === 'active') return 'bg-green-600';
    if (status === 'paused') return 'bg-yellow-600';
    return 'bg-gray-600';
  };

  const getStatusText = (status, reason, isArchived) => {
    if (isArchived) return 'Archived';
    if (status === 'active') return 'Active';
    if (status === 'paused') return `Paused${reason ? ` (${reason})` : ''}`;
    return 'Unknown';
  };

  const bgColor = getStatusColor(status, status === 'archived');
  const statusText = getStatusText(status, reason, status === 'archived');

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1 ${bgColor} text-white px-2 py-1 rounded-lg text-xs font-medium`}>
        <span className="truncate max-w-[140px]">{statusText}</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 ${bgColor} text-white px-3 py-1.5 rounded-xl text-xs font-medium`}>
      <span>{statusText}</span>
    </div>
  );
};

// Initials Avatar Component - Orange background with initials
const InitialsAvatar = ({ firstName, lastName, size = "md", className = "" }) => {
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || ""
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || ""
    return `${firstInitial}${lastInitial}` || "?"
  }

  const sizeClasses = {
    sm: "w-9 h-9 text-sm",
    md: "w-11 h-11 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-20 h-20 text-2xl",
  }

  return (
    <div 
      className={`bg-primary rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0 ${sizeClasses[size]} ${className}`}
      style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
    >
      {getInitials()}
    </div>
  )
};
export default function Members({ studioId: studioIdProp = null, mode = "studio", studioName: studioNameProp = null }) {
  const trainingVideos = trainingVideosData
  const navigate = useNavigate()
  const location = useLocation()

const isAdminMode = mode === "admin" && studioIdProp !== null

// ============================================
// Load members data via shared hook
// ============================================
const { data: membersHookData, isLoading: membersLoading, error: membersError } = useStudioMembers({
  studioId: studioIdProp,
  mode,
})

// Helper function for contract redirect
  const redirectToContract = (memberId) => {
    if (isAdminMode) {
      navigate(`/admin-dashboard/customers`)
    } else {
      navigate(`/dashboard/contracts?member=${memberId}`)
    }
  }
  
  // Member filters - array of filtered members (can be multiple)
  const [memberFilters, setMemberFilters] = useState([])
  // [{ memberId: number, memberName: string }, ...]
  
  // Search autocomplete state
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const searchDropdownRef = useRef(null)
  const searchInputRef = useRef(null)
  
  const [isEditModalOpenMain, setIsEditModalOpenMain] = useState(false)
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false)
  const [selectedMemberMain, setSelectedMemberMain] = useState(null)
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  // 
  const [isCompactView, setIsCompactView] = useState(false);
  const [expandedMemberId, setExpandedMemberId] = useState(null);
  const [expandedMobileRowId, setExpandedMobileRowId] = useState(null); // For mobile expandable actions

  const [activeNoteIdMain, setActiveNoteIdMain] = useState(null)
  // 
  const [editModalTabMain, setEditModalTabMain] = useState("details")
  const [isDirectionDropdownOpen, setIsDirectionDropdownOpen] = useState(false)
  const [viewDetailsInitialTab, setViewDetailsInitialTab] = useState("details")

  const [chatPopup, setChatPopup] = useState({
    isOpen: false,
    member: null
  });

  // Message Type Selection Modal State
  const [messageTypeModal, setMessageTypeModal] = useState({
    isOpen: false,
    member: null
  });

  // Email Modal States
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedMemberForEmail, setSelectedMemberForEmail] = useState(null);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState(null);
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    body: "",
    recipientName: ""
  });

  // Email Templates
  const emailTemplates = [
    { id: 1, name: "Welcome", subject: "Welcome to our studio!", body: "Hello,\n\nWelcome to our studio!" },
    { id: 2, name: "Reminder", subject: "Reminder for your appointment", body: "Hello,\n\nWe would like to remind you about your upcoming appointment." },
    { id: 3, name: "Invoice", subject: "Your Invoice", body: "Hello,\n\nPlease find your invoice attached." },
  ];

  // Member Special Note Modal states (like leads)
  const [isMemberSpecialNoteModalOpen, setIsMemberSpecialNoteModalOpen] = useState(false)
  const [selectedMemberForNote, setSelectedMemberForNote] = useState(null)


  const [sortBy, setSortBy] = useState("name"); // 'name', 'status', 'relations', 'age', 'expiring'
  const [sortDirection, setSortDirection] = useState("asc"); // 'asc', 'desc'
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showMobileSortDropdown, setShowMobileSortDropdown] = useState(false);
  const sortDropdownRef = useRef(null);
  const mobileSortDropdownRef = useRef(null);


  const [showCreateTempMemberModal, setShowCreateTempMemberModal] = useState(false)
  const [memberTypeFilter, setMemberTypeFilter] = useState("all")
  const [archivedFilter, setArchivedFilter] = useState("active")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filtersExpanded, setFiltersExpanded] = useState(false) // Default collapsed on mobile


  const [appointmentToDelete, setAppointmentToDelete] = useState(null)


  // 
  const [showAppointmentModalMain, setShowAppointmentModalMain] = useState(false)
  const [selectedMemberForAppointmentsMain, setSelectedMemberForAppointmentsMain] = useState(null)
  const [showCreateAppointmentModalMain, setShowCreateAppointmentModalMain] = useState(false)
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

  // Assessment states (same as leads)
  const [isAssessmentSelectionModalOpen, setIsAssessmentSelectionModalOpen] = useState(false)
  const [isAssessmentFormModalOpen, setIsAssessmentFormModalOpen] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const [assessmentFromDocumentManagement, setAssessmentFromDocumentManagement] = useState(false)
  const [editingAssessmentDocument, setEditingAssessmentDocument] = useState(null)
  const [isEditingAssessment, setIsEditingAssessment] = useState(false)
  const [isViewingAssessment, setIsViewingAssessment] = useState(false)


  const handleDocumentClick = (member) => {
    setSelectedMemberForDocuments(member)
    setShowDocumentModal(true)
  }

  // Handler for document updates from DocumentManagementModal
  const handleDocumentsUpdate = (memberId, documents) => {
    setMembers(prevMembers => 
      prevMembers.map(member => 
        member.id === memberId ? { ...member, documents } : member
      )
    )
  }

  // Assessment handlers (same as leads)
  const handleCreateAssessmentClick = (member, fromDocManagement = false) => {
    setSelectedMemberMain(member)
    setAssessmentFromDocumentManagement(fromDocManagement)
    
    if (fromDocManagement) {
      setShowDocumentModal(false)
    }
    
    setIsAssessmentSelectionModalOpen(true)
  }

  const handleAssessmentSelect = (assessment) => {
    setSelectedAssessment(assessment)
    setIsAssessmentSelectionModalOpen(false)
    setIsAssessmentFormModalOpen(true)
  }

  const handleAssessmentComplete = (documentData) => {
    setMembers(prevMembers => 
      prevMembers.map(member => {
        if (member.id === selectedMemberMain.id) {
          const existingDocuments = member.documents || []
          
          if (documentData.isEdit) {
            return {
              ...member,
              documents: existingDocuments.map(doc => 
                doc.id === documentData.id ? documentData : doc
              ),
              hasAssessment: true
            }
          } else {
            return {
              ...member,
              documents: [...existingDocuments, documentData],
              hasAssessment: true
            }
          }
        }
        return member
      })
    )
    
    setIsAssessmentFormModalOpen(false)
    setSelectedAssessment(null)
    setIsEditingAssessment(false)
    setEditingAssessmentDocument(null)
    setIsViewingAssessment(false)
    
    if (assessmentFromDocumentManagement) {
      if (selectedMemberForDocuments && selectedMemberForDocuments.id === selectedMemberMain.id) {
        const existingDocuments = selectedMemberForDocuments.documents || []
        let updatedDocuments
        if (documentData.isEdit) {
          updatedDocuments = existingDocuments.map(doc => 
            doc.id === documentData.id ? documentData : doc
          )
        } else {
          updatedDocuments = [...existingDocuments, documentData]
        }
        setSelectedMemberForDocuments({
          ...selectedMemberForDocuments,
          documents: updatedDocuments,
          hasAssessment: true
        })
      }
      setShowDocumentModal(true)
      setAssessmentFromDocumentManagement(false)
    }
    
    toast.success("Medical history saved successfully")
  }

  const handleEditAssessmentClick = (member, doc) => {
    setSelectedMemberMain(member)
    setIsEditingAssessment(true)
    setEditingAssessmentDocument(doc)
    setAssessmentFromDocumentManagement(true)
    setSelectedAssessment({ id: doc.templateId, title: doc.name })
    setShowDocumentModal(false)
    setIsAssessmentFormModalOpen(true)
  }

  const handleViewAssessmentClick = (member, doc) => {
    setSelectedMemberMain(member)
    setEditingAssessmentDocument(doc)
    setIsViewingAssessment(true)
    setAssessmentFromDocumentManagement(true)
    setSelectedAssessment({ id: doc.templateId, title: doc.name })
    setShowDocumentModal(false)
    setIsAssessmentFormModalOpen(true)
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
  // memberRelationsMain wird für EditMember Modal verwendet
 const [memberRelationsMain, setMemberRelationsMain] = useState([])

  // Countries hook für CreateTempMemberModal
  const { countries, loading: countriesLoading } = useCountries()

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
  const [members, setMembers] = useState([])


  //  all
const [appointmentsMain, setAppointmentsMain] = useState([])
const [appointmentTypesMain, setAppointmentTypesMain] = useState([])
const [freeAppointmentsMain, setFreeAppointmentsMain] = useState([])
const [memberHistoryMain, setMemberHistoryMain] = useState({})

  const getActiveFiltersText = () => {
    const statusText = filterOptions.find(opt => opt.id === filterStatus)?.label.split(' (')[0] || 'All Members';
    const typeText = memberTypeFilter === 'all' ? 'All Types' :
      memberTypeFilter === 'full' ? 'Full Members' : 'Temporary Members';
    return `${statusText} & ${typeText}`;
  };


useEffect(() => {
  if (membersHookData) {
    setMembers(membersHookData.members)
    setAppointmentsMain(membersHookData.appointments)
    setAppointmentTypesMain(membersHookData.appointmentTypes)
    setFreeAppointmentsMain(membersHookData.freeAppointments)
    setMemberHistoryMain(membersHookData.memberHistory)
    setMemberRelationsMain(membersHookData.memberRelations)
    
    // Admin immer List View
    if (isAdminMode) {
      setViewMode('list')
    }
  }
}, [membersHookData])

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

  // Handle navigation state from Communications "View Member" or Contracts "Go to Member"
  useEffect(() => {
    if (location.state?.filterMemberId) {
      setMemberFilters([{
        memberId: location.state.filterMemberId,
        memberName: location.state.filterMemberName || 'Member'
      }]);
      // Clear the navigation state to prevent re-filtering on refresh
      window.history.replaceState({}, document.title);
    }
    // Handle navigation from Contracts - filter by member name/id
    if (location.state?.fromContract && location.state?.searchQuery) {
      // If memberId is provided, only add to member filters (no searchQuery to avoid duplicate display)
      if (location.state.memberId) {
        setMemberFilters([{
          memberId: location.state.memberId,
          memberName: location.state.searchQuery
        }]);
      } else {
        // Fallback: use searchQuery if no memberId
        setSearchQuery(location.state.searchQuery);
      }
      // Clear the navigation state to prevent re-filtering on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get search suggestions based on query (exclude already filtered members)
  const getSearchSuggestions = () => {
    if (!searchQuery.trim()) return [];
    return members.filter((member) => {
      // Exclude already filtered members
      const isAlreadyFiltered = memberFilters.some(f => f.memberId === member.id);
      if (isAlreadyFiltered) return false;
      
      return member.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchQuery.toLowerCase());
    }).slice(0, 6);
  };

  // Handle selecting a member from search suggestions
  const handleSelectMember = (member) => {
    setMemberFilters([...memberFilters, {
      memberId: member.id,
      memberName: member.title || `${member.firstName} ${member.lastName}`
    }]);
    setSearchQuery("");
    setShowSearchDropdown(false);
    searchInputRef.current?.focus();
  };

  // Handle removing a member filter
  const handleRemoveFilter = (memberId) => {
    setMemberFilters(memberFilters.filter(f => f.memberId !== memberId));
  };

  // Handle keyboard navigation
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Backspace' && !searchQuery && memberFilters.length > 0) {
      // Remove last filter when backspace is pressed with empty input
      setMemberFilters(memberFilters.slice(0, -1));
    } else if (e.key === 'Escape') {
      setShowSearchDropdown(false);
    }
  };

  // 
  const handleInputChangeMain = (e) => {
    const { name, value } = e.target
    setEditFormMain((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handler für erfolgreiche Erstellung eines temporären Members (Shared Modal)
  const handleTempMemberCreated = (newMemberData) => {
    const newId = Math.max(...members.map((m) => m.id), 0) + 1
    const newTempMember = {
      id: newId,
      ...newMemberData,
      image: newMemberData.img || null,
    }
    setMembers((prev) => [...prev, newTempMember])
  }

  // 
  const handleEditSubmitMain = (e, localRelations = null, localNotes = null) => {
    e.preventDefault()
    
    const updatedMembers = members.map((member) => {
      if (member.id === selectedMemberMain.id) {
        // Use passed localNotes if available, otherwise fall back to editFormMain
        const notesToSave = localNotes || editFormMain.notes || []
        
        // Find primary note for backward compatibility
        const importantNote = notesToSave.find(n => n.isImportant)
        const primaryNote = importantNote || notesToSave[0]
        
        return {
          ...member,
          ...editFormMain,
          title: `${editFormMain.firstName} ${editFormMain.lastName}`,
          // Save notes array
          notes: notesToSave,
          // Keep single note fields for backwards compatibility
          note: primaryNote ? primaryNote.text : "",
          noteImportance: primaryNote?.isImportant ? "important" : "unimportant",
          noteStartDate: primaryNote?.startDate || "",
          noteEndDate: primaryNote?.endDate || "",
          noteStatus: primaryNote?.status || "general",
        }
      }
      return member
    })
    
    // Update relations if provided
    if (localRelations && selectedMemberMain?.id) {
      setMemberRelationsMain(prev => ({
        ...prev,
        [selectedMemberMain.id]: localRelations
      }))
    }
    
    setMembers(updatedMembers)
    setIsEditModalOpenMain(false)
    setSelectedMemberMain(null)
    toast.success("Member details have been updated successfully")
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

      // Close sort dropdown if clicking outside (desktop)
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
      
      // Close mobile sort dropdown if clicking outside
      if (mobileSortDropdownRef.current && !mobileSortDropdownRef.current.contains(event.target)) {
        setShowMobileSortDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeNoteIdMain])

  // Close sort dropdowns on scroll
  useEffect(() => {
    if (!showSortDropdown && !showMobileSortDropdown) return;

    const handleScroll = () => {
      setShowSortDropdown(false);
      setShowMobileSortDropdown(false);
    };

    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true, passive: true });
    };
  }, [showSortDropdown, showMobileSortDropdown]);

  // Close expanded mobile row on scroll for better UX
  useEffect(() => {
    if (!expandedMobileRowId) return;

    const handleScroll = () => {
      setExpandedMobileRowId(null);
    };

    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true, passive: true });
    };
  }, [expandedMobileRowId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      // Ignore if Ctrl/Cmd is pressed (for Ctrl+C copy, etc.)
      if (e.ctrlKey || e.metaKey) return;
      
      // Check if ANY modal is open
      const anyModalOpen = 
        showCreateTempMemberModal ||
        isEditModalOpenMain ||
        isViewDetailsModalOpen ||
        showEmailModal ||
        messageTypeModal.isOpen ||
        isMemberSpecialNoteModalOpen ||
        showAppointmentModalMain ||
        showCreateAppointmentModalMain ||
        showSelectedAppointmentModalMain ||
        isNotifyMemberOpenMain ||
        showContingentModalMain ||
        showAddBillingPeriodModalMain ||
        showHistoryModalMain ||
        showDocumentModal ||
        isAssessmentSelectionModalOpen ||
        isAssessmentFormModalOpen;
      
      // Also check if any modal overlay is visible in the DOM
      const hasVisibleModal = document.querySelector('[class*="fixed"][class*="inset-0"][class*="z-50"]') ||
                              document.querySelector('[class*="fixed"][class*="inset-0"][class*="z-40"]');
      
      // ESC key - Close modals (should work even when modals are open)
      if (e.key === 'Escape') {
        e.preventDefault();
        if (isViewDetailsModalOpen) setIsViewDetailsModalOpen(false);
        else if (isEditModalOpenMain) setIsEditModalOpenMain(false);
        else if (showCreateTempMemberModal) setShowCreateTempMemberModal(false);
        else if (showEmailModal) setShowEmailModal(false);
        else if (messageTypeModal.isOpen) setMessageTypeModal({ isOpen: false, member: null });
        else if (isMemberSpecialNoteModalOpen) setIsMemberSpecialNoteModalOpen(false);
        else if (showAppointmentModalMain) setShowAppointmentModalMain(false);
        else if (showCreateAppointmentModalMain) setShowCreateAppointmentModalMain(false);
        else if (showSelectedAppointmentModalMain) setShowSelectedAppointmentModalMain(false);
        else if (showContingentModalMain) setShowContingentModalMain(false);
        else if (showAddBillingPeriodModalMain) setShowAddBillingPeriodModalMain(false);
        else if (showHistoryModalMain) setShowHistoryModalMain(false);
        else if (showDocumentModal) setShowDocumentModal(false);
        else if (isAssessmentFormModalOpen) setIsAssessmentFormModalOpen(false);
        else if (isAssessmentSelectionModalOpen) setIsAssessmentSelectionModalOpen(false);
        return;
      }
      
      if (anyModalOpen || hasVisibleModal) return;
      
      // C key - Create Temporary Member
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setShowCreateTempMemberModal(true);
      }
      
      // V key - Toggle view mode
      if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [
    showCreateTempMemberModal,
    isEditModalOpenMain,
    isViewDetailsModalOpen,
    showEmailModal,
    messageTypeModal.isOpen,
    isMemberSpecialNoteModalOpen,
    showAppointmentModalMain,
    showCreateAppointmentModalMain,
    showSelectedAppointmentModalMain,
    isNotifyMemberOpenMain,
    showContingentModalMain,
    showAddBillingPeriodModalMain,
    showHistoryModalMain,
    showDocumentModal,
    isAssessmentSelectionModalOpen,
    isAssessmentFormModalOpen
  ]);

  // Expand filters on desktop, keep collapsed on mobile
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768; // md breakpoint
      setFiltersExpanded(isDesktop);
    };
    
    // Run on mount
    handleResize();
    
    // Listen for resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sort options
  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'status', label: 'Status' },
    { value: 'relations', label: 'Relations' },
    { value: 'age', label: 'Age' },
  ];

  // Handle sort option click - doesn't close dropdown so user can change direction
  const handleSortOptionClick = (newSortBy) => {
    if (sortBy === newSortBy) {
      // If same option clicked, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('asc'); // Default to ascending for new sort
    }
    // Don't close dropdown - user may want to change direction
  };

  // Handle mobile sort option click - closes dropdown after selection
  const handleMobileSortOptionClick = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('asc');
    }
    setShowMobileSortDropdown(false);
  };

  // Get current sort label
  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Name';

  // Get sort icon based on current state
  const getSortIcon = () => {
    return sortDirection === 'asc' 
      ? <ArrowUp size={14} className="text-content-primary" />
      : <ArrowDown size={14} className="text-content-primary" />;
  };


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
    // If memberFilters are active, show only those members
    if (memberFilters.length > 0) {
      const filterIds = memberFilters.map(f => f.memberId);
      const filteredMembers = members.filter((member) => filterIds.includes(member.id));
      return filteredMembers;
    }
    
    // No live filtering while typing - list only changes when chips are selected
    let filtered = [...members]

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

    // Sort members
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
          case 'name':
  comparison = (a.title || '').localeCompare(b.title || '');
  break;
          case 'status':
            const getStatusPriority = (member) => {
              if (member.isArchived) return 3
              if (!member.isActive) return 2
              return 1
            }
            comparison = getStatusPriority(a) - getStatusPriority(b);
            break;
          case 'relations':
            comparison = getRelationsCount(a.id) - getRelationsCount(b.id);
            break;
          case 'age':
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
            comparison = getAge(a.dateOfBirth) - getAge(b.dateOfBirth);
            break;
          default:
            comparison = 0;
        }
        
        // Apply sort direction
        return sortDirection === 'asc' ? comparison : -comparison;
      });

    return filtered
  }


  const handleEditMember = (member, tab = "details") => {
    setSelectedMemberMain(member)
    setEditModalTabMain(tab)
    setIsEditModalOpenMain(true)
  }

  const handleViewDetails = (member, tab = "details") => {
    setSelectedMemberMain(member)
    setViewDetailsInitialTab(tab)
    setIsViewDetailsModalOpen(true)
  }

  // Handle opening special note modal for a member
  const handleEditMemberNote = (member) => {
    setSelectedMemberForNote(member)
    setIsMemberSpecialNoteModalOpen(true)
  }

  // Handle saving a new special note for a member
  const handleSaveMemberSpecialNote = (memberId, newNote) => {
    const updatedMembers = members.map((member) => {
      if (member.id === memberId) {
        // Add new note to existing notes array
        const existingNotes = member.notes || []
        const updatedNotes = [newNote, ...existingNotes]
        
        // Find the first important note or first note for backwards compatibility
        const importantNote = updatedNotes.find(n => n.isImportant)
        const primaryNote = importantNote || updatedNotes[0]
        
        return {
          ...member,
          notes: updatedNotes,
          // Keep single note fields for backwards compatibility
          note: primaryNote ? primaryNote.text : "",
          noteImportance: primaryNote?.isImportant ? "important" : "unimportant",
          noteStartDate: primaryNote?.startDate || "",
          noteEndDate: primaryNote?.endDate || "",
        }
      }
      return member
    })
    setMembers(updatedMembers)
    setIsMemberSpecialNoteModalOpen(false)
    setSelectedMemberForNote(null)
    toast.success("Special note added successfully")
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
    setShowCreateAppointmentModalMain(true)
    setShowAppointmentModalMain(false)
  }

  const handleAddAppointmentSubmit = (data) => {
    const newAppointment = {
      id: Math.max(0, ...appointmentsMain.map((a) => a.id)) + 1,
      ...data,
      memberId: selectedMemberForAppointmentsMain?.id,
    }
    setAppointmentsMain([...appointmentsMain, newAppointment])
    setShowCreateAppointmentModalMain(false)
  }

  // 
  const handleDeleteAppointmentMain = (id) => {
    setAppointmentToDelete(id)
  }

  // Direct delete function for EditAppointmentModal (no confirmation needed - already confirmed in modal)
  const handleDeleteAppointmentDirect = (id) => {
    setAppointmentsMain(appointmentsMain.filter((app) => app.id !== id))
    setSelectedAppointmentDataMain(null)
    setShowSelectedAppointmentModalMain(false)
    setIsNotifyMemberOpenMain(true)
    setNotifyActionMain("delete")
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
    setMessageTypeModal({
      isOpen: true,
      member: member
    });
  };

  // App Chat öffnen (vom Message Type Modal)
  const handleOpenAppChat = () => {
    if (messageTypeModal.member) {
      setChatPopup({
        isOpen: true,
        member: messageTypeModal.member
      });
    }
  };

  // Email Modal öffnen (vom Message Type Modal)
  const handleOpenEmailModal = () => {
    if (messageTypeModal.member) {
      setSelectedMemberForEmail(messageTypeModal.member);
      setEmailData({
        to: messageTypeModal.member.email || "",
        subject: "",
        body: "",
        recipientName: `${messageTypeModal.member.firstName} ${messageTypeModal.member.lastName}`
      });
      setShowEmailModal(true);
    }
  };

  // Email Modal schließen
  const handleCloseEmailModal = () => {
    setShowEmailModal(false);
    setSelectedMemberForEmail(null);
    setEmailData({ to: "", subject: "", body: "", recipientName: "" });
    setSelectedEmailTemplate(null);
    setShowTemplateDropdown(false);
    setShowRecipientDropdown(false);
  };

  // Send email
  const handleSendEmail = () => {
    console.log("Sending email:", emailData);
    toast.success("Email sent successfully!");
    handleCloseEmailModal();
  };

  // Save email as draft
  const handleSaveEmailAsDraft = (draftData) => {
    console.log("Saving draft:", draftData);
    toast.success("Draft saved!");
  };

  // Template auswählen
  const handleTemplateSelect = (template) => {
    setSelectedEmailTemplate(template);
    setEmailData({
      ...emailData,
      subject: template.subject,
      body: template.body || ""
    });
    setShowTemplateDropdown(false);
  };

  // Mitglied oder Staff für Email suchen
  const handleSearchMemberForEmail = (query) => {
    if (!query) return [];
    const q = query.toLowerCase();
    
    // Search in members
    const memberResults = members.filter(m => 
      m.firstName?.toLowerCase().includes(q) ||
      m.lastName?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(q)
    ).map(m => ({
      id: `member-${m.id}`,
      email: m.email,
      name: `${m.firstName || ''} ${m.lastName || ''}`.trim(),
      firstName: m.firstName,
      lastName: m.lastName,
      image: m.image || m.avatar,
      type: 'member'
    }));
    
    // Search in staff (staffData uses 'img' not 'image')
    const staffResults = staffData.filter(s => 
      s.firstName?.toLowerCase().includes(q) ||
      s.lastName?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(q)
    ).map(s => ({
      id: `staff-${s.id}`,
      email: s.email,
      name: `${s.firstName || ''} ${s.lastName || ''}`.trim(),
      firstName: s.firstName,
      lastName: s.lastName,
      image: s.img, // staffData uses 'img' field
      type: 'staff'
    }));
    
    return [...memberResults, ...staffResults].slice(0, 10);
  };

  // Select email recipient
  const handleSelectEmailRecipient = (member) => {
    setEmailData({
      ...emailData,
      to: member.email,
      recipientName: `${member.firstName} ${member.lastName}`
    });
    setShowRecipientDropdown(false);
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

const AdminBanner = () => {
  if (!isAdminMode) return null
  return (
    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-3 mb-4 flex items-center gap-3">
      <div className="bg-blue-500/20 p-2 rounded-lg">
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-blue-300">Admin Mode — {studioNameProp || `Studio #${studioIdProp}`}</p>
        <p className="text-xs text-content-muted">Viewing members for this studio. Changes are saved per-studio.</p>
      </div>
    </div>
  )
}

  const getMemberAppointmentsMain = (memberId) => {
    return appointmentsMain.filter((app) => app.memberId === memberId)
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
      <div className="flex flex-col lg:flex-row rounded-3xl bg-surface-base transition-all duration-500 text-content-primary relative">
        <div className="flex-1 min-w-0 md:p-6 p-4 pb-36">
          <AdminBanner />

          {/* Loading State */}
          {membersLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          )}

          {/* Error State */}
          {membersError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
              <p className="text-red-400 text-sm">Failed to load members: {membersError}</p>
            </div>
          )}

          {/* Main Content - nur wenn geladen */}
          {!membersLoading && !membersError && (
            <>
              {/* Header */}
              <div className="flex sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-content-primary oxanium_font text-xl md:text-2xl">Members</h1>
              
              {/* Sort Button - Mobile: next to title */}
              <div className="lg:hidden relative" ref={mobileSortDropdownRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMobileSortDropdown(!showMobileSortDropdown);
                  }}
                  className="px-3 py-2 bg-surface-button text-content-secondary rounded-xl text-xs hover:bg-surface-button-hover transition-colors flex items-center gap-2"
                >
                  {getSortIcon()}
                  <span>{currentSortLabel}</span>
                </button>

                {/* Sort Dropdown - Mobile */}
                {showMobileSortDropdown && (
                  <div className="absolute left-0 mt-1 bg-surface-hover border border-border-subtle rounded-lg shadow-lg z-50 min-w-[180px]">
                    <div className="py-1">
                      <div className="px-3 py-1.5 text-xs text-content-faint font-medium border-b border-border-subtle">
                        Sort by
                      </div>
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMobileSortOptionClick(option.value);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-hover transition-colors flex items-center justify-between ${
                            sortBy === option.value 
                              ? 'text-content-primary bg-surface-hover' 
                              : 'text-content-secondary'
                          }`}
                        >
                          <span>{option.label}</span>
                          {sortBy === option.value && (
                            <span className="text-content-muted">
                              {sortDirection === 'asc' 
                                ? <ArrowUp size={14} /> 
                                : <ArrowDown size={14} />
                              }
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
            {/* View Toggle - Desktop only */}
{!isAdminMode && (
<div className="hidden lg:flex items-center gap-2 bg-surface-dark rounded-xl p-1">
                <div className="relative group">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-primary text-white'
                        : 'text-secondary hover:text-secondary-hover'
                    }`}
                  >
                    <Grid3X3 size={16} />
                  </button>
                  
                  {/* Tooltip */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-surface-dark/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                    <span className="font-medium">Grid View</span>
                    <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">
                      V
                    </span>
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
                  </div>
                </div>
                
                <div className="relative group">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-primary text-white'
                        : 'text-secondary hover:text-secondary-hover'
                    }`}
                  >
                    <List size={16} />
                  </button>
                  
                  {/* Tooltip */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-surface-dark/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                    <span className="font-medium">List View</span>
                    <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">
                      V
                    </span>
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
                  </div>
                </div>

                {/* Compact/Detailed Toggle */}
                <div className="h-6 w-px bg-border-subtle mx-1"></div>
                <div className="relative group">
                  <button
                    onClick={() => setIsCompactView(!isCompactView)}
                    className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${isCompactView ? "text-primary" : "text-primary"}`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="flex gap-0.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${!isCompactView ? 'bg-current' : 'bg-gray-500'}`}></div>
                        <div className={`w-1.5 h-1.5 rounded-full ${!isCompactView ? 'bg-current' : 'bg-gray-500'}`}></div>
                      </div>
                      <div className="flex gap-0.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${isCompactView ? 'bg-current' : 'bg-gray-500'}`}></div>
                        <div className={`w-1.5 h-1.5 rounded-full ${isCompactView ? 'bg-current' : 'bg-gray-500'}`}></div>
                      </div>
                    </div>
                    
                  </button>
                  
                  {/* Tooltip */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-surface-dark/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                    <span className="font-medium">{isCompactView ? "Compact View" : "Detailed View"}</span>
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
                  </div>
                </div>
            </div>
            )}
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden lg:block relative group">
                <button
                  onClick={() => setShowCreateTempMemberModal(true)}
                  className="flex bg-primary hover:bg-primary-hover text-xs sm:text-sm text-white px-3 sm:px-4 py-2 rounded-xl items-center gap-2 justify-center transition-colors"
                >
                  <Plus size={14} className="sm:w-4 sm:h-4" />
                  <span className='hidden sm:inline'>Create Temporary Member</span>
                </button>
                
                {/* Tooltip - YouTube Style */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-surface-dark/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                  <span className="font-medium">Create Temporary Member</span>
                  <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">
                    C
                  </span>
                  {/* Arrow pointing up */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar with Inline Filter Chips */}
          <div className="mb-4" ref={searchDropdownRef}>
            <div className="relative">
              <div 
                className="bg-surface-card rounded-xl px-3 py-2 min-h-[42px] flex flex-wrap items-center gap-1.5 border border-border focus-within:border-primary transition-colors cursor-text"
                onClick={() => searchInputRef.current?.focus()}
              >
                <Search className="text-content-muted flex-shrink-0" size={16} />
                
                {/* Filter Chips */}
                {memberFilters.map((filter) => (
                  <div 
                    key={filter.memberId}
                    className="flex items-center gap-1.5 bg-primary/20 border border-primary/40 rounded-lg px-2 py-1 text-sm"
                  >
                    <div className="w-5 h-5 rounded bg-primary flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                      {filter.memberName.split(' ')[0]?.charAt(0)}{filter.memberName.split(' ')[1]?.charAt(0) || ''}
                    </div>
                    <span className="text-content-primary text-xs whitespace-nowrap">{filter.memberName}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFilter(filter.memberId);
                      }}
                      className="p-0.5 hover:bg-primary/30 rounded transition-colors"
                    >
                      <X size={12} className="text-secondary hover:text-secondary-hover" />
                    </button>
                  </div>
                ))}
                
                {/* Search Input */}
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={memberFilters.length > 0 ? "Add more..." : "Search members..."}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onFocus={() => searchQuery && setShowSearchDropdown(true)}
                  onKeyDown={handleSearchKeyDown}
                  className="flex-1 min-w-[100px] bg-transparent outline-none text-sm text-content-primary placeholder-content-faint"
                />
                
                {/* Clear All Button */}
                {memberFilters.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMemberFilters([]);
                    }}
                    className="p-1 hover:bg-surface-button rounded-lg transition-colors flex-shrink-0"
                    title="Clear all filters"
                  >
                    <X size={14} className="text-secondary hover:text-secondary-hover" />
                  </button>
                )}
              </div>
              
              {/* Autocomplete Dropdown */}
              {showSearchDropdown && searchQuery.trim() && getSearchSuggestions().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-surface-hover border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                  {getSearchSuggestions().map((member) => (
                    <button
                      key={member.id}
                      onClick={() => handleSelectMember(member)}
                      className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-surface-hover transition-colors text-left"
                    >
                      {member.image ? (
                        <img 
                          src={member.image} 
                          alt={member.title} 
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-semibold">
                          {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-content-primary truncate">{member.title}</p>
                        <p className="text-xs text-content-faint truncate">{member.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {/* No results message */}
              {showSearchDropdown && searchQuery.trim() && getSearchSuggestions().length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-surface-hover border border-border rounded-xl shadow-lg z-50 p-3">
                  <p className="text-sm text-content-faint text-center">No members found</p>
                </div>
              )}
            </div>
          </div>

          {/* Filters Section - Collapsible */}
          <div className="mb-4 sm:mb-6">
            {/* Filters Header Row - Always visible */}
            <div className="flex items-center justify-between mb-2">
              {/* Filters Toggle - Clickable to expand/collapse */}
              <button
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                className="flex items-center gap-2 text-secondary hover:text-secondary-hover transition-colors"
              >
                <Filter size={14} />
                <span className="text-xs sm:text-sm font-medium">Filters</span>
                <ChevronDown 
                  size={14} 
                  className={`transition-transform duration-200 ${filtersExpanded ? 'rotate-180' : ''}`} 
                />
                {/* Show active filter count when collapsed */}
                {!filtersExpanded && (filterStatus !== 'all' || memberTypeFilter !== 'all') && (
                  <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {(filterStatus !== 'all' ? 1 : 0) + (memberTypeFilter !== 'all' ? 1 : 0)}
                  </span>
                )}
              </button>

              {/* Sort Controls - Desktop only, always visible */}
              <div className="hidden lg:block relative" ref={sortDropdownRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSortDropdown(!showSortDropdown);
                  }}
                  className="px-3 sm:px-4 py-1.5 bg-surface-button text-content-secondary rounded-xl text-xs sm:text-sm hover:bg-surface-button-hover transition-colors flex items-center gap-2"
                >
                  {getSortIcon()}
                  <span>{currentSortLabel}</span>
                </button>

                {/* Sort Dropdown - Desktop */}
                {showSortDropdown && (
                  <div className="absolute top-full right-0 mt-1 bg-surface-hover border border-border-subtle rounded-lg shadow-lg z-50 min-w-[180px]">
                    <div className="py-1">
                      <div className="px-3 py-1.5 text-xs text-content-faint font-medium border-b border-border-subtle">
                        Sort by
                      </div>
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSortOptionClick(option.value);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-hover transition-colors flex items-center justify-between ${
                            sortBy === option.value 
                              ? 'text-content-primary bg-surface-hover' 
                              : 'text-content-secondary'
                          }`}
                        >
                          <span>{option.label}</span>
                          {sortBy === option.value && (
                            <span className="text-content-muted">
                              {sortDirection === 'asc' 
                                ? <ArrowUp size={14} /> 
                                : <ArrowDown size={14} />
                              }
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Filter Pills - Collapsible */}
            <div className={`overflow-hidden transition-all duration-300 ${filtersExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="flex flex-wrap gap-1.5 sm:gap-3">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${
                    filterStatus === 'all'
                      ? "bg-primary text-white"
                      : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"
                  }`}
                >
                  All ({members.length})
                </button>
                <button
                  onClick={() => setFilterStatus('active')}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${
                    filterStatus === 'active'
                      ? "bg-primary text-white"
                      : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"
                  }`}
                >
                  Active ({members.filter((m) => m.isActive && !m.isArchived).length})
                </button>
                <button
                  onClick={() => setFilterStatus('paused')}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${
                    filterStatus === 'paused'
                      ? "bg-primary text-white"
                      : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"
                  }`}
                >
                  Paused ({members.filter((m) => !m.isActive && !m.isArchived).length})
                </button>
                <button
                  onClick={() => setFilterStatus('archived')}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${
                    filterStatus === 'archived'
                      ? "bg-primary text-white"
                      : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"
                  }`}
                >
                  Archived ({members.filter((m) => m.isArchived).length})
                </button>

                {/* Member Type Pills */}
                <div className="h-6 w-px bg-border-subtle mx-1 hidden sm:block self-center"></div>
                <button
                  onClick={() => setMemberTypeFilter('all')}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${
                    memberTypeFilter === 'all'
                      ? "bg-primary text-white"
                      : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"
                  }`}
                >
                  All Types
                </button>
                <button
                  onClick={() => setMemberTypeFilter('full')}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${
                    memberTypeFilter === 'full'
                      ? "bg-primary text-white"
                      : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"
                  }`}
                >
                  Full Members
                </button>
                <button
                  onClick={() => setMemberTypeFilter('temporary')}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${
                    memberTypeFilter === 'temporary'
                      ? "bg-primary text-white"
                      : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"
                  }`}
                >
                  Temporary Members
                </button>
              </div>
            </div>
          </div>

          <div className="open_sans_font">
            {viewMode === "list" ? (
              // LIST VIEW - Table structure for both compact and detailed
              <div className="bg-surface-card rounded-xl overflow-hidden">
                {/* Table Header - Desktop only */}
                <div className={`hidden lg:grid lg:grid-cols-12 gap-3 px-4 bg-surface-dark border-b border-border-subtle text-xs text-content-faint font-medium ${isCompactView ? 'py-2' : 'py-3'}`}>
                  <div className="col-span-3">Member</div>
                  <div className="col-span-1">Gender</div>
                  <div className="col-span-1">Age</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1">Type</div>
                  <div className="col-span-1">Relations</div>
                  <div className="col-span-3 text-right">Actions</div>
                </div>
                
                {filteredAndSortedMembers().length > 0 ? (
                  filteredAndSortedMembers().map((member, index) => (
                    <div 
                      key={member.id}
                      className={`group hover:bg-surface-hover transition-colors ${
                        index !== filteredAndSortedMembers().length - 1 ? 'border-b border-border-subtle' : ''
                      }`}
                    >
                      {/* Desktop Table Row */}
                      <div className={`hidden lg:grid lg:grid-cols-12 gap-3 px-4 items-center ${isCompactView ? 'py-2.5' : 'py-4'}`}>
                        {/* Member Info */}
                        <div className="col-span-3 flex items-center gap-3 min-w-0">
                          <MemberSpecialNoteIcon
                            member={member}
                            onEditMember={handleEditMember}
                            size={isCompactView ? "sm" : "md"}
                            position="relative"
                          />
                          <div className="relative flex-shrink-0">
                            {member.image ? (
                              <img
                                src={member.image}
                                alt={member.title}
                                className={`${isCompactView ? 'w-9 h-9' : 'w-12 h-12'} rounded-lg object-cover`}
                              />
                            ) : (
                              <InitialsAvatar 
                                firstName={member.firstName} 
                                lastName={member.lastName} 
                                size={isCompactView ? "sm" : "lg"}
                              />
                            )}
                            <BirthdayBadge 
                              show={isBirthday(member.dateOfBirth)} 
                              dateOfBirth={member.dateOfBirth}
                              size={isCompactView ? "sm" : "md"}
                              withTooltip={true}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-content-primary font-medium ${isCompactView ? 'text-sm' : 'text-base'} truncate`}>
                                {member.title}
                              </span>
                            </div>
                            {member.memberType !== "full" && member.autoArchiveDate ? (
                              <span className={`${isCompactView ? 'text-xs' : 'text-sm'} text-content-faint`}>
                                Auto-archive: {member.autoArchiveDate}
                              </span>
                            ) : null}
                          </div>
                        </div>
                        
                        {/* Gender */}
                        <div className="col-span-1">
                          <span className={`${isCompactView ? 'text-xs' : 'text-sm'} text-content-muted`}>
                            {member.gender || '-'}
                          </span>
                        </div>
                        
                        {/* Age */}
                        <div className="col-span-1">
                          {member.dateOfBirth ? (
                            <div className="flex flex-col">
                              <span className={`${isCompactView ? 'text-xs' : 'text-sm'} text-content-primary`}>
                                {calculateAgeMain(member.dateOfBirth)} yrs
                              </span>
                              <span className="text-[10px] text-content-faint">
                                {new Date(member.dateOfBirth).toLocaleDateString('de-DE')}
                              </span>
                            </div>
                          ) : (
                            <span className="text-content-faint text-xs">-</span>
                          )}
                        </div>
                        
                        {/* Status */}
                        <div className="col-span-2">
                          <StatusTag
                            status={member.isArchived ? 'archived' : member.isActive ? 'active' : 'paused'}
                            reason={member.reason}
                            compact={isCompactView}
                          />
                        </div>
                        
                        {/* Type */}
                        <div className="col-span-1">
                          <span className={`${isCompactView ? 'text-xs' : 'text-sm'} text-content-muted`}>
                            {member.memberType === "full" ? "Full" : "Temp"}
                          </span>
                        </div>
                        
                        {/* Relations */}
                        <div className="col-span-1">
                          <button
                            onClick={() => handleRelationClick(member)}
                            className={`${isCompactView ? 'text-xs' : 'text-sm'} text-secondary hover:text-secondary-hover inline-flex items-center gap-1`}
                          >
                            <Users size={isCompactView ? 12 : 14} />
                            {Object.values(memberRelationsMain[member.id] || {}).flat().length}
                          </button>
                        </div>
                        
                        {/* Actions */}
                        <div className="col-span-3 flex items-center justify-end gap-0.5">
                          <button
                            onClick={() => handleCalendarClick(member)}
                            className={`${isCompactView ? 'p-1.5' : 'p-2'} text-content-faint hover:text-content-primary hover:bg-white/5 rounded-lg transition-colors`}
                            title="Appointments"
                          >
                            <Calendar size={isCompactView ? 16 : 18} />
                          </button>
                          <button
                            onClick={() => handleTrainingPlansClickMain(member)}
                            className={`${isCompactView ? 'p-1.5' : 'p-2'} text-content-faint hover:text-content-primary hover:bg-white/5 rounded-lg transition-colors`}
                            title="Training Plans"
                          >
                            <Dumbbell size={isCompactView ? 16 : 18} />
                          </button>
                          <button
                            onClick={() => handleHistoryClick(member)}
                            className={`${isCompactView ? 'p-1.5' : 'p-2'} text-content-faint hover:text-content-primary hover:bg-white/5 rounded-lg transition-colors`}
                            title="History"
                          >
                            <History size={isCompactView ? 16 : 18} />
                          </button>
                          <button
                            onClick={() => handleDocumentClick(member)}
                            className={`${isCompactView ? 'p-1.5' : 'p-2'} text-content-faint hover:text-content-primary hover:bg-white/5 rounded-lg transition-colors`}
                            title="Documents"
                          >
                            <FileText size={isCompactView ? 16 : 18} />
                          </button>
                         {!isAdminMode && (
  <button
    onClick={() => handleChatClick(member)}
    className={`${isCompactView ? 'p-1.5' : 'p-2'} text-content-faint hover:text-content-primary hover:bg-white/5 rounded-lg transition-colors`}
    title="Chat"
  >
    <MessageCircle size={isCompactView ? 16 : 18} />
  </button>
)}
                          <div className={`w-px ${isCompactView ? 'h-4' : 'h-5'} bg-border-subtle/50 mx-1`} />
                          <button
                            onClick={() => handleViewDetails(member)}
                            className={`${isCompactView ? 'p-1.5' : 'p-2'} text-secondary hover:text-secondary-hover hover:bg-white/5 rounded-lg transition-colors`}
                            title="View Details"
                          >
                            <Eye size={isCompactView ? 16 : 18} />
                          </button>
                          <button
                            onClick={() => handleEditMember(member)}
                            className={`${isCompactView ? 'p-1.5' : 'p-2'} text-primary hover:text-primary-hover hover:bg-white/5 rounded-lg transition-colors`}
                            title="Edit"
                          >
                            <Pencil size={isCompactView ? 16 : 18} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Mobile Row */}
                      <div className="lg:hidden">
                        {/* Main Row - Tappable */}
                        <div 
                          className={`px-3 ${isCompactView ? 'py-2.5' : 'py-3'} cursor-pointer active:bg-surface-hover transition-colors`}
                          onClick={() => setExpandedMobileRowId(expandedMobileRowId === member.id ? null : member.id)}
                        >
                          <div className="flex items-center gap-3">
                            <MemberSpecialNoteIcon
                              member={member}
                              onEditMember={handleEditMember}
                              size="sm"
                              position="relative"
                            />
                            <div className="relative flex-shrink-0">
                              {member.image ? (
                                <img
                                  src={member.image}
                                  alt={member.title}
                                  className={`${isCompactView ? 'w-9 h-9' : 'w-11 h-11'} rounded-lg object-cover`}
                                />
                              ) : (
                                <InitialsAvatar 
                                  firstName={member.firstName} 
                                  lastName={member.lastName} 
                                  size={isCompactView ? "sm" : "md"}
                                />
                              )}
                              <BirthdayBadge 
                                show={isBirthday(member.dateOfBirth)} 
                                dateOfBirth={member.dateOfBirth}
                                size="sm"
                                withTooltip={true}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-content-primary font-medium ${isCompactView ? 'text-sm' : 'text-base'} truncate`}>
                                  {member.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                <StatusTag
                                  status={member.isArchived ? 'archived' : member.isActive ? 'active' : 'paused'}
                                  reason={member.reason}
                                  compact={true}
                                />
                              </div>
                            </div>
                            
                            {/* Expand/Collapse Indicator */}
                            <div className="flex-shrink-0 p-1">
                              <ChevronDown 
                                size={18} 
                                className={`text-content-faint transition-transform duration-200 ${expandedMobileRowId === member.id ? 'rotate-180' : ''}`} 
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Expandable Actions Panel */}
                        <div 
                          className={`overflow-hidden transition-all duration-200 ease-in-out ${
                            expandedMobileRowId === member.id ? 'max-h-56 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className="px-3 pb-3 pt-1">
                            <div className="bg-surface-dark rounded-xl p-2">
                              {/* Member Info Badges */}
                              <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                  member.memberType === "full" 
                                    ? "bg-white/10 text-content-secondary" 
                                    : "bg-primary/20 text-primary"
                                }`}>
                                  {member.memberType === "full" ? "Full Member" : "Temporary Member"}
                                </span>
                                {member.gender && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-button/50 text-content-secondary">
                                    {member.gender}
                                  </span>
                                )}
                                {member.dateOfBirth && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-button/50 text-content-secondary">
                                    {calculateAgeMain(member.dateOfBirth)} yrs • {new Date(member.dateOfBirth).toLocaleDateString('de-DE')}
                                  </span>
                                )}
                              </div>
                              <div className="grid grid-cols-4 gap-1">
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleCalendarClick(member); }}
                                  className="flex flex-col items-center gap-1 p-2 text-secondary hover:text-secondary-hover hover:bg-white/5 rounded-lg transition-colors"
                                >
                                  <Calendar size={18} />
                                  <span className="text-[10px]">Calendar</span>
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleTrainingPlansClickMain(member); }}
                                  className="flex flex-col items-center gap-1 p-2 text-secondary hover:text-secondary-hover hover:bg-white/5 rounded-lg transition-colors"
                                >
                                  <Dumbbell size={18} />
                                  <span className="text-[10px]">Training</span>
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleHistoryClick(member); }}
                                  className="flex flex-col items-center gap-1 p-2 text-secondary hover:text-secondary-hover hover:bg-white/5 rounded-lg transition-colors"
                                >
                                  <History size={18} />
                                  <span className="text-[10px]">History</span>
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleDocumentClick(member); }}
                                  className="flex flex-col items-center gap-1 p-2 text-secondary hover:text-secondary-hover hover:bg-white/5 rounded-lg transition-colors"
                                >
                                  <FileText size={18} />
                                  <span className="text-[10px]">Docs</span>
                                </button>
                              </div>
                              <div className="grid grid-cols-4 gap-1 mt-1">
                                {!isAdminMode && (
  <button
    onClick={(e) => { e.stopPropagation(); handleChatClick(member); }}
    className="flex flex-col items-center gap-1 p-2 text-secondary hover:text-secondary-hover hover:bg-white/5 rounded-lg transition-colors"
  >
    <MessageCircle size={18} />
    <span className="text-[10px]">Chat</span>
  </button>
)}
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleRelationClick(member); }}
                                  className="flex flex-col items-center gap-1 p-2 text-secondary hover:text-secondary-hover hover:bg-white/5 rounded-lg transition-colors"
                                >
                                  <Users size={18} />
                                  <span className="text-[10px]">Relations</span>
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleViewDetails(member); }}
                                  className="flex flex-col items-center gap-1 p-2 text-secondary hover:text-secondary-hover hover:bg-white/5 rounded-lg transition-colors"
                                >
                                  <Eye size={18} />
                                  <span className="text-[10px]">Details</span>
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleEditMember(member); }}
                                  className="flex flex-col items-center gap-1 p-2 text-primary hover:text-primary-hover hover:bg-white/5 rounded-lg transition-colors"
                                >
                                  <Pencil size={18} />
                                  <span className="text-[10px]">Edit</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-content-muted text-sm">
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
            ) : // GRID VIEW
              isCompactView ? (
                // COMPACT GRID VIEW - With visible controls
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                  {filteredAndSortedMembers().length > 0 ? (
                    filteredAndSortedMembers().map((member) => (
                      <div 
                        key={member.id}
                        className="bg-surface-card rounded-xl hover:bg-surface-hover transition-colors group relative overflow-hidden"
                      >
                        {/* Note indicator */}
                        <div className="absolute top-2 left-2 z-10">
                          <MemberSpecialNoteIcon
                            member={member}
                            onEditMember={handleEditMember}
                            size="sm"
                            position="relative"
                          />
                        </div>

                        {/* Status indicator dot */}
                        <div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${
                          member.isArchived ? 'bg-red-500' : member.isActive ? 'bg-green-500' : 'bg-yellow-500'
                        }`} title={member.isArchived ? 'Archived' : member.isActive ? 'Active' : 'Paused'} />

                        <div className="p-3 pt-4">
                          {/* Avatar & Name */}
                          <div className="flex flex-col items-center mb-2">
                            {member.image ? (
                              <img
                                src={member.image}
                                alt={member.title}
                                className="w-12 h-12 rounded-xl object-cover mb-2"
                              />
                            ) : (
                              <InitialsAvatar 
                                firstName={getFirstAndLastName(member.title).firstName} 
                                lastName={getFirstAndLastName(member.title).lastName} 
                                size="lg"
                                className="mb-2 rounded-xl"
                              />
                            )}
                            <div className="text-center w-full min-w-0">
                              <p className="text-content-primary font-medium text-sm leading-tight truncate">
                                {getFirstAndLastName(member.title).firstName}
                              </p>
                              <p className="text-content-faint text-xs truncate">
                                {getFirstAndLastName(member.title).lastName}
                              </p>
                            </div>
                          </div>

                          {/* Age & Birthday */}
                          {/* Age & Birthday */}
                          {member.dateOfBirth && (
                            <div className="flex items-center justify-center gap-1.5 mb-2 text-[10px]">
                              <span className="text-content-muted">
                                {calculateAgeMain(member.dateOfBirth)} yrs
                              </span>
                              <span className="text-content-faint">•</span>
                              <span className="text-content-faint">
                                {new Date(member.dateOfBirth).toLocaleDateString('de-DE')}
                              </span>
                            </div>
                          )}

                          {/* Meta info */}
                          <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                            <span className="text-[10px] text-content-faint bg-surface-dark px-1.5 py-0.5 rounded">
                              {member.memberType === "full" ? "Full" : "Temp"}
                            </span>
                            {member.gender && (
                              <span className="text-[10px] text-content-muted bg-surface-dark px-1.5 py-0.5 rounded">
                                {member.gender}
                              </span>
                            )}
                            <button
                              onClick={() => handleRelationClick(member)}
                              className="text-[10px] text-content-muted bg-surface-dark px-1.5 py-0.5 rounded flex items-center gap-0.5"
                            >
                              <Users size={9} />
                              {Object.values(memberRelationsMain[member.id] || {}).flat().length}
                            </button>
                          </div>

                          {/* Action buttons - All visible in 2 rows */}
                          <div className="space-y-1 bg-surface-dark rounded-lg p-1.5">
                            {/* First row - 4 icons */}
                            <div className="grid grid-cols-4 gap-1">
                              <button
                                onClick={() => handleCalendarClick(member)}
                                className="p-1.5 text-secondary hover:text-secondary-hover rounded-lg transition-colors flex items-center justify-center"
                                title="Appointments"
                              >
                                <Calendar size={14} />
                              </button>
                              <button
                                onClick={() => handleTrainingPlansClickMain(member)}
                                className="p-1.5 text-secondary hover:text-secondary-hover rounded-lg transition-colors flex items-center justify-center"
                                title="Training Plans"
                              >
                                <Dumbbell size={14} />
                              </button>
                              <button
                                onClick={() => handleHistoryClick(member)}
                                className="p-1.5 text-secondary hover:text-secondary-hover rounded-lg transition-colors flex items-center justify-center"
                                title="History"
                              >
                                <History size={14} />
                              </button>
                              <button
                                onClick={() => handleDocumentClick(member)}
                                className="p-1.5 text-secondary hover:text-secondary-hover rounded-lg transition-colors flex items-center justify-center"
                                title="Documents"
                              >
                                <FileText size={14} />
                              </button>
                            </div>
                            {/* Second row - 4 icons */}
                            <div className="grid grid-cols-4 gap-1">
                            {!isAdminMode && (
  <button
    onClick={() => handleChatClick(member)}
    className="p-1.5 text-secondary hover:text-secondary-hover rounded-lg transition-colors flex items-center justify-center"
    title="Chat"
  >
    <MessageCircle size={14} />
  </button>
)}
                              <button
                                onClick={() => handleViewDetails(member)}
                                className="p-1.5 text-secondary hover:text-secondary-hover rounded-lg transition-colors flex items-center justify-center"
                                title="Details"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => handleEditMember(member)}
                                className="p-1.5 text-primary hover:text-primary-hover rounded-lg transition-colors flex items-center justify-center"
                                title="Edit"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => handleEditMemberNote(member)}
                                className="p-1.5 text-secondary hover:text-secondary-hover rounded-lg transition-colors flex items-center justify-center"
                                title="Add Note"
                              >
                                <StickyNote size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 col-span-full">
                      <p className="text-content-muted text-sm">
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
                        className="bg-surface-card rounded-xl relative p-4"
                      >
                        {/* Note indicator - always visible like Leads */}
                        <div className="absolute top-3 left-3 z-10">
                          <MemberSpecialNoteIcon
                            member={member}
                            onEditMember={handleEditMember}
                            size="md"
                            position="relative"
                          />
                        </div>

                        <div className="flex flex-col">
                          <div className="flex flex-col items-center mb-4">
                            <div className="relative mb-3">
                              {member.image ? (
                                <img
                                  src={member.image}
                                  className="h-20 w-20 rounded-xl flex-shrink-0 object-cover"
                                  alt=""
                                />
                              ) : (
                                <InitialsAvatar 
                                  firstName={getFirstAndLastName(member.title).firstName} 
                                  lastName={getFirstAndLastName(member.title).lastName} 
                                  size="xl"
                                  className="rounded-xl"
                                />
                              )}
                              <BirthdayBadge 
                                show={isBirthday(member.dateOfBirth)} 
                                dateOfBirth={member.dateOfBirth}
                                size="md"
                                withTooltip={true}
                              />
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="flex flex-col sm:flex-row items-center gap-2">
                                <h3 className="text-content-primary font-medium truncate text-lg">
                                  {member.title}
                                </h3>

                                <div className="flex items-center gap-2">
                                  <StatusTag
                                    status={member.isArchived ? 'archived' : member.isActive ? 'active' : 'paused'}
                                    reason={member.reason}
                                  />
                                </div>
                              </div>

                              {/* Age & Birthday */}
                              {member.dateOfBirth && (
                                <div className="flex items-center gap-2 mt-1 text-sm">
                                  <span className="text-content-secondary">
                                    {calculateAgeMain(member.dateOfBirth)} years old
                                  </span>
                                  <span className="text-content-faint">•</span>
                                  <span className="text-content-faint">
                                    {new Date(member.dateOfBirth).toLocaleDateString('de-DE')}
                                  </span>
                                </div>
                              )}

                              {/* Gender & Member Type */}
                              <div className="text-sm mt-1 flex items-center gap-2 flex-wrap justify-center">
                                {member.gender && (
                                  <>
                                    <span className="text-content-muted">{member.gender}</span>
                                    <span className="text-content-faint">•</span>
                                  </>
                                )}
                                <span className="text-content-muted">
                                  {member.memberType === "full" ? "Full Member" : "Temporary Member"}
                                </span>
                              </div>

                              {member.memberType !== "full" && member.autoArchiveDate && (
                                <p className="text-content-muted text-sm truncate mt-1 text-center sm:text-left flex items-center">
                                  Auto-archive: {member.autoArchiveDate}
                                  {new Date(member.autoArchiveDate) <= new Date() && (
                                    <Clock size={16} className="text-primary ml-1" />
                                  )}
                                </p>
                              )}
                              <div className="mt-2">
                                <button
                                  onClick={() => handleRelationClick(member)}
                                  className="text-xs text-secondary hover:text-secondary-hover flex items-center gap-1"
                                >
                                  <Users size={12} />
                                  Relations ({Object.values(memberRelationsMain[member.id] || {}).flat().length})
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Action buttons - Icons only in first row */}
                          <div className="bg-surface-dark rounded-lg p-2 mt-auto">
                            <div className="grid grid-cols-5 gap-1">
                              <button
                                onClick={() => handleCalendarClick(member)}
                                className="p-2 text-secondary hover:text-secondary-hover rounded-lg transition-colors flex items-center justify-center"
                                title="View Appointments"
                              >
                                <Calendar size={16} />
                              </button>
                              <button
                                onClick={() => handleTrainingPlansClickMain(member)}
                                className="p-2 text-secondary hover:text-secondary-hover rounded-lg transition-colors flex items-center justify-center"
                                title="Training Plans"
                              >
                                <Dumbbell size={16} />
                              </button>
                              <button
                                onClick={() => handleHistoryClick(member)}
                                className="p-2 text-secondary hover:text-secondary-hover rounded-lg transition-colors flex items-center justify-center"
                                title="View History"
                              >
                                <History size={16} />
                              </button>
                              <button
                                onClick={() => handleDocumentClick(member)}
                                className="p-2 text-secondary hover:text-secondary-hover rounded-lg transition-colors flex items-center justify-center"
                                title="Document Management"
                              >
                                <FileText size={16} />
                              </button>
                             {!isAdminMode && (
  <button
    onClick={() => handleChatClick(member)}
    className="p-2 text-secondary hover:text-secondary-hover rounded-lg transition-colors flex items-center justify-center"
    title="Start Chat"
  >
    <MessageCircle size={16} />
  </button>
)}
                            </div>

                            {/* Second row - Text buttons */}
                            <div className="grid grid-cols-2 gap-1 mt-1.5">
                              <button
                                onClick={() => handleViewDetails(member)}
                                className="p-2 text-secondary hover:text-secondary-hover rounded-lg transition-colors flex items-center justify-center gap-1.5"
                              >
                                <Eye size={14} />
                                <span className="text-xs font-medium">Details</span>
                              </button>
                              <button
                                onClick={() => handleEditMember(member)}
                                className="p-2 text-primary hover:text-primary-hover rounded-lg transition-colors flex items-center justify-center gap-1.5"
                              >
                                <Pencil size={14} />
                                <span className="text-xs font-medium">Edit</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-red-600 text-center text-sm cursor-pointer col-span-full">
                      <p className="text-content-muted">
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

         
            </>
          )}
          <CreateTempMemberModal
            show={showCreateTempMemberModal}
            onClose={() => setShowCreateTempMemberModal(false)}
            onSuccess={handleTempMemberCreated}
            availableMembersLeads={availableMembersLeadsMain}
            relationOptions={relationOptionsMain}
            countries={countries}
            countriesLoading={countriesLoading}
            context="members"
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
          <div className="bg-surface-card text-content-primary rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Appointment</h3>
            <p className="text-content-secondary mb-6">
              Are you sure you want to delete this appointment? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setAppointmentToDelete(null)}
                className="px-4 py-2 bg-surface-button text-sm text-content-primary rounded-xl hover:bg-surface-button/90"
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
        onEditMemberNote={handleEditMemberNote}
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
      {showCreateAppointmentModalMain && (
        <CreateAppointmentModal
          isOpen={showCreateAppointmentModalMain}
          onClose={() => setShowCreateAppointmentModalMain(false)}
          appointmentTypesMain={appointmentTypesMain}
          onSubmit={handleAddAppointmentSubmit}
          setIsNotifyMemberOpenMain={setIsNotifyMemberOpenMain}
          setNotifyActionMain={setNotifyActionMain}
          freeAppointmentsMain={freeAppointmentsMain}
          availableMembersLeads={availableMembersLeadsMain}
          selectedMemberMain={selectedMemberForAppointmentsMain}
          memberCredits={selectedMemberForAppointmentsMain ? memberContingent[selectedMemberForAppointmentsMain.id] : null}
          currentBillingPeriod={currentBillingPeriodMain}
          onOpenEditMemberModal={handleEditMember}
          memberRelations={memberRelationsMain}
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
          onDelete={handleDeleteAppointmentDirect}
          onOpenEditMemberModal={handleEditMember}
          memberRelations={memberRelationsMain}
        />
      )}
      <DocumentManagementModal
        entity={selectedMemberForDocuments}
        entityType="member"
        isOpen={showDocumentModal}
        onClose={() => {
          setShowDocumentModal(false)
          setSelectedMemberForDocuments(null)
        }}
        onCreateAssessment={() => handleCreateAssessmentClick(selectedMemberForDocuments, true)}
        onEditAssessment={(doc) => handleEditAssessmentClick(selectedMemberForDocuments, doc)}
        onViewAssessment={(doc) => handleViewAssessmentClick(selectedMemberForDocuments, doc)}
        onDocumentsUpdate={handleDocumentsUpdate}
        sections={[
          { id: "general", label: "General", icon: File },
          { id: "medicalHistory", label: "Medical History", icon: ClipboardList },
        ]}
      />

      <AssessmentSelectionModal
        isOpen={isAssessmentSelectionModalOpen}
        onClose={() => {
          setIsAssessmentSelectionModalOpen(false)
          if (assessmentFromDocumentManagement) {
            setShowDocumentModal(true)
          }
        }}
        onSelectAssessment={handleAssessmentSelect}
        selectedLead={selectedMemberMain}
        fromDocumentManagement={assessmentFromDocumentManagement}
      />

      <AssessmentFormModal
        isOpen={isAssessmentFormModalOpen}
        onClose={() => {
          setIsAssessmentFormModalOpen(false)
          setSelectedAssessment(null)
          setIsEditingAssessment(false)
          setEditingAssessmentDocument(null)
          setIsViewingAssessment(false)
          if (assessmentFromDocumentManagement) {
            setShowDocumentModal(true)
            setAssessmentFromDocumentManagement(false)
          }
        }}
        assessment={selectedAssessment}
        selectedLead={selectedMemberMain}
        onComplete={handleAssessmentComplete}
        fromDocumentManagement={assessmentFromDocumentManagement}
        existingDocument={editingAssessmentDocument}
        isEditMode={isEditingAssessment}
        isViewMode={isViewingAssessment}
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

      {/* Member Special Note Modal */}
      <MemberSpecialNoteModal
        isOpen={isMemberSpecialNoteModalOpen}
        onClose={() => {
          setIsMemberSpecialNoteModalOpen(false)
          setSelectedMemberForNote(null)
        }}
        member={selectedMemberForNote}
        onSave={handleSaveMemberSpecialNote}
      />


      {/* Message Type Selection Modal */}
      <MessageTypeSelectionModal
        isOpen={messageTypeModal.isOpen}
        onClose={() => setMessageTypeModal({ isOpen: false, member: null })}
        member={messageTypeModal.member}
        onSelectAppChat={handleOpenAppChat}
        onSelectEmail={handleOpenEmailModal}
      />

      {/* Chat Popup */}
      {chatPopup.isOpen && chatPopup.member && (
        <ChatPopup
          member={chatPopup.member}
          isOpen={chatPopup.isOpen}
          onClose={() => setChatPopup({ isOpen: false, member: null })}
          onOpenFullMessenger={() => handleOpenFullMessenger(chatPopup.member)}
        />
      )}

      {/* Send Email Modal */}
      <SendEmailModal
        showEmailModal={showEmailModal}
        handleCloseEmailModal={handleCloseEmailModal}
        handleSendEmail={handleSendEmail}
        emailData={emailData}
        setEmailData={setEmailData}
        handleSearchMemberForEmail={handleSearchMemberForEmail}
        preselectedMember={selectedMemberForEmail}
        onSaveAsDraft={handleSaveEmailAsDraft}
        signature={communicationSettingsData?.emailSignature || ""}
      />

      
      {/* Floating Action Button - Mobile Only */}
      <button
        onClick={() => setShowCreateTempMemberModal(true)}
        className="md:hidden fixed bottom-4 right-4 bg-primary hover:bg-primary-hover text-white p-4 rounded-xl shadow-lg transition-all active:scale-95 z-30"
        aria-label="Create Temporary Member"
      >
        <Plus size={22} />
      </button>
    </>
  )
}
