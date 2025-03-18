/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  MoreVertical,
  Plus,
  ChevronDown,
  ArrowUpDown,
  FileText,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { AddContractModal } from "../components/add-contract-modal";
import { ContractDetailsModal } from "../components/contract-details-modal";
import { PauseContractModal } from "../components/pause-contract-modal";
import { CancelContractModal } from "../components/cancel-contract-modal";
import { EditContractModal } from "../components/edit-contract-modal";
import { DocumentManagementModal } from "../components/document-management-modal";

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
];

// Sample lead data for pre-filling contracts
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
];

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 rounded-xl bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors border border-gray-800"
      >
        Previous
      </button>
      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1.5 rounded-xl transition-colors border ${
              currentPage === page
                ? "bg-[#F27A30] text-white border-transparent"
                : "bg-black text-white border-gray-800 hover:bg-gray-900"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 rounded-xl bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors border border-gray-800"
      >
        Next
      </button>
    </div>
  );
};

export default function ContractList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowDetails, setIsShowDetails] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All Contracts");
  const [selectedSort, setSelectedSort] = useState("Alphabetical"); // Update 1: Changed initial state to "Alphabetical"
  const [contracts, setContracts] = useState(initialContracts);
  const [filteredContracts, setFilteredContracts] = useState(initialContracts);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const contractsPerPage = 3;
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");
  const [selectedLead, setSelectedLead] = useState(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

  // Update filtered contracts when selectedFilter, contracts, or searchTerm change
  useEffect(() => {
    let filtered = contracts;

    // Apply status filter
    if (selectedFilter !== "All Contracts") {
      filtered = filtered.filter(
        (contract) => contract.status === selectedFilter
      );
    }

    // Apply search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((contract) =>
        contract.memberName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    switch (selectedSort) {
      case "Expiring Soon":
        filtered = [...filtered].sort(
          (a, b) => new Date(a.endDate) - new Date(b.endDate)
        );
        break;
      default:
        // Alphabetical sorting (default)
        filtered = [...filtered].sort((a, b) =>
          a.memberName.localeCompare(b.memberName)
        );
        break;
    }

    setFilteredContracts(filtered);
    setCurrentPage(1); // Reset to the first page when filter or sort changes
  }, [selectedFilter, contracts, searchTerm, selectedSort]);

  const totalPages = Math.ceil(filteredContracts.length / contractsPerPage);
  const startIndex = (currentPage - 1) * contractsPerPage;
  const paginatedContracts = filteredContracts.slice(
    startIndex,
    startIndex + contractsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of the contracts list
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".dropdown-trigger") &&
        !event.target.closest(".dropdown-menu")
      ) {
        setActiveDropdownId(null);
      }
      if (!event.target.closest(".filter-dropdown")) {
        setFilterDropdownOpen(false);
      }
      if (!event.target.closest(".sort-dropdown")) {
        setSortDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleViewDetails = (contract) => {
    setSelectedContract(contract);
    setIsShowDetails(true);
  };

  const toggleDropdown = (contractId, event) => {
    event.stopPropagation();
    setActiveDropdownId(activeDropdownId === contractId ? null : contractId);
  };

  const handleCancelContract = (contractId) => {
    setSelectedContract(
      contracts.find((contract) => contract.id === contractId)
    );
    setIsCancelModalOpen(true);
  };

  const handlePauseContract = (contractId) => {
    setSelectedContract(
      contracts.find((contract) => contract.id === contractId)
    );
    setIsPauseModalOpen(true);
  };

  const handlePauseReasonSubmit = () => {
    setIsPauseModalOpen(false);
    setIsShowDetails(false);
    setSelectedContract(null);
    toast.success("Contract has been paused");
  };

  const handleCancelSubmit = ({ reason, cancelDate }) => {
    setIsCancelModalOpen(false);
    if (selectedContract) {
      const updatedContracts = contracts.map((contract) =>
        contract.id === selectedContract.id
          ? { ...contract, status: "Cancelled", cancelReason: reason }
          : contract
      );
      setContracts(updatedContracts);
    }
    setIsShowDetails(false);
    setSelectedContract(null);
    toast.success("Contract has been cancelled");
  };

  const handleEditContract = (contractId) => {
    setSelectedContract(
      contracts.find((contract) => contract.id === contractId)
    );
    setIsEditModalOpen(true);
  };

  const handleSaveEditedContract = (updatedContract) => {
    const updatedContracts = contracts.map((c) =>
      c.id === updatedContract.id ? updatedContract : c
    );
    setContracts(updatedContracts);
    setIsEditModalOpen(false);
    toast.success("Contract updated successfully");
  };

  const handleAddContract = () => {
    // Randomly select a lead for pre-filling (in a real app, this would be selected by the user)
    const randomLead =
      sampleLeads[Math.floor(Math.random() * sampleLeads.length)];
    setSelectedLead(randomLead);
    setIsModalOpen(true);
  };

  const handleSaveNewContract = (contractData) => {
    // Create a new contract with the provided data
    const newContract = {
      id: `12321-${contracts.length + 1}`,
      memberName: contractData.fullName,
      contractType: contractData.rateType || "Basic",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split("T")[0],
      status: "Active",
      pauseReason: null,
      cancelReason: null,
      isDigital: contractData.isDigital,
      email: contractData.email,
      phone: contractData.phone,
      iban: contractData.iban,
      sepaMandate: contractData.sepaMandate,
      files: contractData.signedFile ? [contractData.signedFile] : [],
    };

    setContracts([...contracts, newContract]);
    setIsModalOpen(false);
    toast.success("Contract added successfully");
  };

  const handleManageDocuments = (contract) => {
    setSelectedContract(contract);
    setIsDocumentModalOpen(true);
  };

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
        <div className="flex flex-col sm:flex-row sm:justify-between justify-start items-start md:items-center mb-8">
          <h2 className="text-white oxanium_font text-2xl mb-4 sm:mb-0 text-left">
            Contracts
          </h2>
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 w-full sm:w-auto">
            {/* Filter Dropdown */}
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
                  {["All Contracts", "Active", "Paused", "Inactive"].map(
                    (filter) => (
                      <button
                        key={filter}
                        className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-black cursor-pointer text-left"
                        onClick={() => {
                          setSelectedFilter(filter);
                          setFilterDropdownOpen(false);
                        }}
                      >
                        {filter}
                      </button>
                    )
                  )}
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
                        setSelectedSort(sortOption);
                        setSortDropdownOpen(false);
                      }}
                    >
                      {sortOption}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={handleAddContract}
                className="flex items-center justify-center cursor-pointer gap-2 px-4 py-2 text-sm bg-[#F27A30] text-white rounded-xl hover:bg-[#e06b21] transition-colors w-full sm:w-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Add Contract</span>
              </button>
            </div>
          </div>
        </div>

        <div className="relative w-full mb-2 ">
          {" "}
          <input
            type="text"
            placeholder="Search for any contract..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-black text-sm text-white px-4 py-2.5 rounded-xl border border-gray-800 w-full focus:outline-none focus:ring-1 focus:ring-[#F27A30]"
          />
        </div>

        <div className="space-y-3">
          {paginatedContracts.map((contract) => (
            <div
              key={contract.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#141414] p-4 rounded-xl hover:bg-[#1a1a1a] transition-colors gap-4"
            >
              <div className="flex flex-col items-start justify-start">
                {/* Status Tag */}
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-lg mb-1 ${
                    contract.status === "Active"
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

                <span className="text-white font-medium">
                  {contract.memberName}
                </span>
                <span className="text-sm text-gray-400">
                  {contract.contractType}
                </span>
                <span className="text-sm text-gray-400">
                  {contract.startDate} - {contract.endDate}
                </span>
                <span className="text-sm text-gray-400">
                  {contract.isDigital ? "Digital" : "Analog"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleViewDetails(contract)}
                  className="px-4 py-1.5 bg-black text-sm cursor-pointer text-white border border-gray-800 rounded-xl hover:bg-gray-900 transition-colors flex-grow sm:flex-grow-0"
                >
                  View details
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
                      <button className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 text-left">
                        Renew Contract{" "}
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

          {paginatedContracts.length === 0 && (
            <div className="bg-[#141414] p-6 rounded-xl text-center">
              <p className="text-gray-400">
                No contracts found matching your criteria.
              </p>
            </div>
          )}

          {filteredContracts.length > contractsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        {/* Add Contract Modal */}
        {isModalOpen && (
          <AddContractModal
            onClose={() => {
              setIsModalOpen(false);
              setSelectedLead(null);
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
              setIsShowDetails(false);
              setSelectedContract(null);
            }}
            onPause={() => handlePauseContract(selectedContract.id)}
            onCancel={() => handleCancelContract(selectedContract.id)}
          />
        )}

        {/* Pause Contract Modal */}
        {isPauseModalOpen && (
          <PauseContractModal
            onClose={() => setIsPauseModalOpen(false)}
            onSubmit={handlePauseReasonSubmit}
          />
        )}

        {/* Cancel Contract Modal */}
        {isCancelModalOpen && (
          <CancelContractModal
            onClose={() => setIsCancelModalOpen(false)}
            onSubmit={handleCancelSubmit}
          />
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
              setIsDocumentModalOpen(false);
              setSelectedContract(null);
            }}
          />
        )}
      </div>
    </>
  );
}
