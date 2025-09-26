/* eslint-disable no-unused-vars */
import { MoreVertical, Plus, ChevronDown, ArrowUpDown, FileText } from "lucide-react"
import { useEffect, useState } from "react"
import { toast, Toaster } from "react-hot-toast"
import { AddContractModal } from "../../components/customer-dashboard/add-contract-modal"
import { ContractDetailsModal } from "../../components/customer-dashboard/contract-details-modal"
import { PauseContractModal } from "../../components/customer-dashboard/pause-contract-modal"
import { CancelContractModal } from "../../components/customer-dashboard/cancel-contract-modal"
import { EditContractModal } from "../../components/customer-dashboard/edit-contract-modal"
import { DocumentManagementModal } from "../../components/customer-dashboard/document-management-modal"
import { BonusTimeModal } from "../../components/customer-dashboard/bonus-time-modal"
import { RenewContractModal } from "../../components/customer-dashboard/reniew-contract-modal"
import { ChangeContractModal } from "../../components/customer-dashboard/change-contract-modal"
import { IoIosMenu } from "react-icons/io"
import WebsiteLinkModal from "../../components/customer-dashboard/myarea-components/website-link-modal"
import WidgetSelectionModal from "../../components/customer-dashboard/myarea-components/widgets"
import ConfirmationModal from "../../components/customer-dashboard/myarea-components/confirmation-modal"
import Sidebar from "../../components/customer-dashboard/central-sidebar"

const initialStudioContracts = [
  {
    id: "12321-1",
    studioName: "Pro Physio Studio",
    studioOwnerName: "John Doe",
    contractType: "Premium",
    startDate: "2023-01-01",
    endDate: "2024-01-01",
    status: "Active",
    pauseReason: null,
    cancelReason: null,
    isDigital: true,
    email: "prostudio@example.com",
    phone: "1234567890",
    iban: "DE89370400440532013000",
  },
  {
    id: "12321-2",
    studioName: "Power Fitness Gym",
    studioOwnerName: "Jane Smith",
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
    studioName: "Body Fitness Gym",
    studioOwnerName: "Micheal Clark",
    contractType: "Premium",
    startDate: "2023-03-01",
    endDate: "2024-03-01",
    status: "Canceled",
    pauseReason: null,
    cancelReason: "Financial Reasons",
    isDigital: true,
    email: "bodyfitness@example.com",
    phone: "9876543210",
    iban: "FR1420041010050500013M02606",
  },
  {
    id: "12321-4",
    studioName: "Roman Empire Gym",
    studioOwnerName: "Scarlet Johnson",
    contractType: "Bronze",
    startDate: "2023-03-01",
    endDate: "2024-03-01",
    status: "Canceled",
    pauseReason: null,
    cancelReason: "Financial Reasons",
    isDigital: false,
  },
]
const sampleLeads = [
  {
    id: "lead-1",
    studioName: "Elite Fitness Studio",
    studioOwnerName: "Michael Brown",
    email: "michael@example.com",
    phone: "5551234567",
    interestedIn: "Premium",
  },
  {
    id: "lead-2",
    studioName: "Wellness Center Pro",
    studioOwnerName: "Sarah Wilson",
    email: "sarah@example.com",
    phone: "5559876543",
    interestedIn: "Basic",
  },
]

export default function ContractList() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isShowDetails, setIsShowDetails] = useState(false)
  const [selectedContract, setSelectedContract] = useState(null)
  const [activeDropdownId, setActiveDropdownId] = useState(null)
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false)
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState("All Contracts")
  const [selectedSort, setSelectedSort] = useState("Alphabetical")
  const [contracts, setContracts] = useState(initialStudioContracts)
  const [filteredContracts, setFilteredContracts] = useState(initialStudioContracts)
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("This Month")
  const [selectedLead, setSelectedLead] = useState(null)
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false)
  const [isBonusTimeModalOpen, setIsBonusTimeModalOpen] = useState(false)
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false)
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false)

  //sidebar related logic and states 
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedMemberType, setSelectedMemberType] = useState("Studios Acquired")
  const [isRightWidgetModalOpen, setIsRightWidgetModalOpen] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, linkId: null })
  const [editingLink, setEditingLink] = useState(null)
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null)

  const [sidebarWidgets, setSidebarWidgets] = useState([
    { id: "sidebar-chart", type: "chart", position: 0 },
    { id: "sidebar-todo", type: "todo", position: 1 },
    { id: "sidebar-websiteLink", type: "websiteLink", position: 2 },
    { id: "sidebar-expiringContracts", type: "expiringContracts", position: 3 },
  ])

  const [todos, setTodos] = useState([
    {
      id: 1,
      title: "Review Design",
      description: "Review the new dashboard design",
      assignee: "Jack",
      dueDate: "2024-12-15",
      dueTime: "14:30",
    },
    {
      id: 2,
      title: "Team Meeting",
      description: "Weekly team sync",
      assignee: "Jack",
      dueDate: "2024-12-16",
      dueTime: "10:00",
    },
  ])

  const memberTypes = {
    "Studios Acquired": {
      data: [
        [30, 45, 60, 75, 90, 105, 120, 135, 150],
        [25, 40, 55, 70, 85, 100, 115, 130, 145],
      ],
      growth: "12%",
      title: "Studios Acquired",
    },
    Finance: {
      data: [
        [50000, 60000, 75000, 85000, 95000, 110000, 125000, 140000, 160000],
        [45000, 55000, 70000, 80000, 90000, 105000, 120000, 135000, 155000],
      ],
      growth: "8%",
      title: "Finance Statistics",
    },
    Leads: {
      data: [
        [120, 150, 180, 210, 240, 270, 300, 330, 360],
        [100, 130, 160, 190, 220, 250, 280, 310, 340],
      ],
      growth: "15%",
      title: "Leads Statistics",
    },
    Franchises: {
      data: [
        [120, 150, 180, 210, 240, 270, 300, 330, 360],
        [100, 130, 160, 190, 220, 250, 280, 310, 340],
      ],
      growth: "10%",
      title: "Franchises Acquired",
    },
  }

  const [customLinks, setCustomLinks] = useState([
    {
      id: "link1",
      url: "https://fitness-web-kappa.vercel.app/",
      title: "Timathy Fitness Town",
    },
    { id: "link2", url: "https://oxygengym.pk/", title: "Oxygen Gyms" },
    { id: "link3", url: "https://fitness-web-kappa.vercel.app/", title: "Timathy V1" },
  ])

  const [expiringContracts, setExpiringContracts] = useState([
    {
      id: 1,
      title: "Oxygen Gym Membership",
      expiryDate: "June 30, 2025",
      status: "Expiring Soon",
    },
    {
      id: 2,
      title: "Timathy Fitness Equipment Lease",
      expiryDate: "July 15, 2025",
      status: "Expiring Soon",
    },
    {
      id: 3,
      title: "Studio Space Rental",
      expiryDate: "August 5, 2025",
      status: "Expiring Soon",
    },
    {
      id: 4,
      title: "Insurance Policy",
      expiryDate: "September 10, 2025",
      status: "Expiring Soon",
    },
    {
      id: 5,
      title: "Software License",
      expiryDate: "October 20, 2025",
      status: "Expiring Soon",
    },
  ])

  // -------------- end of sidebar logic


  useEffect(() => {
    let filtered = contracts

    // Apply status filter
    if (selectedFilter !== "All Contracts") {
      filtered = filtered.filter((contract) => contract.status === selectedFilter)
    }

    // Apply search filter - only search by studio name
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((contract) => contract.studioName.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Apply sorting
    switch (selectedSort) {
      case "Expiring Soon":
        filtered = [...filtered].sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
        break
      default:
        // Alphabetical sorting by studio name (default)
        filtered = [...filtered].sort((a, b) => a.studioName.localeCompare(b.studioName))
        break
    }

    setFilteredContracts(filtered)
  }, [selectedFilter, contracts, searchTerm, selectedSort])

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
      studioName: contractData.studioName || contractData.fullName,
      studioOwnerName: contractData.studioOwnerName || contractData.fullName,
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

  const handleRenewContract = (contractId) => {
    setSelectedContract(contracts.find((contract) => contract.id === contractId))
    setIsRenewModalOpen(true)
  }

  const handleChangeContract = (contractId) => {
    setSelectedContract(contracts.find((contract) => contract.id === contractId))
    setIsChangeModalOpen(true)
  }

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


  // continue sidebar logic
  const updateCustomLink = (id, field, value) => {
    setCustomLinks((currentLinks) => currentLinks.map((link) => (link.id === id ? { ...link, [field]: value } : link)))
  }

  const removeCustomLink = (id) => {
    setConfirmationModal({ isOpen: true, linkId: id })
  }

  const handleAddSidebarWidget = (widgetType) => {
    const newWidget = {
      id: `sidebar-widget${Date.now()}`,
      type: widgetType,
      position: sidebarWidgets.length,
    }
    setSidebarWidgets((currentWidgets) => [...currentWidgets, newWidget])
    setIsRightWidgetModalOpen(false)
    toast.success(`${widgetType} widget has been added to sidebar Successfully`)
  }

  const confirmRemoveLink = () => {
    if (confirmationModal.linkId) {
      setCustomLinks((currentLinks) => currentLinks.filter((link) => link.id !== confirmationModal.linkId))
      toast.success("Website link removed successfully")
    }
    setConfirmationModal({ isOpen: false, linkId: null })
  }

  const getSidebarWidgetStatus = (widgetType) => {
    // Check if widget exists in sidebar widgets
    const existsInSidebar = sidebarWidgets.some((widget) => widget.type === widgetType)

    if (existsInSidebar) {
      return { canAdd: false, location: "sidebar" }
    }

    return { canAdd: true, location: null }
  }

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen)
  }

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

      <div className={`
      min-h-screen rounded-3xl bg-[#1C1C1C] text-white md:p-6 p-3
      transition-all duration-500 ease-in-out flex-1
      ${isRightSidebarOpen
          ? 'lg:mr-86 mr-0'
          : 'mr-0'
        }
    `}>
        <div className="flex flex-col sm:flex-row sm:justify-between justify-start items-start md:items-center mb-8">

          <div className="flex justify-between md:mb-0 mb-4 items-center w-full md:w-auto">

            <h2 className="text-white oxanium_font text-2xl  text-left">Contracts</h2>
            <div onClick={toggleRightSidebar} className="cursor-pointer lg:hidden md:hidden block text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md ">
              <IoIosMenu size={26} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 w-full sm:w-auto">
            <div className="relative filter-dropdown w-full sm:w-auto">
              <button
                onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                className="bg-black text-sm cursor-pointer text-white px-4 py-2 rounded-xl border border-gray-800 flex items-center justify-between gap-2 w-full sm:min-w-[150px]"
              >
                {selectedFilter}
                <ChevronDown className="w-4 h-4" />
              </button>
              {filterDropdownOpen && (
                <div className="absolute right-0 text-sm mt-2 w-full bg-[#2F2F2F]/90 backdrop-blur-2xl rounded-xl border border-gray-800 shadow-lg z-10">
                  {["All Contracts", "Active", "Paused", "Canceled"].map((filter) => (
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
            <div className="relative sort-dropdown w-full sm:w-auto">
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="bg-black text-sm cursor-pointer text-white px-4 py-2 rounded-xl border border-gray-800 flex items-center justify-between gap-2 w-full sm:min-w-[150px]"
              >
                <span>Sort: {selectedSort}</span>
                <ArrowUpDown className="w-4 h-4" />
              </button>
              {sortDropdownOpen && (
                <div className="absolute right-0 text-sm mt-2 w-full bg-[#2F2F2F]/90 backdrop-blur-2xl rounded-xl border border-gray-800 shadow-lg z-10">
                  {["Alphabetical", "Expiring Soon"].map((sortOption) => (
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

            <div className="flex flex-col sm:flex-row gap-2 w-full items-center sm:w-auto">
              <button
                onClick={handleAddContract}
                className="flex items-center justify-center cursor-pointer gap-2 px-4 py-2 text-sm bg-[#F27A30] text-white rounded-xl hover:bg-[#e06b21] transition-colors w-full sm:w-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Add Contract</span>
              </button>

              <div onClick={toggleRightSidebar} className="cursor-pointer lg:block md:block hidden text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md ">
                <IoIosMenu size={26} />
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full mb-2">
          <input
            type="text"
            placeholder="Search for any contract..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-black text-sm text-white px-4 py-2.5 rounded-xl border border-gray-800 w-full focus:outline-none focus:ring-1 focus:ring-[#F27A30]"
          />
        </div>

        <div className="space-y-3">
          {filteredContracts.map((contract) => (
            <div
              key={contract.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#141414] p-4 rounded-xl hover:bg-[#1a1a1a] transition-colors gap-4"
            >
              <div className="flex flex-col items-start justify-start">
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-lg mb-1 ${contract.status === "Active"
                    ? "bg-green-600 text-white"
                    : contract.status === "Paused"
                      ? "bg-yellow-600 text-white"
                      : "bg-red-600 text-white"
                    }`}
                >
                  {contract.status}
                  {contract.pauseReason && ` (${contract.pauseReason})`}
                  {contract.cancelReason && ` (${contract.cancelReason})`}
                </span>

                <span className="text-white font-medium">{contract.studioName}</span>
                <span className="text-sm text-gray-400 mt-1">
                  <span className="font-semibold text-gray-300">Owner Name: </span>
                  {contract.studioOwnerName}
                </span>
                <span className="text-sm text-gray-400">
                  {" "}
                  <span className="font-semibold text-gray-300">Contract Type:</span> {contract.contractType}
                </span>
                <span className="text-sm text-gray-400">
                  <span className="font-semibold text-gray-300">Contract Duration:</span> {contract.startDate} -{" "}
                  {contract.endDate}
                </span>
                <span className="text-sm text-gray-400">{contract.isDigital ? "Digital" : "Analog"}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleViewDetails(contract)}
                  className="px-4 py-1.5 bg-black text-sm cursor-pointer text-white border border-gray-800 rounded-xl hover:bg-gray-900 transition-colors flex-grow sm:flex-grow-0"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleManageDocuments(contract)}
                  className="p-1.5 bg-black text-sm cursor-pointer text-white border border-gray-800 rounded-xl hover:bg-gray-900 transition-colors"
                  title="Manage Documents"
                >
                  <FileText className="w-5 h-5" />
                </button>
                <div className="relative">
                  <button
                    onClick={(e) => toggleDropdown(contract.id, e)}
                    className="dropdown-trigger p-1 hover:bg-[#2a2a2a] rounded-full transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" />
                  </button>

                  {activeDropdownId === contract.id && (
                    <div className="dropdown-menu absolute right-0 sm:right-3 top-6 w-46 bg-[#2F2F2F]/20 backdrop-blur-xl rounded-xl border border-gray-800 shadow-lg z-10">
                      <button
                        className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 text-left"
                        onClick={() => handleRenewContract(contract.id)}
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
              </div>
            </div>
          ))}

          {filteredContracts.length === 0 && (
            <div className="bg-[#141414] p-6 rounded-xl text-center">
              <p className="text-gray-400">No contracts found matching your criteria.</p>
            </div>
          )}
        </div>

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

        {isShowDetails && selectedContract && (
          <ContractDetailsModal
            contract={selectedContract}
            onClose={() => {
              setIsShowDetails(false)
              setSelectedContract(null)
            }}
            onPause={() => handlePauseContract(selectedContract.id)}
            onCancel={() => handleCancelContract(selectedContract.id)}
          />
        )}

        {isPauseModalOpen && (
          <PauseContractModal onClose={() => setIsPauseModalOpen(false)} onSubmit={handlePauseReasonSubmit} />
        )}

        {isCancelModalOpen && (
          <CancelContractModal onClose={() => setIsCancelModalOpen(false)} onSubmit={handleCancelSubmit} />
        )}

        {isEditModalOpen && selectedContract && (
          <EditContractModal
            contract={selectedContract}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleSaveEditedContract}
          />
        )}

        {isDocumentModalOpen && selectedContract && (
          <DocumentManagementModal
            contract={selectedContract}
            onClose={() => {
              setIsDocumentModalOpen(false)
              setSelectedContract(null)
            }}
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

        {/* sidebar related modals */}

        <Sidebar
          isOpen={isRightSidebarOpen}
          onClose={() => setIsRightSidebarOpen(false)}
          widgets={sidebarWidgets}
          setWidgets={setSidebarWidgets}
          isEditing={isEditing}
          todos={todos}
          customLinks={customLinks}
          setCustomLinks={setCustomLinks}
          expiringContracts={expiringContracts}
          selectedMemberType={selectedMemberType}
          setSelectedMemberType={setSelectedMemberType}
          memberTypes={memberTypes}
          onAddWidget={() => setIsRightWidgetModalOpen(true)}
          updateCustomLink={updateCustomLink}
          removeCustomLink={removeCustomLink}
          editingLink={editingLink}
          setEditingLink={setEditingLink}
          openDropdownIndex={openDropdownIndex}
          setOpenDropdownIndex={setOpenDropdownIndex}
        />

        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal({ isOpen: false, linkId: null })}
          onConfirm={confirmRemoveLink}
          title="Delete Website Link"
          message="Are you sure you want to delete this website link? This action cannot be undone."
        />

        <WidgetSelectionModal
          isOpen={isRightWidgetModalOpen}
          onClose={() => setIsRightWidgetModalOpen(false)}
          onSelectWidget={handleAddSidebarWidget}
          getWidgetStatus={getSidebarWidgetStatus}
          widgetArea="sidebar"
        />

        {editingLink && (
          <WebsiteLinkModal
            link={editingLink}
            onClose={() => setEditingLink(null)}
            updateCustomLink={updateCustomLink}
            setCustomLinks={setCustomLinks}
          />
        )}
      </div>
    </>
  )
}
