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
  CalendarClock,
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
import { ContractFormFillModal } from "../../components/shared/contracts/ContractFormFillModal"
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
  cancelDate = null,
  scheduledStartDate = null 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-600';
      case 'Pending': return 'bg-surface-button-hover';
      case 'Paused': return 'bg-yellow-600';
      case 'Cancelled': return 'bg-red-600';
      case 'Scheduled': return 'bg-surface-button-hover';
      default: return 'bg-surface-button-hover';
    }
  };

  const bgColor = getStatusColor(status);
  const hasTooltip = status === 'Paused' || status === 'Cancelled' || status === 'Scheduled';
  const hasHoverEffect = status === 'Paused' || status === 'Cancelled' || status === 'Scheduled';
  
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

  // Build tooltip content for Scheduled
  const renderScheduledTooltip = () => {
    if (status !== 'Scheduled') return null;
    return (
      <>
        {scheduledStartDate && (
          <div className="flex items-center gap-2">
            <span className="text-content-muted font-medium">Starts:</span>
            <span>{formatD(scheduledStartDate)}</span>
          </div>
        )}
        {!scheduledStartDate && (
          <span>Contract is scheduled</span>
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
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-surface-dark text-content-primary px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg pointer-events-none">
            <div className="flex flex-col gap-1">
              {renderPauseTooltip()}
              {renderCancelTooltip()}
              {renderScheduledTooltip()}
            </div>
            {/* Arrow pointing up */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent" style={{ borderBottomColor: 'var(--color-surface-dark)' }} />
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
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-surface-dark text-content-primary px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg pointer-events-none">
          <div className="flex flex-col gap-1">
            {renderPauseTooltip()}
            {renderCancelTooltip()}
            {renderScheduledTooltip()}
          </div>
          {/* Arrow pointing up */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent" style={{ borderBottomColor: 'var(--color-surface-dark)' }} />
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

  // Auto-expire contracts and auto-activate scheduled contracts
  useEffect(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    let hasChanges = false
    
    let updated = contracts.map(contract => {
      // Activate Scheduled contracts whose start date has arrived
      if (contract.status === 'Scheduled') {
        const startDate = new Date(contract.scheduledStartDate || contract.startDate)
        startDate.setHours(0, 0, 0, 0)
        if (today >= startDate) {
          hasChanges = true
          return {
            ...contract,
            status: 'Active',
          }
        }
        return contract
      }

      // Only process Active or Paused contracts for auto-expiry
      if (contract.status !== 'Active' && contract.status !== 'Paused') return contract
      
      // Determine the effective final date (considering auto-renewal)
      let finalDate = new Date(contract.endDate)
      
      if (contract.autoRenewal) {
        if (contract.renewalIndefinite === true) return contract
        if (contract.autoRenewalEndDate) {
          finalDate = new Date(contract.autoRenewalEndDate)
        } else {
          return contract
        }
      }
      
      // If final date is in the past -> auto-cancel
      if (today > finalDate) {
        hasChanges = true
        return {
          ...contract,
          status: 'Cancelled',
          cancelReason: 'Contract expired',
          originalEndDate: contract.originalEndDate || contract.endDate,
        }
      }
      
      return contract
    })

    // When a Scheduled contract becomes Active, cancel the old contract it replaced
    if (hasChanges) {
      updated = updated.map(contract => {
        // Find if a newly-activated contract replaced this one
        const activatedReplacement = updated.find(c => 
          c.changedFromContractId === contract.id && 
          c.status === 'Active' &&
          contract.scheduledCancelDate
        )
        if (activatedReplacement && contract.status === 'Active') {
          return {
            ...contract,
            status: 'Cancelled',
            cancelReason: 'Contract changed',
            cancelDate: contract.scheduledCancelDate || new Date().toISOString().split('T')[0],
            changedToContractId: activatedReplacement.id,
          }
        }
        return contract
      })
      setContracts(updated)
    }
  }, []) // Run once on mount
  
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
  const [filterStatuses, setFilterStatuses] = useState([])
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
  // State for ContractFormFillModal after contract change
  const [isChangeFormFillOpen, setIsChangeFormFillOpen] = useState(false)
  const [changeFormFillData, setChangeFormFillData] = useState(null)

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
    // Never show expiring for cancelled or pending contracts
    if (contract.status === 'Cancelled' || contract.status === 'Pending') return false

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

  // Check if contract is expired (end date in past) - used for visual dimming
  const isExpiredContract = (contract) => {
    // Cancelled contracts are always dimmed
    if (contract.status === 'Cancelled') return true
    
    // Contracts whose end date is in the past (and no auto-renewal keeping them active)
    if (contract.endDate) {
      const endDate = new Date(contract.endDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (endDate < today) {
        // If auto-renewal is active and indefinite, don't dim
        if (contract.autoRenewal && contract.renewalIndefinite === true) return false
        // If auto-renewal with end date that's still in the future, don't dim
        if (contract.autoRenewal && contract.autoRenewalEndDate && new Date(contract.autoRenewalEndDate) >= today) return false
        return true
      }
    }
    
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

  // Calculate the effective end date considering bonus time with extension
  // Also calculates the bonus period dynamically for consistent display
  const getEffectiveEndDate = (contract) => {
    // Check if contract was cancelled early (cancelToDate set)
    const isCancelledEarly = !!(contract.cancelToDate && contract.status === 'Cancelled')

    if (!contract.bonusTime?.bonusAmount) {
      return { date: contract.endDate, isExtended: false, isCancelledEarly, bonusPeriod: null }
    }
    const start = new Date(contract.endDate)
    const end = new Date(contract.endDate)
    const amount = contract.bonusTime.bonusAmount
    switch (contract.bonusTime.bonusUnit) {
      case 'days':
        end.setDate(end.getDate() + amount)
        break
      case 'weeks':
        end.setDate(end.getDate() + amount * 7)
        break
      case 'months':
        end.setMonth(end.getMonth() + amount)
        break
      default:
        break
    }
    const bonusPeriod = `${formatDate(start.toISOString().split('T')[0])} - ${formatDate(end.toISOString().split('T')[0])}`
    const isExtended = !!contract.bonusTime.withExtension
    return { 
      date: isExtended ? end.toISOString().split('T')[0] : contract.endDate, 
      isExtended, 
      isCancelledEarly,
      bonusPeriod,
      effectiveEndDate: end.toISOString().split('T')[0],
    }
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
      
      const query = searchQuery.toLowerCase()
      return member.memberName.toLowerCase().includes(query) ||
        (member.contractNumber && member.contractNumber.toLowerCase().includes(query))
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

    // If memberFilters are active, show only those members' contracts
    if (memberFilters.length > 0) {
      const filterIds = memberFilters.map(f => f.memberId)
      filtered = filtered.filter(contract => filterIds.includes(contract.memberId))
    }

    // Apply status filter (multi-select)
    if (filterStatuses.length > 0) {
      filtered = filtered.filter(contract => {
        const statusMap = {
          active: 'Active',
          scheduled: 'Scheduled',
          pending: 'Pending',
          paused: 'Paused',
          cancelled: 'Cancelled'
        }
        return filterStatuses.some(f => contract.status === statusMap[f])
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
        isHistoryModalOpen ||
        isChangeFormFillOpen;

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
        else if (isChangeFormFillOpen) setIsChangeFormFillOpen(false);
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
    isChangeFormFillOpen,
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

  // Cancel a Scheduled contract: remove it and undo the scheduled cancel on the old contract
  const handleCancelScheduledContract = (contractId) => {
    const scheduledContract = contracts.find(c => c.id === contractId)
    if (!scheduledContract) return

    setContracts(prev => {
      // Remove the scheduled contract
      let updated = prev.filter(c => c.id !== contractId)
      
      // If the scheduled contract was a change from an old contract, undo the scheduled cancel
      if (scheduledContract.changedFromContractId) {
        updated = updated.map(c =>
          c.id === scheduledContract.changedFromContractId
            ? {
                ...c,
                scheduledCancelDate: null,
                changedToContractId: null,
              }
            : c
        )
      }
      return updated
    })
    toast.success("Scheduled contract cancelled")
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

  const handleRemoveBonusTime = (contractId) => {
    setContracts(contracts.map(c =>
      c.id === contractId ? { ...c, bonusTime: null } : c
    ))
    toast.success("Bonus time removed")
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
    
    // Helper: check if a date string is in the future
    const isFutureDate = (dateStr) => {
      if (!dateStr) return false
      const date = new Date(dateStr)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      date.setHours(0, 0, 0, 0)
      return date > today
    }
    
    if (isNewFormat) {
      // New format: Full contract object from ContractFormFillModal
      const futureStart = isFutureDate(contractData.startDate)
      newContract = {
        id: contractData.id || `12321-${contracts.length + 1}`,
        contractNumber: contractData.contractNumber || `C-${Date.now()}`,
        memberName: contractData.memberName,
        memberId: contractData.memberId || `M-${Date.now()}`,
        contractType: contractData.contractType,
        startDate: contractData.startDate,
        endDate: contractData.endDate,
        trainingStartDate: contractData.trainingStartDate,
        status: futureStart ? "Scheduled" : (contractData.status || "Active"),
        scheduledStartDate: futureStart ? contractData.startDate : null,
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
      const legacyStartDate = contractData.contractStartDate || new Date().toISOString().split("T")[0]
      const futureStart = isFutureDate(legacyStartDate)
      newContract = {
        id: `12321-${contracts.length + 1}`,
        memberName: contractData.fullName,
        contractType: contractData.rateType || "Basic",
        startDate: legacyStartDate,
        endDate: contractData.contractEndDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
        status: futureStart ? "Scheduled" : "Active",
        scheduledStartDate: futureStart ? legacyStartDate : null,
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
    // Convert for Active and Scheduled contracts (not Pending)
    const contractStatus = newContract.status || "Active"
    const leadId = contractData.leadId || contractData.memberId
    
    if ((contractStatus === "Active" || contractStatus === "Scheduled") && leadId) {
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
    } else if (contractStatus === "Pending") {
      // For Pending contracts, keep the lead - no conversion yet
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

  const handleCancelSubmit = ({ reason, cancelDate, cancelToDate }) => {
    if (selectedContract) {
      setContracts(contracts.map((c) => {
        if (c.id !== selectedContract.id) return c
        const updates = {
          ...c,
          status: "Cancelled",
          cancelReason: reason,
          cancelDate: cancelDate || null,
          cancelToDate: cancelToDate || null,
        }
        // If cancelToDate is set, store original endDate and update endDate
        if (cancelToDate) {
          updates.originalEndDate = c.originalEndDate || c.endDate // preserve if already set
          updates.endDate = cancelToDate
        }
        return updates
      }))
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
      // Store the change data and open the ContractFormFillModal for the new contract type
      const newContractType = changeData.selectedContractType || 
        DEFAULT_CONTRACT_TYPES.find(t => t.name === changeData.newContractType)
      
      setChangeFormFillData({
        changeData,
        contractType: newContractType,
        contract: selectedContract,
      })
      setIsChangeModalOpen(false)
      
      // If the new contract type has a form, open the form fill modal
      if (newContractType?.contractFormId) {
        setIsChangeFormFillOpen(true)
      } else {
        // No form attached — cancel old contract + create new one directly
        finalizeContractChange(changeData, newContractType, selectedContract, null)
      }
    }
  }

  // Handle completion of ContractFormFillModal after contract change
  const handleChangeFormFillComplete = (formData) => {
    if (changeFormFillData && changeFormFillData.contract) {
      const { changeData, contractType, contract: originalContract } = changeFormFillData
      finalizeContractChange(changeData, contractType, originalContract, formData)
    }
    
    setIsChangeFormFillOpen(false)
    setSelectedContract(null)
    setChangeFormFillData(null)
  }

  // Shared logic: handle contract change (Scheduled if future, immediate if today)
  const finalizeContractChange = (changeData, contractType, originalContract, formData) => {
    const fv = formData?.formValues || {}
    
    // Calculate end date for the new contract
    let newEndDate = changeData.endDate || originalContract.endDate
    if (changeData.startDate && contractType?.duration) {
      const start = new Date(changeData.startDate)
      start.setMonth(start.getMonth() + parseInt(contractType.duration))
      newEndDate = start.toISOString().split('T')[0]
    }

    // Determine if the start date is in the future
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const changeStartDate = new Date(changeData.startDate)
    changeStartDate.setHours(0, 0, 0, 0)
    const isFutureStart = changeStartDate > today

    // Build the new contract object
    const newContract = {
      id: `12321-${Date.now()}`,
      contractNumber: `C-${Date.now()}`,
      memberName: originalContract.memberName,
      memberId: originalContract.memberId,
      contractType: changeData.newContractType,
      startDate: changeData.startDate || originalContract.startDate,
      endDate: newEndDate,
      trainingStartDate: originalContract.trainingStartDate,
      // If start date is in the future -> Scheduled, otherwise Active
      status: isFutureStart ? "Scheduled" : (formData?.status || "Active"),
      scheduledStartDate: isFutureStart ? changeData.startDate : null,
      autoRenewal: contractType?.autoRenewal || false,
      renewalIndefinite: contractType?.renewalIndefinite ?? true,
      cost: contractType?.cost || originalContract.cost,
      billingPeriod: contractType?.billingPeriod || originalContract.billingPeriod,
      email: fv.email || originalContract.email,
      phone: fv.telephone || originalContract.phone,
      iban: fv.iban || originalContract.iban,
      bic: fv.bic || originalContract.bic,
      sepaMandate: originalContract.sepaMandate,
      address: {
        street: fv.street || originalContract.address?.street,
        zipCode: fv.zipCode || originalContract.address?.zipCode,
        city: fv.city || originalContract.address?.city,
      },
      discount: changeData.discount || null,
      formData: formData || null,
      contractFormSnapshot: formData ? {
        formValues: formData.formValues,
        systemValues: formData.systemValues,
        contractFormId: formData.contractFormId,
        contractFormName: formData.contractFormName,
        contractFormData: formData.contractFormData,
        completedAt: formData.completedAt,
      } : null,
      files: [],
      dateOfBirth: originalContract.dateOfBirth,
      bankName: originalContract.bankName,
      salutation: originalContract.salutation,
      isDraft: formData?.isDraft || false,
      pauseReason: null,
      cancelReason: null,
      // Reference to the old contract
      changedFromContractId: originalContract.id,
    }

    if (isFutureStart) {
      // Future start: old contract stays Active, gets scheduled cancel date
      // New contract is "Scheduled" - will auto-activate on start date
      setContracts(prev => {
        const updated = prev.map(c =>
          c.id === originalContract.id
            ? {
                ...c,
                scheduledCancelDate: changeData.startDate,
                changedToContractId: newContract.id,
              }
            : c
        )
        return [...updated, newContract]
      })
      toast.success(`Contract change scheduled for ${new Date(changeData.startDate).toLocaleDateString('de-DE')}`)
    } else {
      // Immediate: cancel old contract now, new contract is Active
      setContracts(prev => {
        const updated = prev.map(c =>
          c.id === originalContract.id
            ? {
                ...c,
                status: "Cancelled",
                cancelReason: "Contract changed",
                cancelDate: new Date().toISOString().split('T')[0],
                changedToContractId: newContract.id,
              }
            : c
        )
        return [...updated, newContract]
      })
      toast.success("Contract changed successfully")
    }

    // Filter to show the member's contracts
    setMemberFilters([{
      memberId: newContract.memberId,
      memberName: newContract.memberName,
    }])
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

      <div className="flex flex-col lg:flex-row rounded-3xl bg-surface-base transition-all duration-500 text-content-primary relative select-none">
        <div className="flex-1 min-w-0 md:p-6 p-4 pb-36">
          {/* Header - matches members.jsx */}
          <div className="flex sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-content-primary oxanium_font text-xl md:text-2xl">Contracts</h1>
              
              {/* Sort Button - Mobile: next to title */}
              <div className="lg:hidden relative" ref={mobileSortDropdownRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMobileSortDropdown(!showMobileSortDropdown)
                  }}
                  className="px-3 py-2 bg-surface-button text-content-secondary rounded-xl text-xs hover:bg-surface-button-hover transition-colors flex items-center gap-2"
                >
                  {getSortIcon()}
                  <span>{currentSortLabel}</span>
                </button>

                {/* Sort Dropdown - Mobile */}
                {showMobileSortDropdown && (
                  <div className="absolute left-0 mt-1 bg-surface-hover border border-border rounded-lg shadow-lg z-50 min-w-[180px]">
                    <div className="py-1">
                      <div className="px-3 py-1.5 text-xs text-content-faint font-medium border-b border-border">Sort by</div>
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSortOptionClick(option.value)
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-hover transition-colors flex items-center justify-between ${sortBy === option.value ? 'text-content-primary bg-surface-hover/50' : 'text-content-secondary'}`}
                        >
                          <span>{option.label}</span>
                          {sortBy === option.value && (
                            <span className="text-content-muted">
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
              <div className="hidden lg:flex items-center gap-2 bg-surface-dark rounded-xl p-1">
                <div className="relative group">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-secondary hover:text-secondary-hover'}`}
                  >
                    <Grid3X3 size={16} />
                  </button>
                  
                  {/* Tooltip */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-surface-dark text-content-primary px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                    <span className="font-medium">Grid View</span>
                    <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">V</span>
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent" style={{ borderBottomColor: 'var(--color-surface-dark)' }} />
                  </div>
                </div>
                
                <div className="relative group">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'text-secondary hover:text-secondary-hover'}`}
                  >
                    <List size={16} />
                  </button>
                  
                  {/* Tooltip */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-surface-dark text-content-primary px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                    <span className="font-medium">List View</span>
                    <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">V</span>
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent" style={{ borderBottomColor: 'var(--color-surface-dark)' }} />
                  </div>
                </div>

                {/* Compact/Detailed Toggle */}
                <div className="h-6 w-px bg-border mx-1"></div>
                <div className="relative group">
                  <button
                    onClick={() => setIsCompactView(!isCompactView)}
                    className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${isCompactView ? "text-primary" : "text-primary"}`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="flex gap-0.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${!isCompactView ? 'bg-current' : 'bg-content-muted'}`}></div>
                        <div className={`w-1.5 h-1.5 rounded-full ${!isCompactView ? 'bg-current' : 'bg-content-muted'}`}></div>
                      </div>
                      <div className="flex gap-0.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${isCompactView ? 'bg-current' : 'bg-content-muted'}`}></div>
                        <div className={`w-1.5 h-1.5 rounded-full ${isCompactView ? 'bg-current' : 'bg-content-muted'}`}></div>
                      </div>
                    </div>
                  </button>
                  
                  {/* Tooltip */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-surface-dark text-content-primary px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                    <span className="font-medium">{isCompactView ? "Compact View" : "Detailed View"}</span>
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent" style={{ borderBottomColor: 'var(--color-surface-dark)' }} />
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
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-surface-dark text-content-primary px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                  <span className="font-medium">Create Contract</span>
                  <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">
                    C
                  </span>
                  {/* Arrow pointing up */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent" style={{ borderBottomColor: 'var(--color-surface-dark)' }} />
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
                    <div className="w-5 h-5 rounded bg-surface-button flex items-center justify-center flex-shrink-0">
                      <FileText size={12} className="text-orange-400" />
                    </div>
                    <span className="text-content-primary text-xs whitespace-nowrap">{filter.memberName}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFilter(filter.memberId);
                      }}
                      className="p-0.5 hover:bg-primary/30 rounded transition-colors"
                    >
                      <X size={12} className="text-content-muted hover:text-content-primary" />
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
                  className="flex-1 min-w-[100px] bg-transparent outline-none text-sm text-content-primary placeholder-gray-500"
                />
                
                {/* Clear All Button */}
                {memberFilters.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setMemberFilters([])
                    }}
                    className="p-1 hover:bg-surface-button rounded-lg transition-colors flex-shrink-0"
                    title="Clear all filters"
                  >
                    <X size={14} className="text-content-muted hover:text-content-primary" />
                  </button>
                )}
              </div>
              
              {/* Autocomplete Dropdown */}
              {showSearchDropdown && searchQuery.trim() && getSearchSuggestions().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-surface-hover border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                  {getSearchSuggestions().map((member) => (
                    <button
                      key={member.memberId}
                      onClick={() => handleSelectMember(member)}
                      className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-surface-button transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-surface-button flex items-center justify-center flex-shrink-0">
                        <FileText size={16} className="text-orange-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-content-primary truncate">{member.memberName}</p>
                        <p className="text-xs text-content-faint truncate">{member.contractType}</p>
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
                {!filtersExpanded && filterStatuses.length > 0 && (
                  <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full">{filterStatuses.length}</span>
                )}
              </button>

              {/* Sort Controls - Desktop only, always visible */}
              <div className="hidden lg:block relative" ref={sortDropdownRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowSortDropdown(!showSortDropdown)
                  }}
                  className="px-3 sm:px-4 py-1.5 bg-surface-button text-content-secondary rounded-xl text-xs sm:text-sm hover:bg-surface-button-hover transition-colors flex items-center gap-2"
                >
                  {getSortIcon()}
                  <span>{currentSortLabel}</span>
                </button>

                {/* Sort Dropdown - Desktop */}
                {showSortDropdown && (
                  <div className="absolute top-full right-0 mt-1 bg-surface-hover border border-border rounded-lg shadow-lg z-50 min-w-[180px]">
                    <div className="py-1">
                      <div className="px-3 py-1.5 text-xs text-content-faint font-medium border-b border-border">Sort by</div>
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSortOptionClick(option.value)
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-hover transition-colors flex items-center justify-between ${sortBy === option.value ? 'text-content-primary bg-surface-hover/50' : 'text-content-secondary'}`}
                        >
                          <span>{option.label}</span>
                          {sortBy === option.value && (
                            <span className="text-content-muted">
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
                  onClick={() => setFilterStatuses([])}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${filterStatuses.length === 0 ? "bg-primary text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"}`}
                >
                  All ({contracts.length})
                </button>
                <button
                  onClick={() => setFilterStatuses(prev => prev.includes('active') ? prev.filter(f => f !== 'active') : [...prev, 'active'])}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${filterStatuses.includes('active') ? "bg-primary text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"}`}
                >
                  Active ({contracts.filter((c) => c.status === "Active").length})
                </button>
                <button
                  onClick={() => setFilterStatuses(prev => prev.includes('scheduled') ? prev.filter(f => f !== 'scheduled') : [...prev, 'scheduled'])}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${filterStatuses.includes('scheduled') ? "bg-primary text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"}`}
                >
                  Scheduled ({contracts.filter((c) => c.status === "Scheduled").length})
                </button>
                <button
                  onClick={() => setFilterStatuses(prev => prev.includes('pending') ? prev.filter(f => f !== 'pending') : [...prev, 'pending'])}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${filterStatuses.includes('pending') ? "bg-primary text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"}`}
                >
                  Pending ({contracts.filter((c) => c.status === "Pending").length})
                </button>
                <button
                  onClick={() => setFilterStatuses(prev => prev.includes('paused') ? prev.filter(f => f !== 'paused') : [...prev, 'paused'])}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${filterStatuses.includes('paused') ? "bg-primary text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"}`}
                >
                  Paused ({contracts.filter((c) => c.status === "Paused").length})
                </button>
                <button
                  onClick={() => setFilterStatuses(prev => prev.includes('cancelled') ? prev.filter(f => f !== 'cancelled') : [...prev, 'cancelled'])}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${filterStatuses.includes('cancelled') ? "bg-primary text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"}`}
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
            <>
              {/* Desktop Table - unified compact/detailed */}
              <div className="hidden lg:block">
                <div className="bg-surface-card rounded-xl overflow-visible">
                  {/* Table Header */}
                  <div className={`grid grid-cols-[auto_1fr_1.5fr_1fr_1fr_0.8fr_1.5fr_auto] gap-4 px-4 bg-surface-dark text-content-muted font-medium border-b border-border rounded-t-xl ${isCompactView ? 'py-2 text-xs' : 'py-3 text-sm'}`}>
                    <div className={`text-center pr-4 ${isCompactView ? 'w-14' : 'w-20'}`}>Contract</div>
                    <div>Contract No.</div>
                    <div>Name</div>
                    <div>Contract Type</div>
                    <div>Status</div>
                    <div>Auto Renewal</div>
                    <div>Contract Duration</div>
                    <div className={`text-right ${isCompactView ? 'w-20' : 'w-24'}`}>Actions</div>
                  </div>
                  {/* Table Body */}
                  {filteredAndSortedContracts().length > 0 ? (
                    filteredAndSortedContracts().map((contract) => (
                      <div
                        key={contract.id}
                        className={`grid grid-cols-[auto_1fr_1.5fr_1fr_1fr_0.8fr_1.5fr_auto] gap-4 px-4 items-center border-b border-border/50 hover:bg-surface-hover transition-colors relative ${isCompactView ? 'py-2' : 'py-3'}`}
                      >
                        {isExpiredContract(contract) && (
                          <div className="absolute inset-0 bg-surface-dark/70 z-[40] pointer-events-none" />
                        )}
                        <div className={`flex items-center justify-center pr-4 ${isCompactView ? 'w-14' : 'w-20'}`}>
                          <button
                            onClick={() => handleManageDocuments(contract)}
                            className={`bg-surface-button rounded-xl flex items-center justify-center hover:bg-surface-button-hover transition-colors cursor-pointer ${isCompactView ? 'w-8 h-8' : 'w-10 h-10'}`}
                            title="Open Contract Documents"
                          >
                            <FileText size={isCompactView ? 16 : 20} className="text-orange-400" />
                          </button>
                        </div>
                        <div className={`text-content-muted truncate ${isCompactView ? 'text-xs' : 'text-sm'}`} title={contract.contractNumber || '-'}>
                          {contract.contractNumber || '-'}
                        </div>
                        <div className="flex items-center">
                          <span className={`text-content-primary font-medium ${isCompactView ? 'text-xs' : 'text-sm'}`}>{contract.memberName}</span>
                        </div>
                        <div className={`text-content-secondary ${isCompactView ? 'text-xs' : 'text-sm'}`}>{contract.contractType}</div>
                        <div><StatusTag status={contract.status} compact={true} pauseReason={contract.pauseReason} pauseStartDate={contract.pauseStartDate} pauseEndDate={contract.pauseEndDate} cancelReason={contract.cancelReason} cancelDate={contract.cancelDate} scheduledStartDate={contract.scheduledStartDate} /></div>
                        <div className={`text-content-secondary ${isCompactView ? 'text-xs' : 'text-sm'}`}>
                          {(() => {
                            const renewalInfo = getAutoRenewalInfo(contract)
                            const isCancelled = contract.status === 'Cancelled'
                            return renewalInfo.hasRenewal ? (
                              <div className="relative group inline-flex">
                                <span className={`flex items-center gap-1 cursor-pointer transition-transform duration-200 hover:scale-110 ${isCancelled ? 'text-content-faint line-through' : 'text-orange-400'}`}>
                                  <RefreshCw size={isCompactView ? 10 : 12} /> Yes
                                </span>
                                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-surface-dark text-content-primary px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg pointer-events-none">
                                  <div className={`flex items-center gap-2 ${isCancelled ? 'line-through text-content-muted' : ''}`}>
                                    <RefreshCw size={10} className={isCancelled ? 'text-content-faint' : 'text-orange-400'} />
                                    <span>{renewalInfo.tooltip}</span>
                                  </div>
                                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent" style={{ borderBottomColor: 'var(--color-surface-dark)' }} />
                                </div>
                              </div>
                            ) : (
                              <span className="text-content-faint">No</span>
                            )
                          })()}
                        </div>
                        <div className={`text-content-muted ${isCompactView ? 'text-xs' : 'text-sm'}`}>
                          {contract.status === "Pending" ? (
                            <span className="text-content-faint italic">—</span>
                          ) : (
                          <>
                          {formatDate(contract.startDate)} - {(() => {
                            const eff = getEffectiveEndDate(contract)
                            if (eff.isCancelledEarly) return <span className="text-red-400 font-medium">{formatDate(contract.endDate)}</span>
                            if (eff.isExtended) return <span className="text-orange-400 font-medium">{formatDate(eff.date)}</span>
                            return formatDate(contract.endDate)
                          })()}
                          {shouldShowExpiring(contract) && (
                            <span className={`ml-2 text-red-400 flex items-center gap-1 inline-flex ${isCompactView ? 'text-[10px]' : 'text-xs'}`}>
                              <AlertTriangle size={isCompactView ? 10 : 12} />
                              Expiring
                            </span>
                          )}
                          {contract.bonusTime && (
                            <div className="relative group inline-flex ml-2">
                              <span className={`text-orange-400 flex items-center gap-1 cursor-pointer transition-transform duration-200 hover:scale-110 ${isCompactView ? 'text-[10px]' : 'text-xs'}`}>
                                <Gift size={isCompactView ? 10 : 12} />
                                Bonus
                              </span>
                              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-surface-dark text-content-primary px-3 py-1.5 rounded text-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg pointer-events-none max-w-[280px]">
                                {(() => {
                                  const eff = getEffectiveEndDate(contract)
                                  return (
                                    <div className="flex items-start gap-2">
                                      <Gift size={10} className="text-orange-400 mt-0.5 flex-shrink-0" />
                                      <div className="min-w-0 overflow-hidden">
                                        <span className="font-medium whitespace-nowrap">{contract.bonusTime.bonusAmount} {contract.bonusTime.bonusUnit}</span>
                                        {contract.bonusTime.reason && <span className="text-content-secondary block truncate"> — {contract.bonusTime.reason}</span>}
                                        {eff.bonusPeriod && <span className="text-content-muted block whitespace-nowrap mt-0.5">{eff.bonusPeriod}</span>}
                                        {contract.bonusTime.withExtension 
                                          ? <span className="text-green-400 block text-[10px] mt-0.5">+ Contract extension</span>
                                          : <span className="text-content-faint block text-[10px] mt-0.5">Without extension</span>
                                        }
                                      </div>
                                    </div>
                                  )
                                })()}
                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent" style={{ borderBottomColor: 'var(--color-surface-dark)' }} />
                              </div>
                            </div>
                          )}
                          </>
                          )}
                        </div>
                        <div className={`flex items-center justify-end gap-0.5 ${isCompactView ? 'w-20' : 'w-24'}`}>
                          {contract.status === "Pending" ? (
                            <button onClick={() => handleEditContract(contract)} className={`text-orange-400 hover:text-orange-300 hover:bg-surface-hover rounded-lg transition-colors ${isCompactView ? 'p-1.5' : 'p-2'}`} title="Edit">
                              <Pencil size={isCompactView ? 14 : 18} />
                            </button>
                          ) : (
                            <div className={`${isCompactView ? 'p-1.5 w-[28px]' : 'p-2 w-[34px]'}`} />
                          )}
                          <button onClick={() => handleViewHistory(contract.id)} className={`text-content-muted hover:text-content-primary hover:bg-surface-hover rounded-lg transition-colors ${isCompactView ? 'p-1.5' : 'p-2'}`} title="History">
                            <History size={isCompactView ? 14 : 18} />
                          </button>
                          <div className="relative dropdown-trigger">
                            <button onClick={(e) => toggleDropdownContract(contract.id, e)} className={`text-content-muted hover:text-content-primary hover:bg-surface-hover rounded-lg transition-colors ${isCompactView ? 'p-1.5' : 'p-2'}`}>
                              <MoreVertical size={isCompactView ? 14 : 18} />
                            </button>
                            {activeDropdownId === contract.id && (
                              <div className="dropdown-menu absolute bottom-full right-0 mb-1 bg-surface-hover border border-border rounded-lg shadow-xl z-[9999] min-w-[190px] py-1">
                                {contract.status === "Pending" && (
                                  <button onClick={(e) => { e.stopPropagation(); handleDeleteContract(contract.id); setActiveDropdownId(null); }} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-surface-hover flex items-center gap-2"><Trash2 size={14} /> Delete</button>
                                )}
                                {contract.status === "Cancelled" && (
                                  <button onClick={(e) => { e.stopPropagation(); handleRenewContract(contract.id); setActiveDropdownId(null); }} className="w-full text-left px-3 py-2 text-sm text-content-secondary hover:bg-surface-hover flex items-center gap-2"><RefreshCw size={14} /> Renew</button>
                                )}
                                {contract.status === "Scheduled" && (
                                  <button onClick={(e) => { e.stopPropagation(); handleCancelContract(contract.id); setActiveDropdownId(null); }} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-surface-hover flex items-center gap-2"><XCircle size={14} /> Cancel</button>
                                )}
                                {contract.status === "Paused" && (
                                  <>
                                    <button onClick={(e) => { e.stopPropagation(); handleResumeContract(contract.id); setActiveDropdownId(null); }} className="w-full text-left px-3 py-2 text-sm text-orange-400 hover:bg-surface-hover flex items-center gap-2"><PlayCircle size={14} /> Resume</button>
                                    <button onClick={(e) => { e.stopPropagation(); handleRenewContract(contract.id); setActiveDropdownId(null); }} className="w-full text-left px-3 py-2 text-sm text-content-secondary hover:bg-surface-hover flex items-center gap-2"><RefreshCw size={14} /> Renew</button>
                                    <button onClick={(e) => { e.stopPropagation(); handleAddBonusTime(contract.id); setActiveDropdownId(null); }} className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-hover flex items-center gap-2 ${contract.bonusTime ? 'text-orange-400' : 'text-content-secondary'}`}><Gift size={14} /> {contract.bonusTime ? 'Edit Bonus Time' : 'Add Bonus Time'}</button>
                                    {contract.bonusTime && (<button onClick={(e) => { e.stopPropagation(); handleRemoveBonusTime(contract.id); setActiveDropdownId(null); }} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-surface-hover flex items-center gap-2"><Trash2 size={14} /> Remove Bonus Time</button>)}
                                    <button onClick={(e) => { e.stopPropagation(); handleChangeContract(contract.id); setActiveDropdownId(null); }} className="w-full text-left px-3 py-2 text-sm text-content-secondary hover:bg-surface-hover flex items-center gap-2"><ArrowRightLeft size={14} /> Change</button>
                                    <hr className="border-border my-1" />
                                    <button onClick={(e) => { e.stopPropagation(); handleCancelContract(contract.id); setActiveDropdownId(null); }} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-surface-hover flex items-center gap-2"><XCircle size={14} /> Cancel</button>
                                  </>
                                )}
                                {contract.status === "Active" && (
                                  <>
                                    <button onClick={(e) => { e.stopPropagation(); handlePauseContract(contract.id); setActiveDropdownId(null); }} className="w-full text-left px-3 py-2 text-sm text-content-secondary hover:bg-surface-hover flex items-center gap-2"><PauseCircle size={14} /> Pause</button>
                                    <button onClick={(e) => { e.stopPropagation(); handleRenewContract(contract.id); setActiveDropdownId(null); }} className="w-full text-left px-3 py-2 text-sm text-content-secondary hover:bg-surface-hover flex items-center gap-2"><RefreshCw size={14} /> Renew</button>
                                    <button onClick={(e) => { e.stopPropagation(); handleAddBonusTime(contract.id); setActiveDropdownId(null); }} className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-hover flex items-center gap-2 ${contract.bonusTime ? 'text-orange-400' : 'text-content-secondary'}`}><Gift size={14} /> {contract.bonusTime ? 'Edit Bonus Time' : 'Add Bonus Time'}</button>
                                    {contract.bonusTime && (<button onClick={(e) => { e.stopPropagation(); handleRemoveBonusTime(contract.id); setActiveDropdownId(null); }} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-surface-hover flex items-center gap-2"><Trash2 size={14} /> Remove Bonus Time</button>)}
                                    <button onClick={(e) => { e.stopPropagation(); handleChangeContract(contract.id); setActiveDropdownId(null); }} className="w-full text-left px-3 py-2 text-sm text-content-secondary hover:bg-surface-hover flex items-center gap-2"><ArrowRightLeft size={14} /> Change</button>
                                    <hr className="border-border my-1" />
                                    <button onClick={(e) => { e.stopPropagation(); handleCancelContract(contract.id); setActiveDropdownId(null); }} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-surface-hover flex items-center gap-2"><XCircle size={14} /> Cancel</button>
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
                      <p className="text-content-muted text-sm">No contracts found.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile List */}
                <div className="lg:hidden space-y-2">
                  {filteredAndSortedContracts().length > 0 ? (
                    filteredAndSortedContracts().map((contract) => (
                      <div key={contract.id} className={`bg-surface-card rounded-xl relative ${isExpiredContract(contract) ? 'overflow-visible' : 'overflow-hidden'}`}>
                        {isExpiredContract(contract) && (
                          <div className="absolute inset-0 bg-surface-dark/70 z-[40] pointer-events-none rounded-xl" />
                        )}
                        <div
                          className="p-3 cursor-pointer"
                          onClick={() => setExpandedMobileRowId(expandedMobileRowId === contract.id ? null : contract.id)}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleManageDocuments(contract); }}
                              className="w-11 h-11 bg-surface-button rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-surface-button-hover transition-colors"
                              title="Open Contract Documents"
                            >
                              <FileText size={22} className="text-orange-400" />
                            </button>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-content-primary font-medium truncate">{contract.memberName}</span>
                                {contract.contractNumber && (
                                  <span className="text-content-faint text-[10px] flex-shrink-0">#{contract.contractNumber}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <StatusTag status={contract.status} compact={true} pauseReason={contract.pauseReason} pauseStartDate={contract.pauseStartDate} pauseEndDate={contract.pauseEndDate} cancelReason={contract.cancelReason} cancelDate={contract.cancelDate} scheduledStartDate={contract.scheduledStartDate} />
                                <span className="text-content-muted text-xs">{contract.contractType}</span>
                              </div>
                            </div>
                            <ChevronDown
                              size={18}
                              className={`text-content-faint transition-transform duration-200 ${expandedMobileRowId === contract.id ? 'rotate-180' : ''}`}
                            />
                          </div>
                        </div>

                        <div className={`overflow-hidden transition-all duration-200 ease-in-out ${expandedMobileRowId === contract.id ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className="px-3 pb-3 pt-1">
                            <div className="bg-surface-dark rounded-xl p-2">
                              <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                                {contract.status === "Pending" ? (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-button/50 text-content-faint italic">—</span>
                                ) : (
                                <>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-button/50 text-content-secondary">
                                  {formatDate(contract.startDate)} - {(() => {
                                    const eff = getEffectiveEndDate(contract)
                                    if (eff.isCancelledEarly) return <span className="text-red-400 font-medium">{formatDate(contract.endDate)}</span>
                                    if (eff.isExtended) return <span className="text-orange-400 font-medium">{formatDate(eff.date)}</span>
                                    return formatDate(contract.endDate)
                                  })()}
                                </span>
                                {contract.bonusTime && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 flex items-center gap-1">
                                    <Gift size={10} /> Bonus
                                  </span>
                                )}
                                </>
                                )}
                              </div>
                              {/* Status-based action icons - all visible like members */}
                              {contract.status === "Active" && (
                                <>
                                  <div className="grid grid-cols-4 gap-1">
                                    <button onClick={(e) => { e.stopPropagation(); handlePauseContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-content-muted hover:text-content-primary hover:bg-surface-hover rounded-lg transition-colors">
                                      <PauseCircle size={18} /><span className="text-[10px]">Pause</span>
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleRenewContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-content-muted hover:text-content-primary hover:bg-surface-hover rounded-lg transition-colors">
                                      <RefreshCw size={18} /><span className="text-[10px]">Renew</span>
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleAddBonusTime(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-orange-400 hover:text-orange-300 hover:bg-surface-hover rounded-lg transition-colors">
                                      <Gift size={18} /><span className="text-[10px]">{contract.bonusTime ? 'Edit Bonus' : 'Bonus'}</span>
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleChangeContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-content-muted hover:text-content-primary hover:bg-surface-hover rounded-lg transition-colors">
                                      <ArrowRightLeft size={18} /><span className="text-[10px]">Change</span>
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-4 gap-1 mt-1">
                                    <button onClick={(e) => { e.stopPropagation(); handleViewHistory(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-content-muted hover:text-content-primary hover:bg-surface-hover rounded-lg transition-colors">
                                      <History size={18} /><span className="text-[10px]">History</span>
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleManageDocuments(contract); }} className="flex flex-col items-center gap-1 p-2 text-content-muted hover:text-content-primary hover:bg-surface-hover rounded-lg transition-colors">
                                      <FileText size={18} /><span className="text-[10px]">Docs</span>
                                    </button>
                                    <div className="p-2" />
                                    <button onClick={(e) => { e.stopPropagation(); handleCancelContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-red-400 hover:text-red-300 hover:bg-surface-hover rounded-lg transition-colors">
                                      <XCircle size={18} /><span className="text-[10px]">Cancel</span>
                                    </button>
                                  </div>
                                </>
                              )}

                              {contract.status === "Paused" && (
                                <>
                                  <div className="grid grid-cols-4 gap-1">
                                    <button onClick={(e) => { e.stopPropagation(); handleResumeContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-orange-400 hover:text-orange-300 hover:bg-surface-hover rounded-lg transition-colors">
                                      <PlayCircle size={18} /><span className="text-[10px]">Resume</span>
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleRenewContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-content-muted hover:text-content-primary hover:bg-surface-hover rounded-lg transition-colors">
                                      <RefreshCw size={18} /><span className="text-[10px]">Renew</span>
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleAddBonusTime(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-orange-400 hover:text-orange-300 hover:bg-surface-hover rounded-lg transition-colors">
                                      <Gift size={18} /><span className="text-[10px]">{contract.bonusTime ? 'Edit Bonus' : 'Bonus'}</span>
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleChangeContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-content-muted hover:text-content-primary hover:bg-surface-hover rounded-lg transition-colors">
                                      <ArrowRightLeft size={18} /><span className="text-[10px]">Change</span>
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-4 gap-1 mt-1">
                                    <button onClick={(e) => { e.stopPropagation(); handleViewHistory(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-content-muted hover:text-content-primary hover:bg-surface-hover rounded-lg transition-colors">
                                      <History size={18} /><span className="text-[10px]">History</span>
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleManageDocuments(contract); }} className="flex flex-col items-center gap-1 p-2 text-content-muted hover:text-content-primary hover:bg-surface-hover rounded-lg transition-colors">
                                      <FileText size={18} /><span className="text-[10px]">Docs</span>
                                    </button>
                                    <div className="p-2" />
                                    <button onClick={(e) => { e.stopPropagation(); handleCancelContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-red-400 hover:text-red-300 hover:bg-surface-hover rounded-lg transition-colors">
                                      <XCircle size={18} /><span className="text-[10px]">Cancel</span>
                                    </button>
                                  </div>
                                </>
                              )}

                              {contract.status === "Pending" && (
                                <div className="grid grid-cols-4 gap-1">
                                  <button onClick={(e) => { e.stopPropagation(); handleEditContract(contract); }} className="flex flex-col items-center gap-1 p-2 text-orange-400 hover:text-orange-300 hover:bg-surface-hover rounded-lg transition-colors">
                                    <Pencil size={18} /><span className="text-[10px]">Edit</span>
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); handleViewHistory(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-content-muted hover:text-content-primary hover:bg-surface-hover rounded-lg transition-colors">
                                    <History size={18} /><span className="text-[10px]">History</span>
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); handleManageDocuments(contract); }} className="flex flex-col items-center gap-1 p-2 text-content-muted hover:text-content-primary hover:bg-surface-hover rounded-lg transition-colors">
                                    <FileText size={18} /><span className="text-[10px]">Docs</span>
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); handleDeleteContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-red-400 hover:text-red-300 hover:bg-surface-hover rounded-lg transition-colors">
                                    <Trash2 size={18} /><span className="text-[10px]">Delete</span>
                                  </button>
                                </div>
                              )}

                              {contract.status === "Cancelled" && (
                                <div className="grid grid-cols-4 gap-1">
                                  <button onClick={(e) => { e.stopPropagation(); handleRenewContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-content-muted hover:text-content-primary hover:bg-surface-hover rounded-lg transition-colors">
                                    <RefreshCw size={18} /><span className="text-[10px]">Renew</span>
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); handleViewHistory(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-content-muted hover:text-content-primary hover:bg-surface-hover rounded-lg transition-colors">
                                    <History size={18} /><span className="text-[10px]">History</span>
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); handleManageDocuments(contract); }} className="flex flex-col items-center gap-1 p-2 text-content-muted hover:text-content-primary hover:bg-surface-hover rounded-lg transition-colors">
                                    <FileText size={18} /><span className="text-[10px]">Docs</span>
                                  </button>
                                  <div className="p-2" />
                                </div>
                              )}

                              {contract.status === "Scheduled" && (
                                <div className="grid grid-cols-4 gap-1">
                                  <button onClick={(e) => { e.stopPropagation(); handleManageDocuments(contract); }} className="flex flex-col items-center gap-1 p-2 text-content-muted hover:text-content-primary hover:bg-surface-hover rounded-lg transition-colors">
                                    <FileText size={18} /><span className="text-[10px]">Docs</span>
                                  </button>
                                  <div className="p-2" />
                                  <div className="p-2" />
                                  <button onClick={(e) => { e.stopPropagation(); handleCancelContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-red-400 hover:text-red-300 hover:bg-surface-hover rounded-lg transition-colors">
                                    <XCircle size={18} /><span className="text-[10px]">Cancel</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-content-muted text-sm">No contracts found.</p>
                    </div>
                  )}
                </div>
              </>
          ) : (
            // GRID VIEW
            <div className={`grid gap-4 ${isCompactView 
              ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
              {filteredAndSortedContracts().length > 0 ? (
                filteredAndSortedContracts().map((contract) => (
                  <div
                    key={contract.id}
                    className={`bg-surface-card rounded-xl hover:bg-surface-hover transition-colors relative ${isCompactView ? 'p-3' : 'p-4'}`}
                  >
                    {isExpiredContract(contract) && (
                      <div className="absolute inset-0 bg-surface-dark/70 z-[40] pointer-events-none rounded-xl" />
                    )}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => handleManageDocuments(contract)}
                        className={`bg-surface-button rounded-xl flex items-center justify-center hover:bg-surface-button-hover transition-colors cursor-pointer ${isCompactView ? 'w-12 h-12 mb-2' : 'w-20 h-20 mb-3'}`}
                        title="Open Contract Documents"
                      >
                        <FileText size={isCompactView ? 22 : 36} className="text-orange-400" />
                      </button>
                      <h3 className={`text-content-primary font-medium text-center ${isCompactView ? 'text-sm' : 'text-lg'}`}>{contract.memberName}</h3>
                      {contract.contractNumber && (
                        <p className={`text-content-faint ${isCompactView ? 'text-[10px]' : 'text-xs'}`}>#{contract.contractNumber}</p>
                      )}
                      <div className={`flex items-center gap-2 ${isCompactView ? 'mt-1' : 'mt-2'}`}>
                        <StatusTag status={contract.status} compact={isCompactView} pauseReason={contract.pauseReason} pauseStartDate={contract.pauseStartDate} pauseEndDate={contract.pauseEndDate} cancelReason={contract.cancelReason} cancelDate={contract.cancelDate} scheduledStartDate={contract.scheduledStartDate} />
                      </div>
                      <p className={`text-content-muted ${isCompactView ? 'text-xs mt-1' : 'text-sm mt-2'}`}>{contract.contractType}</p>
                      {contract.status !== "Pending" && (
                      <p className={`text-content-faint mt-1 ${isCompactView ? 'text-[10px]' : 'text-xs'}`}>
                        {formatDate(contract.startDate)} - {(() => {
                          const eff = getEffectiveEndDate(contract)
                          if (eff.isCancelledEarly) return <span className="text-red-400 font-medium">{formatDate(contract.endDate)}</span>
                          if (eff.isExtended) return <span className="text-orange-400 font-medium">{formatDate(eff.date)}</span>
                          return formatDate(contract.endDate)
                        })()}
                      </p>
                      )}
                      {!isCompactView && (
                        <div className="flex items-center gap-1 mt-1 text-xs">
                          {(() => {
                            const renewalInfo = getAutoRenewalInfo(contract)
                            const isCancelled = contract.status === 'Cancelled'
                            return renewalInfo.hasRenewal ? (
                              <div className="relative group inline-flex">
                                <span className={`flex items-center gap-1 cursor-pointer transition-transform duration-200 hover:scale-110 ${isCancelled ? 'text-content-faint line-through' : 'text-orange-400'}`}>
                                  <RefreshCw size={10} /> Auto Renewal
                                </span>
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-surface-dark text-content-primary px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg pointer-events-none">
                                  <div className={`flex items-center gap-2 ${isCancelled ? 'line-through text-content-muted' : ''}`}>
                                    <RefreshCw size={10} className={isCancelled ? 'text-content-faint' : 'text-orange-400'} />
                                    <span>{renewalInfo.tooltip}</span>
                                  </div>
                                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent" style={{ borderTopColor: 'var(--color-surface-dark)' }} />
                                </div>
                              </div>
                            ) : (
                              <span className="text-content-faint">No Auto Renewal</span>
                            )
                          })()}
                        </div>
                      )}
                      {shouldShowExpiring(contract) && (
                        <span className={`rounded-full bg-red-500/20 text-red-400 flex items-center gap-1 ${isCompactView ? 'mt-1 text-[10px] px-1.5 py-0.5' : 'mt-2 text-xs px-2 py-1'}`}>
                          <AlertTriangle size={isCompactView ? 10 : 12} /> Expiring
                        </span>
                      )}
                      {contract.bonusTime && (
                        <div className="relative group inline-flex mt-1">
                          <span className={`rounded-full bg-orange-500/20 text-orange-400 flex items-center gap-1 cursor-pointer transition-transform duration-200 hover:scale-110 ${isCompactView ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'}`}>
                            <Gift size={isCompactView ? 10 : 12} /> Bonus
                          </span>
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-surface-dark text-content-primary px-3 py-1.5 rounded text-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg pointer-events-none max-w-[280px]">
                            {(() => {
                              const eff = getEffectiveEndDate(contract)
                              return (
                                <div className="flex items-start gap-2">
                                  <Gift size={10} className="text-orange-400 mt-0.5 flex-shrink-0" />
                                  <div className="min-w-0 overflow-hidden">
                                    <span className="font-medium whitespace-nowrap">{contract.bonusTime.bonusAmount} {contract.bonusTime.bonusUnit}</span>
                                    {contract.bonusTime.reason && <span className="text-content-secondary block truncate"> — {contract.bonusTime.reason}</span>}
                                    {eff.bonusPeriod && <span className="text-content-muted block whitespace-nowrap mt-0.5">{eff.bonusPeriod}</span>}
                                    {contract.bonusTime.withExtension 
                                      ? <span className="text-green-400 block text-[10px] mt-0.5">+ Contract extension</span>
                                      : <span className="text-content-faint block text-[10px] mt-0.5">Without extension</span>
                                    }
                                  </div>
                                </div>
                              )
                            })()}
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent" style={{ borderTopColor: 'var(--color-surface-dark)' }} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons - Members-style visible icons */}
                    <div className={`bg-surface-dark rounded-lg ${isCompactView ? 'p-1.5 mt-2' : 'p-2 mt-4'}`}>
                      {/* Row 1 - Status action icons */}
                      <div className="grid grid-cols-5 gap-1">
                        {/* Active: Pause, Renew, Bonus, Change, Cancel */}
                        {contract.status === "Active" && (
                          <>
                            <button onClick={() => handlePauseContract(contract.id)} className={`text-content-muted hover:text-content-primary rounded-lg transition-colors flex items-center justify-center ${isCompactView ? 'p-1.5' : 'p-2'}`} title="Pause">
                              <PauseCircle size={isCompactView ? 14 : 16} />
                            </button>
                            <button onClick={() => handleRenewContract(contract.id)} className={`text-content-muted hover:text-content-primary rounded-lg transition-colors flex items-center justify-center ${isCompactView ? 'p-1.5' : 'p-2'}`} title="Renew">
                              <RefreshCw size={isCompactView ? 14 : 16} />
                            </button>
                            <button onClick={() => handleAddBonusTime(contract.id)} className={`text-orange-400 hover:text-orange-300 rounded-lg transition-colors flex items-center justify-center ${isCompactView ? 'p-1.5' : 'p-2'}`} title={contract.bonusTime ? 'Edit Bonus Time' : 'Add Bonus Time'}>
                              <Gift size={isCompactView ? 14 : 16} />
                            </button>
                            <button onClick={() => handleChangeContract(contract.id)} className={`text-content-muted hover:text-content-primary rounded-lg transition-colors flex items-center justify-center ${isCompactView ? 'p-1.5' : 'p-2'}`} title="Change Contract">
                              <ArrowRightLeft size={isCompactView ? 14 : 16} />
                            </button>
                            <button onClick={() => handleCancelContract(contract.id)} className={`text-red-400 hover:text-red-300 rounded-lg transition-colors flex items-center justify-center ${isCompactView ? 'p-1.5' : 'p-2'}`} title="Cancel">
                              <XCircle size={isCompactView ? 14 : 16} />
                            </button>
                          </>
                        )}

                        {/* Paused: Resume, Renew, Bonus, Change, Cancel */}
                        {contract.status === "Paused" && (
                          <>
                            <button onClick={() => handleResumeContract(contract.id)} className={`text-orange-400 hover:text-orange-300 rounded-lg transition-colors flex items-center justify-center ${isCompactView ? 'p-1.5' : 'p-2'}`} title="Resume">
                              <PlayCircle size={isCompactView ? 14 : 16} />
                            </button>
                            <button onClick={() => handleRenewContract(contract.id)} className={`text-content-muted hover:text-content-primary rounded-lg transition-colors flex items-center justify-center ${isCompactView ? 'p-1.5' : 'p-2'}`} title="Renew">
                              <RefreshCw size={isCompactView ? 14 : 16} />
                            </button>
                            <button onClick={() => handleAddBonusTime(contract.id)} className={`text-orange-400 hover:text-orange-300 rounded-lg transition-colors flex items-center justify-center ${isCompactView ? 'p-1.5' : 'p-2'}`} title={contract.bonusTime ? 'Edit Bonus Time' : 'Add Bonus Time'}>
                              <Gift size={isCompactView ? 14 : 16} />
                            </button>
                            <button onClick={() => handleChangeContract(contract.id)} className={`text-content-muted hover:text-content-primary rounded-lg transition-colors flex items-center justify-center ${isCompactView ? 'p-1.5' : 'p-2'}`} title="Change Contract">
                              <ArrowRightLeft size={isCompactView ? 14 : 16} />
                            </button>
                            <button onClick={() => handleCancelContract(contract.id)} className={`text-red-400 hover:text-red-300 rounded-lg transition-colors flex items-center justify-center ${isCompactView ? 'p-1.5' : 'p-2'}`} title="Cancel">
                              <XCircle size={isCompactView ? 14 : 16} />
                            </button>
                          </>
                        )}

                        {/* Pending: Edit, empty, empty, empty, Delete */}
                        {contract.status === "Pending" && (
                          <>
                            <button onClick={() => handleEditContract(contract)} className={`text-orange-400 hover:text-orange-300 rounded-lg transition-colors flex items-center justify-center ${isCompactView ? 'p-1.5' : 'p-2'}`} title="Edit">
                              <Pencil size={isCompactView ? 14 : 16} />
                            </button>
                            <div className={isCompactView ? 'p-1.5' : 'p-2'} />
                            <div className={isCompactView ? 'p-1.5' : 'p-2'} />
                            <div className={isCompactView ? 'p-1.5' : 'p-2'} />
                            <button onClick={() => handleDeleteContract(contract.id)} className={`text-red-400 hover:text-red-300 rounded-lg transition-colors flex items-center justify-center ${isCompactView ? 'p-1.5' : 'p-2'}`} title="Delete">
                              <Trash2 size={isCompactView ? 14 : 16} />
                            </button>
                          </>
                        )}

                        {/* Cancelled: empty, Renew, empty, empty, empty */}
                        {contract.status === "Cancelled" && (
                          <>
                            <div className={isCompactView ? 'p-1.5' : 'p-2'} />
                            <button onClick={() => handleRenewContract(contract.id)} className={`text-content-muted hover:text-content-primary rounded-lg transition-colors flex items-center justify-center ${isCompactView ? 'p-1.5' : 'p-2'}`} title="Renew">
                              <RefreshCw size={isCompactView ? 14 : 16} />
                            </button>
                            <div className={isCompactView ? 'p-1.5' : 'p-2'} />
                            <div className={isCompactView ? 'p-1.5' : 'p-2'} />
                            <div className={isCompactView ? 'p-1.5' : 'p-2'} />
                          </>
                        )}

                        {/* Scheduled: empty, empty, empty, empty, Cancel */}
                        {contract.status === "Scheduled" && (
                          <>
                            <div className={isCompactView ? 'p-1.5' : 'p-2'} />
                            <div className={isCompactView ? 'p-1.5' : 'p-2'} />
                            <div className={isCompactView ? 'p-1.5' : 'p-2'} />
                            <div className={isCompactView ? 'p-1.5' : 'p-2'} />
                            <button onClick={() => handleCancelContract(contract.id)} className={`text-red-400 hover:text-red-300 rounded-lg transition-colors flex items-center justify-center ${isCompactView ? 'p-1.5' : 'p-2'}`} title="Cancel">
                              <XCircle size={isCompactView ? 14 : 16} />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Row 2 - History button only */}
                      <div className="flex justify-center mt-1">
                        <button
                          onClick={() => handleViewHistory(contract.id)}
                          className={`text-content-muted hover:text-content-primary rounded-lg transition-colors flex items-center justify-center gap-1.5 ${isCompactView ? 'p-1' : 'p-2'}`}
                        >
                          <History size={isCompactView ? 12 : 14} />
                          <span className={`font-medium ${isCompactView ? 'text-[10px]' : 'text-xs'}`}>History</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 col-span-full">
                  <p className="text-content-muted text-sm">No contracts found.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Floating Action Button - Mobile */}
        <button
          onClick={handleAddContract}
          className="sm:hidden fixed bottom-4 right-4 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-xl shadow-lg transition-all active:scale-95 z-50"
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
            onClose={() => setIsDocumentModalOpen(false)}
          />
        )}

        {isBonusTimeModalOpen && selectedContract && (
          <BonusTimeModal
            contract={selectedContract}
            onClose={() => setIsBonusTimeModalOpen(false)}
            onSubmit={(bonusData) => {
              setContracts(contracts.map(c =>
                c.id === selectedContract.id
                  ? { ...c, bonusTime: bonusData }
                  : c
              ))
              setIsBonusTimeModalOpen(false)
              toast.success(selectedContract.bonusTime ? "Bonus time updated successfully" : "Bonus time added successfully")
            }}
            onDelete={() => {
              setContracts(contracts.map(c =>
                c.id === selectedContract.id
                  ? { ...c, bonusTime: null }
                  : c
              ))
              setIsBonusTimeModalOpen(false)
              toast.success("Bonus time removed")
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
            onClose={() => {
              setIsChangeModalOpen(false)
              setSelectedContract(null)
              setChangeFormFillData(null)
            }}
            onSubmit={handleChangeSubmit}
            initialData={changeFormFillData?.changeData || null}
          />
        )}

        {/* ContractFormFillModal for contract changes (signature required) */}
        {isChangeFormFillOpen && changeFormFillData && (
          <ContractFormFillModal
            isOpen={isChangeFormFillOpen}
            onClose={() => {
              // Go back to the ChangeContractModal instead of closing everything
              setIsChangeFormFillOpen(false)
              setIsChangeModalOpen(true)
              // Keep selectedContract and changeFormFillData so the change modal is still populated
            }}
            onSubmit={handleChangeFormFillComplete}
            contractType={changeFormFillData.contractType}
            contractData={{
              memberId: changeFormFillData.contract.memberId,
              startDate: changeFormFillData.changeData.startDate || changeFormFillData.contract.startDate,
              endDate: changeFormFillData.changeData.endDate || changeFormFillData.contract.endDate,
              trainingStartDate: changeFormFillData.contract.trainingStartDate,
              sepaReference: changeFormFillData.contract.sepaMandate,
            }}
            leadData={{
              firstName: changeFormFillData.contract.memberName?.split(' ')[0] || '',
              lastName: changeFormFillData.contract.memberName?.split(' ').slice(1).join(' ') || '',
              email: changeFormFillData.contract.email || '',
              phone: changeFormFillData.contract.phone || '',
              street: changeFormFillData.contract.address?.street || '',
              zipCode: changeFormFillData.contract.address?.zipCode || '',
              city: changeFormFillData.contract.address?.city || '',
              dateOfBirth: changeFormFillData.contract.dateOfBirth || '',
              iban: changeFormFillData.contract.iban || '',
              bic: changeFormFillData.contract.bic || '',
              bankName: changeFormFillData.contract.bankName || '',
              salutation: changeFormFillData.contract.salutation || '',
            }}
            existingFormData={changeFormFillData.contract.formData?.formValues || null}
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
