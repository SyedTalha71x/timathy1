"use client"

/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  MoreVertical,
  Plus,
  ChevronDown,
  ArrowUpDown,
  FileText,
  History,
  Search,
  Grid3X3,
  List,
  Eye,
  Trash2,
  AlertTriangle,
} from "lucide-react"
import { useEffect, useState } from "react"
import { toast, Toaster } from "react-hot-toast"
import AddContractModal from "../../components/contract-components/add-contract-modal"
import { ContractDetailsModal } from "../../components/contract-components/contract-details-modal"
import { PauseContractModal } from "../../components/contract-components/pause-contract-modal"
import { CancelContractModal } from "../../components/contract-components/cancel-contract-modal"
import {EditContractModal} from "../../components/contract-components/edit-contract-modal"
import { DocumentManagementModal } from "../../components/contract-components/document-management-modal"
import { BonusTimeModal } from "../../components/contract-components/bonus-time-modal"
import { RenewContractModal } from "../../components/contract-components/reniew-contract-modal"
import { ChangeContractModal } from "../../components/contract-components/change-contract-modal"
import { ContractHistoryModal } from "../../components/contract-components/contract-history-modal"

import Avatar from "../../../public/avatar.png"
import Rectangle1 from "../../../public/Rectangle 1.png"
import { useNavigate } from "react-router-dom"
import { SidebarArea } from "../../components/custom-sidebar"
import { IoIosMenu } from "react-icons/io"

const initialContracts = [
  {
    id: "12321-1",
    memberName: "John Doe",
    contractType: "Premium",
    startDate: "2023-01-01",
    endDate: "2024-01-01",
    status: "Active",
    pauseReason: null,
    cancelReason: null,
    isDigital: true,
    email: "john@example.com",
    phone: "1234567890",
    iban: "DE89370400440532013000",
  },
  {
    id: "12321-2",
    memberName: "Jane Smith",
    contractType: "Basic",
    startDate: "2023-02-15",
    endDate: "2024-02-15",
    status: "Paused",
    pauseReason: "Pregnancy",
    cancelReason: null,
    isDigital: false,
  },
  {
    id: "12321-3",
    memberName: "Bob Johnson",
    contractType: "Premium",
    startDate: "2023-03-01",
    endDate: "2024-03-01",
    status: "Cancelled",
    pauseReason: null,
    cancelReason: null,
    isDigital: true,
    email: "bob@example.com",
    phone: "9876543210",
    iban: "FR1420041010050500013M02606",
  },
  {
    id: "12321-4",
    memberName: "Scarlet Johnson",
    contractType: "Bronze",
    startDate: "2023-03-01",
    endDate: "2024-03-01",
    status: "Cancelled",
    pauseReason: null,
    cancelReason: "Financial Reasons",
    isDigital: false,
  },
  {
    id: "12321-5",
    memberName: "Alice Cooper",
    contractType: "Premium",
    startDate: "2023-06-01",
    endDate: "2024-06-01",
    status: "Ongoing",
    pauseReason: null,
    cancelReason: null,
    isDigital: true,
    email: "alice@example.com",
    phone: "5551234567",
    iban: "GB82WEST12345698765432",
    signatureRequired: true,
  },
]

const contractHistory = {
  "12321-1": [
    {
      id: "hist-1",
      date: "2023-12-15",
      action: "Contract Changed",
      details: "Changed from Basic to Premium",
      performedBy: "Admin User",
      oldValue: "Basic",
      newValue: "Premium",
    },
    {
      id: "hist-2",
      date: "2023-11-20",
      action: "Contract Renewed",
      details: "Renewed for 12 months",
      performedBy: "System",
      oldValue: "2023-01-01 to 2024-01-01",
      newValue: "2024-01-01 to 2025-01-01",
    },
  ],
  "12321-2": [
    {
      id: "hist-3",
      date: "2023-10-10",
      action: "Contract Paused",
      details: "Paused due to Pregnancy",
      performedBy: "Admin User",
      oldValue: "Active",
      newValue: "Paused",
    },
  ],
}

const sampleLeads = [
  {
    id: "lead-1",
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "5551234567",
    interestedIn: "Premium",
  },
  {
    id: "lead-2",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    phone: "5559876543",
    interestedIn: "Basic",
  },
]

export default function ContractList() {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isShowDetails, setIsShowDetails] = useState(false)
  const [selectedContract, setSelectedContract] = useState(null)
  const [activeDropdownId, setActiveDropdownId] = useState(null)
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false)
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState("All Contracts")
  const [selectedSort, setSelectedSort] = useState("Alphabetical (A-Z)") // Update 1: Changed initial state to "Alphabetical (A-Z)"
  const [contracts, setContracts] = useState(initialContracts)
  const [filteredContracts, setFilteredContracts] = useState(initialContracts)
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [viewMode, setViewMode] = useState("list") // Added view mode state for switching between grid and list views

  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const contractsPerPage = 40
  const [selectedPeriod, setSelectedPeriod] = useState("This Month")
  const [selectedLead, setSelectedLead] = useState(null)
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false)
  const [isBonusTimeModalOpen, setIsBonusTimeModalOpen] = useState(false)
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false)
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)

  const handleRenewContract = (contractId) => {
    setSelectedContract(contracts.find((contract) => contract.id === contractId))
    setIsRenewModalOpen(true)
  }

  useEffect(() => {
    let filtered = contracts

    // Apply status filter
    if (selectedFilter !== "All Contracts") {
      filtered = filtered.filter((contract) => contract.status === selectedFilter)
    }

    // Apply search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((contract) => contract.memberName.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    switch (selectedSort) {
      case "Alphabetical (A-Z)":
        filtered = [...filtered].sort((a, b) => a.memberName.localeCompare(b.memberName))
        break
      case "Alphabetical (Z-A)":
        filtered = [...filtered].sort((a, b) => b.memberName.localeCompare(a.memberName))
        break
      case "Contract Type (A-Z)":
        filtered = [...filtered].sort((a, b) => a.contractType.localeCompare(b.contractType))
        break
      case "Contract Type (Z-A)":
        filtered = [...filtered].sort((a, b) => b.contractType.localeCompare(a.contractType))
        break
      case "Status (A-Z)":
        filtered = [...filtered].sort((a, b) => a.status.localeCompare(b.status))
        break
      case "Status (Z-A)":
        filtered = [...filtered].sort((a, b) => b.status.localeCompare(a.status))
        break
      case "Expiring Soon":
        filtered = [...filtered].sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
        break
      case "Recently Added":
        filtered = [...filtered].sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
        break
      default:
        // Default alphabetical sorting
        filtered = [...filtered].sort((a, b) => a.memberName.localeCompare(b.memberName))
        break
    }

    setFilteredContracts(filtered)
    setCurrentPage(1) // Reset to the first page when filter or sort changes
  }, [selectedFilter, contracts, searchTerm, selectedSort])

  const isContractExpired = (endDate) => {
    const today = new Date()
    const contractEndDate = new Date(endDate)
    return today > contractEndDate
  }

  const handleDeleteOngoingContract = (contractId) => {
    if (confirm("Are you sure you want to delete this ongoing contract?")) {
      const updatedContracts = contracts.filter((contract) => contract.id !== contractId)
      setContracts(updatedContracts)
      toast.success("Ongoing contract deleted successfully")
    }
  }

  const totalPages = Math.ceil(filteredContracts.length / contractsPerPage)
  const startIndex = (currentPage - 1) * contractsPerPage
  const paginatedContracts = filteredContracts.slice(startIndex, startIndex + contractsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    // Scroll to top of the contracts list
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-trigger") && !event.target.closest(".dropdown-menu")) {
        setActiveDropdownId(null)
      }
      if (!event.target.closest(".filter-dropdown")) {
        setFilterDropdownOpen(false)
      }
      if (!event.target.closest(".sort-dropdown")) {
        setSortDropdownOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const handleRenewSubmit = (renewalData) => {
    setIsRenewModalOpen(false)
    if (selectedContract) {
      // Calculate new end date based on renewal duration
      const startDate = renewalData.startAfterCurrent
        ? new Date(selectedContract.endDate)
        : new Date(renewalData.customStartDate)

      const endDate = new Date(startDate)
      endDate.setMonth(endDate.getMonth() + Number.parseInt(renewalData.duration))

      const updatedContracts = contracts.map((contract) =>
        contract.id === selectedContract.id
          ? {
              ...contract,
              contractType: renewalData.contractType,
              endDate: endDate.toISOString().split("T")[0],
              status: "Active",
            }
          : contract,
      )
      setContracts(updatedContracts)
    }
    setSelectedContract(null)
    toast.success("Contract renewed successfully")
  }

  const handleChangeSubmit = (changeData) => {
    setIsChangeModalOpen(false)
    if (selectedContract) {
      const updatedContracts = contracts.map((contract) =>
        contract.id === selectedContract.id
          ? {
              ...contract,
              contractType: changeData.newContractType,
              // You might want to update other fields based on the change
            }
          : contract,
      )
      setContracts(updatedContracts)
    }
    setSelectedContract(null)
    toast.success("Contract changed successfully")
  }

  const handleChangeContract = (contractId) => {
    setSelectedContract(contracts.find((contract) => contract.id === contractId))
    setIsChangeModalOpen(true)
  }

  const handleViewDetails = (contract) => {
    setSelectedContract(contract)
    setIsShowDetails(true)
  }

  const toggleDropdown = (contractId, event) => {
    event.stopPropagation()
    setActiveDropdownId(activeDropdownId === contractId ? null : contractId)
  }

  const handleCancelContract = (contractId) => {
    setSelectedContract(contracts.find((contract) => contract.id === contractId))
    setIsCancelModalOpen(true)
  }

  const handlePauseContract = (contractId) => {
    setSelectedContract(contracts.find((contract) => contract.id === contractId))
    setIsPauseModalOpen(true)
  }

  const handlePauseReasonSubmit = () => {
    setIsPauseModalOpen(false)
    setIsShowDetails(false)
    setSelectedContract(null)
    toast.success("Contract has been paused")
  }

  const handleCancelSubmit = ({ reason, cancelDate }) => {
    setIsCancelModalOpen(false)
    if (selectedContract) {
      const updatedContracts = contracts.map((contract) =>
        contract.id === selectedContract.id ? { ...contract, status: "Cancelled", cancelReason: reason } : contract,
      )
      setContracts(updatedContracts)
    }
    setIsShowDetails(false)
    setSelectedContract(null)
    toast.success("Contract has been cancelled")
  }

  const handleEditContract = (contractId) => {
    setSelectedContract(contracts.find((contract) => contract.id === contractId))
    setIsEditModalOpen(true)
  }

  const handleSaveEditedContract = (updatedContract) => {
    const updatedContracts = contracts.map((c) => (c.id === updatedContract.id ? updatedContract : c))
    setContracts(updatedContracts)
    setIsEditModalOpen(false)
    toast.success("Contract updated successfully")
  }

  const handleAddContract = () => {
    // Randomly select a lead for pre-filling (in a real app, this would be selected by the user)
    const randomLead = sampleLeads[Math.floor(Math.random() * sampleLeads.length)]
    setSelectedLead(randomLead)
    setIsModalOpen(true)
  }

  const handleSaveNewContract = (contractData) => {
    // Create a new contract with the provided data
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
    }

    setContracts([...contracts, newContract])
    setIsModalOpen(false)
    toast.success("Contract added successfully")
  }

  const handleManageDocuments = (contract) => {
    setSelectedContract(contract)
    setIsDocumentModalOpen(true)
  }

  const handleAddBonusTime = (contractId) => {
    setSelectedContract(contracts.find((contract) => contract.id === contractId))
    setIsBonusTimeModalOpen(true)
  }

  const handleViewHistory = (contractId) => {
    setSelectedContract(contracts.find((contract) => contract.id === contractId))
    setIsHistoryModalOpen(true)
  }

  const [communications, setCommunications] = useState([
    {
      id: 1,
      name: "John Doe",
      message: "Hey, how's the project going?",
      time: "2 min ago",
      avatar: Rectangle1,
    },
    {
      id: 2,
      name: "Jane Smith",
      message: "Meeting scheduled for tomorrow",
      time: "10 min ago",
      avatar: Rectangle1,
    },
  ])

  const [todos, setTodos] = useState([
    {
      id: 1,
      title: "Review project proposal",
      description: "Check the latest updates",
      assignee: "Mike",
    },
    {
      id: 2,
      title: "Update documentation",
      description: "Add new features info",
      assignee: "Sarah",
    },
  ])

  const [birthdays, setBirthdays] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      date: "Dec 15, 2024",
      avatar: Avatar,
    },
    {
      id: 2,
      name: "Bob Wilson",
      date: "Dec 20, 2024",
      avatar: Avatar,
    },
  ])

  const [customLinks, setCustomLinks] = useState([
    {
      id: 1,
      title: "Google Drive",
      url: "https://drive.google.com",
    },
    {
      id: 2,
      title: "GitHub",
      url: "https://github.com",
    },
  ])

  const [openDropdownIndex, setOpenDropdownIndex] = useState(null)
  const [editingLink, setEditingLink] = useState(null)

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen)
  }

  const closeSidebar = () => {
    setIsRightSidebarOpen(false)
  }

  const redirectToCommunication = () => {
    navigate("/dashboard/communication")
  }

  const redirectToTodos = () => {
    console.log("Redirecting to todos page")
    navigate("/dashboard/to-do")
  }

  const toggleContractDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index)
  }

  const sortOptions = [
    "Alphabetical (A-Z)",
    "Alphabetical (Z-A)",
    "Contract Type (A-Z)",
    "Contract Type (Z-A)",
    "Status (A-Z)",
    "Status (Z-A)",
    "Expiring Soon",
    "Recently Added",
  ]

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

      <div
        className={`
          min-h-screen rounded-3xl bg-[#1C1C1C] p-4 sm:p-6
          transition-all duration-500 ease-in-out flex-1
          ${
            isRightSidebarOpen
              ? "lg:mr-86 md:mr-86 sm:mr-86" // Adjust right margin when sidebar is open on larger screens
              : "mr-0" // No margin when closed
          }
        `}
      >
        <div className="flex flex-col lg:justify-between md:flex-col lg:flex-row gap-4 mb-6 sm:mb-8">
          {/* Title and Menu Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-white oxanium_font text-xl sm:text-2xl">Contracts</h2>

              <div className="flex bg-black items-center rounded-xl border border-gray-800 p-1 w-fit">
                <span className="text-xs text-gray-400 px-2">View</span>

                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-[#F27A30] text-white" : "text-gray-400 hover:text-white"
                  }`}
                  title="Grid View"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list" ? "bg-[#F27A30] text-white" : "text-gray-400 hover:text-white"
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)} className="md:hidden text-white">
              <IoIosMenu size={23} />
            </button>
          </div>

          {/* Controls Row - Responsive Layout */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* View Mode Toggle */}

            {/* Filter and Sort Controls */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
              {/* Filter Dropdown */}
              <div className="relative filter-dropdown flex-1 sm:flex-none sm:min-w-[150px]">
                <button
                  onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                  className="bg-black text-sm cursor-pointer text-white px-4 py-2 rounded-xl border border-gray-800 flex items-center justify-between gap-2 w-full"
                >
                  {selectedFilter}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {filterDropdownOpen && (
                  <div className="absolute left-0 right-0 sm:right-auto sm:w-full text-sm mt-2 bg-[#2F2F2F]/90 backdrop-blur-2xl rounded-xl border border-gray-800 shadow-lg z-10">
                    {["All Contracts", "Active", "Ongoing", "Paused", "Cancelled"].map((filter) => (
                      <button
                        key={filter}
                        className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-black cursor-pointer text-left"
                        onClick={() => {
                          setSelectedFilter(filter)
                          setFilterDropdownOpen(false)
                        }}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative sort-dropdown flex-1 sm:flex-none sm:min-w-[200px]">
                <button
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  className="bg-black text-sm cursor-pointer text-white px-4 py-2 rounded-xl border border-gray-800 flex items-center justify-between gap-2 w-full"
                >
                  <span className="truncate">Sort: {selectedSort}</span>
                  <ArrowUpDown className="w-4 h-4 flex-shrink-0" />
                </button>
                {sortDropdownOpen && (
                  <div className="absolute left-0 right-0 sm:right-auto sm:w-full text-sm mt-2 bg-[#2F2F2F]/90 backdrop-blur-2xl rounded-xl border border-gray-800 shadow-lg z-10 max-h-60 overflow-y-auto">
                    {sortOptions.map((sortOption) => (
                      <button
                        key={sortOption}
                        className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-black cursor-pointer text-left"
                        onClick={() => {
                          setSelectedSort(sortOption)
                          setSortDropdownOpen(false)
                        }}
                      >
                        {sortOption}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Create Button and Menu */}
            <div className="flex gap-3 items-center">
              <button
                onClick={handleAddContract}
                className="flex items-center justify-center cursor-pointer gap-2 px-4 py-2 text-sm bg-orange-500 text-white rounded-xl hover:bg-[#e06b21] transition-colors flex-1 sm:flex-none"
              >
                <Plus className="w-5 h-5" />
                <span>Create Contract</span>
              </button>

              <button
                onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                className="hidden md:block text-sm hover:bg-gray-100 hover:text-black text-white rounded-md cursor-pointer"
              >
                <IoIosMenu size={23} />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search Contracts"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-2 pl-10"
          />
        </div>

        {viewMode === "list" ? (
          // List View (Original Layout)
          <div className="space-y-3">
            {paginatedContracts.map((contract) => (
              <div
                key={contract.id}
                className="flex flex-col lg:flex-row lg:items-center justify-between bg-[#141414] p-4 rounded-xl hover:bg-[#1a1a1a] transition-colors gap-4"
              >
                <div className="flex flex-col items-start justify-start">
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-lg mb-1 ${
                      contract.status === "Active"
                        ? "bg-green-600 text-white"
                        : contract.status === "Ongoing"
                          ? "bg-gray-600 text-white"
                          : contract.status === "Paused"
                            ? "bg-yellow-600 text-white"
                            : "bg-red-600 text-white"
                    }`}
                  >
                    {contract.status}
                    {contract.pauseReason && ` (${contract.pauseReason})`}
                    {contract.cancelReason && ` (${contract.cancelReason})`}
                  </span>

                  {contract.status === "Ongoing" && contract.signatureRequired && (
                    <div className="flex items-center gap-1 mb-1">
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                      <span className="text-red-500 text-xs font-medium">Signature required</span>
                    </div>
                  )}

                  <span className="text-white font-medium">{contract.memberName}</span>
                  <span className="text-sm text-gray-400">{contract.contractType}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">
                      {contract.startDate} - {contract.endDate}
                    </span>
                    {isContractExpired(contract.endDate) && contract.status === "Active" && (
                      <span className="text-xs text-blue-400 font-medium">Automatically renewed</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => handleViewDetails(contract)}
                    className="text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-1.5 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    View Details
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleManageDocuments(contract)}
                      className="text-white flex-1 sm:flex-none bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2 relative"
                      title="Manage Documents"
                    >
                      <FileText size={16} />
                      {contract.status === "Ongoing" && contract.signatureRequired && (
                        <AlertTriangle className="w-3 h-3 text-red-500 absolute -top-1 -right-1" />
                      )}
                    </button>
                    <button
                      onClick={() => handleViewHistory(contract.id)}
                      className="text-white flex-1 sm:flex-none bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                      title="View Contract History"
                    >
                      <History size={16} />
                    </button>
                    {contract.status === "Ongoing" ? (
                      <button
                        onClick={() => handleDeleteOngoingContract(contract.id)}
                        className="p-2 bg-black rounded-xl border border-slate-600 hover:border-red-400 hover:text-red-400 transition-colors"
                        title="Delete Ongoing Contract"
                      >
                        <Trash2 className="w-4 h-4 text-red-400 cursor-pointer" />
                      </button>
                    ) : (
                      <div className="relative">
                        <button
                          onClick={(e) => toggleDropdown(contract.id, e)}
                          className="dropdown-trigger p-2 bg-black rounded-xl border border-slate-600 hover:border-slate-400 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer" />
                        </button>

                        {activeDropdownId === contract.id && (
                          <div className="dropdown-menu absolute right-0 top-10 w-46 bg-[#2F2F2F]/20 backdrop-blur-xl rounded-xl border border-gray-800 shadow-lg z-10">
                            <button
                              onClick={() => handleRenewContract(contract.id)}
                              className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 text-left"
                            >
                              Renew Contract{" "}
                            </button>
                            <button
                              className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 text-left"
                              onClick={() => handleChangeContract(contract.id)}
                            >
                              Change Contract
                            </button>
                            <button
                              className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 text-left"
                              onClick={() => handleAddBonusTime(contract.id)}
                            >
                              Add Bonustime
                            </button>
                            <button
                              className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 text-left"
                              onClick={() => handlePauseContract(contract.id)}
                            >
                              Pause Contract
                            </button>
                            <button
                              className="w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-800 text-left"
                              onClick={() => handleCancelContract(contract.id)}
                            >
                              Cancel Contract
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedContracts.map((contract) => (
              <div key={contract.id} className="bg-[#141414] p-4 rounded-xl hover:bg-[#1a1a1a] transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-lg ${
                      contract.status === "Active"
                        ? "bg-green-600 text-white"
                        : contract.status === "Ongoing"
                          ? "bg-gray-600 text-white"
                          : contract.status === "Paused"
                            ? "bg-yellow-600 text-white"
                            : "bg-red-600 text-white"
                    }`}
                  >
                    {contract.status}
                    {contract.pauseReason && ` (${contract.pauseReason})`}
                    {contract.cancelReason && ` (${contract.cancelReason})`}
                  </span>

                  {contract.status === "Ongoing" ? (
                    <button
                      onClick={() => handleDeleteOngoingContract(contract.id)}
                      className="p-1 hover:bg-[#2a2a2a] rounded-full transition-colors"
                      title="Delete Ongoing Contract"
                    >
                      <Trash2 className="w-5 h-5 text-red-400 cursor-pointer" />
                    </button>
                  ) : (
                    <div className="relative">
                      <button
                        onClick={(e) => toggleDropdown(contract.id, e)}
                        className="dropdown-trigger p-1 hover:bg-[#2a2a2a] rounded-full transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" />
                      </button>

                      {activeDropdownId === contract.id && (
                        <div className="dropdown-menu absolute right-0 top-6 w-46 bg-[#2F2F2F]/20 backdrop-blur-xl rounded-xl border border-gray-800 shadow-lg z-10">
                          <button
                            onClick={() => handleRenewContract(contract.id)}
                            className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 text-left"
                          >
                            Renew Contract
                          </button>
                          <button
                            className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 text-left"
                            onClick={() => handleChangeContract(contract.id)}
                          >
                            Change Contract
                          </button>
                          <button
                            className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 text-left"
                            onClick={() => handleAddBonusTime(contract.id)}
                          >
                            Add Bonustime
                          </button>
                          <button
                            className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 text-left"
                            onClick={() => handlePauseContract(contract.id)}
                          >
                            Pause Contract
                          </button>
                          <button
                            className="w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-800 text-left"
                            onClick={() => handleCancelContract(contract.id)}
                          >
                            Cancel Contract
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {contract.status === "Ongoing" && contract.signatureRequired && (
                  <div className="flex items-center gap-1 mb-2">
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    <span className="text-red-500 text-xs font-medium">Signature required</span>
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  <h3 className="text-white font-medium text-lg">{contract.memberName}</h3>
                  <p className="text-gray-400 text-sm">{contract.contractType}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-400 text-sm">
                      {contract.startDate} - {contract.endDate}
                    </p>
                    {isContractExpired(contract.endDate) && contract.status === "Active" && (
                      <span className="text-xs text-blue-400 font-medium">Automatically renewed</span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{contract.isDigital ? "Digital" : "Analog"}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleViewDetails(contract)}
                    className="px-3 py-1.5 bg-black text-sm cursor-pointer text-white border border-gray-800 rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleManageDocuments(contract)}
                      className="flex-1 p-1.5 bg-black text-sm cursor-pointer text-white border border-gray-800 rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center relative"
                      title="Manage Documents"
                    >
                      <FileText className="w-5 h-5" />
                      {contract.status === "Ongoing" && contract.signatureRequired && (
                        <AlertTriangle className="w-3 h-3 text-red-500 absolute -top-1 -right-1" />
                      )}
                    </button>
                    <button
                      onClick={() => handleViewHistory(contract.id)}
                      className="flex-1 p-1.5 bg-black text-sm cursor-pointer text-white border border-gray-800 rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center"
                      title="View Contract History"
                    >
                      <History className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {paginatedContracts.length === 0 && (
          <div className="bg-[#141414] p-6 rounded-xl text-center">
            <p className="text-gray-400">No contracts found matching your criteria.</p>
          </div>
        )}

        {/* Add Contract Modal */}
        {isModalOpen && (
          <AddContractModal
            onClose={() => {
              setIsModalOpen(false)
              setSelectedLead(null)
            }}
            onSave={handleSaveNewContract}
            leadData={selectedLead}
          />
        )}

        {/* View Details Modal */}
        {isShowDetails && selectedContract && (
          <ContractDetailsModal
            contract={selectedContract}
            onClose={() => {
              setIsShowDetails(false)
              setSelectedContract(null)
            }}
            onPause={() => handlePauseContract(selectedContract.id)}
            onCancel={() => handleCancelContract(selectedContract.id)}
            handleHistoryModal={handleViewHistory}
          />
        )}

        {/* Pause Contract Modal */}
        {isPauseModalOpen && (
          <PauseContractModal onClose={() => setIsPauseModalOpen(false)} onSubmit={handlePauseReasonSubmit} />
        )}

        {/* Cancel Contract Modal */}
        {isCancelModalOpen && (
          <CancelContractModal onClose={() => setIsCancelModalOpen(false)} onSubmit={handleCancelSubmit} />
        )}

        {/* Edit Contract Modal */}
        {isEditModalOpen && selectedContract && (
          <EditContractModal
            contract={selectedContract}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleSaveEditedContract}
          />
        )}

        {/* Document Management Modal */}
        {isDocumentModalOpen && selectedContract && (
          <DocumentManagementModal
            contract={selectedContract}
            onClose={() => {
              setIsDocumentModalOpen(false)
              setSelectedContract(null)
            }}
          />
        )}

        {/* Bonus Time Modal */}
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

        {/* Renew Contract Modal */}
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
        {/* Contract History Modal */}
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
      </div>
      <SidebarArea
        isOpen={isRightSidebarOpen}
        onClose={closeSidebar}
        communications={communications}
        todos={todos}
        birthdays={birthdays}
        customLinks={customLinks}
        setCustomLinks={setCustomLinks}
        redirectToCommunication={redirectToCommunication}
        redirectToTodos={redirectToTodos}
        toggleDropdown={toggleDropdown}
        openDropdownIndex={openDropdownIndex}
        setEditingLink={setEditingLink}
      />

      {/* Overlay for mobile screens only */}
      {isRightSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeSidebar} />}
    </>
  )
}
