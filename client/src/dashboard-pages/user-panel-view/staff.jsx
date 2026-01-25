/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, createContext, useRef, useEffect } from "react"
import { 
  X, 
  Calendar, 
  Users, 
  History, 
  MessageCircle, 
  Grid3X3, 
  List, 
  FileText, 
  Eye, 
  ChevronUp, 
  ChevronDown,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Plus,
  Pencil,
  Briefcase,
  Cake,
  File,
  ClipboardList,
} from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import AddStaffModal from "../../components/user-panel-components/staff-components/add-staff-modal"
import EditStaffModal from "../../components/user-panel-components/staff-components/edit-staff-modal"
import StaffPlanningModal from "../../components/user-panel-components/staff-components/staff-planning-modal"
import VacationCalendarModal from "../../components/user-panel-components/staff-components/vacation-calendar-modal"
import StaffHistoryModal from "../../components/user-panel-components/staff-components/staff-history-modal"
import { StaffColorIndicator, staffMemberDataNew } from "../../utils/user-panel-states/app-states"
import { useSidebarSystem } from "../../hooks/useSidebarSystem"
import { trainingVideosData } from "../../utils/user-panel-states/training-states"
import Sidebar from "../../components/central-sidebar"
import { TbPlusMinus } from "react-icons/tb";

import EditTaskModal from "../../components/user-panel-components/todo-components/edit-task-modal"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal"
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal"
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal"
import TrainingPlansModal from "../../components/myarea-components/TrainingPlanModal"
import VacationContingentModal from "../../components/user-panel-components/staff-components/vacation-contigent"
import ChatPopup from "../../components/shared/ChatPopup"
import MessageTypeSelectionModal from "../../components/shared/MessageTypeSelectionModal"
import SendEmailModal from "../../components/shared/SendEmailModal"
import DocumentManagementModal from "../../components/shared/DocumentManagementModal"
import StaffViewDetailsModal from "../../components/user-panel-components/staff-components/staff-view-details-modal"
import AssessmentFormModal from "../../components/shared/medical-history-form-modal"
import AssessmentSelectionModal from "../../components/shared/medical-history-selection-modal"

const StaffContext = createContext(null)

// Role Tag Component
const RoleTag = ({ role, compact = false }) => {
  const getDynamicRoleColor = (role) => {
    const roleColors = {
      'Telephone operator': 'bg-purple-600',
      'Software Engineer': 'bg-blue-600', 
      'System Engineer': 'bg-green-600',
      'Manager': 'bg-red-600',
      'Trainer': 'bg-indigo-600',
      'Reception': 'bg-yellow-600',
      'Cleaner': 'bg-orange-600',
      'Admin': 'bg-pink-600',
      'Therapist': 'bg-teal-600'
    };

    return roleColors[role] || 'bg-gray-600';
  };

  const bgColor = getDynamicRoleColor(role);

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1 ${bgColor} text-white px-2 py-1 rounded-lg text-xs font-medium`}>
        <Briefcase size={12} className="flex-shrink-0" />
        <span className="truncate max-w-[140px]">{role}</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 ${bgColor} text-white px-3 py-1.5 rounded-xl text-xs font-medium`}>
      <Briefcase size={14} />
      <span>{role}</span>
    </div>
  );
};

// Initials Avatar Component - Blue background with initials (for Staff)
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
      className={`bg-blue-600 rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0 ${sizeClasses[size]} ${className}`}
      style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
    >
      {getInitials()}
    </div>
  )
};

export default function StaffManagement() {
  const sidebarSystem = useSidebarSystem();
  const [isShowDetails, setIsShowDetails] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [staffToRemove, setStaffToRemove] = useState(null)
  const [isPlanningModalOpen, setIsPlanningModalOpen] = useState(false)
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false)
  const [isVacationRequestModalOpen, setIsVacationRequestModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [selectedStaffForHistory, setSelectedStaffForHistory] = useState(null)
  const [viewMode, setViewMode] = useState("list")

  const [isCompactView, setIsCompactView] = useState(false);
  const [expandedStaffId, setExpandedStaffId] = useState(null);
  const [expandedMobileRowId, setExpandedMobileRowId] = useState(null);

  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [selectedMemberForDocuments, setSelectedMemberForDocuments] = useState(null)

  // Assessment states (Medical History)
  const [isAssessmentSelectionModalOpen, setIsAssessmentSelectionModalOpen] = useState(false)
  const [isAssessmentFormModalOpen, setIsAssessmentFormModalOpen] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const [assessmentFromDocumentManagement, setAssessmentFromDocumentManagement] = useState(false)
  const [editingAssessmentDocument, setEditingAssessmentDocument] = useState(null)
  const [isEditingAssessment, setIsEditingAssessment] = useState(false)
  const [isViewingAssessment, setIsViewingAssessment] = useState(false)

  const [chatPopup, setChatPopup] = useState({
    isOpen: false,
    staff: null
  });

  // Message Type Selection Modal State
  const [messageTypeModal, setMessageTypeModal] = useState({
    isOpen: false,
    staff: null
  });

  // Email Modal States
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedStaffForEmail, setSelectedStaffForEmail] = useState(null);
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
    { id: 1, name: "Welcome", subject: "Welcome to our team!", body: "Hello,\n\nWelcome to our team!" },
    { id: 2, name: "Reminder", subject: "Reminder for your shift", body: "Hello,\n\nThis is a reminder about your upcoming shift." },
    { id: 3, name: "Schedule", subject: "Your Schedule", body: "Hello,\n\nPlease find your schedule attached." },
  ];

  const [isVacationContingentModalOpen, setIsVacationContingentModalOpen] = useState(false)
  const [selectedStaffForContingent, setSelectedStaffForContingent] = useState(null)

  // View Details Modal State
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false)
  const [selectedStaffForView, setSelectedStaffForView] = useState(null)

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filtersExpanded, setFiltersExpanded] = useState(false)

  // Sort States
  const [sortBy, setSortBy] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [showMobileSortDropdown, setShowMobileSortDropdown] = useState(false)
  const sortDropdownRef = useRef(null)
  const mobileSortDropdownRef = useRef(null)

  const trainingVideos = trainingVideosData
  const [staffMembers, setStaffMembers] = useState(staffMemberDataNew)

  // Sort options
  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "role", label: "Role" },
  ]

  // Get unique roles for filter
  const uniqueRoles = [...new Set(staffMembers.map(s => s.role))].sort()

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false)
      }
      if (mobileSortDropdownRef.current && !mobileSortDropdownRef.current.contains(event.target)) {
        setShowMobileSortDropdown(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      // Ignore if Ctrl/Cmd is pressed (for Ctrl+C copy, etc.)
      if (e.ctrlKey || e.metaKey) return;
      
      // Check if ANY modal is open - if so, don't trigger hotkeys
      // Only check local modal states (sidebar modals are checked via DOM)
      const anyLocalModalOpen = 
        isModalOpen ||
        isRemoveModalOpen ||
        isPlanningModalOpen ||
        isAttendanceModalOpen ||
        isVacationRequestModalOpen ||
        isHistoryModalOpen ||
        isAssessmentSelectionModalOpen ||
        isAssessmentFormModalOpen ||
        chatPopup.isOpen ||
        messageTypeModal.isOpen ||
        showEmailModal ||
        isVacationContingentModalOpen ||
        isViewDetailsModalOpen ||
        showDocumentModal;
      
      // Also check if any modal overlay is visible in the DOM
      const hasVisibleModal = document.querySelector('[class*="fixed"][class*="inset-0"][class*="z-50"]') ||
                              document.querySelector('[class*="fixed"][class*="inset-0"][class*="z-40"]');
      
      if (anyLocalModalOpen || hasVisibleModal) return;
      
      // C key - Create Staff
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setIsModalOpen(true);
      }
      
      // V key - Toggle view mode
      if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
      }
      
      // P key - Staff Planning
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setIsPlanningModalOpen(true);
      }
      
      // K key - Vacation Calendar
      if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        setIsVacationRequestModalOpen(true);
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [
    isModalOpen,
    isRemoveModalOpen,
    isPlanningModalOpen,
    isAttendanceModalOpen,
    isVacationRequestModalOpen,
    isHistoryModalOpen,
    isAssessmentSelectionModalOpen,
    isAssessmentFormModalOpen,
    chatPopup.isOpen,
    messageTypeModal.isOpen,
    showEmailModal,
    isVacationContingentModalOpen,
    isViewDetailsModalOpen,
    showDocumentModal
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

  // Filter and sort staff
  const filteredAndSortedStaff = () => {
    let filtered = [...staffMembers]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(staff => 
        `${staff.firstName} ${staff.lastName}`.toLowerCase().includes(query) ||
        staff.role?.toLowerCase().includes(query) ||
        staff.email?.toLowerCase().includes(query)
      )
    }

    // Role filter
    if (filterRole !== "all") {
      filtered = filtered.filter(staff => staff.role === filterRole)
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "name":
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase()
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase()
          comparison = nameA.localeCompare(nameB)
          break
        case "role":
          comparison = (a.role || "").localeCompare(b.role || "")
          break
      }
      return sortDirection === "asc" ? comparison : -comparison
    })

    return filtered
  }

  // Sort handlers
  const handleSortOptionClick = (value) => {
    if (sortBy === value) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(value)
      setSortDirection("asc")
    }
    setShowSortDropdown(false)
  }

  const handleMobileSortOptionClick = (value) => {
    if (sortBy === value) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(value)
      setSortDirection("asc")
    }
    setShowMobileSortDropdown(false)
  }

  const getSortIcon = () => {
    return sortDirection === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />
  }

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || "Name"

  // Helper functions
  const isBirthday = (dateString) => {
    if (!dateString) return false
    const today = new Date()
    const birthDate = new Date(dateString)
    return today.getMonth() === birthDate.getMonth() && today.getDate() === birthDate.getDate()
  }

  const handleVacationContingentClick = (staff) => {
    setSelectedStaffForContingent(staff)
    setIsVacationContingentModalOpen(true)
  }

  const handleUpdateVacationContingent = (staffId, newContingent, notes) => {
    setStaffMembers(prev => prev.map(staff =>
      staff.id === staffId
        ? {
          ...staff,
          vacationDays: newContingent,
          vacationNotes: notes
        }
        : staff
    ))
    toast.success("Vacation contingent updated successfully")
  }

  const handleEdit = (staff) => {
    setSelectedStaff(staff)
    setIsShowDetails(true)
  }

  const handleRemovalStaff = (staff) => {
    setStaffToRemove(staff)
    setIsRemoveModalOpen(true)
  }

  const handleDocumentClick = (staff) => {
    setSelectedMemberForDocuments(staff)
    setShowDocumentModal(true)
  }

  // Handler for document updates from DocumentManagementModal
  const handleDocumentsUpdate = (staffId, documents) => {
    setStaffMembers(prevStaff => 
      prevStaff.map(staff => 
        staff.id === staffId ? { ...staff, documents } : staff
      )
    )
  }

  // Assessment handlers (Medical History)
  const handleCreateAssessmentClick = (staff, fromDocManagement = false) => {
    setSelectedStaff(staff)
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
    setStaffMembers(prevStaff => 
      prevStaff.map(staff => {
        if (staff.id === selectedStaff.id) {
          const existingDocuments = staff.documents || []
          
          if (documentData.isEdit) {
            return {
              ...staff,
              documents: existingDocuments.map(doc => 
                doc.id === documentData.id ? documentData : doc
              ),
              hasAssessment: true
            }
          } else {
            return {
              ...staff,
              documents: [...existingDocuments, documentData],
              hasAssessment: true
            }
          }
        }
        return staff
      })
    )
    
    setIsAssessmentFormModalOpen(false)
    setSelectedAssessment(null)
    setIsEditingAssessment(false)
    setEditingAssessmentDocument(null)
    setIsViewingAssessment(false)
    
    if (assessmentFromDocumentManagement) {
      if (selectedMemberForDocuments && selectedMemberForDocuments.id === selectedStaff.id) {
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

  const handleEditAssessmentClick = (staff, doc) => {
    setSelectedStaff(staff)
    setIsEditingAssessment(true)
    setEditingAssessmentDocument(doc)
    setAssessmentFromDocumentManagement(true)
    setSelectedAssessment({ id: doc.templateId, title: doc.name })
    setShowDocumentModal(false)
    setIsAssessmentFormModalOpen(true)
  }

  const handleViewAssessmentClick = (staff, doc) => {
    setSelectedStaff(staff)
    setEditingAssessmentDocument(doc)
    setIsViewingAssessment(true)
    setAssessmentFromDocumentManagement(true)
    setSelectedAssessment({ id: doc.templateId, title: doc.name })
    setShowDocumentModal(false)
    setIsAssessmentFormModalOpen(true)
  }

  const confirmRemoveStaff = () => {
    setStaffMembers(staffMembers.filter((member) => member.id !== staffToRemove.id))
    setIsRemoveModalOpen(false)
    setStaffToRemove(null)
    setIsShowDetails(false)
    toast.success("Staff deleted successfully")
  }

  const handleVacationRequest = (staffId, startDate, endDate) => {
    console.log(`Vacation request for staff ${staffId} from ${startDate} to ${endDate}`)
    toast.success("Vacation request submitted for approval")
  }

  const handleHistoryClick = (staff) => {
    setSelectedStaffForHistory(staff)
    setIsHistoryModalOpen(true)
  }

  const handleViewDetails = (staff) => {
    setSelectedStaffForView(staff)
    setIsViewDetailsModalOpen(true)
  }

  const handleChatClick = (staff) => {
    setMessageTypeModal({
      isOpen: true,
      staff: staff
    });
  };

  // Open App Chat (from Message Type Modal)
  const handleOpenAppChat = () => {
    if (messageTypeModal.staff) {
      setChatPopup({
        isOpen: true,
        staff: messageTypeModal.staff
      });
    }
  };

  // Open Email Modal (from Message Type Modal)
  const handleOpenEmailModal = () => {
    if (messageTypeModal.staff) {
      setSelectedStaffForEmail(messageTypeModal.staff);
      setEmailData({
        to: messageTypeModal.staff.email || "",
        subject: "",
        body: "",
        recipientName: `${messageTypeModal.staff.firstName} ${messageTypeModal.staff.lastName}`
      });
      setShowEmailModal(true);
    }
  };

  // Close Email Modal
  const handleCloseEmailModal = () => {
    setShowEmailModal(false);
    setSelectedStaffForEmail(null);
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

  // Template select
  const handleTemplateSelect = (template) => {
    setSelectedEmailTemplate(template);
    setEmailData({
      ...emailData,
      subject: template.subject,
      body: template.body || ""
    });
    setShowTemplateDropdown(false);
  };

  // Search staff for email
  const handleSearchStaffForEmail = (query) => {
    if (!query) return [];
    return staffMembers.filter(s => 
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
      s.email?.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Select email recipient
  const handleSelectEmailRecipient = (staff) => {
    setEmailData({
      ...emailData,
      to: staff.email,
      recipientName: `${staff.firstName} ${staff.lastName}`
    });
    setShowRecipientDropdown(false);
  };

  const handleOpenFullMessenger = (staff) => {
    setChatPopup({ isOpen: false, staff: null });
    window.location.href = `/dashboard/communication`;
  };

  // Extract all states and functions from the hook
  const {
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

  // Wrapper functions
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

  return (
    <StaffContext.Provider value={{ staffMembers, setStaffMembers }}>
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
          className={`flex flex-col lg:flex-row rounded-3xl bg-[#1C1C1C] transition-all duration-500 text-white relative ${isRightSidebarOpen ? "lg:mr-96 mr-0" : "mr-0"}`}
        >
          <div className="flex-1 min-w-0 md:p-6 p-4 pb-36">
            {/* Header */}
            <div className="flex sm:items-center justify-between mb-6 sm:mb-8 gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-white oxanium_font text-xl md:text-2xl">Staff</h1>
                
                {/* Sort Button - Mobile: next to title */}
                <div className="lg:hidden relative" ref={mobileSortDropdownRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMobileSortDropdown(!showMobileSortDropdown);
                    }}
                    className="px-3 py-2 bg-[#2F2F2F] text-gray-300 rounded-xl text-xs hover:bg-[#3F3F3F] transition-colors flex items-center gap-2"
                  >
                    {getSortIcon()}
                    <span>{currentSortLabel}</span>
                  </button>

                  {/* Sort Dropdown - Mobile */}
                  {showMobileSortDropdown && (
                    <div className="absolute left-0 mt-1 bg-[#1F1F1F] border border-gray-700 rounded-lg shadow-lg z-50 min-w-[180px]">
                      <div className="py-1">
                        <div className="px-3 py-1.5 text-xs text-gray-500 font-medium border-b border-gray-700">
                          Sort by
                        </div>
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMobileSortOptionClick(option.value);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-800 transition-colors flex items-center justify-between ${
                              sortBy === option.value 
                                ? 'text-white bg-gray-800/50' 
                                : 'text-gray-300'
                            }`}
                          >
                            <span>{option.label}</span>
                            {sortBy === option.value && (
                              <span className="text-gray-400">
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
                <div className="hidden lg:flex items-center gap-2 bg-black rounded-xl p-1">
                  <div className="relative group">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-orange-600 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Grid3X3 size={16} />
                    </button>
                    
                    {/* Tooltip */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                      <span className="font-medium">Grid View</span>
                      <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">V</span>
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'list'
                          ? 'bg-orange-600 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <List size={16} />
                    </button>
                    
                    {/* Tooltip */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                      <span className="font-medium">List View</span>
                      <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">V</span>
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
                    </div>
                  </div>

                  {/* Compact/Detailed Toggle */}
                  <div className="h-6 w-px bg-gray-700 mx-1"></div>
                  <div className="relative group">
                    <button
                      onClick={() => setIsCompactView(!isCompactView)}
                      className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${isCompactView ? "text-orange-500" : "text-orange-500"}`}
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
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                      <span className="font-medium">{isCompactView ? "Compact View" : "Detailed View"}</span>
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Action Buttons - Desktop */}
                <div className="hidden lg:flex items-center gap-2">
                  <div className="relative group">
                    <button
                      onClick={() => setIsPlanningModalOpen(true)}
                      className="bg-black py-2 px-4 text-sm rounded-xl flex items-center gap-2 hover:bg-[#1a1a1a] transition-colors"
                    >
                      <Users className="h-4 w-4" />
                      <span>Staff Planning</span>
                    </button>
                    
                    {/* Tooltip */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                      <span className="font-medium">Staff Planning</span>
                      <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">P</span>
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
                    </div>
                  </div>

                  <div className="relative group">
                    <button
                      onClick={() => setIsVacationRequestModalOpen(true)}
                      className="bg-black py-2 px-4 text-sm rounded-xl flex items-center gap-2 hover:bg-[#1a1a1a] transition-colors"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Vacation Calendar</span>
                    </button>
                    
                    {/* Tooltip */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                      <span className="font-medium">Vacation Calendar</span>
                      <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">K</span>
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
                    </div>
                  </div>

                  <div className="relative group">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors"
                    >
                      <Plus size={14} />
                      <span>Create Staff</span>
                    </button>
                    
                    {/* Tooltip */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                      <span className="font-medium">Create Staff Member</span>
                      <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">C</span>
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
                    </div>
                  </div>
                </div>

                {isRightSidebarOpen ? (
                  <div onClick={toggleRightSidebar}>
                    <img src='/expand-sidebar mirrored.svg' className="h-5 w-5 cursor-pointer" alt="" />
                  </div>
                ) : (
                  <div onClick={toggleRightSidebar}>
                    <img src="/icon.svg" className="h-5 w-5 cursor-pointer" alt="" />
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className="lg:hidden flex gap-2 mb-4">
              <button
                onClick={() => setIsPlanningModalOpen(true)}
                className="flex-1 bg-black py-2.5 px-3 text-sm rounded-xl flex items-center justify-center gap-2"
              >
                <Users className="h-4 w-4" />
                <span>Planning</span>
              </button>
              <button
                onClick={() => setIsVacationRequestModalOpen(true)}
                className="flex-1 bg-black py-2.5 px-3 text-sm rounded-xl flex items-center justify-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                <span>Vacation</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-2 pl-9 sm:pl-10 border border-[#333333] focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            {/* Filters Section - Collapsible */}
            <div className="mb-4 sm:mb-6">
              {/* Filters Header Row */}
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setFiltersExpanded(!filtersExpanded)}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Filter size={14} />
                  <span className="text-xs sm:text-sm font-medium">Filters</span>
                  <ChevronDown 
                    size={14} 
                    className={`transition-transform duration-200 ${filtersExpanded ? 'rotate-180' : ''}`} 
                  />
                  {!filtersExpanded && (filterRole !== 'all') && (
                    <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {filterRole !== 'all' ? 1 : 0}
                    </span>
                  )}
                </button>

                {/* Sort Controls - Desktop only */}
                <div className="hidden lg:block relative" ref={sortDropdownRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSortDropdown(!showSortDropdown);
                    }}
                    className="px-3 sm:px-4 py-1.5 bg-[#2F2F2F] text-gray-300 rounded-xl text-xs sm:text-sm hover:bg-[#3F3F3F] transition-colors flex items-center gap-2"
                  >
                    {getSortIcon()}
                    <span>{currentSortLabel}</span>
                  </button>

                  {showSortDropdown && (
                    <div className="absolute top-full right-0 mt-1 bg-[#1F1F1F] border border-gray-700 rounded-lg shadow-lg z-50 min-w-[180px]">
                      <div className="py-1">
                        <div className="px-3 py-1.5 text-xs text-gray-500 font-medium border-b border-gray-700">
                          Sort by
                        </div>
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSortOptionClick(option.value);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-800 transition-colors flex items-center justify-between ${
                              sortBy === option.value 
                                ? 'text-white bg-gray-800/50' 
                                : 'text-gray-300'
                            }`}
                          >
                            <span>{option.label}</span>
                            {sortBy === option.value && (
                              <span className="text-gray-400">
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
                  {/* Role Filter Pills */}
                  <button
                    onClick={() => setFilterRole('all')}
                    className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${
                      filterRole === 'all'
                        ? "bg-blue-600 text-white"
                        : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                    }`}
                  >
                    All Roles ({staffMembers.length})
                  </button>
                  {uniqueRoles.map(role => (
                    <button
                      key={role}
                      onClick={() => setFilterRole(role)}
                      className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${
                        filterRole === role
                          ? "bg-blue-600 text-white"
                          : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Staff List/Grid View */}
            <div className="open_sans_font">
              {viewMode === "list" ? (
                // LIST VIEW
                <div className="bg-[#141414] rounded-xl overflow-hidden">
                  {/* Table Header - Desktop only */}
                  <div className={`hidden lg:grid lg:grid-cols-12 gap-3 px-4 bg-[#0f0f0f] border-b border-gray-800 text-xs text-gray-500 font-medium ${isCompactView ? 'py-2' : 'py-3'}`}>
                    <div className="col-span-3">Staff</div>
                    <div className="col-span-2">Role</div>
                    <div className="col-span-2">Username</div>
                    <div className="col-span-2">About</div>
                    <div className="col-span-3 text-right">Actions</div>
                  </div>
                  
                  {filteredAndSortedStaff().length > 0 ? (
                    filteredAndSortedStaff().map((staff, index) => (
                      <div 
                        key={staff.id}
                        className={`group hover:bg-[#1a1a1a] transition-colors ${
                          index !== filteredAndSortedStaff().length - 1 ? 'border-b border-gray-800/50' : ''
                        }`}
                      >
                        {/* Desktop Table Row */}
                        <div className={`hidden lg:grid lg:grid-cols-12 gap-3 px-4 items-center ${isCompactView ? 'py-2.5' : 'py-4'}`}>
                          {/* Staff Info */}
                          <div className="col-span-3 flex items-center gap-3 min-w-0">
                            {staff.img ? (
                              <img
                                src={staff.img}
                                alt={`${staff.firstName} ${staff.lastName}`}
                                className={`${isCompactView ? 'w-9 h-9' : 'w-12 h-12'} rounded-xl flex-shrink-0 object-cover`}
                              />
                            ) : (
                              <InitialsAvatar 
                                firstName={staff.firstName} 
                                lastName={staff.lastName} 
                                size={isCompactView ? "sm" : "lg"}
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-white font-medium ${isCompactView ? 'text-sm' : 'text-base'} truncate`}>
                                  {staff.firstName} {staff.lastName}
                                </span>
                                <StaffColorIndicator color={staff.color} />
                                {isBirthday(staff.dateOfBirth) && <Cake size={isCompactView ? 14 : 16} className="text-yellow-500 flex-shrink-0" />}
                              </div>
                              <span className={`${isCompactView ? 'text-xs' : 'text-sm'} text-gray-500 truncate block`}>
                                {staff.email}
                              </span>
                            </div>
                          </div>
                          
                          {/* Role */}
                          <div className="col-span-2">
                            <RoleTag role={staff.role} compact={isCompactView} />
                          </div>
                          
                          {/* Username */}
                          <div className="col-span-2">
                            <span className={`${isCompactView ? 'text-xs' : 'text-sm'} text-gray-400 truncate block`}>
                              {staff.username || "â€”"}
                            </span>
                          </div>
                          
                          {/* About */}
                          <div className="col-span-2">
                            <span className={`${isCompactView ? 'text-xs' : 'text-sm'} text-gray-400 line-clamp-2`}>
                              {staff.description || staff.about || "ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â"}
                            </span>
                          </div>
                          
                          {/* Actions */}
                          <div className="col-span-3 flex items-center justify-end gap-0.5">
                            <button
                              onClick={() => handleHistoryClick(staff)}
                              className={`${isCompactView ? 'p-1.5' : 'p-2'} text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors`}
                              title="History"
                            >
                              <History size={isCompactView ? 16 : 18} />
                            </button>
                            <button
                              onClick={() => handleChatClick(staff)}
                              className={`${isCompactView ? 'p-1.5' : 'p-2'} text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors`}
                              title="Chat"
                            >
                              <MessageCircle size={isCompactView ? 16 : 18} />
                            </button>
                            <button
                              onClick={() => handleVacationContingentClick(staff)}
                              className={`${isCompactView ? 'p-1.5' : 'p-2'} text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors`}
                              title="Vacation Contingent"
                            >
                              <TbPlusMinus size={isCompactView ? 16 : 18} />
                            </button>
                            <button
                              onClick={() => handleDocumentClick(staff)}
                              className={`${isCompactView ? 'p-1.5' : 'p-2'} text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors`}
                              title="Documents"
                            >
                              <FileText size={isCompactView ? 16 : 18} />
                            </button>
                            <button
                              onClick={() => handleViewDetails(staff)}
                              className={`${isCompactView ? 'p-1.5' : 'p-2'} text-blue-400 hover:text-blue-300 hover:bg-white/5 rounded-lg transition-colors`}
                              title="View Details"
                            >
                              <Eye size={isCompactView ? 16 : 18} />
                            </button>
                            <div className={`w-px ${isCompactView ? 'h-4' : 'h-5'} bg-gray-700/50 mx-1`} />
                            <button
                              onClick={() => handleEdit(staff)}
                              className={`${isCompactView ? 'p-1.5' : 'p-2'} text-orange-400 hover:text-orange-300 hover:bg-white/5 rounded-lg transition-colors`}
                              title="Edit"
                            >
                              <Pencil size={isCompactView ? 16 : 18} />
                            </button>
                          </div>
                        </div>
                        
                        {/* Mobile Row */}
                        <div className="lg:hidden">
                          <div 
                            className={`px-3 ${isCompactView ? 'py-2.5' : 'py-3'} cursor-pointer active:bg-[#252525] transition-colors`}
                            onClick={() => setExpandedMobileRowId(expandedMobileRowId === staff.id ? null : staff.id)}
                          >
                            <div className="flex items-center gap-3">
                              {staff.img ? (
                                <img
                                  src={staff.img}
                                  alt={`${staff.firstName} ${staff.lastName}`}
                                  className={`${isCompactView ? 'w-9 h-9' : 'w-11 h-11'} rounded-xl flex-shrink-0 object-cover`}
                                />
                              ) : (
                                <InitialsAvatar 
                                  firstName={staff.firstName} 
                                  lastName={staff.lastName} 
                                  size={isCompactView ? "sm" : "md"}
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className={`text-white font-medium ${isCompactView ? 'text-sm' : 'text-base'} truncate`}>
                                    {staff.firstName} {staff.lastName}
                                  </span>
                                  <StaffColorIndicator color={staff.color} />
                                  {isBirthday(staff.dateOfBirth) && <Cake size={12} className="text-yellow-500 flex-shrink-0" />}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                  <RoleTag role={staff.role} compact={true} />
                                </div>
                              </div>
                              
                              <div className="flex-shrink-0 p-1">
                                <ChevronDown 
                                  size={18} 
                                  className={`text-gray-500 transition-transform duration-200 ${expandedMobileRowId === staff.id ? 'rotate-180' : ''}`} 
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* Expandable Actions Panel */}
                          <div 
                            className={`overflow-hidden transition-all duration-200 ease-in-out ${
                              expandedMobileRowId === staff.id ? 'max-h-56 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                          >
                            <div className="px-3 pb-3 pt-1">
                              <div className="bg-[#0f0f0f] rounded-xl p-2">
                                <div className="grid grid-cols-4 gap-1">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleHistoryClick(staff); }}
                                    className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                  >
                                    <History size={18} />
                                    <span className="text-[10px]">History</span>
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleChatClick(staff); }}
                                    className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                  >
                                    <MessageCircle size={18} />
                                    <span className="text-[10px]">Chat</span>
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleVacationContingentClick(staff); }}
                                    className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                  >
                                    <TbPlusMinus size={18} />
                                    <span className="text-[10px]">Vacation</span>
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDocumentClick(staff); }}
                                    className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                  >
                                    <FileText size={18} />
                                    <span className="text-[10px]">Docs</span>
                                  </button>
                                </div>
                                <div className="grid grid-cols-2 gap-1 mt-1">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleViewDetails(staff); }}
                                    className="flex items-center justify-center gap-2 p-2 text-blue-400 hover:text-blue-300 hover:bg-white/5 rounded-lg transition-colors"
                                  >
                                    <Eye size={18} />
                                    <span className="text-xs">View Details</span>
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleEdit(staff); }}
                                    className="flex items-center justify-center gap-2 p-2 text-orange-400 hover:text-orange-300 hover:bg-white/5 rounded-lg transition-colors"
                                  >
                                    <Pencil size={18} />
                                    <span className="text-xs">Edit Staff</span>
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
                      <p className="text-gray-400 text-sm">No staff members found.</p>
                    </div>
                  )}
                </div>
              ) : // GRID VIEW
                isCompactView ? (
                  // COMPACT GRID VIEW
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                    {filteredAndSortedStaff().length > 0 ? (
                      filteredAndSortedStaff().map((staff) => (
                        <div 
                          key={staff.id}
                          className="bg-[#141414] rounded-xl hover:bg-[#1a1a1a] transition-colors group relative overflow-hidden"
                        >
                          <div className="p-3 pt-4">
                            {/* Avatar & Name */}
                            <div className="flex flex-col items-center mb-2">
                              {staff.img ? (
                                <img
                                  src={staff.img}
                                  alt={`${staff.firstName} ${staff.lastName}`}
                                  className="w-12 h-12 rounded-xl object-cover mb-2"
                                />
                              ) : (
                                <InitialsAvatar 
                                  firstName={staff.firstName} 
                                  lastName={staff.lastName} 
                                  size="lg"
                                  className="mb-2"
                                />
                              )}
                              <div className="text-center w-full min-w-0">
                                <p className="text-white font-medium text-sm leading-tight truncate">
                                  {staff.firstName}
                                </p>
                                <p className="text-gray-500 text-xs truncate">
                                  {staff.lastName}
                                </p>
                                {staff.username && (
                                  <p className="text-gray-600 text-xs truncate">
                                    {staff.username}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Role */}
                            <div className="flex justify-center mb-2">
                              <RoleTag role={staff.role} compact={true} />
                            </div>

                            {/* Action buttons */}
                            <div className="space-y-1 bg-[#0a0a0a] rounded-lg p-1.5">
                              <div className="grid grid-cols-4 gap-1">
                                <button
                                  onClick={() => handleHistoryClick(staff)}
                                  className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors flex items-center justify-center"
                                  title="History"
                                >
                                  <History size={14} />
                                </button>
                                <button
                                  onClick={() => handleChatClick(staff)}
                                  className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors flex items-center justify-center"
                                  title="Chat"
                                >
                                  <MessageCircle size={14} />
                                </button>
                                <button
                                  onClick={() => handleVacationContingentClick(staff)}
                                  className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors flex items-center justify-center"
                                  title="Vacation"
                                >
                                  <TbPlusMinus size={14} />
                                </button>
                                <button
                                  onClick={() => handleDocumentClick(staff)}
                                  className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors flex items-center justify-center"
                                  title="Documents"
                                >
                                  <FileText size={14} />
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-1">
                                <button
                                  onClick={() => handleViewDetails(staff)}
                                  className="p-1.5 text-blue-400 hover:text-blue-300 rounded-lg transition-colors flex items-center justify-center gap-1"
                                  title="View Details"
                                >
                                  <Eye size={14} />
                                </button>
                                <button
                                  onClick={() => handleEdit(staff)}
                                  className="p-1.5 text-orange-400 hover:text-orange-300 rounded-lg transition-colors flex items-center justify-center gap-1"
                                  title="Edit"
                                >
                                  <Pencil size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 col-span-full">
                        <p className="text-gray-400 text-sm">No staff members found.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  // DETAILED GRID VIEW
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAndSortedStaff().length > 0 ? (
                      filteredAndSortedStaff().map((staff) => (
                        <div
                          key={staff.id}
                          className="bg-[#161616] rounded-xl relative p-4"
                        >
                          <div className="flex flex-col">
                            <div className="flex flex-col items-center mb-4">
                              {staff.img ? (
                                <img
                                  src={staff.img}
                                  className="h-20 w-20 rounded-xl flex-shrink-0 object-cover mb-3"
                                  alt={`${staff.firstName} ${staff.lastName}`}
                                />
                              ) : (
                                <InitialsAvatar 
                                  firstName={staff.firstName} 
                                  lastName={staff.lastName} 
                                  size="xl"
                                  className="mb-3"
                                />
                              )}
                              <div className="flex flex-col items-center">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-white font-medium text-lg">
                                    {staff.firstName} {staff.lastName}
                                  </h3>
                                  <StaffColorIndicator color={staff.color} />
                                  {isBirthday(staff.dateOfBirth) && <Cake size={16} className="text-yellow-500" />}
                                </div>

                                <div className="flex items-center gap-2 mt-2">
                                  <RoleTag role={staff.role} />
                                </div>

                                <p className="text-gray-400 text-sm mt-2 text-center">
                                  {staff.email}
                                </p>
                                {staff.username && (
                                  <p className="text-gray-500 text-xs mt-1 text-center">
                                    {staff.username}
                                  </p>
                                )}
                              </div>
                            </div>

                            {(staff.description || staff.about) && (
                              <p className="text-gray-400 text-sm text-center mb-4 line-clamp-2">
                                {staff.description || staff.about}
                              </p>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2 justify-center">
                              <button
                                onClick={() => handleHistoryClick(staff)}
                                className="p-2.5 text-gray-400 hover:text-white bg-[#0f0f0f] hover:bg-[#1a1a1a] rounded-xl transition-colors"
                                title="History"
                              >
                                <History size={18} />
                              </button>
                              <button
                                onClick={() => handleChatClick(staff)}
                                className="p-2.5 text-gray-400 hover:text-white bg-[#0f0f0f] hover:bg-[#1a1a1a] rounded-xl transition-colors"
                                title="Chat"
                              >
                                <MessageCircle size={18} />
                              </button>
                              <button
                                onClick={() => handleVacationContingentClick(staff)}
                                className="p-2.5 text-gray-400 hover:text-white bg-[#0f0f0f] hover:bg-[#1a1a1a] rounded-xl transition-colors"
                                title="Vacation Contingent"
                              >
                                <TbPlusMinus size={18} />
                              </button>
                              <button
                                onClick={() => handleDocumentClick(staff)}
                                className="p-2.5 text-gray-400 hover:text-white bg-[#0f0f0f] hover:bg-[#1a1a1a] rounded-xl transition-colors"
                                title="Documents"
                              >
                                <FileText size={18} />
                              </button>
                              <button
                                onClick={() => handleViewDetails(staff)}
                                className="p-2.5 text-blue-400 hover:text-blue-300 bg-[#0f0f0f] hover:bg-[#1a1a1a] rounded-xl transition-colors"
                                title="View Details"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                onClick={() => handleEdit(staff)}
                                className="p-2.5 text-orange-400 hover:text-orange-300 bg-[#0f0f0f] hover:bg-[#1a1a1a] rounded-xl transition-colors"
                                title="Edit"
                              >
                                <Pencil size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 col-span-full">
                        <p className="text-gray-400 text-sm">No staff members found.</p>
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Modals */}
        {isModalOpen && (
          <AddStaffModal
            setIsModalOpen={setIsModalOpen}
            staffMembers={staffMembers}
            setStaffMembers={setStaffMembers}
          />
        )}

        {isShowDetails && selectedStaff && (
          <EditStaffModal
            staff={selectedStaff}
            setIsShowDetails={setIsShowDetails}
            setSelectedStaff={setSelectedStaff}
            staffMembers={staffMembers}
            setStaffMembers={setStaffMembers}
            handleRemovalStaff={handleRemovalStaff}
          />
        )}

        {isRemoveModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1001]">
            <div className="bg-[#181818] rounded-xl p-6 max-w-md mx-4 text-white">
              <h3 className="text-lg font-semibold mb-4">Delete Staff</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete {staffToRemove?.firstName} {staffToRemove?.lastName}? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsRemoveModalOpen(false)}
                  className="px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#3F3F3F]"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemoveStaff}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {isPlanningModalOpen && (
          <StaffPlanningModal
            onClose={() => setIsPlanningModalOpen(false)}
            staffMembers={staffMembers}
          />
        )}

        {isAttendanceModalOpen && (
          <AttendanceOverviewModal
            onClose={() => setIsAttendanceModalOpen(false)}
            staffMembers={staffMembers}
          />
        )}

        {isVacationRequestModalOpen && (
          <VacationCalendarModal
            onClose={() => setIsVacationRequestModalOpen(false)}
            staffMembers={staffMembers}
            onSubmitRequest={handleVacationRequest}
          />
        )}

        {isHistoryModalOpen && selectedStaffForHistory && (
          <StaffHistoryModal
            onClose={() => {
              setIsHistoryModalOpen(false)
              setSelectedStaffForHistory(null)
            }}
            staff={selectedStaffForHistory}
          />
        )}

        {showDocumentModal && selectedMemberForDocuments && (
          <DocumentManagementModal
            entity={selectedMemberForDocuments}
            entityType="staff"
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
        )}

        {/* Assessment Selection Modal */}
        <AssessmentSelectionModal
          isOpen={isAssessmentSelectionModalOpen}
          onClose={() => {
            setIsAssessmentSelectionModalOpen(false)
            if (assessmentFromDocumentManagement) {
              setShowDocumentModal(true)
            }
          }}
          onSelectAssessment={handleAssessmentSelect}
          selectedLead={selectedStaff}
          fromDocumentManagement={assessmentFromDocumentManagement}
        />

        {/* Assessment Form Modal */}
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
          selectedLead={selectedStaff}
          onComplete={handleAssessmentComplete}
          fromDocumentManagement={assessmentFromDocumentManagement}
          existingDocument={editingAssessmentDocument}
          isEditMode={isEditingAssessment}
          isViewMode={isViewingAssessment}
        />

        {/* Message Type Selection Modal */}
        <MessageTypeSelectionModal
          isOpen={messageTypeModal.isOpen}
          onClose={() => setMessageTypeModal({ isOpen: false, staff: null })}
          member={messageTypeModal.staff}
          onSelectAppChat={handleOpenAppChat}
          onSelectEmail={handleOpenEmailModal}
          context="staff"
        />

        {/* Chat Popup */}
        {chatPopup.isOpen && chatPopup.staff && (
          <ChatPopup
            member={chatPopup.staff}
            isOpen={chatPopup.isOpen}
            onClose={() => setChatPopup({ isOpen: false, staff: null })}
            onOpenFullMessenger={() => handleOpenFullMessenger(chatPopup.staff)}
            context="staff"
          />
        )}

        {/* Send Email Modal */}
        <SendEmailModal
          showEmailModal={showEmailModal}
          handleCloseEmailModal={handleCloseEmailModal}
          handleSendEmail={handleSendEmail}
          setShowTemplateDropdown={setShowTemplateDropdown}
          showTemplateDropdown={showTemplateDropdown}
          selectedEmailTemplate={selectedEmailTemplate}
          emailTemplates={emailTemplates}
          handleTemplateSelect={handleTemplateSelect}
          setSelectedEmailTemplate={setSelectedEmailTemplate}
          emailData={emailData}
          setEmailData={setEmailData}
          handleSearchMemberForEmail={handleSearchStaffForEmail}
          preselectedMember={selectedStaffForEmail}
          context="staff"
        />

        {isVacationContingentModalOpen && selectedStaffForContingent && (
          <VacationContingentModal
            isOpen={isVacationContingentModalOpen}
            onClose={() => {
              setIsVacationContingentModalOpen(false)
              setSelectedStaffForContingent(null)
            }}
            staff={selectedStaffForContingent}
            onUpdateContingent={handleUpdateVacationContingent}
          />
        )}

        {/* Sidebar */}
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
          selectedMember={selectedUserForTrainingPlan}
          memberTrainingPlans={memberTrainingPlans[selectedUserForTrainingPlan?.id] || []}
          availableTrainingPlans={availableTrainingPlans}
          onAssignPlan={handleAssignTrainingPlan}
          onRemovePlan={handleRemoveTrainingPlan}
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

        {/* Staff View Details Modal */}
        <StaffViewDetailsModal
          isOpen={isViewDetailsModalOpen}
          onClose={() => {
            setIsViewDetailsModalOpen(false)
            setSelectedStaffForView(null)
          }}
          selectedStaff={selectedStaffForView}
          onEditStaff={(staff) => {
            setIsViewDetailsModalOpen(false)
            setSelectedStaffForView(null)
            handleEdit(staff)
          }}
        />

        {/* Floating Action Button - Mobile Only */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="md:hidden fixed bottom-4 right-4 bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-xl shadow-lg transition-all active:scale-95 z-30"
          aria-label="Create Staff"
        >
          <Plus size={22} />
        </button>
      </>
    </StaffContext.Provider>
  );
}
