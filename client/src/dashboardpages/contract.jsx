/* eslint-disable no-unused-vars */
import { MoreVertical, Plus, ChevronDown, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { AddContractModal } from "../components/add-contract-modal";
import { ContractDetailsModal } from "../components/contract-details-modal";
import { PauseContractModal } from "../components/pause-contract-modal";
import { CancelContractModal } from "../components/cancel-contract-modal";
import { FinancesModal } from "../components/finances-modal";
import { EditContractModal } from "../components/edit-contract-modal";

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
    status: "Inactive",
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
]

export default function ContractList() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isShowDetails, setIsShowDetails] = useState(false)
  const [selectedContract, setSelectedContract] = useState(null)
  const [activeDropdownId, setActiveDropdownId] = useState(null)
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState("All Contracts")
  const [contracts, setContracts] = useState(initialContracts)
  const [filteredContracts, setFilteredContracts] = useState(contracts)
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-trigger") && !event.target.closest(".dropdown-menu")) {
        setActiveDropdownId(null)
      }
      if (!event.target.closest(".filter-dropdown")) {
        setFilterDropdownOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  useEffect(() => {
    if (selectedFilter === "All Contracts") {
      setFilteredContracts(contracts)
    } else {
      setFilteredContracts(contracts.filter((contract) => contract.status === selectedFilter))
    }
  }, [selectedFilter, contracts])

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

      <div className="bg-[#1C1C1C] p-6 rounded-3xl w-full">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-white oxanium_font text-2xl">Contracts</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative filter-dropdown w-full sm:w-auto">
              <button
                onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                className="bg-black text-sm cursor-pointer text-white px-4 py-2 rounded-xl border border-gray-800 flex items-center justify-between gap-2 min-w-[150px]"
              >
                {selectedFilter}
                <ChevronDown className="w-4 h-4" />
              </button>
              {filterDropdownOpen && (
                <div className="absolute right-0 text-sm mt-2 w-full bg-[#2F2F2F]/90 backdrop-blur-2xl rounded-xl border border-gray-800 shadow-lg z-10">
                  {["All Contracts", "Active", "Paused", "Inactive", "Cancelled"].map((filter) => (
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
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center cursor-pointer gap-2 px-4 py-2 text-sm bg-[#F27A30] text-white rounded-xl hover:bg-[#e06b21] transition-colors w-full sm:w-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Add Contract</span>
              </button>
              <button
                onClick={() => setIsFinanceModalOpen(true)}
                className="flex items-center justify-center cursor-pointer gap-2 px-4 py-2 text-sm bg-[#3F74FF] text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors w-full sm:w-auto"
              >
                <DollarSign className="w-5 h-5" />
                <span>Finances</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {filteredContracts.map((contract) => (
            <div
              key={contract.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#141414] p-4 rounded-xl hover:bg-[#1a1a1a] transition-colors gap-4"
            >
              <div className="flex flex-col items-start justify-start">
                <span className="text-white font-medium">{contract.memberName}</span>
                <span className="text-sm text-gray-400">{contract.contractType}</span>
                <span className="text-sm text-gray-400">
                  {contract.startDate} - {contract.endDate}
                </span>
                <span className="text-sm text-gray-400">{contract.isDigital ? "Digital" : "Analog"}</span>
                <span
                  className={`text-sm ${
                    contract.status === "Active"
                      ? "text-green-500"
                      : contract.status === "Paused"
                        ? "text-yellow-500"
                        : "text-red-500"
                  }`}
                >
                  {contract.status}
                  {contract.pauseReason && ` (${contract.pauseReason})`}
                  {contract.cancelReason && ` (${contract.cancelReason})`}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleViewDetails(contract)}
                  className="px-4 py-1.5 bg-black text-sm cursor-pointer text-white border border-gray-800 rounded-xl hover:bg-gray-900 transition-colors flex-grow sm:flex-grow-0"
                >
                  View details
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
                        onClick={() => handleEditContract(contract.id)}
                      >
                        Edit
                      </button>
                      <button className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 text-left">
                        Extend Contract
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
        </div>

        {/* Add Contract Modal */}
        {isModalOpen && (
          <AddContractModal
            onClose={() => setIsModalOpen(false)}
            onSave={() => {
              setIsModalOpen(false)
              toast.success("Contract added successfully")
            }}
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

        {/* Finances Modal */}
        {isFinanceModalOpen && <FinancesModal onClose={() => setIsFinanceModalOpen(false)} />}

        {/* Edit Contract Modal */}
        {isEditModalOpen && selectedContract && (
          <EditContractModal
            contract={selectedContract}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleSaveEditedContract}
          />
        )}
      </div>
    </>
  )
}

