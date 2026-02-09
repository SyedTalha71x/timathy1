/* eslint-disable no-unused-vars */
import { MoreVertical, Plus, ChevronDown, ArrowUpDown, FileText } from "lucide-react"
import { useEffect, useState } from "react"
import { toast, Toaster } from "react-hot-toast"

import { AddContractModal } from "../../components/admin-dashboard-components/contract-components/add-contract-modal"
import { ContractDetailsModal } from "../../components/admin-dashboard-components/contract-components/contract-details-modal"
import { PauseContractModal } from "../../components/admin-dashboard-components/contract-components/pause-contract-modal"
import { CancelContractModal } from "../../components/admin-dashboard-components/contract-components/cancel-contract-modal"
import { EditContractModal } from "../../components/admin-dashboard-components/contract-components/edit-contract-modal"
import { DocumentManagementModal } from "../../components/admin-dashboard-components/contract-components/document-management-modal"
import { BonusTimeModal } from "../../components/admin-dashboard-components/contract-components/bonus-time-modal"
import { RenewContractModal } from "../../components/admin-dashboard-components/contract-components/reniew-contract-modal"
import { ChangeContractModal } from "../../components/admin-dashboard-components/contract-components/change-contract-modal"
import { Search } from "react-feather"

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
      
    `}>
        <div className="flex flex-col sm:flex-row sm:justify-between justify-start items-start md:items-center mb-8">

          <div className="flex justify-between md:mb-0 mb-4 items-center w-full md:w-auto">

            <h2 className="text-white oxanium_font text-2xl  text-left">Contracts</h2>
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
                <span>Create Contract</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 w-full relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search Contracts"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-2 pl-10"
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
                {/* <span className="text-sm text-gray-400 mt-1">
                  <span className="font-semibold text-gray-300">Owner Name: </span>
                  {contract.studioOwnerName}
                </span> */}
                <span className="text-sm text-gray-400">
                  {" "}
                  <span className="font-semibold text-gray-300"></span> {contract.contractType}
                </span>
                <span className="text-sm text-gray-400">
                  <span className="font-semibold text-gray-300"></span> {contract.startDate} -{" "}
                  {contract.endDate}
                </span>
                {/* <span className="text-sm text-gray-400">{contract.isDigital ? "Digital" : "Analog"}</span> */}
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
      </div>
    </>
  )
}
