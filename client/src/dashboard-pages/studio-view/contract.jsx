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
  Eye,
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
  XCircle,
  RefreshCw,
  Gift,
  ArrowRightLeft,
  X,
} from "lucide-react"
import { toast, Toaster } from "react-hot-toast"
import { useNavigate, useLocation } from "react-router-dom"

import { AddContractModal } from "../../components/shared/contracts/add-contract-modal"
import { ContractDetailsModal } from "../../components/studio-components/contract-components/contract-details-modal"
import { PauseContractModal } from "../../components/studio-components/contract-components/pause-contract-modal"
import { CancelContractModal } from "../../components/studio-components/contract-components/cancel-contract-modal"
import { EditContractModal } from "../../components/studio-components/contract-components/edit-contract-modal"
import { DocumentManagementModal } from "../../components/studio-components/contract-components/document-management-modal"
import { BonusTimeModal } from "../../components/studio-components/contract-components/bonus-time-modal"
import { RenewContractModal } from "../../components/studio-components/contract-components/renew-contract-modal"
import { ChangeContractModal } from "../../components/studio-components/contract-components/change-contract-modal"
import { ContractHistoryModal } from "../../components/studio-components/contract-components/contract-history-modal"
import { DeleteContractModal } from "../../components/studio-components/contract-components/delete-contract-modal"
import { contractHistory, initialContracts, sampleLeads } from "../../utils/studio-states/contract-states"

// Status Tag Component - matches members.jsx
const StatusTag = ({ status, compact = false }) => {
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

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1 ${bgColor} text-white px-2 py-1 rounded-lg text-xs font-medium`}>
        <span className="truncate max-w-[140px]">{status}</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 ${bgColor} text-white px-3 py-1.5 rounded-xl text-xs font-medium`}>
      <span>{status}</span>
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
  
  // Search states - matches members.jsx
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const searchDropdownRef = useRef(null)
  const searchInputRef = useRef(null)

  // Filter states
  const [filterStatus, setFilterStatus] = useState("all")
  const [filtersExpanded, setFiltersExpanded] = useState(false)

  // Sort states - matches members.jsx pattern
  const [sortBy, setSortBy] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [showMobileSortDropdown, setShowMobileSortDropdown] = useState(false)
  const sortDropdownRef = useRef(null)
  const mobileSortDropdownRef = useRef(null)

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isShowDetails, setIsShowDetails] = useState(false)
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('de-DE')
  }

  // Search autocomplete matches
  const searchMatches = contracts.filter(contract =>
    contract.memberName.toLowerCase().includes(searchQuery.toLowerCase()) &&
    searchQuery.length > 0
  ).slice(0, 5)

  // Filter and sort contracts
  const filteredAndSortedContracts = () => {
    let filtered = [...contracts]

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(contract => {
        if (filterStatus === "active") return contract.status === "Active"
        if (filterStatus === "ongoing") return contract.status === "Ongoing"
        if (filterStatus === "paused") return contract.status === "Paused"
        if (filterStatus === "cancelled") return contract.status === "Cancelled"
        return true
      })
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(contract =>
        contract.memberName.toLowerCase().includes(searchQuery.toLowerCase())
      )
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
          comparison = new Date(a.endDate) - new Date(b.endDate)
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

  // Contract handlers
  const handleViewDetails = (contract) => {
    setSelectedContract(contract)
    setIsShowDetails(true)
  }

  const handleEditContract = (contract) => {
    setSelectedContract(contract)
    setIsEditModalOpenContract(true)
  }

  const handlePauseContract = (contractId) => {
    setSelectedContract(contracts.find((c) => c.id === contractId))
    setIsPauseModalOpen(true)
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
    const newContract = {
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
    setContracts([...contracts, newContract])
    setIsModalOpen(false)
    toast.success("Contract added successfully")
  }

  const handleSaveEditedContract = (updatedContract) => {
    setContracts(contracts.map((c) => (c.id === updatedContract.id ? updatedContract : c)))
    setIsEditModalOpenContract(false)
    toast.success("Contract updated successfully")
  }

  const handlePauseReasonSubmit = () => {
    setIsPauseModalOpen(false)
    setIsShowDetails(false)
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
    setIsShowDetails(false)
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

      <div className="flex flex-col lg:flex-row rounded-3xl bg-[#1C1C1C] transition-all duration-500 text-white relative">
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
              <button
                onClick={handleAddContract}
                className="hidden lg:flex bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm text-white px-3 sm:px-4 py-2 rounded-xl items-center gap-2 justify-center transition-colors"
              >
                <Plus size={14} className="sm:w-4 sm:h-4" />
                <span className='hidden sm:inline'>Create Contract</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-4" ref={searchDropdownRef}>
            <div className="relative">
              <div 
                className="bg-[#141414] rounded-xl px-3 py-2 min-h-[42px] flex flex-wrap items-center gap-1.5 border border-[#333333] focus-within:border-[#3F74FF] transition-colors cursor-text"
                onClick={() => searchInputRef.current?.focus()}
              >
                <Search className="text-gray-400 flex-shrink-0" size={16} />
                
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search contracts..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowSearchDropdown(true)
                  }}
                  onFocus={() => searchQuery && setShowSearchDropdown(true)}
                  className="flex-1 min-w-[100px] bg-transparent outline-none text-sm text-white placeholder-gray-500"
                />
                
                {searchQuery && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSearchQuery("")
                      setShowSearchDropdown(false)
                    }}
                    className="p-1 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                  >
                    <X size={14} className="text-gray-400 hover:text-white" />
                  </button>
                )}
              </div>
              
              {/* Autocomplete Dropdown */}
              {showSearchDropdown && searchQuery.trim() && searchMatches.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-[#333333] rounded-xl shadow-lg z-50 overflow-hidden">
                  {searchMatches.map((contract) => (
                    <button
                      key={contract.id}
                      onClick={() => {
                        setSearchQuery(contract.memberName)
                        setShowSearchDropdown(false)
                      }}
                      className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-[#252525] transition-colors text-left"
                    >
                      <InitialsAvatar
                        firstName={getFirstAndLastName(contract.memberName).firstName}
                        lastName={getFirstAndLastName(contract.memberName).lastName}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{contract.memberName}</p>
                        <p className="text-xs text-gray-500 truncate">{contract.contractType}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {/* No results message */}
              {showSearchDropdown && searchQuery.trim() && searchMatches.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-[#333333] rounded-xl shadow-lg z-50 p-3">
                  <p className="text-sm text-gray-500 text-center">No contracts found</p>
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
                  All ({contracts.length})
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
                          <InitialsAvatar
                            firstName={getFirstAndLastName(contract.memberName).firstName}
                            lastName={getFirstAndLastName(contract.memberName).lastName}
                            size="sm"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium text-sm truncate">{contract.memberName}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <StatusTag status={contract.status} compact={true} />
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
                              {isContractExpiringSoon(contract.endDate) && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                                  Expiring Soon
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-4 gap-1">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleViewDetails(contract); }}
                                className="flex flex-col items-center gap-1 p-2 text-blue-400 hover:text-blue-300 hover:bg-white/5 rounded-lg transition-colors"
                              >
                                <Eye size={18} />
                                <span className="text-[10px]">Details</span>
                              </button>
                              {contract.status === "Ongoing" ? (
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleEditContract(contract); }}
                                  className="flex flex-col items-center gap-1 p-2 text-orange-400 hover:text-orange-300 hover:bg-white/5 rounded-lg transition-colors"
                                >
                                  <Pencil size={18} />
                                  <span className="text-[10px]">Edit</span>
                                </button>
                              ) : (
                                <div className="p-2 w-[50px]" />
                              )}
                              <button
                                onClick={(e) => { e.stopPropagation(); handleViewHistory(contract.id); }}
                                className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                              >
                                <History size={18} />
                                <span className="text-[10px]">History</span>
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleManageDocuments(contract); }}
                                className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                              >
                                <FileText size={18} />
                                <span className="text-[10px]">Docs</span>
                              </button>
                            </div>
                            <div className="grid grid-cols-4 gap-1 mt-1">
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
                              <button
                                onClick={(e) => { e.stopPropagation(); handleCancelContract(contract.id); }}
                                className="flex flex-col items-center gap-1 p-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors"
                              >
                                <XCircle size={18} />
                                <span className="text-[10px]">Cancel</span>
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteContract(contract.id); }}
                                className="flex flex-col items-center gap-1 p-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors"
                              >
                                <Trash2 size={18} />
                                <span className="text-[10px]">Delete</span>
                              </button>
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
                    <div className="grid grid-cols-[2fr_1fr_1fr_0.8fr_1.5fr_auto] gap-4 px-4 py-3 bg-[#0f0f0f] text-gray-400 text-sm font-medium border-b border-gray-800 rounded-t-xl">
                      <div>Member</div>
                      <div>Contract Type</div>
                      <div>Status</div>
                      <div>Auto Renewal</div>
                      <div>Duration</div>
                      <div className="w-32 text-right">Actions</div>
                    </div>

                    {/* Table Body */}
                    {filteredAndSortedContracts().length > 0 ? (
                      filteredAndSortedContracts().map((contract) => (
                        <div
                          key={contract.id}
                          className="grid grid-cols-[2fr_1fr_1fr_0.8fr_1.5fr_auto] gap-4 px-4 py-3 items-center border-b border-gray-800/50 hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                          onClick={() => handleViewDetails(contract)}
                        >
                          <div className="flex items-center gap-3">
                            <InitialsAvatar
                              firstName={getFirstAndLastName(contract.memberName).firstName}
                              lastName={getFirstAndLastName(contract.memberName).lastName}
                              size="md"
                            />
                            <span className="text-white font-medium">{contract.memberName}</span>
                          </div>
                          <div className="text-gray-300">{contract.contractType}</div>
                          <div><StatusTag status={contract.status} compact={true} /></div>
                          <div className="text-gray-300 text-sm">
                            {contract.autoRenewal ? (
                              <span className="text-green-400 flex items-center gap-1">
                                <RefreshCw size={12} /> Yes
                              </span>
                            ) : (
                              <span className="text-gray-500">No</span>
                            )}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                            {isContractExpiringSoon(contract.endDate) && (
                              <span className="ml-2 text-red-400 text-xs flex items-center gap-1 inline-flex">
                                <AlertTriangle size={12} />
                                Soon
                              </span>
                            )}
                          </div>
                          <div className="w-32 flex items-center justify-end gap-0.5">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleViewHistory(contract.id); }}
                              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                              title="History"
                            >
                              <History size={14} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleManageDocuments(contract); }}
                              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                              title="Documents"
                            >
                              <FileText size={14} />
                            </button>
                            <div className="w-px h-4 bg-gray-700/50 mx-0.5" />
                            <button
                              onClick={(e) => { e.stopPropagation(); handleViewDetails(contract); }}
                              className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-white/5 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye size={14} />
                            </button>
                            {contract.status === "Ongoing" ? (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleEditContract(contract); }}
                                className="p-1.5 text-orange-400 hover:text-orange-300 hover:bg-white/5 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Pencil size={14} />
                              </button>
                            ) : (
                              <div className="p-1.5 w-[26px]" />
                            )}
                            <div className="relative dropdown-trigger">
                              <button
                                onClick={(e) => toggleDropdownContract(contract.id, e)}
                                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                              >
                                <MoreVertical size={14} />
                              </button>
                              {activeDropdownId === contract.id && (
                                <div className="dropdown-menu absolute bottom-full right-0 mb-1 bg-[#1F1F1F] border border-gray-700 rounded-lg shadow-xl z-[9999] min-w-[150px] py-1">
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
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteContract(contract.id); setActiveDropdownId(null); }}
                                    className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-800 flex items-center gap-2"
                                  >
                                    <Trash2 size={14} /> Delete
                                  </button>
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
                            <InitialsAvatar
                              firstName={getFirstAndLastName(contract.memberName).firstName}
                              lastName={getFirstAndLastName(contract.memberName).lastName}
                              size="md"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-white font-medium truncate block">{contract.memberName}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <StatusTag status={contract.status} compact={true} />
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
                              <div className="grid grid-cols-4 gap-1">
                                <button onClick={(e) => { e.stopPropagation(); handleViewDetails(contract); }} className="flex flex-col items-center gap-1 p-2 text-blue-400 hover:text-blue-300 hover:bg-white/5 rounded-lg transition-colors">
                                  <Eye size={18} /><span className="text-[10px]">Details</span>
                                </button>
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
                                <button onClick={(e) => { e.stopPropagation(); handleManageDocuments(contract); }} className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                  <FileText size={18} /><span className="text-[10px]">Docs</span>
                                </button>
                              </div>
                              <div className="grid grid-cols-4 gap-1 mt-1">
                                <button onClick={(e) => { e.stopPropagation(); handlePauseContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                  <PauseCircle size={18} /><span className="text-[10px]">Pause</span>
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); handleRenewContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                  <RefreshCw size={18} /><span className="text-[10px]">Renew</span>
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); handleCancelContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors">
                                  <XCircle size={18} /><span className="text-[10px]">Cancel</span>
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteContract(contract.id); }} className="flex flex-col items-center gap-1 p-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors">
                                  <Trash2 size={18} /><span className="text-[10px]">Delete</span>
                                </button>
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
                    className="bg-[#161616] rounded-xl p-4 cursor-pointer hover:bg-[#1a1a1a] transition-colors"
                    onClick={() => handleViewDetails(contract)}
                  >
                    <div className="flex flex-col items-center">
                      <InitialsAvatar
                        firstName={getFirstAndLastName(contract.memberName).firstName}
                        lastName={getFirstAndLastName(contract.memberName).lastName}
                        size="xl"
                        className="mb-3"
                      />
                      <h3 className="text-white font-medium text-lg text-center">{contract.memberName}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <StatusTag status={contract.status} />
                      </div>
                      <p className="text-gray-400 text-sm mt-2">{contract.contractType}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs">
                        {contract.autoRenewal ? (
                          <span className="text-green-400 flex items-center gap-1">
                            <RefreshCw size={10} /> Auto Renewal
                          </span>
                        ) : (
                          <span className="text-gray-500">No Auto Renewal</span>
                        )}
                      </div>
                      {isContractExpiringSoon(contract.endDate) && (
                        <span className="mt-2 text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400 flex items-center gap-1">
                          <AlertTriangle size={12} /> Expiring Soon
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-gray-800">
                      <div className="grid grid-cols-5 gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleViewDetails(contract); }}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {contract.status === "Ongoing" ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEditContract(contract); }}
                            className="p-2 text-orange-400 hover:text-orange-300 hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                        ) : (
                          <div className="p-2" />
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleViewHistory(contract.id); }}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center"
                          title="History"
                        >
                          <History size={16} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleManageDocuments(contract); }}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center"
                          title="Documents"
                        >
                          <FileText size={16} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRenewContract(contract.id); }}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center"
                          title="Renew"
                        >
                          <RefreshCw size={16} />
                        </button>
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
          <AddContractModal
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveNewContract}
            leadData={selectedLead}
          />
        )}

        {isShowDetails && selectedContract && (
          <ContractDetailsModal
            contract={selectedContract}
            onClose={() => {
              setIsShowDetails(false)
              setSelectedContract(null)
            }}
            onPause={() => setIsPauseModalOpen(true)}
            onCancel={() => setIsCancelModalOpen(true)}
            onEdit={() => setIsEditModalOpenContract(true)}
            onDocuments={() => setIsDocumentModalOpen(true)}
            onBonusTime={() => setIsBonusTimeModalOpen(true)}
            onRenew={() => setIsRenewModalOpen(true)}
            onChange={() => setIsChangeModalOpen(true)}
            onHistory={() => setIsHistoryModalOpen(true)}
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
          <EditContractModal
            contract={selectedContract}
            onClose={() => setIsEditModalOpenContract(false)}
            onSave={handleSaveEditedContract}
          />
        )}

        {isDocumentModalOpen && selectedContract && (
          <DocumentManagementModal
            contract={selectedContract}
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
