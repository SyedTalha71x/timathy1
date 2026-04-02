/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react"
import {
  MoreVertical,
  Plus,
  ChevronDown,
  FileText,

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
  AlertCircle,
  Info,
} from "lucide-react"
import toast from "../../components/shared/SharedToast"
import { useNavigate, useLocation } from "react-router-dom"

// Admin contract components
import { AdminContractModal } from "../../components/admin-dashboard-components/contract-components/admin-contract-modal"
import { AdminPauseContractModal } from "../../components/admin-dashboard-components/contract-components/admin-pause-contract-modal"
import { AdminCancelContractModal } from "../../components/admin-dashboard-components/contract-components/admin-cancel-contract-modal"
import { AdminContractManagement } from "../../components/admin-dashboard-components/contract-components/admin-contract-management"
import { AdminBonusTimeModal } from "../../components/admin-dashboard-components/contract-components/admin-bonus-time-modal"
import { AdminRenewContractModal } from "../../components/admin-dashboard-components/contract-components/admin-renew-contract-modal"
import { AdminChangeContractModal } from "../../components/admin-dashboard-components/contract-components/admin-change-contract-modal"
import { AdminDeleteContractModal } from "../../components/admin-dashboard-components/contract-components/admin-delete-contract-modal"
import { AdminContractFormFillModal } from "../../components/admin-dashboard-components/contract-components/AdminContractFormFillModal"
import { adminContractsFlatList } from "../../utils/admin-panel-states/admin-contract-states"
import { DEFAULT_ADMIN_CONTRACT_TYPES } from "../../utils/admin-panel-states/admin-contract-states"
import { studioDataNew } from "../../utils/admin-panel-states/customers-states"

import { useTranslation } from "react-i18next"
import { haptic } from "../../utils/haptic"
import KeyboardSpacer from "../../components/shared/KeyboardSpacer"
import PullToRefresh from "../../components/shared/PullToRefresh"
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
  const { t, i18n } = useTranslation()

  const statusTranslationMap = {
    'Active': t("admin.contract.status.active"),
    'Pending': t("admin.contract.status.pending"),
    'Paused': t("admin.contract.status.paused"),
    'Cancelled': t("admin.contract.status.cancelled"),
    'Scheduled': t("admin.contract.status.scheduled"),
  }
  const translatedStatus = statusTranslationMap[status] || status

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
  const formatD = (d) => d ? new Date(d).toLocaleDateString(i18n.language) : null;

  // Build tooltip content for Paused
  const renderPauseTooltip = () => {
    if (status !== 'Paused') return null;
    return (
      <>
        {pauseReason && (
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-medium">{t("admin.contract.tooltip.reason")}:</span>
            <span>{pauseReason}</span>
          </div>
        )}
        {pauseStartDate && pauseEndDate && (
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-medium">{t("admin.contract.tooltip.period")}:</span>
            <span>{formatD(pauseStartDate)} - {formatD(pauseEndDate)}</span>
          </div>
        )}
        {pauseStartDate && !pauseEndDate && (
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-medium">{t("admin.contract.tooltip.since")}:</span>
            <span>{formatD(pauseStartDate)}</span>
          </div>
        )}
        {!pauseReason && !pauseStartDate && (
          <span>{t("admin.contract.status.paused")}</span>
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
            <span className="text-red-400 font-medium">{t("admin.contract.tooltip.reason")}:</span>
            <span>{cancelReason}</span>
          </div>
        )}
        {cancelDate && (
          <div className="flex items-center gap-2">
            <span className="text-red-400 font-medium">{t("admin.contract.tooltip.cancelled")}:</span>
            <span>{formatD(cancelDate)}</span>
          </div>
        )}
        {!cancelReason && !cancelDate && (
          <span>{t("admin.contract.status.cancelled")}</span>
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
            <span className="text-content-muted font-medium">{t("admin.contract.tooltip.starts")}:</span>
            <span>{formatD(scheduledStartDate)}</span>
          </div>
        )}
        {!scheduledStartDate && (
          <span>{t("admin.contract.status.scheduled")}</span>
        )}
      </>
    );
  };

  if (compact) {
    return (
      <div className={`relative ${hasTooltip ? 'group' : ''}`}>
        <div className={`inline-flex items-center gap-1 ${bgColor} text-white px-2 py-1 rounded-lg text-xs font-medium transition-transform duration-200 ${hasHoverEffect ? 'cursor-pointer hover:scale-110' : ''}`}>
          <span className="truncate max-w-[140px]">{translatedStatus}</span>
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
        <span>{translatedStatus}</span>
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

export default function AdminContractList({ studioId: studioIdProp = null, studioName: studioNameProp = null }) {
  const navigate = useNavigate()
  const location = useLocation()

  // ============================================
  // Admin mode: contracts come from admin-contract-states
  // ============================================

  // View and display states
  const [viewMode, setViewMode] = useState("list")
  const { t, i18n } = useTranslation()
  const [isCompactView, setIsCompactView] = useState(false)
  const [expandedMobileRowId, setExpandedMobileRowId] = useState(null)
  const [expandedCompactId, setExpandedCompactId] = useState(null)

  // Contract data - loaded from admin contract states
  const [contracts, setContracts] = useState(
    studioIdProp
      ? adminContractsFlatList.filter(c => c.studioId === studioIdProp)
      : adminContractsFlatList
  )

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
          cancelReason: t("admin.contract.reasons.expired"),
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
            cancelReason: t("admin.contract.reasons.changed"),
            cancelDate: contract.scheduledCancelDate || new Date().toISOString().split('T')[0],
            changedToContractId: activatedReplacement.id,
          }
        }
        return contract
      })
      setContracts(updated)
    }
  }, []) // Run once on mount
  
  // Studios data for selection and display
  const [studios, setStudios] = useState(studioDataNew)

  // Lookup owner name from studios data by studioId
  const getOwnerName = (studioId) => {
    const studio = studios.find(s => s.id === studioId)
    return studio?.ownerName || '-'
  }

  // Admin panel: no hook-based loading needed, data comes directly from admin-contract-states
  
  // Search states - matches members.jsx
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const searchDropdownRef = useRef(null)
  const searchInputRef = useRef(null)
  
  // Member filters - array of filtered members (can be multiple)
  const [studioFilters, setMemberFilters] = useState([])
  // [{ studioId: string, studioName: string }, ...]

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
  // State for ContractFormFillModal after contract change
  const [isChangeFormFillOpen, setIsChangeFormFillOpen] = useState(false)
  const [changeFormFillData, setChangeFormFillData] = useState(null)
  // Track draft ID when editing a change-draft, so we can remove it after re-submitting
  const [editingChangeDraftId, setEditingChangeDraftId] = useState(null)
  // State for ContractFormFillModal after contract renew (mirrors change flow)
  const [isRenewFormFillOpen, setIsRenewFormFillOpen] = useState(false)
  const [renewFormFillData, setRenewFormFillData] = useState(null)
  // Renew confirmation when member has other running contracts
  const [renewConfirmData, setRenewConfirmData] = useState(null)
  const [resumeConfirmData, setResumeConfirmData] = useState(null)
  const [removeBonusConfirmData, setRemoveBonusConfirmData] = useState(null)

  // Sort options - matches members.jsx pattern
  const sortOptions = [
    { value: "name", label: t("admin.contract.sort.name") },
    { value: "contractType", label: t("admin.contract.sort.contractType") },
    { value: "status", label: t("admin.contract.sort.status") },
    { value: "expiring", label: t("admin.contract.sort.expiring") },
    { value: "recentlyAdded", label: t("admin.contract.sort.recentlyAdded") },
  ]

  // Get current sort label
  const currentSortLabel = sortOptions.find(o => o.value === sortBy)?.label || t("admin.contract.sort.name")

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
      return { hasRenewal: false, label: t("common.no"), tooltip: t("admin.contract.autoRenewal.none") }
    }
    
    // Check if renewal is indefinite (from contract or lookup from contract type)
    const isIndefinite = contract.renewalIndefinite === true
    
    if (isIndefinite) {
      return { 
        hasRenewal: true, 
        label: t("common.yes"), 
        sublabel: t("admin.contract.autoRenewal.unlimited"),
        tooltip: t("admin.contract.autoRenewal.unlimitedTooltip") 
      }
    }
    
    // Limited renewal - show the renewal period or end date
    if (contract.autoRenewalEndDate) {
      return { 
        hasRenewal: true, 
        label: t("common.yes"), 
        sublabel: t("admin.contract.autoRenewal.until", { date: formatDate(contract.autoRenewalEndDate) }),
        tooltip: t("admin.contract.autoRenewal.untilTooltip", { date: formatDate(contract.autoRenewalEndDate) }) 
      }
    }
    
    // Lookup from contract type if available
    const contractType = DEFAULT_ADMIN_CONTRACT_TYPES.find(t => t.name === contract.contractType)
    if (contractType?.renewalPeriod) {
      return { 
        hasRenewal: true, 
        label: t("common.yes"), 
        sublabel: t("admin.contract.autoRenewal.plusMonths", { months: contractType.renewalPeriod }),
        tooltip: t("admin.contract.autoRenewal.renewsForMonths", { months: contractType.renewalPeriod }) 
      }
    }
    
    // Fallback
    return { hasRenewal: true, label: t("common.yes"), sublabel: "", tooltip: t("admin.contract.autoRenewal.enabled") }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(i18n.language)
  }

  // Translate status values for display
  const translateStatus = (status) => {
    const map = {
      'Active': t("admin.contract.status.active"),
      'Pending': t("admin.contract.status.pending"),
      'Paused': t("admin.contract.status.paused"),
      'Cancelled': t("admin.contract.status.cancelled"),
      'Scheduled': t("admin.contract.status.scheduled"),
    }
    return map[status] || status
  }


  // Calculate the effective end date considering bonus time
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
    return { 
      date: contract.endDate, 
      isExtended: false, 
      isCancelledEarly,
      bonusPeriod,
      effectiveEndDate: end.toISOString().split('T')[0],
    }
  }

  // Get unique members from contracts for search suggestions
  const getUniqueMembersFromContracts = () => {
    const memberMap = new Map()
    contracts.forEach(contract => {
      if (!memberMap.has(contract.studioId)) {
        memberMap.set(contract.studioId, {
          studioId: contract.studioId,
          studioName: contract.studioName,
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
      const isAlreadyFiltered = studioFilters.some(f => f.studioId === member.studioId)
      if (isAlreadyFiltered) return false
      
      const query = searchQuery.toLowerCase()
      return member.studioName.toLowerCase().includes(query) ||
        (member.contractNumber && member.contractNumber.toLowerCase().includes(query))
    }).slice(0, 6)
  }

  // Handle selecting a member from search suggestions
  const handleSelectMember = (member) => {
    setMemberFilters([...studioFilters, {
      studioId: member.studioId,
      studioName: member.studioName
    }])
    setSearchQuery("")
    setShowSearchDropdown(false)
    searchInputRef.current?.focus()
  }

  // Handle removing a member filter
  const handleRemoveFilter = (studioId) => {
    setMemberFilters(studioFilters.filter(f => f.studioId !== studioId))
  }

  // Handle keyboard navigation
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Backspace' && !searchQuery && studioFilters.length > 0) {
      // Remove last filter when backspace is pressed with empty input
      setMemberFilters(studioFilters.slice(0, -1))
    } else if (e.key === 'Escape') {
      setShowSearchDropdown(false)
    }
  }

  // Filter and sort contracts
  const filteredAndSortedContracts = () => {
    let filtered = [...contracts]

    // If studioFilters are active, show only those members' contracts
    if (studioFilters.length > 0) {
      const filterIds = studioFilters.map(f => f.studioId)
      filtered = filtered.filter(contract => filterIds.includes(contract.studioId))
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
          comparison = a.studioName.localeCompare(b.studioName)
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
          comparison = a.studioName.localeCompare(b.studioName)
      }
      return sortDirection === "asc" ? comparison : -comparison
    })

    // Always pin Pending contracts to the top, regardless of sort
    const pending = filtered.filter(c => c.status === 'Pending')
    const rest = filtered.filter(c => c.status !== 'Pending')

    return [...pending, ...rest]
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
        studioId: location.state.filterMemberId,
        studioName: location.state.filterMemberName || t("admin.customers.shared.entityMember")
      }])
      // Clear the navigation state to prevent re-filtering on refresh
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  // Handle pre-selected lead from Leads page (open create modal automatically)
  useEffect(() => {
    if (location.state?.preSelectedLead) {
      setSelectedLead(location.state.preSelectedLead)
      setIsModalOpen(true)
      // Clear the navigation state so it doesn't re-trigger
      navigate(location.pathname, { replace: true, state: {} })
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
        isChangeFormFillOpen ||
        isRenewFormFillOpen ||
        renewConfirmData ||
        resumeConfirmData ||
        removeBonusConfirmData;

      // ESC key - Close modals
      if (e.key === 'Escape') {
        e.preventDefault();
        if (renewConfirmData) setRenewConfirmData(null);
        else if (resumeConfirmData) setResumeConfirmData(null);
        else if (removeBonusConfirmData) setRemoveBonusConfirmData(null);
        else if (isModalOpen) setIsModalOpen(false);
        else if (isPauseModalOpen) setIsPauseModalOpen(false);
        else if (isCancelModalOpen) setIsCancelModalOpen(false);
        else if (isDeleteModalOpen) setIsDeleteModalOpen(false);
        else if (isEditModalOpenContract) setIsEditModalOpenContract(false);
        else if (isDocumentModalOpen) setIsDocumentModalOpen(false);
        else if (isBonusTimeModalOpen) setIsBonusTimeModalOpen(false);
        else if (isRenewModalOpen) setIsRenewModalOpen(false);
        else if (isChangeModalOpen) setIsChangeModalOpen(false);
        else if (isChangeFormFillOpen) setIsChangeFormFillOpen(false);
        else if (isRenewFormFillOpen) setIsRenewFormFillOpen(false);
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
    isRenewFormFillOpen,
    renewConfirmData,
    resumeConfirmData,
    removeBonusConfirmData
  ]);

  // Contract handlers
  const handleEditContract = (contract) => {
    // If this is a draft from a contract change, open the change contract flow
    if (contract.changedFromContractId) {
      const originalContract = contracts.find(c => c.id === contract.changedFromContractId)
      if (originalContract) {
        // Store the draft ID so we can delete it when the new change is finalized
        setEditingChangeDraftId(contract.id)
        setSelectedContract(originalContract)
        // Pre-fill the change modal with data from the draft
        setChangeFormFillData({
          changeData: {
            newContractType: contract.contractType,
            startDate: contract.startDate,
            discount: contract.discount || null,
            changeReason: contract.changeReason || null,
          },
          contractType: DEFAULT_ADMIN_CONTRACT_TYPES.find(t => t.name === contract.contractType),
          contract: originalContract,
        })
        setIsChangeModalOpen(true)
        return
      }
    }
    setSelectedContract(contract)
    setIsEditModalOpenContract(true)
  }

  const handlePauseContract = (contractId) => {
    setSelectedContract(contracts.find((c) => c.id === contractId))
    setIsPauseModalOpen(true)
  }

  const handleResumeContract = (contractId) => {
    const contractToResume = contracts.find((c) => c.id === contractId)
    if (contractToResume) {
      setResumeConfirmData(contractToResume)
    }
  }

  const confirmResume = () => {
    if (resumeConfirmData) {
      setContracts(contracts.map((c) =>
        c.id === resumeConfirmData.id ? { ...c, status: "Active", pauseReason: null } : c
      ))
      haptic.success(); toast.success(t("admin.contract.toast.resumed"))
    }
    setResumeConfirmData(null)
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
    haptic.success(); toast.success(t("admin.contract.toast.scheduledCancelled"))
  }

  const handleDeleteContract = (contractId) => {
    const contract = contracts.find((c) => c.id === contractId)
    setContractToDelete(contract)
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteContract = () => {
    if (contractToDelete) {
      setContracts(contracts.filter((c) => c.id !== contractToDelete.id))
      haptic.success(); toast.success(t("admin.contract.toast.deleted"))
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
    const contract = contracts.find((c) => c.id === contractId)
    if (contract) {
      setRemoveBonusConfirmData(contract)
    }
  }

  const confirmRemoveBonusTime = () => {
    if (removeBonusConfirmData) {
      setContracts(contracts.map(c =>
        c.id === removeBonusConfirmData.id ? { ...c, bonusTime: null } : c
      ))
      haptic.success(); toast.success(t("admin.contract.toast.bonusRemoved"))
    }
    setRemoveBonusConfirmData(null)
  }

  const handleRenewContract = (contractId) => {
    const contractToRenew = contracts.find((c) => c.id === contractId)
    if (!contractToRenew) return

    // Check if the member already has other running contracts
    const runningStatuses = ['Active', 'Pending', 'Scheduled']
    const otherRunning = contracts.filter(c => 
      c.studioId === contractToRenew.studioId && 
      c.id !== contractId && 
      runningStatuses.includes(c.status)
    )

    if (otherRunning.length > 0) {
      // Show confirmation prompt
      setRenewConfirmData({ contract: contractToRenew, otherContracts: otherRunning })
    } else {
      setSelectedContract(contractToRenew)
      setIsRenewModalOpen(true)
    }
  }

  const confirmRenew = () => {
    if (renewConfirmData?.contract) {
      setSelectedContract(renewConfirmData.contract)
      setIsRenewModalOpen(true)
    }
    setRenewConfirmData(null)
  }

  const handleChangeContract = (contractId) => {
    setSelectedContract(contracts.find((c) => c.id === contractId))
    setIsChangeModalOpen(true)
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
        studioName: contractData.studioName,
        studioId: contractData.studioId || `M-${Date.now()}`,
        contractType: contractData.contractType,
        startDate: contractData.startDate,
        endDate: contractData.endDate,
        accessStartDate: contractData.accessStartDate,
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
        studioName: contractData.fullName,
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
      studioId: newContract.studioId,
      studioName: newContract.studioName
    }])
    
    // Lead-to-Member Conversion Logic
    // Convert for Active and Scheduled contracts (not Pending)
    const contractStatus = newContract.status || "Active"
    const leadId = contractData.leadId || contractData.studioId
    
    if ((contractStatus === "Active" || contractStatus === "Scheduled") && leadId) {
      // Find the lead to convert
      const leadToConvert = leads.find(lead => 
        lead.id === leadId || 
        lead.leadId === leadId ||
        `${lead.firstName} ${lead.lastName}` === newContract.studioName
      )
      
      if (leadToConvert) {
        // Create new member from lead data
        const newMember = {
          id: newContract.studioId || `member-${Date.now()}`,
          firstName: leadToConvert.firstName || contractData.firstName || newContract.studioName?.split(' ')[0] || '',
          lastName: leadToConvert.lastName || contractData.lastName || newContract.studioName?.split(' ').slice(1).join(' ') || '',
          title: newContract.studioName,
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
        
        haptic.success(); toast.success(t("admin.contract.toast.leadConverted", { name: newContract.studioName }))
      }
    } else if (contractStatus === "Pending") {
      // For Pending contracts, keep the lead - no conversion yet
      toast.info(t("admin.contract.toast.savedAsDraft"))
    }
    
    // Toast is handled by contract-modal.jsx for new format
    if (!isNewFormat) {
      haptic.success(); toast.success(t("admin.contract.toast.added"))
    }
  }

  const handleSaveEditedContract = (updatedContract) => {
    setContracts(contracts.map((c) => (c.id === updatedContract.id ? updatedContract : c)))
    setIsEditModalOpenContract(false)
    haptic.success(); toast.success(t("admin.contract.toast.updated"))
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
    haptic.success(); toast.success(t("admin.contract.toast.paused"))
  }

  const handleCancelSubmit = ({ reason, cancelDate, cancelToDate, cancellationType, extraordinaryCancellation, cancellationThroughStudio, notificationRule }) => {
    if (selectedContract) {
      setContracts(contracts.map((c) => {
        if (c.id !== selectedContract.id) return c
        const updates = {
          ...c,
          status: "Cancelled",
          cancelReason: reason,
          cancelDate: cancelDate || null,
          cancelToDate: cancelToDate || null,
          cancellationType: cancellationType || "extraordinary",
          extraordinaryCancellation: extraordinaryCancellation || false,
          cancellationThroughStudio: cancellationThroughStudio || false,
          notificationRule: notificationRule ?? true,
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
    haptic.success(); toast.success(t("admin.contract.toast.cancelled"))
  }

  const handleRenewSubmit = (renewalData) => {
    if (selectedContract) {
      // Store the renew data and check if form fill is needed (mirrors handleChangeSubmit)
      const newContractType = renewalData.selectedContractType || 
        DEFAULT_ADMIN_CONTRACT_TYPES.find(t => t.name === renewalData.newContractType || t.name === renewalData.contractType)

      setRenewFormFillData({
        renewalData,
        contractType: newContractType,
        contract: selectedContract,
      })
      setIsRenewModalOpen(false)

      // If the contract type has a form, open the form fill modal
      if (newContractType?.contractFormId) {
        setIsRenewFormFillOpen(true)
      } else {
        // No form attached — create the new contract directly
        finalizeContractRenew(renewalData, newContractType, selectedContract, null)
      }
    }
  }

  // Handle completion of ContractFormFillModal after contract renew
  const handleRenewFormFillComplete = (formData) => {
    if (renewFormFillData && renewFormFillData.contract) {
      const { renewalData, contractType, contract: originalContract } = renewFormFillData
      finalizeContractRenew(renewalData, contractType, originalContract, formData)
    }
    
    setIsRenewFormFillOpen(false)
    setSelectedContract(null)
    setRenewFormFillData(null)
  }

  // Shared logic: handle contract renew (Scheduled if future, immediate if today)
  const finalizeContractRenew = (renewalData, contractType, originalContract, formData) => {
    const fv = formData?.formValues || {}
    
    // Use the dates calculated by the modal
    const startDate = renewalData.startDate || originalContract.startDate
    let newEndDate = renewalData.endDate || originalContract.endDate
    if (!newEndDate && startDate && contractType?.duration) {
      const start = new Date(startDate)
      start.setMonth(start.getMonth() + parseInt(contractType.duration))
      newEndDate = start.toISOString().split('T')[0]
    }

    // Determine if the start date is in the future
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const renewStartDate = new Date(startDate)
    renewStartDate.setHours(0, 0, 0, 0)
    const isFutureStart = renewStartDate > today

    // Build the new contract object
    const newContract = {
      id: `12321-${Date.now()}`,
      contractNumber: `C-${Date.now()}`,
      studioName: originalContract.studioName,
      studioId: originalContract.studioId,
      contractType: renewalData.newContractType || renewalData.contractType,
      startDate: startDate,
      endDate: newEndDate,
      accessStartDate: originalContract.accessStartDate,
      status: (formData?.isDraft) ? "Pending" : (isFutureStart ? "Scheduled" : (formData?.status || "Active")),
      scheduledStartDate: (isFutureStart && !formData?.isDraft) ? startDate : null,
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
      discount: renewalData.discount || null,
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
      renewedFromContractId: originalContract.id,
      renewReason: renewalData.renewReason || null,
    }

    const isDraft = formData?.isDraft || false

    if (isDraft) {
      // Draft: just add the new contract as Pending, don't touch the old contract yet
      setContracts(prev => [...prev, newContract])
      haptic.success(); toast.success(t("admin.contract.toast.renewDraft"))
    } else if (isFutureStart) {
      // Future start: old contract stays as-is (it will end naturally or on its end date)
      // New contract is "Scheduled" - will auto-activate on start date
      setContracts(prev => {
        const updated = prev.map(c =>
          c.id === originalContract.id
            ? {
                ...c,
                renewedToContractId: newContract.id,
              }
            : c
        )
        return [...updated, newContract]
      })
      haptic.success(); toast.success(t("admin.contract.toast.renewScheduled", { date: new Date(startDate).toLocaleDateString(i18n.language) }))
    } else {
      // Immediate: mark old contract as ended/renewed, new contract is Active
      setContracts(prev => {
        const updated = prev.map(c =>
          c.id === originalContract.id
            ? {
                ...c,
                status: "Cancelled",
                cancelReason: t("admin.contract.reasons.renewed"),
                cancelDate: new Date().toISOString().split('T')[0],
                renewedToContractId: newContract.id,
              }
            : c
        )
        return [...updated, newContract]
      })
      haptic.success(); toast.success(t("admin.contract.toast.renewed"))
    }

    // Filter to show the member's contracts
    setMemberFilters([{
      studioId: newContract.studioId,
      studioName: newContract.studioName,
    }])
  }

  const handleChangeSubmit = (changeData) => {
    if (selectedContract) {
      // Store the change data and open the ContractFormFillModal for the new contract type
      const newContractType = changeData.selectedContractType || 
        DEFAULT_ADMIN_CONTRACT_TYPES.find(t => t.name === changeData.newContractType)
      
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
      studioName: originalContract.studioName,
      studioId: originalContract.studioId,
      contractType: changeData.newContractType,
      startDate: changeData.startDate || originalContract.startDate,
      endDate: newEndDate,
      accessStartDate: originalContract.accessStartDate,
      // If start date is in the future -> Scheduled, otherwise Active
      // BUT: if it's a draft (incomplete form), always set to Pending
      status: (formData?.isDraft) ? "Pending" : (isFutureStart ? "Scheduled" : (formData?.status || "Active")),
      scheduledStartDate: (isFutureStart && !formData?.isDraft) ? changeData.startDate : null,
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

    const isDraft = formData?.isDraft || false
    const draftIdToRemove = editingChangeDraftId
    if (draftIdToRemove) setEditingChangeDraftId(null)

    // Helper: remove old draft from contract list if editing an existing one
    const removeDraft = (list) => draftIdToRemove ? list.filter(c => c.id !== draftIdToRemove) : list

    if (isDraft) {
      // Draft: just add the new contract as Pending, don't touch the old contract yet
      setContracts(prev => [...removeDraft(prev), newContract])
      haptic.success(); toast.success(t("admin.contract.toast.changeDraft"))
    } else if (isFutureStart) {
      // Future start: old contract stays Active, gets scheduled cancel date
      // New contract is "Scheduled" - will auto-activate on start date
      setContracts(prev => {
        const updated = removeDraft(prev).map(c =>
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
      haptic.success(); toast.success(t("admin.contract.toast.changeScheduled", { date: new Date(changeData.startDate).toLocaleDateString(i18n.language) }))
    } else {
      // Immediate: cancel old contract now, new contract is Active
      setContracts(prev => {
        const updated = removeDraft(prev).map(c =>
          c.id === originalContract.id
            ? {
                ...c,
                status: "Cancelled",
                cancelReason: t("admin.contract.reasons.changed"),
                cancelDate: new Date().toISOString().split('T')[0],
                changedToContractId: newContract.id,
              }
            : c
        )
        return [...updated, newContract]
      })
      haptic.success(); toast.success(t("admin.contract.toast.changed"))
    }

    // Filter to show the member's contracts
    setMemberFilters([{
      studioId: newContract.studioId,
      studioName: newContract.studioName,
    }])
  }

  const toggleDropdownContract = (contractId, event) => {
    event.stopPropagation()
    setActiveDropdownId(activeDropdownId === contractId ? null : contractId)
  }

  return (
    <>


      <div className="flex flex-col lg:flex-row rounded-3xl bg-surface-base transition-all duration-500 text-content-primary relative select-none">
        <div className="flex-1 min-w-0 md:p-6 p-4 pb-36">
          {/* Header - matches members.jsx */}
          <div className="flex sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-content-primary oxanium_font text-xl md:text-2xl">{t("admin.contract.title")}</h1>
              
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
                      <div className="px-3 py-1.5 text-xs text-content-faint font-medium border-b border-border">{t("common.sortBy")}</div>
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
                    <span className="font-medium">{t("admin.contract.view.grid")}</span>
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
                    <span className="font-medium">{t("admin.contract.view.list")}</span>
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
                    <span className="font-medium">{isCompactView ? t("admin.contract.view.compact") : t("admin.contract.view.detailed")}</span>
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
                  <span className='hidden sm:inline'>{t("admin.contract.createContract")}</span>
                </button>
                
                {/* Tooltip - YouTube Style */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-surface-dark text-content-primary px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
                  <span className="font-medium">{t("admin.contract.createContract")}</span>
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
                {studioFilters.map((filter) => (
                  <div 
                    key={filter.studioId}
                    className="flex items-center gap-1.5 bg-primary/20 border border-primary/40 rounded-lg px-2 py-1 text-sm"
                  >
                    <div className="w-5 h-5 rounded bg-surface-button flex items-center justify-center flex-shrink-0">
                      <FileText size={12} className="text-orange-400" />
                    </div>
                    <span className="text-content-primary text-xs whitespace-nowrap">{filter.studioName}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFilter(filter.studioId);
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
                  placeholder={studioFilters.length > 0 ? t("admin.contract.search.addMore") : t("admin.contract.search.placeholder")}
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
                {studioFilters.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setMemberFilters([])
                    }}
                    className="p-1 hover:bg-surface-button rounded-lg transition-colors flex-shrink-0"
                    title={t("admin.contract.filters.clearAll")}
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
                      key={member.studioId}
                      onClick={() => handleSelectMember(member)}
                      className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-surface-button transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-surface-button flex items-center justify-center flex-shrink-0">
                        <FileText size={16} className="text-orange-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-content-primary truncate">{member.studioName}</p>
                        <p className="text-xs text-content-faint truncate">{member.contractType}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {/* No results message */}
              {showSearchDropdown && searchQuery.trim() && getSearchSuggestions().length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-surface-hover border border-border rounded-xl shadow-lg z-50 p-3">
                  <p className="text-sm text-content-faint text-center">{t("admin.contract.search.noMembers")}</p>
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
                <span className="text-xs sm:text-sm font-medium">{t("admin.contract.filters.title")}</span>
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
                      <div className="px-3 py-1.5 text-xs text-content-faint font-medium border-b border-border">{t("common.sortBy")}</div>
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
                  {t("common.all")} ({contracts.length})
                </button>
                <button
                  onClick={() => setFilterStatuses(prev => prev.includes('active') ? prev.filter(f => f !== 'active') : [...prev, 'active'])}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${filterStatuses.includes('active') ? "bg-primary text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"}`}
                >
                  {t("admin.contract.status.active")} ({contracts.filter((c) => c.status === "Active").length})
                </button>
                <button
                  onClick={() => setFilterStatuses(prev => prev.includes('scheduled') ? prev.filter(f => f !== 'scheduled') : [...prev, 'scheduled'])}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${filterStatuses.includes('scheduled') ? "bg-primary text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"}`}
                >
                  {t("admin.contract.status.scheduled")} ({contracts.filter((c) => c.status === "Scheduled").length})
                </button>
                <button
                  onClick={() => setFilterStatuses(prev => prev.includes('pending') ? prev.filter(f => f !== 'pending') : [...prev, 'pending'])}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${filterStatuses.includes('pending') ? "bg-primary text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"}`}
                >
                  {t("admin.contract.status.pending")} ({contracts.filter((c) => c.status === "Pending").length})
                </button>
                <button
                  onClick={() => setFilterStatuses(prev => prev.includes('paused') ? prev.filter(f => f !== 'paused') : [...prev, 'paused'])}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${filterStatuses.includes('paused') ? "bg-primary text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"}`}
                >
                  {t("admin.contract.status.paused")} ({contracts.filter((c) => c.status === "Paused").length})
                </button>
                <button
                  onClick={() => setFilterStatuses(prev => prev.includes('cancelled') ? prev.filter(f => f !== 'cancelled') : [...prev, 'cancelled'])}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${filterStatuses.includes('cancelled') ? "bg-primary text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"}`}
                >
                  {t("admin.contract.status.cancelled")} ({contracts.filter((c) => c.status === "Cancelled").length})
                </button>
              </div>
            </div>
          </div>

        {/* Content */}
        <PullToRefresh onRefresh={async () => {}} className="open_sans_font">
          {viewMode === "list" ? (
            // LIST VIEW
            <>
              {/* Desktop Table - unified compact/detailed */}
              <div className="hidden lg:block">
                <div className="bg-surface-card rounded-xl overflow-visible">
                  {/* Table Header */}
                  <div className={`grid grid-cols-[auto_1fr_1.2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 px-4 bg-surface-dark text-content-muted font-medium border-b border-border rounded-t-xl ${isCompactView ? 'py-2 text-xs' : 'py-3 text-sm'}`}>
                    <div className={`text-center pr-4 ${isCompactView ? 'w-14' : 'w-20'}`}>{t("admin.contract.table.contract")}</div>
                    <div>{t("admin.contract.table.contractNo")}</div>
                    <div>{t("admin.contract.table.studioName")}</div>
                    <div>{t("admin.contract.table.owner")}</div>
                    <div>{t("admin.contract.table.contractType")}</div>
                    <div>{t("admin.contract.table.status")}</div>
                    <div>{t("admin.contract.table.autoRenewal")}</div>
                    <div>{t("admin.contract.table.contractDuration")}</div>
                    <div className={`text-right ${isCompactView ? 'w-20' : 'w-24'}`}>{t("admin.contract.table.actions")}</div>
                  </div>
                  {/* Table Body */}
                  {filteredAndSortedContracts().length > 0 ? (
                    filteredAndSortedContracts().map((contract, idx, arr) => (
                      <React.Fragment key={contract.id}>
                        {idx > 0 && contract.status !== 'Pending' && arr[idx - 1].status === 'Pending' && (
                          <div className="px-4 py-3">
                            <div className="border-t border-border" />
                          </div>
                        )}
                      <div
                        className={`grid grid-cols-[auto_1fr_1.2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 px-4 items-center border-b border-border/50 hover:bg-surface-hover transition-colors relative ${isCompactView ? 'py-2' : 'py-3'} ${contract.status === 'Pending' ? 'border border-dashed border-primary/40 rounded-xl my-1 bg-primary/5' : ''}`}
                      >
                        {isExpiredContract(contract) && (
                          <div className="absolute inset-0 bg-surface-dark/70 z-[1] pointer-events-none" />
                        )}
                        <div className={`flex items-center justify-center pr-4 ${isCompactView ? 'w-14' : 'w-20'}`}>
                          <button
                            onClick={() => handleManageDocuments(contract)}
                            className={`bg-surface-button rounded-xl flex items-center justify-center hover:bg-surface-button-hover transition-colors cursor-pointer ${isCompactView ? 'w-8 h-8' : 'w-10 h-10'}`}
                            title={t("admin.contract.actions.openDocuments")}
                          >
                            <FileText size={isCompactView ? 16 : 20} className="text-orange-400" />
                          </button>
                        </div>
                        <div className={`text-content-muted truncate ${isCompactView ? 'text-xs' : 'text-sm'}`} title={contract.contractNumber || '-'}>
                          {contract.contractNumber || '-'}
                        </div>
                        <div className="flex items-center">
                          <span className={`text-content-primary font-medium ${isCompactView ? 'text-xs' : 'text-sm'}`}>{contract.studioName}</span>
                        </div>
                        <div className={`text-content-secondary truncate ${isCompactView ? 'text-xs' : 'text-sm'}`} title={getOwnerName(contract.studioId)}>
                          {getOwnerName(contract.studioId)}
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
                                  <RefreshCw size={isCompactView ? 10 : 12} /> {t("common.yes")}
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
                              <span className="text-content-faint">{t("common.no")}</span>
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
                            return formatDate(contract.endDate)
                          })()}
                          {shouldShowExpiring(contract) && (
                            <span className={`ml-2 text-red-400 flex items-center gap-1 inline-flex ${isCompactView ? 'text-[10px]' : 'text-xs'}`}>
                              <AlertTriangle size={isCompactView ? 10 : 12} />
                              {t("admin.contract.labels.expiring")}
                            </span>
                          )}
                          {contract.bonusTime && (
                            <div className="relative group inline-flex ml-2">
                              <span className={`text-orange-400 flex items-center gap-1 cursor-pointer transition-transform duration-200 hover:scale-110 ${isCompactView ? 'text-[10px]' : 'text-xs'}`}>
                                <Gift size={isCompactView ? 10 : 12} />
                                {t("admin.contract.labels.bonus")}
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
                            <button onClick={() => handleEditContract(contract)} className={`text-orange-400 hover:text-orange-300 hover:bg-surface-hover rounded-lg transition-colors ${isCompactView ? 'p-1.5' : 'p-2'}`} title={t("common.edit")}>
                              <Pencil size={isCompactView ? 14 : 18} />
                            </button>
                          ) : (
                            <div className={`${isCompactView ? 'p-1.5 w-[28px]' : 'p-2 w-[34px]'}`} />
                          )}
                          <div className="relative dropdown-trigger">
                            <button onClick={(e) => toggleDropdownContract(contract.id, e)} className={`text-content-muted hover:text-content-primary hover:bg-surface-hover rounded-lg transition-colors ${isCompactView ? 'p-1.5' : 'p-2'}`}>
                              <MoreVertical size={isCompactView ? 14 : 18} />
                            </button>
                            {activeDropdownId === contract.id && (
                              <div className="dropdown-menu absolute bottom-full right-0 mb-1 bg-surface-hover border border-border rounded-lg shadow-xl z-[9999] min-w-[190px] py-1">
                                {contract.status === "Pending" && (
                                  <button onClick={(e) => { e.stopPropagation(); handleDeleteContract(contract.id); setActiveDropdownId(null); }} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-surface-hover flex items-center gap-2"><Trash2 size={14} /> {t("common.delete")}</button>
                                )}
                                {contract.status === "Cancelled" && (
                                  <button onClick={(e) => { e.stopPropagation(); handleRenewContract(contract.id); setActiveDropdownId(null); }} className="w-full text-left px-3 py-2 text-sm text-content-secondary hover:bg-surface-hover flex items-center gap-2"><RefreshCw size={14} /> {t("admin.contract.actions.renew")}</button>
                                )}
                                {contract.status === "Scheduled" && (
                                  <button onClick={(e) => { e.stopPropagation(); handleCancelContract(contract.id); setActiveDropdownId(null); }} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-surface-hover flex items-center gap-2"><XCircle size={14} /> {t("common.cancel")}</button>
                                )}
                                {contract.status === "Paused" && (
                                  <>
                                    <button onClick={(e) => { e.stopPropagation(); handleResumeContract(contract.id); setActiveDropdownId(null); }} className="w-full text-left px-3 py-2 text-sm text-orange-400 hover:bg-surface-hover flex items-center gap-2"><PlayCircle size={14} /> {t("admin.contract.actions.resume")}</button>
                                    <button onClick={(e) => { e.stopPropagation(); handleRenewContract(contract.id); setActiveDropdownId(null); }} className="w-full text-left px-3 py-2 text-sm text-content-secondary hover:bg-surface-hover flex items-center gap-2"><RefreshCw size={14} /> {t("admin.contract.actions.renew")}</button>
                                    <button onClick={(e) => { e.stopPropagation(); handleAddBonusTime(contract.id); setActiveDropdownId(null); }} className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-hover flex items-center gap-2 ${contract.bonusTime ? 'text-orange-400' : 'text-content-secondary'}`}><Gift size={14} /> {contract.bonusTime ? t("admin.contract.actions.editBonusTime") : t("admin.contract.actions.addBonusTime")}</button>
                                    {contract.bonusTime && (<button onClick={(e) => { e.stopPropagation(); handleRemoveBonusTime(contract.id); setActiveDropdownId(null); }} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-surface-hover flex items-center gap-2"><Trash2 size={14} /> {t("admin.contract.actions.removeBonusTime")}</button>)}
                                    <button onClick={(e) => { e.stopPropagation(); handleChangeContract(contract.id); setActiveDropdownId(null); }} className="w-full text-left px-3 py-2 text-sm text-content-secondary hover:bg-surface-hover flex items-center gap-2"><ArrowRightLeft size={14} /> {t("admin.contract.actions.change")}</button>
                                    <hr className="border-border my-1" />
                                    <button onClick={(e) => { e.stopPropagation(); handleCancelContract(contract.id); setActiveDropdownId(null); }} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-surface-hover flex items-center gap-2"><XCircle size={14} /> {t("common.cancel")}</button>
                                  </>
                                )}
                                {contract.status === "Active" && (
                                  <>
                                    <button onClick={(e) => { e.stopPropagation(); handlePauseContract(contract.id); setActiveDropdownId(null); }} className="w-full text-left px-3 py-2 text-sm text-content-secondary hover:bg-surface-hover flex items-center gap-2"><PauseCircle size={14} /> {t("admin.contract.actions.pause")}</button>
                                    <button onClick={(e) => { e.stopPropagation(); handleRenewContract(contract.id); setActiveDropdownId(null); }} className="w-full text-left px-3 py-2 text-sm text-content-secondary hover:bg-surface-hover flex items-center gap-2"><RefreshCw size={14} /> {t("admin.contract.actions.renew")}</button>
                                    <button onClick={(e) => { e.stopPropagation(); handleAddBonusTime(contract.id); setActiveDropdownId(null); }} className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-hover flex items-center gap-2 ${contract.bonusTime ? 'text-orange-400' : 'text-content-secondary'}`}><Gift size={14} /> {contract.bonusTime ? t("admin.contract.actions.editBonusTime") : t("admin.contract.actions.addBonusTime")}</button>
                                    {contract.bonusTime && (<button onClick={(e) => { e.stopPropagation(); handleRemoveBonusTime(contract.id); setActiveDropdownId(null); }} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-surface-hover flex items-center gap-2"><Trash2 size={14} /> {t("admin.contract.actions.removeBonusTime")}</button>)}
                                    <button onClick={(e) => { e.stopPropagation(); handleChangeContract(contract.id); setActiveDropdownId(null); }} className="w-full text-left px-3 py-2 text-sm text-content-secondary hover:bg-surface-hover flex items-center gap-2"><ArrowRightLeft size={14} /> {t("admin.contract.actions.change")}</button>
                                    <hr className="border-border my-1" />
                                    <button onClick={(e) => { e.stopPropagation(); handleCancelContract(contract.id); setActiveDropdownId(null); }} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-surface-hover flex items-center gap-2"><XCircle size={14} /> {t("common.cancel")}</button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      </React.Fragment>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-content-muted text-sm">{t("admin.contract.noContracts")}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile List */}
                <div className="lg:hidden space-y-2">
                  {filteredAndSortedContracts().length > 0 ? (
                    filteredAndSortedContracts().map((contract, idx, arr) => (
                      <React.Fragment key={contract.id}>
                        {idx > 0 && contract.status !== 'Pending' && arr[idx - 1].status === 'Pending' && (
                          <div className="py-2">
                            <div className="border-t border-border" />
                          </div>
                        )}
                      <div className={`bg-surface-card rounded-xl relative overflow-hidden ${contract.status === 'Pending' ? 'border border-dashed border-primary/40 bg-primary/5' : ''}`}>
                        {isExpiredContract(contract) && (
                          <div className="absolute inset-0 bg-surface-dark/70 z-[1] pointer-events-none rounded-xl" />
                        )}
                        <div
                          className="p-3 cursor-pointer"
                          onClick={() => setExpandedMobileRowId(expandedMobileRowId === contract.id ? null : contract.id)}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleManageDocuments(contract); }}
                              className="w-11 h-11 bg-surface-button rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-surface-button-hover transition-colors"
                              title={t("admin.contract.actions.openDocuments")}
                            >
                              <FileText size={22} className="text-orange-400" />
                            </button>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-content-primary font-medium truncate">{contract.studioName}</span>
                                {contract.contractNumber && (
                                  <span className="text-content-faint text-[10px] flex-shrink-0">#{contract.contractNumber}</span>
                                )}
                              </div>
                              <div className="text-content-muted text-xs truncate">{getOwnerName(contract.studioId)}</div>
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
                                    return formatDate(contract.endDate)
                                  })()}
                                </span>
                                {contract.bonusTime && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 flex items-center gap-1">
                                    <Gift size={10} /> {t("admin.contract.labels.bonus")}
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
                                      <PauseCircle size={18} /><span className="text-[10px]">{t("admin.contract.actions.pause")}</span>
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleRenewContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-content-muted hover:text-content-primary hover:bg-surface-hover rounded-lg transition-colors">
                                      <RefreshCw size={18} /><span className="text-[10px]">{t("admin.contract.actions.renew")}</span>
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleAddBonusTime(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-orange-400 hover:text-orange-300 hover:bg-surface-hover rounded-lg transition-colors">
                                      <Gift size={18} /><span className="text-[10px]">{contract.bonusTime ? t("admin.contract.actions.editBonus") : t("admin.contract.labels.bonus")}</span>
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleChangeContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-content-muted hover:text-content-primary hover:bg-surface-hover rounded-lg transition-colors">
                                      <ArrowRightLeft size={18} /><span className="text-[10px]">{t("admin.contract.actions.change")}</span>
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-4 gap-1 mt-1">
                                    <div className="p-2" />
                                    <div className="p-2" />
                                    <div className="p-2" />
                                    <button onClick={(e) => { e.stopPropagation(); handleCancelContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-red-400 hover:text-red-300 hover:bg-surface-hover rounded-lg transition-colors">
                                      <XCircle size={18} /><span className="text-[10px]">{t("common.cancel")}</span>
                                    </button>
                                  </div>
                                </>
                              )}

                              {contract.status === "Paused" && (
                                <>
                                  <div className="grid grid-cols-4 gap-1">
                                    <button onClick={(e) => { e.stopPropagation(); handleResumeContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-orange-400 hover:text-orange-300 hover:bg-surface-hover rounded-lg transition-colors">
                                      <PlayCircle size={18} /><span className="text-[10px]">{t("admin.contract.actions.resume")}</span>
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleRenewContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-content-muted hover:text-content-primary hover:bg-surface-hover rounded-lg transition-colors">
                                      <RefreshCw size={18} /><span className="text-[10px]">{t("admin.contract.actions.renew")}</span>
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleAddBonusTime(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-orange-400 hover:text-orange-300 hover:bg-surface-hover rounded-lg transition-colors">
                                      <Gift size={18} /><span className="text-[10px]">{contract.bonusTime ? t("admin.contract.actions.editBonus") : t("admin.contract.labels.bonus")}</span>
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleChangeContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-content-muted hover:text-content-primary hover:bg-surface-hover rounded-lg transition-colors">
                                      <ArrowRightLeft size={18} /><span className="text-[10px]">{t("admin.contract.actions.change")}</span>
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-4 gap-1 mt-1">
                                    <div className="p-2" />
                                    <div className="p-2" />
                                    <div className="p-2" />
                                    <button onClick={(e) => { e.stopPropagation(); handleCancelContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-red-400 hover:text-red-300 hover:bg-surface-hover rounded-lg transition-colors">
                                      <XCircle size={18} /><span className="text-[10px]">{t("common.cancel")}</span>
                                    </button>
                                  </div>
                                </>
                              )}

                              {contract.status === "Pending" && (
                                <div className="grid grid-cols-4 gap-1">
                                  <button onClick={(e) => { e.stopPropagation(); handleEditContract(contract); }} className="flex flex-col items-center gap-1 p-2 text-orange-400 hover:text-orange-300 hover:bg-surface-hover rounded-lg transition-colors">
                                    <Pencil size={18} /><span className="text-[10px]">{t("common.edit")}</span>
                                  </button>
                                  <div className="p-2" />
                                  <div className="p-2" />
                                  <button onClick={(e) => { e.stopPropagation(); handleDeleteContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-red-400 hover:text-red-300 hover:bg-surface-hover rounded-lg transition-colors">
                                    <Trash2 size={18} /><span className="text-[10px]">{t("common.delete")}</span>
                                  </button>
                                </div>
                              )}

                              {contract.status === "Cancelled" && (
                                <div className="grid grid-cols-4 gap-1">
                                  <button onClick={(e) => { e.stopPropagation(); handleRenewContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-content-muted hover:text-content-primary hover:bg-surface-hover rounded-lg transition-colors">
                                    <RefreshCw size={18} /><span className="text-[10px]">{t("admin.contract.actions.renew")}</span>
                                  </button>
                                  <div className="p-2" />
                                  <div className="p-2" />
                                  <div className="p-2" />
                                </div>
                              )}

                              {contract.status === "Scheduled" && (
                                <div className="grid grid-cols-4 gap-1">
                                  <div className="p-2" />
                                  <div className="p-2" />
                                  <div className="p-2" />
                                  <button onClick={(e) => { e.stopPropagation(); handleCancelContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-red-400 hover:text-red-300 hover:bg-surface-hover rounded-lg transition-colors">
                                    <XCircle size={18} /><span className="text-[10px]">{t("common.cancel")}</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      </React.Fragment>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-content-muted text-sm">{t("admin.contract.noContracts")}</p>
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
                filteredAndSortedContracts().map((contract, idx, arr) => (
                  <React.Fragment key={contract.id}>
                    {idx > 0 && contract.status !== 'Pending' && arr[idx - 1].status === 'Pending' && (
                      <div className="col-span-full py-2">
                        <div className="border-t border-border" />
                      </div>
                    )}
                  <div
                    className={`bg-surface-card rounded-xl hover:bg-surface-hover transition-colors relative ${isCompactView ? 'p-3' : 'p-4'} ${contract.status === 'Pending' ? 'border border-dashed border-primary/40 bg-primary/5' : ''}`}
                  >
                    {isExpiredContract(contract) && (
                      <div className="absolute inset-0 bg-surface-dark/70 z-[1] pointer-events-none rounded-xl" />
                    )}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => handleManageDocuments(contract)}
                        className={`bg-surface-button rounded-xl flex items-center justify-center hover:bg-surface-button-hover transition-colors cursor-pointer ${isCompactView ? 'w-12 h-12 mb-2' : 'w-20 h-20 mb-3'}`}
                        title={t("admin.contract.actions.openDocuments")}
                      >
                        <FileText size={isCompactView ? 22 : 36} className="text-orange-400" />
                      </button>
                      <h3 className={`text-content-primary font-medium text-center ${isCompactView ? 'text-sm' : 'text-lg'}`}>{contract.studioName}</h3>
                      <p className={`text-content-muted ${isCompactView ? 'text-xs' : 'text-sm'}`}>{getOwnerName(contract.studioId)}</p>
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
                                  <RefreshCw size={10} /> {t("admin.contract.autoRenewal.label")}
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
                              <span className="text-content-faint">{t("admin.contract.autoRenewal.noAutoRenewal")}</span>
                            )
                          })()}
                        </div>
                      )}
                      {shouldShowExpiring(contract) && (
                        <span className={`rounded-full bg-red-500/20 text-red-400 flex items-center gap-1 ${isCompactView ? 'mt-1 text-[10px] px-1.5 py-0.5' : 'mt-2 text-xs px-2 py-1'}`}>
                          <AlertTriangle size={isCompactView ? 10 : 12} /> {t("admin.contract.labels.expiring")}
                        </span>
                      )}
                      {contract.bonusTime && (
                        <div className="relative group inline-flex mt-1">
                          <span className={`rounded-full bg-orange-500/20 text-orange-400 flex items-center gap-1 cursor-pointer transition-transform duration-200 hover:scale-110 ${isCompactView ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'}`}>
                            <Gift size={isCompactView ? 10 : 12} /> {t("admin.contract.labels.bonus")}
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
                            <button onClick={() => handlePauseContract(contract.id)} className={`text-content-muted hover:text-content-primary rounded-lg transition-colors flex items-center justify-center ${isCompactView ? 'p-1.5' : 'p-2'}`} title={t("admin.contract.actions.pause")}>
                              <PauseCircle size={isCompactView ? 14 : 16} />
                            </button>
                            <button onClick={() => handleRenewContract(contract.id)} className={`text-content-muted hover:text-content-primary rounded-lg transition-colors flex items-center justify-center ${isCompactView ? 'p-1.5' : 'p-2'}`} title={t("admin.contract.actions.renew")}>
                              <RefreshCw size={isCompactView ? 14 : 16} />
                            </button>
                            <button onClick={() => handleAddBonusTime(contract.id)} className={`text-orange-400 hover:text-orange-300 rounded-lg transition-colors flex items-center justify-center ${isCompactView ? 'p-1.5' : 'p-2'}`} title={contract.bonusTime ? t("admin.contract.actions.editBonusTime") : t("admin.contract.actions.addBonusTime")}>
                              <Gift size={isCompactView ? 14 : 16} />
                            </button>
                            <button onClick={() => handleChangeContract(contract.id)} className={`text-content-muted hover:text-content-primary rounded-lg transition-colors flex items-center justify-center ${isCompactView ? 'p-1.5' : 'p-2'}`} title={t("admin.contract.actions.changeContract")}>
                              <ArrowRightLeft size={isCompactView ? 14 : 16} />
                            </button>
                            <button onClick={() => handleCancelContract(contract.id)} className={`text-red-400 hover:text-red-300 rounded-lg transition-colors flex items-center justify-center ${isCompactView ? 'p-1.5' : 'p-2'}`} title={t("common.cancel")}>
                              <XCircle size={isCompactView ? 14 : 16} />
                            </button>
                          </>
                        )}

                        {/* Paused: Resume, Renew, Bonus, Change, Cancel */}
                        {contract.status === "Paused" && (
                          <>
                            <button onClick={() => handleResumeContract(contract.id)} className={`text-orange-400 hover:text-orange-300 rounded-lg transition-colors flex items-center justify-center ${isCompactView ? 'p-1.5' : 'p-2'}`} title={t("admin.contract.actions.resume")}>
                              <PlayCircle size={isCompactView ? 14 : 16} />
                            </button>
                            <button onClick={() => handleRenewContract(contract.id)} className={`text-content-muted hover:text-content-primary rounded-lg transition-colors flex items-center justify-center ${isCompactView ? 'p-1.5' : 'p-2'}`} title={t("admin.contract.actions.renew")}>
                              <RefreshCw size={isCompactView ? 14 : 16} />
                            </button>
                            <button onClick={() => handleAddBonusTime(contract.id)} className={`text-orange-400 hover:text-orange-300 rounded-lg transition-colors flex items-center justify-center ${isCompactView ? 'p-1.5' : 'p-2'}`} title={contract.bonusTime ? t("admin.contract.actions.editBonusTime") : t("admin.contract.actions.addBonusTime")}>
                              <Gift size={isCompactView ? 14 : 16} />
                            </button>
                            <button onClick={() => handleChangeContract(contract.id)} className={`text-content-muted hover:text-content-primary rounded-lg transition-colors flex items-center justify-center ${isCompactView ? 'p-1.5' : 'p-2'}`} title={t("admin.contract.actions.changeContract")}>
                              <ArrowRightLeft size={isCompactView ? 14 : 16} />
                            </button>
                            <button onClick={() => handleCancelContract(contract.id)} className={`text-red-400 hover:text-red-300 rounded-lg transition-colors flex items-center justify-center ${isCompactView ? 'p-1.5' : 'p-2'}`} title={t("common.cancel")}>
                              <XCircle size={isCompactView ? 14 : 16} />
                            </button>
                          </>
                        )}

                        {/* Pending: Edit, empty, empty, empty, Delete */}
                        {contract.status === "Pending" && (
                          <>
                            <button onClick={() => handleEditContract(contract)} className={`text-orange-400 hover:text-orange-300 rounded-lg transition-colors flex items-center justify-center ${isCompactView ? 'p-1.5' : 'p-2'}`} title={t("common.edit")}>
                              <Pencil size={isCompactView ? 14 : 16} />
                            </button>
                            <div className={isCompactView ? 'p-1.5' : 'p-2'} />
                            <div className={isCompactView ? 'p-1.5' : 'p-2'} />
                            <div className={isCompactView ? 'p-1.5' : 'p-2'} />
                            <button onClick={() => handleDeleteContract(contract.id)} className={`text-red-400 hover:text-red-300 rounded-lg transition-colors flex items-center justify-center ${isCompactView ? 'p-1.5' : 'p-2'}`} title={t("common.delete")}>
                              <Trash2 size={isCompactView ? 14 : 16} />
                            </button>
                          </>
                        )}

                        {/* Cancelled: empty, Renew, empty, empty, empty */}
                        {contract.status === "Cancelled" && (
                          <>
                            <div className={isCompactView ? 'p-1.5' : 'p-2'} />
                            <button onClick={() => handleRenewContract(contract.id)} className={`text-content-muted hover:text-content-primary rounded-lg transition-colors flex items-center justify-center ${isCompactView ? 'p-1.5' : 'p-2'}`} title={t("admin.contract.actions.renew")}>
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
                            <button onClick={() => handleCancelContract(contract.id)} className={`text-red-400 hover:text-red-300 rounded-lg transition-colors flex items-center justify-center ${isCompactView ? 'p-1.5' : 'p-2'}`} title={t("common.cancel")}>
                              <XCircle size={isCompactView ? 14 : 16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  </React.Fragment>
                ))
              ) : (
                <div className="text-center py-8 col-span-full">
                  <p className="text-content-muted text-sm">{t("admin.contract.noContracts")}</p>
                </div>
              )}
            </div>
          )}
        </PullToRefresh>

        {/* Floating Action Button - Mobile */}
        <button
          onClick={handleAddContract}
          className="md:hidden fixed bottom-4 right-4 bg-primary hover:bg-primary-hover text-white p-4 rounded-xl shadow-lg transition-all active:scale-95 z-30"
          aria-label={t("admin.contract.createContract")}
        >
          <Plus size={22} />
        </button>

        {/* Modals */}
        {isModalOpen && (
          <AdminContractModal
            onClose={() => { setIsModalOpen(false); setSelectedLead(null); }}
            onSave={handleSaveNewContract}
            leadData={selectedLead}
          />
        )}

        {isPauseModalOpen && selectedContract && (
          <AdminPauseContractModal
            contract={selectedContract}
            onClose={() => setIsPauseModalOpen(false)}
            onSubmit={handlePauseReasonSubmit}
          />
        )}

        {isCancelModalOpen && selectedContract && (
          <AdminCancelContractModal
            contract={selectedContract}
            onClose={() => setIsCancelModalOpen(false)}
            onSubmit={handleCancelSubmit}
          />
        )}

        {isEditModalOpenContract && selectedContract && (
          <AdminContractModal
            contract={selectedContract}
            onClose={() => setIsEditModalOpenContract(false)}
            onSave={handleSaveEditedContract}
          />
        )}

        {isDocumentModalOpen && selectedContract && (
          <AdminContractManagement
            contract={selectedContract}
            onClose={() => setIsDocumentModalOpen(false)}
          />
        )}

        {isBonusTimeModalOpen && selectedContract && (
          <AdminBonusTimeModal
            contract={selectedContract}
            onClose={() => setIsBonusTimeModalOpen(false)}
            onSubmit={(bonusData) => {
              const wasEdit = !!selectedContract.bonusTime
              setContracts(contracts.map(c =>
                c.id === selectedContract.id
                  ? { ...c, bonusTime: bonusData }
                  : c
              ))
              setIsBonusTimeModalOpen(false)
              haptic.success(); toast.success(wasEdit ? t("admin.contract.toast.bonusUpdated") : t("admin.contract.toast.bonusAdded"))
            }}
            onDelete={() => {
              setContracts(contracts.map(c =>
                c.id === selectedContract.id
                  ? { ...c, bonusTime: null }
                  : c
              ))
              setIsBonusTimeModalOpen(false)
              haptic.success(); toast.success(t("admin.contract.toast.bonusRemoved"))
            }}
          />
        )}

        {isRenewModalOpen && selectedContract && (
          <AdminRenewContractModal
            contract={selectedContract}
            onClose={() => {
              setIsRenewModalOpen(false)
              setSelectedContract(null)
              setRenewFormFillData(null)
            }}
            onSubmit={handleRenewSubmit}
          />
        )}

        {isChangeModalOpen && selectedContract && (
          <AdminChangeContractModal
            contract={selectedContract}
            onClose={() => {
              setIsChangeModalOpen(false)
              setSelectedContract(null)
              setChangeFormFillData(null)
              setEditingChangeDraftId(null)
            }}
            onSubmit={handleChangeSubmit}
            initialData={changeFormFillData?.changeData || null}
          />
        )}

        {/* ContractFormFillModal for contract changes (signature required) */}
        {isChangeFormFillOpen && changeFormFillData && (
          <AdminContractFormFillModal
            isOpen={isChangeFormFillOpen}
            onClose={() => {
              // Go back to the AdminChangeContractModal instead of closing everything
              setIsChangeFormFillOpen(false)
              setIsChangeModalOpen(true)
              // Keep selectedContract and changeFormFillData so the change modal is still populated
            }}
            onSubmit={handleChangeFormFillComplete}
            contractType={changeFormFillData.contractType}
            contractData={{
              studioId: changeFormFillData.contract.studioId,
              startDate: changeFormFillData.changeData.startDate || changeFormFillData.contract.startDate,
              endDate: changeFormFillData.changeData.endDate || changeFormFillData.contract.endDate,
              accessStartDate: changeFormFillData.contract.accessStartDate,
              sepaReference: changeFormFillData.contract.sepaMandate,
            }}
            leadData={{
              firstName: changeFormFillData.contract.studioName?.split(' ')[0] || '',
              lastName: changeFormFillData.contract.studioName?.split(' ').slice(1).join(' ') || '',
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

        {/* ContractFormFillModal for contract renewals (mirrors change flow) */}
        {isRenewFormFillOpen && renewFormFillData && (
          <AdminContractFormFillModal
            isOpen={isRenewFormFillOpen}
            onClose={() => {
              // Go back to the AdminRenewContractModal instead of closing everything
              setIsRenewFormFillOpen(false)
              setIsRenewModalOpen(true)
              // Keep selectedContract and renewFormFillData so the renew modal is still populated
            }}
            onSubmit={handleRenewFormFillComplete}
            contractType={renewFormFillData.contractType}
            contractData={{
              studioId: renewFormFillData.contract.studioId,
              startDate: renewFormFillData.renewalData.startDate || renewFormFillData.contract.startDate,
              endDate: renewFormFillData.renewalData.endDate || renewFormFillData.contract.endDate,
              accessStartDate: renewFormFillData.contract.accessStartDate,
              sepaReference: renewFormFillData.contract.sepaMandate,
            }}
            leadData={{
              firstName: renewFormFillData.contract.studioName?.split(' ')[0] || '',
              lastName: renewFormFillData.contract.studioName?.split(' ').slice(1).join(' ') || '',
              email: renewFormFillData.contract.email || '',
              phone: renewFormFillData.contract.phone || '',
              street: renewFormFillData.contract.address?.street || '',
              zipCode: renewFormFillData.contract.address?.zipCode || '',
              city: renewFormFillData.contract.address?.city || '',
              dateOfBirth: renewFormFillData.contract.dateOfBirth || '',
              iban: renewFormFillData.contract.iban || '',
              bic: renewFormFillData.contract.bic || '',
              bankName: renewFormFillData.contract.bankName || '',
              salutation: renewFormFillData.contract.salutation || '',
            }}
            existingFormData={renewFormFillData.contract.formData?.formValues || null}
          />
        )}

        {isDeleteModalOpen && (
          <AdminDeleteContractModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false)
              setContractToDelete(null)
            }}
            onDelete={confirmDeleteContract}
            contract={contractToDelete}
          />
        )}

        {/* Renew Confirmation - when member has other running contracts */}
        {renewConfirmData && (
          <div className="fixed inset-0 w-screen h-screen bg-black/50 flex items-center justify-center z-[1001]">
            <div className="bg-surface-base rounded-xl p-6 w-full max-w-md relative">
              <button onClick={() => setRenewConfirmData(null)} className="absolute top-4 right-4 text-content-muted hover:text-content-primary">
                <X size={20} />
              </button>
              <h3 className="text-content-primary text-lg font-semibold mb-3">{t("admin.contract.renewConfirm.title")}</h3>
              <div className="flex items-start gap-2.5 bg-primary/10 border border-primary/20 rounded-xl p-3 mb-4">
                <AlertCircle size={16} className="text-primary flex-shrink-0 mt-0.5" />
                <div className="text-xs text-content-secondary leading-relaxed">
                  {t("admin.contract.renewConfirm.otherContracts", { count: renewConfirmData.otherContracts.length })}
                  <div className="mt-2 space-y-1">
                    {renewConfirmData.otherContracts.map(c => (
                      <div key={c.id} className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${
                          c.status === 'Active' ? 'bg-green-500' : c.status === 'Pending' ? 'bg-gray-400' : 'bg-yellow-500'
                        }`} />
                        <span className="text-content-primary font-medium">{c.contractType}</span>
                        <span className="text-content-faint">({translateStatus(c.status)})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-content-secondary mb-5">{t("admin.contract.renewConfirm.confirmText", { contractType: renewConfirmData.contract.contractType })}</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setRenewConfirmData(null)}
                  className="px-4 py-2 bg-surface-dark text-sm text-content-primary rounded-xl border border-border hover:bg-surface-hover transition-colors"
                >
                  {t("common.cancel")}
                </button>
                <button
                  onClick={confirmRenew}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-sm text-white rounded-xl transition-colors"
                >
                  {t("admin.contract.renewConfirm.renewAnyway")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resume Confirmation */}
        {resumeConfirmData && (
          <div className="fixed inset-0 w-screen h-screen bg-black/50 flex items-center justify-center z-[1001]">
            <div className="bg-surface-base rounded-xl p-6 w-full max-w-md relative">
              <button onClick={() => setResumeConfirmData(null)} className="absolute top-4 right-4 text-content-muted hover:text-content-primary">
                <X size={20} />
              </button>
              <h3 className="text-content-primary text-lg font-semibold mb-3">{t("admin.contract.resumeConfirm.title")}</h3>
              <p className="text-sm text-content-secondary mb-4">
                {t("admin.contract.resumeConfirm.confirmText", { contractType: resumeConfirmData.contractType, name: resumeConfirmData.studioName })}
              </p>
              {resumeConfirmData.pauseReason && (
                <div className="flex items-start gap-2.5 bg-primary/10 border border-primary/20 rounded-xl p-3 mb-5">
                  <Info size={16} className="text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-content-secondary leading-relaxed">
                    {t("admin.contract.resumeConfirm.pauseReason")}: <span className="text-content-primary font-medium">{resumeConfirmData.pauseReason}</span>
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setResumeConfirmData(null)}
                  className="px-4 py-2 bg-surface-dark text-sm text-content-primary rounded-xl border border-border hover:bg-surface-hover transition-colors"
                >
                  {t("common.cancel")}
                </button>
                <button
                  onClick={confirmResume}
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-sm text-white rounded-xl transition-colors"
                >
                  {t("admin.contract.resumeConfirm.resumeContract")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Remove Bonus Time Confirmation */}
        {removeBonusConfirmData && (
          <div className="fixed inset-0 w-screen h-screen bg-black/50 flex items-center justify-center z-[1001]">
            <div className="bg-surface-base rounded-xl p-6 w-full max-w-md relative">
              <button onClick={() => setRemoveBonusConfirmData(null)} className="absolute top-4 right-4 text-content-muted hover:text-content-primary">
                <X size={20} />
              </button>
              <h3 className="text-content-primary text-lg font-semibold mb-3">{t("admin.contract.removeBonusConfirm.title")}</h3>
              <p className="text-sm text-content-secondary mb-4">
                {t("admin.contract.removeBonusConfirm.confirmText", { contractType: removeBonusConfirmData.contractType, name: removeBonusConfirmData.studioName })}
              </p>
              {removeBonusConfirmData.bonusTime && (
                <div className="flex items-start gap-2.5 bg-primary/10 border border-primary/20 rounded-xl p-3 mb-5">
                  <Info size={16} className="text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-content-secondary leading-relaxed">
                    {t("admin.contract.removeBonusConfirm.currentBonus")}: <span className="text-content-primary font-medium">{removeBonusConfirmData.bonusTime.days || removeBonusConfirmData.bonusTime.amount} {removeBonusConfirmData.bonusTime.days ? t("admin.contract.labels.days") : removeBonusConfirmData.bonusTime.type}</span>
                    {removeBonusConfirmData.bonusTime.reason && (
                      <> — {removeBonusConfirmData.bonusTime.reason}</>
                    )}
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setRemoveBonusConfirmData(null)}
                  className="px-4 py-2 bg-surface-dark text-sm text-content-primary rounded-xl border border-border hover:bg-surface-hover transition-colors"
                >
                  {t("common.cancel")}
                </button>
                <button
                  onClick={confirmRemoveBonusTime}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-sm text-white rounded-xl transition-colors"
                >
                  {t("common.remove")}
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  )
}
