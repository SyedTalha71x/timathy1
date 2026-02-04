/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react"
import {
  MoreVertical,
  Plus,
  ChevronDown,
  FileText,
  History,
  Search,
  Grid3X3,
  List,
  Trash2,
  AlertTriangle,
  ChevronUp,
  Filter,
  ArrowUp,
  ArrowDown,
  Pencil,
  Clock,
  Calendar,
  PauseCircle,
  PlayCircle,
  XCircle,
  RefreshCw,
  Gift,
  ArrowRightLeft,
  X,
} from "lucide-react"
import { toast, Toaster } from "react-hot-toast"
import { useNavigate, useLocation } from "react-router-dom"

import { ContractModal } from "../../components/shared/contracts/contract-modal"
import { PauseContractModal } from "../../components/studio-components/contract-components/pause-contract-modal"
import { CancelContractModal } from "../../components/studio-components/contract-components/cancel-contract-modal"
import { ContractManagement } from "../../components/studio-components/contract-components/contract-management"
import { BonusTimeModal } from "../../components/studio-components/contract-components/bonus-time-modal"
import { RenewContractModal } from "../../components/studio-components/contract-components/renew-contract-modal"
import { ChangeContractModal } from "../../components/studio-components/contract-components/change-contract-modal"
import { ContractHistoryModal } from "../../components/studio-components/contract-components/contract-history-modal"
import { DeleteContractModal } from "../../components/studio-components/contract-components/delete-contract-modal"
import { contractHistory, initialContracts, sampleLeads } from "../../utils/studio-states/contract-states"
import { DEFAULT_CONTRACT_TYPES } from "../../utils/studio-states/configuration-states"
import { leadsData } from "../../utils/studio-states/leads-states"
import { membersData } from "../../utils/studio-states"

// Status Tag Component - matches members.jsx
const StatusTag = ({ 
  status, 
  compact = false, 
  pauseReason = null, 
  pauseStartDate = null, 
  pauseEndDate = null,
  cancelReason = null,
  cancelDate = null 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-600';
      case 'Ongoing': return 'bg-gray-600';
      case 'Paused': return 'bg-yellow-600';
      case 'Cancelled': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const bgColor = getStatusColor(status);
  const hasTooltip = status === 'Paused' || status === 'Cancelled';
  const hasHoverEffect = status === 'Paused' || status === 'Cancelled';
  
  // Format date helper
  const formatD = (d) => d ? new Date(d).toLocaleDateString('de-DE') : null;

  // Build tooltip content for Paused
  const renderPauseTooltip = () => {
    if (status !== 'Paused') return null;
    return (
      <>
        {pauseReason && (
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-medium">Reason:</span>
            <span>{pauseReason}</span>
          </div>
        )}
        {pauseStartDate && pauseEndDate && (
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-medium">Period:</span>
            <span>{formatD(pauseStartDate)} - {formatD(pauseEndDate)}</span>
          </div>
        )}
        {pauseStartDate && !pauseEndDate && (
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-medium">Since:</span>
            <span>{formatD(pauseStartDate)}</span>
          </div>
        )}
        {!pauseReason && !pauseStartDate && (
          <span>Contract is paused</span>
        )}
      </>
    );
  };

  // Build tooltip content for Cancelled
  const renderCancelTooltip = () => {
    if (status !== 'Cancelled') return null;
    return (
      <>
        {cancelReason && (
          <div className="flex items-center gap-2">
            <span className="text-red-400 font-medium">Reason:</span>
            <span>{cancelReason}</span>
          </div>
        )}
        {cancelDate && (
          <div className="flex items-center gap-2">
            <span className="text-red-400 font-medium">Cancelled:</span>
            <span>{formatD(cancelDate)}</span>
          </div>
        )}
        {!cancelReason && !cancelDate && (
          <span>Contract was cancelled</span>
        )}
      </>
    );
  };

  if (compact) {
    return (
      <div className={`relative ${hasTooltip ? 'group' : ''}`}>
        <div className={`inline-flex items-center gap-1 ${bgColor} text-white px-2 py-1 rounded-lg text-xs font-medium transition-transform duration-200 ${hasHoverEffect ? 'cursor-pointer hover:scale-110' : ''}`}>
          <span className="truncate max-w-[140px]">{status}</span>
        </div>
        {/* Custom Tooltip */}
        {hasTooltip && (
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/95 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg pointer-events-none">
            <div className="flex flex-col gap-1">
              {renderPauseTooltip()}
              {renderCancelTooltip()}
            </div>
            {/* Arrow pointing up */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/95" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${hasTooltip ? 'group' : ''}`}>
      <div className={`inline-flex items-center gap-2 ${bgColor} text-white px-3 py-1.5 rounded-xl text-xs font-medium transition-transform duration-200 ${hasHoverEffect ? 'cursor-pointer hover:scale-110' : ''}`}>
        <span>{status}</span>
      </div>
      {/* Custom Tooltip */}
      {hasTooltip && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/95 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg pointer-events-none">
          <div className="flex flex-col gap-1">
            {renderPauseTooltip()}
            {renderCancelTooltip()}
          </div>
          {/* Arrow pointing up */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/95" />
        </div>
      )}
    </div>
  );
};

// Initials Avatar Component - matches members.jsx
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
      className={`bg-orange-500 rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0 ${sizeClasses[size]} ${className}`}
      style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
    >
      {getInitials()}
    </div>
  )
};

export default function ContractList() {
  const navigate = useNavigate()
  const location = useLocation()

  // View and display states
  const [viewMode, setViewMode] = useState("list")
  const [isCompactView, setIsCompactView] = useState(false)
  const [expandedMobileRowId, setExpandedMobileRowId] = useState(null)
  const [expandedCompactId, setExpandedCompactId] = useState(null)

  // Contract data
  const [contracts, setContracts] = useState(initialContracts)
  
  // Leads and Members data for conversion
  const [leads, setLeads] = useState(leadsData)
  const [members, setMembers] = useState(membersData)
  
  // Search states - matches members.jsx
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const searchDropdownRef = useRef(null)
  const searchInputRef = useRef(null)
  
  // Member filters - array of filtered members (can be multiple)
  const [memberFilters, setMemberFilters] = useState([])
  // [{ memberId: string, memberName: string }, ...]

  // Filter states
  const [filterStatus, setFilterStatus] = useState("all")
  const [filtersExpanded, setFiltersExpanded] = useState(false)

  // Sort states - matches members.jsx pattern
  const [sortBy, setSortBy] = useState("expiring")
  const [sortDirection, setSortDirection] = useState("asc")
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [showMobileSortDropdown, setShowMobileSortDropdown] = useState(false)
  const sortDropdownRef = useRef(null)
  const mobileSortDropdownRef = useRef(null)

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedContract, setSelectedContract] = useState(null)
  const [activeDropdownId, setActiveDropdownId] = useState(null)
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [contractToDelete, setContractToDelete] = useState(null)
  const [isEditModalOpenContract, setIsEditModalOpenContract] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false)
  const [isBonusTimeModalOpen, setIsBonusTimeModalOpen] = useState(false)
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false)
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)

  // Sort options - matches members.jsx pattern
  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "contractType", label: "Contract Type" },
    { value: "status", label: "Status" },
    { value: "expiring", label: "Expiring" },
    { value: "recentlyAdded", label: "Recently Added" },
  ]

  // Get current sort label
  const currentSortLabel = sortOptions.find(o => o.value === sortBy)?.label || "Name"

  // Get sort icon based on current sort
  const getSortIcon = () => {
    return sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
  }

  // Handle sort option click - toggle direction if same option
  const handleSortOptionClick = (value) => {
    if (sortBy === value) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(value)
      setSortDirection('asc')
    }
    setShowSortDropdown(false)
    setShowMobileSortDropdown(false)
  }

  // Helper functions
  const getFirstAndLastName = (fullName) => {
    const parts = fullName?.trim().split(" ") || []
    const firstName = parts[0] || ""
    const lastName = parts.length > 1 ? parts[parts.length - 1] : ""
    return { firstName, lastName }
  }

  const isContractExpired = (endDate) => {
    const today = new Date()
    const contractEndDate = new Date(endDate)
    return today > contractEndDate
  }

  const isContractExpiringSoon = (endDate) => {
    const today = new Date()
    const contractEndDate = new Date(endDate)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return contractEndDate <= thirtyDaysFromNow && contractEndDate > today
  }

  // Check if contract should show expiring warning
  // For auto-renewal contracts: only show if not indefinite and autoRenewalEndDate is approaching
  const shouldShowExpiring = (contract) => {
    // If no auto-renewal, use normal expiring logic
    if (!contract.autoRenewal) {
      return isContractExpiringSoon(contract.endDate)
    }
    
    // If renewal is indefinite, never show expiring
    if (contract.renewalIndefinite === true) {
      return false
    }
    
    // If auto-renewal with end date (limited renewal), check the final end date
    if (contract.autoRenewalEndDate) {
      return isContractExpiringSoon(contract.autoRenewalEndDate)
    }
    
    // Auto-renewal without end date set - never show expiring (assume unlimited)
    return false
  }

  // Check if contract should show expired warning
  const shouldShowExpired = (contract) => {
    // If no auto-renewal, use normal expired logic
    if (!contract.autoRenewal) {
      return isContractExpired(contract.endDate)
    }
    
    // If renewal is indefinite, never show expired
    if (contract.renewalIndefinite === true) {
      return false
    }
    
    // If auto-renewal with end date, check the final end date
    if (contract.autoRenewalEndDate) {
      return isContractExpired(contract.autoRenewalEndDate)
    }
    
    // Auto-renewal without end date - never show expired
    return false
  }

  // Get auto renewal display info for a contract
  const getAutoRenewalInfo = (contract) => {
    if (!contract.autoRenewal) {
      return { hasRenewal: false, label: "No", tooltip: "No auto renewal" }
    }
    
    // Check if renewal is indefinite (from contract or lookup from contract type)
    const isIndefinite = contract.renewalIndefinite === true
    
    if (isIndefinite) {
      return { 
        hasRenewal: true, 
        label: "Yes", 
        sublabel: "unlimited",
        tooltip: "Unlimited auto renewal" 
      }
    }
    
    // Limited renewal - show the renewal period or end date
    if (contract.autoRenewalEndDate) {
      return { 
        hasRenewal: true, 
        label: "Yes", 
        sublabel: `until ${formatDate(contract.autoRenewalEndDate)}`,
        tooltip: `Auto renewal until ${formatDate(contract.autoRenewalEndDate)}` 
      }
    }
    
    // Lookup from contract type if available
    const contractType = DEFAULT_CONTRACT_TYPES.find(t => t.name === contract.contractType)
    if (contractType?.renewalPeriod) {
      return { 
        hasRenewal: true, 
        label: "Yes", 
        sublabel: `+${contractType.renewalPeriod} months`,
        tooltip: `Renews for ${contractType.renewalPeriod} months` 
      }
    }
    
    // Fallback
    return { hasRenewal: true, label: "Yes", sublabel: "", tooltip: "Auto renewal enabled" }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('de-DE')
  }

  // Get unique members from contracts for search suggestions
  const getUniqueMembersFromContracts = () => {
    const memberMap = new Map()
    contracts.forEach(contract => {
      if (!memberMap.has(contract.memberId)) {
        memberMap.set(contract.memberId, {
          memberId: contract.memberId,
          memberName: contract.memberName,
          contractType: contract.contractType,
        })
      }
    })
    return Array.from(memberMap.values())
  }

  // Get search suggestions based on query (exclude already filtered members)
  const getSearchSuggestions = () => {
    if (!searchQuery.trim()) return []
    const uniqueMembers = getUniqueMembersFromContracts()
    return uniqueMembers.filter((member) => {
      // Exclude already filtered members
      const isAlreadyFiltered = memberFilters.some(f => f.memberId === member.memberId)
      if (isAlreadyFiltered) return false
      
      return member.memberName.toLowerCase().includes(searchQuery.toLowerCase())
    }).slice(0, 6)
  }

  // Handle selecting a member from search suggestions
  const handleSelectMember = (member) => {
    setMemberFilters([...memberFilters, {
      memberId: member.memberId,
      memberName: member.memberName
    }])
    setSearchQuery("")
    setShowSearchDropdown(false)
    searchInputRef.current?.focus()
  }

  // Handle removing a member filter
  const handleRemoveFilter = (memberId) => {
    setMemberFilters(memberFilters.filter(f => f.memberId !== memberId))
  }

  // Handle keyboard navigation
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Backspace' && !searchQuery && memberFilters.length > 0) {
      // Remove last filter when backspace is pressed with empty input
      setMemberFilters(memberFilters.slice(0, -1))
    } else if (e.key === 'Escape') {
      setShowSearchDropdown(false)
    }
  }

  // Filter and sort contracts
  const filteredAndSortedContracts = () => {
    let filtered = [...contracts]

    // Helper to get the "display" contract for a member (Active > Paused > Ongoing > most recent Cancelled)
    const getDisplayContractForMember = (memberContracts) => {
      if (memberContracts.length === 0) return null
      
      const active = memberContracts.find(c => c.status === 'Active')
      if (active) return active
      
      const paused = memberContracts.find(c => c.status === 'Paused')
      if (paused) return paused
      
      const ongoing = memberContracts.find(c => c.status === 'Ongoing')
      if (ongoing) return ongoing
      
      // Return most recent cancelled
      const cancelled = memberContracts
        .filter(c => c.status === 'Cancelled')
        .sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
      
      return cancelled[0] || null
    }

    // If memberFilters are active, show only those members' contracts
    if (memberFilters.length > 0) {
      const filterIds = memberFilters.map(f => f.memberId)
      filtered = filtered.filter(contract => filterIds.includes(contract.memberId))
    }

    // For "all" filter (and no member filters), show only the most relevant contract per member
    if (filterStatus === "all" && memberFilters.length === 0) {
      // Group by memberId
      const memberMap = new Map()
      filtered.forEach(contract => {
        const memberId = contract.memberId
        if (!memberMap.has(memberId)) {
          memberMap.set(memberId, [])
        }
        memberMap.get(memberId).push(contract)
      })
      
      // Get display contract for each member
      filtered = []
      memberMap.forEach((memberContracts) => {
        const displayContract = getDisplayContractForMember(memberContracts)
        if (displayContract) {
          filtered.push(displayContract)
        }
      })
    } else if (filterStatus !== "all") {
      // Apply specific status filter - show all matching contracts
      filtered = filtered.filter(contract => {
        if (filterStatus === "active") return contract.status === "Active"
        if (filterStatus === "ongoing") return contract.status === "Ongoing"
        if (filterStatus === "paused") return contract.status === "Paused"
        if (filterStatus === "cancelled") return contract.status === "Cancelled"
        return true
      })
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "name":
          comparison = a.memberName.localeCompare(b.memberName)
          break
        case "contractType":
          comparison = a.contractType.localeCompare(b.contractType)
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
        case "expiring":
          // Put expired contracts at the end, sort non-expired by end date (soonest first)
          const today = new Date()
          const aEndDate = new Date(a.endDate)
          const bEndDate = new Date(b.endDate)
          const aExpired = aEndDate < today
          const bExpired = bEndDate < today
          
          if (aExpired && !bExpired) {
            comparison = 1 // a (expired) goes after b (not expired)
          } else if (!aExpired && bExpired) {
            comparison = -1 // a (not expired) goes before b (expired)
          } else {
            // Both expired or both not expired - sort by end date
            comparison = aEndDate - bEndDate
          }
          break
        case "recentlyAdded":
          comparison = new Date(b.startDate) - new Date(a.startDate)
          break
        default:
          comparison = a.memberName.localeCompare(b.memberName)
      }
      return sortDirection === "asc" ? comparison : -comparison
    })

    return filtered
  }

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
        setShowSearchDropdown(false)
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false)
      }
      if (mobileSortDropdownRef.current && !mobileSortDropdownRef.current.contains(event.target)) {
        setShowMobileSortDropdown(false)
      }
      if (!event.target.closest(".dropdown-trigger") && !event.target.closest(".dropdown-menu")) {
        setActiveDropdownId(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle navigation state from other pages (e.g., Leads)
  useEffect(() => {
    if (location.state?.filterMemberId) {
      // Set filter for the member from another page (e.g., Leads, Expiring Contracts Widget)
      setMemberFilters([{
        memberId: location.state.filterMemberId,
        memberName: location.state.filterMemberName || 'Member'
      }])
      // Clear the navigation state to prevent re-filtering on refresh
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Check if any modal is open
      const anyModalOpen =
        isModalOpen ||
        isPauseModalOpen ||
        isCancelModalOpen ||
        isDeleteModalOpen ||
        isEditModalOpenContract ||
        isDocumentModalOpen ||
        isBonusTimeModalOpen ||
        isRenewModalOpen ||
        isChangeModalOpen ||
        isHistoryModalOpen;

      // ESC key - Close modals
      if (e.key === 'Escape') {
        e.preventDefault();
        if (isModalOpen) setIsModalOpen(false);
        else if (isPauseModalOpen) setIsPauseModalOpen(false);
        else if (isCancelModalOpen) setIsCancelModalOpen(false);
        else if (isDeleteModalOpen) setIsDeleteModalOpen(false);
        else if (isEditModalOpenContract) setIsEditModalOpenContract(false);
        else if (isDocumentModalOpen) setIsDocumentModalOpen(false);
        else if (isBonusTimeModalOpen) setIsBonusTimeModalOpen(false);
        else if (isRenewModalOpen) setIsRenewModalOpen(false);
        else if (isChangeModalOpen) setIsChangeModalOpen(false);
        else if (isHistoryModalOpen) setIsHistoryModalOpen(false);
        return;
      }

      if (anyModalOpen) return;

      // C key - Create Contract
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setSelectedLead(null);
        setIsModalOpen(true);
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
    isModalOpen,
    isPauseModalOpen,
    isCancelModalOpen,
    isDeleteModalOpen,
    isEditModalOpenContract,
    isDocumentModalOpen,
    isBonusTimeModalOpen,
    isRenewModalOpen,
    isChangeModalOpen,
    isHistoryModalOpen
  ]);

  // Contract handlers
  const handleEditContract = (contract) => {
    setSelectedContract(contract)
    setIsEditModalOpenContract(true)
  }

  const handlePauseContract = (contractId) => {
    setSelectedContract(contracts.find((c) => c.id === contractId))
    setIsPauseModalOpen(true)
  }

  const handleResumeContract = (contractId) => {
    setContracts(contracts.map((c) =>
      c.id === contractId ? { ...c, status: "Active", pauseReason: null } : c
    ))
    toast.success("Contract resumed successfully")
  }

  const handleCancelContract = (contractId) => {
    setSelectedContract(contracts.find((c) => c.id === contractId))
    setIsCancelModalOpen(true)
  }

  const handleDeleteContract = (contractId) => {
    const contract = contracts.find((c) => c.id === contractId)
    setContractToDelete(contract)
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteContract = () => {
    if (contractToDelete) {
      setContracts(contracts.filter((c) => c.id !== contractToDelete.id))
      toast.success("Contract deleted successfully")
      setIsDeleteModalOpen(false)
      setContractToDelete(null)
    }
  }

  const handleManageDocuments = (contract) => {
    setSelectedContract(contract)
    setIsDocumentModalOpen(true)
  }

  const handleAddBonusTime = (contractId) => {
    setSelectedContract(contracts.find((c) => c.id === contractId))
    setIsBonusTimeModalOpen(true)
  }

  const handleRenewContract = (contractId) => {
    setSelectedContract(contracts.find((c) => c.id === contractId))
    setIsRenewModalOpen(true)
  }

  const handleChangeContract = (contractId) => {
    setSelectedContract(contracts.find((c) => c.id === contractId))
    setIsChangeModalOpen(true)
  }

  const handleViewHistory = (contractId) => {
    setSelectedContract(contracts.find((c) => c.id === contractId))
    setIsHistoryModalOpen(true)
  }

  const handleAddContract = () => {
    setSelectedLead(null)
    setIsModalOpen(true)
  }

  const handleSaveNewContract = (contractData) => {
    // Check if this is the new format (full contract object from ContractFormFillModal)
    // New format has contractFormSnapshot or formData property
    const isNewFormat = !!(contractData.contractFormSnapshot || contractData.formData || contractData.contractNumber)
    
    let newContract
    
    if (isNewFormat) {
      // New format: Full contract object from ContractFormFillModal
      newContract = {
        id: contractData.id || `12321-${contracts.length + 1}`,
        contractNumber: contractData.contractNumber || `C-${Date.now()}`,
        memberName: contractData.memberName,
        memberId: contractData.memberId || `M-${Date.now()}`,
        contractType: contractData.contractType,
        startDate: contractData.startDate,
        endDate: contractData.endDate,
        trainingStartDate: contractData.trainingStartDate,
        status: contractData.status || "Active",
        autoRenewal: contractData.autoRenewal || false,
        cost: contractData.cost,
        billingPeriod: contractData.billingPeriod,
        email: contractData.email,
        phone: contractData.phone,
        iban: contractData.iban,
        bic: contractData.bic,
        sepaMandate: contractData.sepaMandate,
        address: contractData.address || {},
        discount: contractData.discount,
        // Store the form data for PDF generation
        formData: contractData.formData,
        contractFormSnapshot: contractData.contractFormSnapshot,
        files: contractData.files || [],
        isDigital: contractData.isDigital,
        isDraft: contractData.isDraft || false,
        dateOfBirth: contractData.dateOfBirth,
        bankName: contractData.bankName,
        salutation: contractData.salutation,
        pauseReason: null,
        cancelReason: null,
      }
    } else {
      // Legacy format: Basic contract data from old flow
      newContract = {
        id: `12321-${contracts.length + 1}`,
        memberName: contractData.fullName,
        contractType: contractData.rateType || "Basic",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
        status: "Active",
        pauseReason: null,
        cancelReason: null,
        isDigital: contractData.isDigital,
        email: contractData.email,
        phone: contractData.phone,
        iban: contractData.iban,
        sepaMandate: contractData.sepaMandate,
        files: contractData.signedFile ? [contractData.signedFile] : [],
        autoRenewal: contractData.autoRenewal || false,
      }
    }
    
    setContracts([...contracts, newContract])
    setIsModalOpen(false)
    
    // Set filter to show the newly created contract's member
    setMemberFilters([{
      memberId: newContract.memberId,
      memberName: newContract.memberName
    }])
    
    // Lead-to-Member Conversion Logic
    // Only convert when contract status is "Active" (not "Ongoing")
    const contractStatus = newContract.status || "Active"
    const leadId = contractData.leadId || contractData.memberId
    
    if (contractStatus === "Active" && leadId) {
      // Find the lead to convert
      const leadToConvert = leads.find(lead => 
        lead.id === leadId || 
        lead.leadId === leadId ||
        `${lead.firstName} ${lead.lastName}` === newContract.memberName
      )
      
      if (leadToConvert) {
        // Create new member from lead data
        const newMember = {
          id: newContract.memberId || `member-${Date.now()}`,
          firstName: leadToConvert.firstName || contractData.firstName || newContract.memberName?.split(' ')[0] || '',
          lastName: leadToConvert.lastName || contractData.lastName || newContract.memberName?.split(' ').slice(1).join(' ') || '',
          title: newContract.memberName,
          email: leadToConvert.email || contractData.email || newContract.email || '',
          phone: leadToConvert.phoneNumber || leadToConvert.telephoneNumber || contractData.phone || newContract.phone || '',
          phoneNumber: leadToConvert.phoneNumber || leadToConvert.telephoneNumber || contractData.phone || newContract.phone || '',
          street: leadToConvert.street || contractData.address?.street || '',
          zipCode: leadToConvert.zipCode || contractData.address?.zipCode || '',
          city: leadToConvert.city || contractData.address?.city || '',
          country: leadToConvert.country || '',
          birthday: leadToConvert.birthday || contractData.dateOfBirth || '',
          gender: leadToConvert.gender || '',
          status: 'active',
          memberType: 'member',
          memberSince: newContract.startDate || new Date().toISOString().split('T')[0],
          contractType: newContract.contractType,
          image: leadToConvert.avatar || null,
          notes: leadToConvert.notes || [],
          // Banking info
          iban: contractData.iban || newContract.iban || '',
          bic: contractData.bic || newContract.bic || '',
          bankName: contractData.bankName || newContract.bankName || '',
          // Additional data from lead
          source: leadToConvert.source || leadToConvert.leadSource || '',
          convertedFromLead: true,
          originalLeadId: leadToConvert.id,
          convertedAt: new Date().toISOString(),
        }
        
        // Add new member
        setMembers(prevMembers => [...prevMembers, newMember])
        
        // Remove lead from leads list
        setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadToConvert.id))
        
        toast.success(`Lead "${newContract.memberName}" converted to member!`)
      }
    } else if (contractStatus === "Ongoing") {
      // For Ongoing contracts, keep the lead - no conversion yet
      toast.info("Contract saved as draft. Lead will be converted when contract is activated.")
    }
    
    // Toast is handled by contract-modal.jsx for new format
    if (!isNewFormat) {
      toast.success("Contract added successfully")
    }
  }

  const handleSaveEditedContract = (updatedContract) => {
    setContracts(contracts.map((c) => (c.id === updatedContract.id ? updatedContract : c)))
    setIsEditModalOpenContract(false)
    toast.success("Contract updated successfully")
  }

  const handlePauseReasonSubmit = ({ reason, startDate, endDate }) => {
    if (selectedContract) {
      setContracts(contracts.map((c) =>
        c.id === selectedContract.id 
          ? { ...c, status: "Paused", pauseReason: reason, pauseStartDate: startDate, pauseEndDate: endDate } 
          : c
      ))
    }
    setIsPauseModalOpen(false)
    setSelectedContract(null)
    toast.success("Contract has been paused")
  }

  const handleCancelSubmit = ({ reason, cancelDate }) => {
    if (selectedContract) {
      setContracts(contracts.map((c) =>
        c.id === selectedContract.id ? { ...c, status: "Cancelled", cancelReason: reason } : c
      ))
    }
    setIsCancelModalOpen(false)
    setSelectedContract(null)
    toast.success("Contract has been cancelled")
  }

  const handleRenewSubmit = (renewalData) => {
    if (selectedContract) {
      const startDate = renewalData.startAfterCurrent
        ? new Date(selectedContract.endDate)
        : new Date(renewalData.customStartDate)
      const endDate = new Date(startDate)
      endDate.setMonth(endDate.getMonth() + Number.parseInt(renewalData.duration))

      setContracts(contracts.map((c) =>
        c.id === selectedContract.id
          ? { ...c, contractType: renewalData.contractType, endDate: endDate.toISOString().split("T")[0], status: "Active" }
          : c
      ))
    }
    setIsRenewModalOpen(false)
    setSelectedContract(null)
    toast.success("Contract renewed successfully")
  }

  const handleChangeSubmit = (changeData) => {
    if (selectedContract) {
      setContracts(contracts.map((c) =>
        c.id === selectedContract.id ? { ...c, contractType: changeData.newContractType } : c
      ))
    }
    setIsChangeModalOpen(false)
    setSelectedContract(null)
    toast.success("Contract changed successfully")
  }

  const toggleDropdownContract = (contractId, event) => {
    event.stopPropagation()
    setActiveDropdownId(activeDropdownId === contractId ? null : contractId)
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: { background: "#333", color: "#fff" },
        }}
      />

      <div className="flex flex-col lg:flex-row rounded-3xl bg-[#1C1C1C] transition-all duration-500 text-white relative select-none">
        <div className="flex-1 min-w-0 md:p-6 p-4 pb-36">
          {/* Header - matches members.jsx */}
          <div className="flex sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-white oxanium_font text-xl md:text-2xl">Contracts</h1>
              
              {/* Sort Button - Mobile: next to title */}
              <div className="lg:hidden relative" ref={mobileSortDropdownRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMobileSortDropdown(!showMobileSortDropdown)
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
                      <div className="px-3 py-1.5 text-xs text-gray-500 font-medium border-b border-gray-700">Sort by</div>
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSortOptionClick(option.value)
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-800 transition-colors flex items-center justify-between ${sortBy === option.value ? 'text-white bg-gray-800/50' : 'text-gray-300'}`}
                        >
                          <span>{option.label}</span>
                          {sortBy === option.value && (
                            <span className="text-gray-400">
                              {sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
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
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}
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
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}
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
                    className="p-2 rounded-lg transition-colors flex items-center gap-1 text-orange-500"
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
              <div className="hidden lg:block relative group">
                <button
                  onClick={handleAddContract}
                  className="flex bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm text-white px-3 sm:px-4 py-2 rounded-xl items-center gap-2 justify-center transition-colors"
                >
                  <Plus size={14} className="sm:w-4 sm:h-4" />
                  <span className='hidden sm:inline'>Create Contract</span>
                </button>
                
                {/* Tooltip - YouTube Style */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                  <span className="font-medium">Create Contract</span>
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
                className="bg-[#141414] rounded-xl px-3 py-2 min-h-[42px] flex flex-wrap items-center gap-1.5 border border-[#333333] focus-within:border-[#3F74FF] transition-colors cursor-text"
                onClick={() => searchInputRef.current?.focus()}
              >
                <Search className="text-gray-400 flex-shrink-0" size={16} />
                
                {/* Filter Chips */}
                {memberFilters.map((filter) => (
                  <div 
                    key={filter.memberId}
                    className="flex items-center gap-1.5 bg-[#3F74FF]/20 border border-[#3F74FF]/40 rounded-lg px-2 py-1 text-sm"
                  >
                    <div className="w-5 h-5 rounded bg-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                      <FileText size={12} className="text-orange-400" />
                    </div>
                    <span className="text-white text-xs whitespace-nowrap">{filter.memberName}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFilter(filter.memberId);
                      }}
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
                  placeholder={memberFilters.length > 0 ? "Add more..." : "Search contracts..."}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowSearchDropdown(true)
                  }}
                  onFocus={() => searchQuery && setShowSearchDropdown(true)}
                  onKeyDown={handleSearchKeyDown}
                  className="flex-1 min-w-[100px] bg-transparent outline-none text-sm text-white placeholder-gray-500"
                />
                
                {/* Clear All Button */}
                {memberFilters.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setMemberFilters([])
                    }}
                    className="p-1 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                    title="Clear all filters"
                  >
                    <X size={14} className="text-gray-400 hover:text-white" />
                  </button>
                )}
              </div>
              
              {/* Autocomplete Dropdown */}
              {showSearchDropdown && searchQuery.trim() && getSearchSuggestions().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-[#333333] rounded-xl shadow-lg z-50 overflow-hidden">
                  {getSearchSuggestions().map((member) => (
                    <button
                      key={member.memberId}
                      onClick={() => handleSelectMember(member)}
                      className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-[#252525] transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                        <FileText size={16} className="text-orange-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{member.memberName}</p>
                        <p className="text-xs text-gray-500 truncate">{member.contractType}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {/* No results message */}
              {showSearchDropdown && searchQuery.trim() && getSearchSuggestions().length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-[#333333] rounded-xl shadow-lg z-50 p-3">
                  <p className="text-sm text-gray-500 text-center">No members found</p>
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
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Filter size={14} />
                <span className="text-xs sm:text-sm font-medium">Filters</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${filtersExpanded ? 'rotate-180' : ''}`}
                />
                {!filtersExpanded && filterStatus !== 'all' && (
                  <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">1</span>
                )}
              </button>

              {/* Sort Controls - Desktop only, always visible */}
              <div className="hidden lg:block relative" ref={sortDropdownRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowSortDropdown(!showSortDropdown)
                  }}
                  className="px-3 sm:px-4 py-1.5 bg-[#2F2F2F] text-gray-300 rounded-xl text-xs sm:text-sm hover:bg-[#3F3F3F] transition-colors flex items-center gap-2"
                >
                  {getSortIcon()}
                  <span>{currentSortLabel}</span>
                </button>

                {/* Sort Dropdown - Desktop */}
                {showSortDropdown && (
                  <div className="absolute top-full right-0 mt-1 bg-[#1F1F1F] border border-gray-700 rounded-lg shadow-lg z-50 min-w-[180px]">
                    <div className="py-1">
                      <div className="px-3 py-1.5 text-xs text-gray-500 font-medium border-b border-gray-700">Sort by</div>
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSortOptionClick(option.value)
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-800 transition-colors flex items-center justify-between ${sortBy === option.value ? 'text-white bg-gray-800/50' : 'text-gray-300'}`}
                        >
                          <span>{option.label}</span>
                          {sortBy === option.value && (
                            <span className="text-gray-400">
                              {sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
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
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${filterStatus === 'all' ? "bg-blue-600 text-white" : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"}`}
                >
                  All ({new Set(contracts.map(c => c.memberId)).size})
                </button>
                <button
                  onClick={() => setFilterStatus('active')}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${filterStatus === 'active' ? "bg-blue-600 text-white" : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"}`}
                >
                  Active ({contracts.filter((c) => c.status === "Active").length})
                </button>
                <button
                  onClick={() => setFilterStatus('ongoing')}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${filterStatus === 'ongoing' ? "bg-blue-600 text-white" : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"}`}
                >
                  Ongoing ({contracts.filter((c) => c.status === "Ongoing").length})
                </button>
                <button
                  onClick={() => setFilterStatus('paused')}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${filterStatus === 'paused' ? "bg-blue-600 text-white" : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"}`}
                >
                  Paused ({contracts.filter((c) => c.status === "Paused").length})
                </button>
                <button
                  onClick={() => setFilterStatus('cancelled')}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${filterStatus === 'cancelled' ? "bg-blue-600 text-white" : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"}`}
                >
                  Cancelled ({contracts.filter((c) => c.status === "Cancelled").length})
                </button>
              </div>
            </div>
          </div>

        {/* Content */}
        <div className="open_sans_font">
          {viewMode === "list" ? (
            // LIST VIEW
            isCompactView ? (
              // COMPACT LIST VIEW - Mobile
              <div className="space-y-2">
                {filteredAndSortedContracts().length > 0 ? (
                  filteredAndSortedContracts().map((contract) => (
                    <div key={contract.id} className="bg-[#161616] rounded-xl overflow-hidden">
                      {/* Collapsed Row */}
                      <div
                        className="p-3 cursor-pointer"
                        onClick={() => setExpandedMobileRowId(expandedMobileRowId === contract.id ? null : contract.id)}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleManageDocuments(contract); }}
                            className="w-9 h-9 bg-[#2a2a2a] rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-[#3a3a3a] transition-colors"
                            title="Open Contract Documents"
                          >
                            <FileText size={18} className="text-orange-400" />
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium text-sm truncate">{contract.memberName}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <StatusTag status={contract.status} compact={true} pauseReason={contract.pauseReason} pauseStartDate={contract.pauseStartDate} pauseEndDate={contract.pauseEndDate} cancelReason={contract.cancelReason} cancelDate={contract.cancelDate} />
                              <span className="text-gray-400 text-xs">{contract.contractType}</span>
                            </div>
                          </div>
                          <ChevronDown
                            size={18}
                            className={`text-gray-500 transition-transform duration-200 ${expandedMobileRowId === contract.id ? 'rotate-180' : ''}`}
                          />
                        </div>
                      </div>

                      {/* Expandable Actions Panel */}
                      <div className={`overflow-hidden transition-all duration-200 ease-in-out ${expandedMobileRowId === contract.id ? 'max-h-56 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-3 pb-3 pt-1">
                          <div className="bg-[#0f0f0f] rounded-xl p-2">
                            {/* Contract Info */}
                            <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-300">
                                {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                              </span>
                              {shouldShowExpiring(contract) && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                                  Expiring
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-3 gap-1">
                              {contract.status === "Ongoing" ? (
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleEditContract(contract); }}
                                  className="flex flex-col items-center gap-1 p-2 text-orange-400 hover:text-orange-300 hover:bg-white/5 rounded-lg transition-colors"
                                >
                                  <Pencil size={18} />
                                  <span className="text-[10px]">Edit</span>
                                </button>
                              ) : (
                                <div className="p-2" />
                              )}
                              <button
                                onClick={(e) => { e.stopPropagation(); handleViewHistory(contract.id); }}
                                className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                              >
                                <History size={18} />
                                <span className="text-[10px]">History</span>
                              </button>
                              <div className="p-2" />
                            </div>
                            {/* Status-based action buttons */}
                            <div className="grid grid-cols-4 gap-1 mt-1">
                              {/* Ongoing: only Delete */}
                              {contract.status === "Ongoing" && (
                                <>
                                  <div className="p-2" />
                                  <div className="p-2" />
                                  <div className="p-2" />
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteContract(contract.id); }}
                                    className="flex flex-col items-center gap-1 p-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors"
                                  >
                                    <Trash2 size={18} />
                                    <span className="text-[10px]">Delete</span>
                                  </button>
                                </>
                              )}

                              {/* Cancelled: only Renew */}
                              {contract.status === "Cancelled" && (
                                <>
                                  <div className="p-2" />
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleRenewContract(contract.id); }}
                                    className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                  >
                                    <RefreshCw size={18} />
                                    <span className="text-[10px]">Renew</span>
                                  </button>
                                  <div className="p-2" />
                                  <div className="p-2" />
                                </>
                              )}

                              {/* Paused: Resume, Renew, Cancel */}
                              {contract.status === "Paused" && (
                                <>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleResumeContract(contract.id); }}
                                    className="flex flex-col items-center gap-1 p-2 text-orange-400 hover:text-orange-300 hover:bg-white/5 rounded-lg transition-colors"
                                  >
                                    <PlayCircle size={18} />
                                    <span className="text-[10px]">Resume</span>
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleRenewContract(contract.id); }}
                                    className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                  >
                                    <RefreshCw size={18} />
                                    <span className="text-[10px]">Renew</span>
                                  </button>
                                  <div className="p-2" />
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleCancelContract(contract.id); }}
                                    className="flex flex-col items-center gap-1 p-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors"
                                  >
                                    <XCircle size={18} />
                                    <span className="text-[10px]">Cancel</span>
                                  </button>
                                </>
                              )}

                              {/* Active: Pause, Renew, Cancel */}
                              {contract.status === "Active" && (
                                <>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handlePauseContract(contract.id); }}
                                    className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                  >
                                    <PauseCircle size={18} />
                                    <span className="text-[10px]">Pause</span>
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleRenewContract(contract.id); }}
                                    className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                  >
                                    <RefreshCw size={18} />
                                    <span className="text-[10px]">Renew</span>
                                  </button>
                                  <div className="p-2" />
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleCancelContract(contract.id); }}
                                    className="flex flex-col items-center gap-1 p-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors"
                                  >
                                    <XCircle size={18} />
                                    <span className="text-[10px]">Cancel</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm">No contracts found.</p>
                  </div>
                )}
              </div>
            ) : (
              // DETAILED LIST VIEW - Desktop Table
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block">
                  <div className="bg-[#161616] rounded-xl overflow-visible">
                    {/* Table Header */}
                    <div className="grid grid-cols-[auto_2fr_1fr_1fr_0.8fr_1.5fr_auto] gap-4 px-4 py-3 bg-[#0f0f0f] text-gray-400 text-sm font-medium border-b border-gray-800 rounded-t-xl">
                      <div className="w-20 text-center pr-4">Contract</div>
                      <div>Member</div>
                      <div>Contract Type</div>
                      <div>Status</div>
                      <div>Auto Renewal</div>
                      <div>Duration</div>
                      <div className="w-24 text-right">Actions</div>
                    </div>

                    {/* Table Body */}
                    {filteredAndSortedContracts().length > 0 ? (
                      filteredAndSortedContracts().map((contract) => (
                        <div
                          key={contract.id}
                          className="grid grid-cols-[auto_2fr_1fr_1fr_0.8fr_1.5fr_auto] gap-4 px-4 py-3 items-center border-b border-gray-800/50 hover:bg-[#1a1a1a] transition-colors"
                        >
                          <div className="w-20 flex items-center justify-center pr-4">
                            <button
                              onClick={() => handleManageDocuments(contract)}
                              className="w-10 h-10 bg-[#2a2a2a] rounded-xl flex items-center justify-center hover:bg-[#3a3a3a] transition-colors cursor-pointer"
                              title="Open Contract Documents"
                            >
                              <FileText size={20} className="text-orange-400" />
                            </button>
                          </div>
                          <div className="flex items-center">
                            <span className="text-white font-medium">{contract.memberName}</span>
                          </div>
                          <div className="text-gray-300">{contract.contractType}</div>
                          <div><StatusTag status={contract.status} compact={true} pauseReason={contract.pauseReason} pauseStartDate={contract.pauseStartDate} pauseEndDate={contract.pauseEndDate} cancelReason={contract.cancelReason} cancelDate={contract.cancelDate} /></div>
                          <div className="text-gray-300 text-sm">
                            {(() => {
                              const renewalInfo = getAutoRenewalInfo(contract)
                              return renewalInfo.hasRenewal ? (
                                <div className="relative group inline-flex">
                                  <span className="text-orange-400 flex items-center gap-1 cursor-pointer transition-transform duration-200 hover:scale-110">
                                    <RefreshCw size={12} /> Yes
                                  </span>
                                  {/* Custom Tooltip */}
                                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/95 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg pointer-events-none">
                                    <div className="flex items-center gap-2">
                                      <RefreshCw size={10} className="text-orange-400" />
                                      <span>{renewalInfo.tooltip}</span>
                                    </div>
                                    {/* Arrow */}
                                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/95" />
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-500">No</span>
                              )
                            })()}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                            {shouldShowExpiring(contract) && (
                              <span className="ml-2 text-red-400 text-xs flex items-center gap-1 inline-flex">
                                <AlertTriangle size={12} />
                                Expiring
                              </span>
                            )}
                          </div>
                          <div className="w-24 flex items-center justify-end gap-0.5">
                            {contract.status === "Ongoing" ? (
                              <button
                                onClick={() => handleEditContract(contract)}
                                className="p-2 text-orange-400 hover:text-orange-300 hover:bg-white/5 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Pencil size={18} />
                              </button>
                            ) : (
                              <div className="p-2 w-[34px]" />
                            )}
                            <button
                              onClick={() => handleViewHistory(contract.id)}
                              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                              title="History"
                            >
                              <History size={18} />
                            </button>
                            <div className="relative dropdown-trigger">
                              <button
                                onClick={(e) => toggleDropdownContract(contract.id, e)}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                              >
                                <MoreVertical size={18} />
                              </button>
                              {activeDropdownId === contract.id && (
                                <div className="dropdown-menu absolute bottom-full right-0 mb-1 bg-[#1F1F1F] border border-gray-700 rounded-lg shadow-xl z-[9999] min-w-[150px] py-1">
                                  {/* Ongoing: only Delete */}
                                  {contract.status === "Ongoing" && (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleDeleteContract(contract.id); setActiveDropdownId(null); }}
                                      className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-800 flex items-center gap-2"
                                    >
                                      <Trash2 size={14} /> Delete
                                    </button>
                                  )}

                                  {/* Cancelled: only Renew */}
                                  {contract.status === "Cancelled" && (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleRenewContract(contract.id); setActiveDropdownId(null); }}
                                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center gap-2"
                                    >
                                      <RefreshCw size={14} /> Renew
                                    </button>
                                  )}

                                  {/* Paused: Resume, Renew, Bonus Time, Change, Cancel */}
                                  {contract.status === "Paused" && (
                                    <>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleResumeContract(contract.id); setActiveDropdownId(null); }}
                                        className="w-full text-left px-3 py-2 text-sm text-orange-400 hover:bg-gray-800 flex items-center gap-2"
                                      >
                                        <PlayCircle size={14} /> Resume
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleRenewContract(contract.id); setActiveDropdownId(null); }}
                                        className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center gap-2"
                                      >
                                        <RefreshCw size={14} /> Renew
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleAddBonusTime(contract.id); setActiveDropdownId(null); }}
                                        className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center gap-2"
                                      >
                                        <Gift size={14} /> Bonus Time
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleChangeContract(contract.id); setActiveDropdownId(null); }}
                                        className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center gap-2"
                                      >
                                        <ArrowRightLeft size={14} /> Change
                                      </button>
                                      <hr className="border-gray-700 my-1" />
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleCancelContract(contract.id); setActiveDropdownId(null); }}
                                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-800 flex items-center gap-2"
                                      >
                                        <XCircle size={14} /> Cancel
                                      </button>
                                    </>
                                  )}

                                  {/* Active: Pause, Renew, Bonus Time, Change, Cancel */}
                                  {contract.status === "Active" && (
                                    <>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handlePauseContract(contract.id); setActiveDropdownId(null); }}
                                        className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center gap-2"
                                      >
                                        <PauseCircle size={14} /> Pause
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleRenewContract(contract.id); setActiveDropdownId(null); }}
                                        className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center gap-2"
                                      >
                                        <RefreshCw size={14} /> Renew
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleAddBonusTime(contract.id); setActiveDropdownId(null); }}
                                        className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center gap-2"
                                      >
                                        <Gift size={14} /> Bonus Time
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleChangeContract(contract.id); setActiveDropdownId(null); }}
                                        className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center gap-2"
                                      >
                                        <ArrowRightLeft size={14} /> Change
                                      </button>
                                      <hr className="border-gray-700 my-1" />
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleCancelContract(contract.id); setActiveDropdownId(null); }}
                                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-800 flex items-center gap-2"
                                      >
                                        <XCircle size={14} /> Cancel
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400 text-sm">No contracts found.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile List */}
                <div className="lg:hidden space-y-2">
                  {filteredAndSortedContracts().length > 0 ? (
                    filteredAndSortedContracts().map((contract) => (
                      <div key={contract.id} className="bg-[#161616] rounded-xl overflow-hidden">
                        <div
                          className="p-3 cursor-pointer"
                          onClick={() => setExpandedMobileRowId(expandedMobileRowId === contract.id ? null : contract.id)}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleManageDocuments(contract); }}
                              className="w-11 h-11 bg-[#2a2a2a] rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-[#3a3a3a] transition-colors"
                              title="Open Contract Documents"
                            >
                              <FileText size={22} className="text-orange-400" />
                            </button>
                            <div className="flex-1 min-w-0">
                              <span className="text-white font-medium truncate block">{contract.memberName}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <StatusTag status={contract.status} compact={true} pauseReason={contract.pauseReason} pauseStartDate={contract.pauseStartDate} pauseEndDate={contract.pauseEndDate} cancelReason={contract.cancelReason} cancelDate={contract.cancelDate} />
                                <span className="text-gray-400 text-xs">{contract.contractType}</span>
                              </div>
                            </div>
                            <ChevronDown
                              size={18}
                              className={`text-gray-500 transition-transform duration-200 ${expandedMobileRowId === contract.id ? 'rotate-180' : ''}`}
                            />
                          </div>
                        </div>

                        <div className={`overflow-hidden transition-all duration-200 ease-in-out ${expandedMobileRowId === contract.id ? 'max-h-56 opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className="px-3 pb-3 pt-1">
                            <div className="bg-[#0f0f0f] rounded-xl p-2">
                              <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-300">
                                  {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-1">
                                {contract.status === "Ongoing" ? (
                                  <button onClick={(e) => { e.stopPropagation(); handleEditContract(contract); }} className="flex flex-col items-center gap-1 p-2 text-orange-400 hover:text-orange-300 hover:bg-white/5 rounded-lg transition-colors">
                                    <Pencil size={18} /><span className="text-[10px]">Edit</span>
                                  </button>
                                ) : (
                                  <div className="p-2" />
                                )}
                                <button onClick={(e) => { e.stopPropagation(); handleViewHistory(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                  <History size={18} /><span className="text-[10px]">History</span>
                                </button>
                                <div className="p-2" />
                              </div>
                              {/* Status-based action buttons */}
                              <div className="grid grid-cols-4 gap-1 mt-1">
                                {/* Ongoing: only Delete */}
                                {contract.status === "Ongoing" && (
                                  <>
                                    <div className="p-2" />
                                    <div className="p-2" />
                                    <div className="p-2" />
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors">
                                      <Trash2 size={18} /><span className="text-[10px]">Delete</span>
                                    </button>
                                  </>
                                )}

                                {/* Cancelled: only Renew */}
                                {contract.status === "Cancelled" && (
                                  <>
                                    <div className="p-2" />
                                    <button onClick={(e) => { e.stopPropagation(); handleRenewContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                      <RefreshCw size={18} /><span className="text-[10px]">Renew</span>
                                    </button>
                                    <div className="p-2" />
                                    <div className="p-2" />
                                  </>
                                )}

                                {/* Paused: Resume, Renew, Cancel */}
                                {contract.status === "Paused" && (
                                  <>
                                    <button onClick={(e) => { e.stopPropagation(); handleResumeContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-orange-400 hover:text-orange-300 hover:bg-white/5 rounded-lg transition-colors">
                                      <PlayCircle size={18} /><span className="text-[10px]">Resume</span>
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleRenewContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                      <RefreshCw size={18} /><span className="text-[10px]">Renew</span>
                                    </button>
                                    <div className="p-2" />
                                    <button onClick={(e) => { e.stopPropagation(); handleCancelContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors">
                                      <XCircle size={18} /><span className="text-[10px]">Cancel</span>
                                    </button>
                                  </>
                                )}

                                {/* Active: Pause, Renew, Cancel */}
                                {contract.status === "Active" && (
                                  <>
                                    <button onClick={(e) => { e.stopPropagation(); handlePauseContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                      <PauseCircle size={18} /><span className="text-[10px]">Pause</span>
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleRenewContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                      <RefreshCw size={18} /><span className="text-[10px]">Renew</span>
                                    </button>
                                    <div className="p-2" />
                                    <button onClick={(e) => { e.stopPropagation(); handleCancelContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors">
                                      <XCircle size={18} /><span className="text-[10px]">Cancel</span>
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-sm">No contracts found.</p>
                    </div>
                  )}
                </div>
              </>
            )
          ) : (
            // GRID VIEW
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAndSortedContracts().length > 0 ? (
                filteredAndSortedContracts().map((contract) => (
                  <div
                    key={contract.id}
                    className="bg-[#161616] rounded-xl p-4 hover:bg-[#1a1a1a] transition-colors"
                  >
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => handleManageDocuments(contract)}
                        className="w-20 h-20 bg-[#2a2a2a] rounded-xl flex items-center justify-center mb-3 hover:bg-[#3a3a3a] transition-colors cursor-pointer"
                        title="Open Contract Documents"
                      >
                        <FileText size={36} className="text-orange-400" />
                      </button>
                      <h3 className="text-white font-medium text-lg text-center">{contract.memberName}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <StatusTag status={contract.status} pauseReason={contract.pauseReason} pauseStartDate={contract.pauseStartDate} pauseEndDate={contract.pauseEndDate} cancelReason={contract.cancelReason} cancelDate={contract.cancelDate} />
                      </div>
                      <p className="text-gray-400 text-sm mt-2">{contract.contractType}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs">
                        {(() => {
                          const renewalInfo = getAutoRenewalInfo(contract)
                          return renewalInfo.hasRenewal ? (
                            <div className="relative group inline-flex">
                              <span className="text-orange-400 flex items-center gap-1 cursor-pointer transition-transform duration-200 hover:scale-110">
                                <RefreshCw size={10} /> Auto Renewal
                              </span>
                              {/* Custom Tooltip */}
                              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-black/95 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg pointer-events-none">
                                <div className="flex items-center gap-2">
                                  <RefreshCw size={10} className="text-orange-400" />
                                  <span>{renewalInfo.tooltip}</span>
                                </div>
                                {/* Arrow pointing down */}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black/95" />
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-500">No Auto Renewal</span>
                          )
                        })()}
                      </div>
                      {shouldShowExpiring(contract) && (
                        <span className="mt-2 text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400 flex items-center gap-1">
                          <AlertTriangle size={12} /> Expiring
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-gray-800">
                      <div className="grid grid-cols-3 gap-1">
                        {contract.status === "Ongoing" ? (
                          <button
                            onClick={() => handleEditContract(contract)}
                            className="p-2 text-orange-400 hover:text-orange-300 hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                        ) : (
                          <div className="p-2" />
                        )}
                        <button
                          onClick={() => handleViewHistory(contract.id)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center"
                          title="History"
                        >
                          <History size={16} />
                        </button>
                        {/* Status-based last button */}
                        {contract.status === "Ongoing" ? (
                          <button
                            onClick={() => handleDeleteContract(contract.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        ) : contract.status === "Paused" ? (
                          <button
                            onClick={() => handleResumeContract(contract.id)}
                            className="p-2 text-orange-400 hover:text-orange-300 hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center"
                            title="Resume"
                          >
                            <PlayCircle size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRenewContract(contract.id)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center"
                            title="Renew"
                          >
                            <RefreshCw size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 col-span-full">
                  <p className="text-gray-400 text-sm">No contracts found.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Floating Action Button - Mobile */}
        <button
          onClick={handleAddContract}
          className="sm:hidden fixed bottom-4 right-4 bg-[#3F74FF] hover:bg-[#3F74FF]/90 text-white p-4 rounded-xl shadow-lg transition-all active:scale-95 z-30"
          aria-label="Create Contract"
        >
          <Plus size={22} />
        </button>

        {/* Modals */}
        {isModalOpen && (
          <ContractModal
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveNewContract}
            leadData={selectedLead}
          />
        )}

        {isPauseModalOpen && selectedContract && (
          <PauseContractModal
            contract={selectedContract}
            onClose={() => setIsPauseModalOpen(false)}
            onSubmit={handlePauseReasonSubmit}
          />
        )}

        {isCancelModalOpen && selectedContract && (
          <CancelContractModal
            contract={selectedContract}
            onClose={() => setIsCancelModalOpen(false)}
            onSubmit={handleCancelSubmit}
          />
        )}

        {isEditModalOpenContract && selectedContract && (
          <ContractModal
            contract={selectedContract}
            onClose={() => setIsEditModalOpenContract(false)}
            onSave={handleSaveEditedContract}
          />
        )}

        {isDocumentModalOpen && selectedContract && (
          <ContractManagement
            contract={selectedContract}
            allContracts={contracts}
            onClose={() => setIsDocumentModalOpen(false)}
          />
        )}

        {isBonusTimeModalOpen && selectedContract && (
          <BonusTimeModal
            contract={selectedContract}
            onClose={() => setIsBonusTimeModalOpen(false)}
            onSubmit={(bonusData) => {
              setIsBonusTimeModalOpen(false)
              toast.success("Bonus time added successfully")
            }}
          />
        )}

        {isRenewModalOpen && selectedContract && (
          <RenewContractModal
            contract={selectedContract}
            onClose={() => setIsRenewModalOpen(false)}
            onSubmit={handleRenewSubmit}
          />
        )}

        {isChangeModalOpen && selectedContract && (
          <ChangeContractModal
            contract={selectedContract}
            onClose={() => setIsChangeModalOpen(false)}
            onSubmit={handleChangeSubmit}
          />
        )}

        {isHistoryModalOpen && selectedContract && (
          <ContractHistoryModal
            contract={selectedContract}
            history={contractHistory[selectedContract.id] || []}
            onClose={() => {
              setIsHistoryModalOpen(false)
              setSelectedContract(null)
            }}
          />
        )}

        {isDeleteModalOpen && (
          <DeleteContractModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false)
              setContractToDelete(null)
            }}
            onDelete={confirmDeleteContract}
            contract={contractToDelete}
          />
        )}
        </div>
      </div>
    </>
  )
}
