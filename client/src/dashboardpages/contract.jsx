/* eslint-disable no-unused-vars */
import { MoreVertical, Plus, X, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

const contracts = [
  {
    id: "12321-1",
    title: "Contract",
    description: "Description",
    date: "17 apr 2025",
    status: "Active",
  },
  {
    id: "12321-2",
    title: "Contract",
    description: "Description",
    date: "17 apr 2025",
    status: "Active",
  },
  {
    id: "12321-3",
    title: "Contract",
    description: "Description",
    date: "17 apr 2025",
    status: "Inactive",
  },
  {
    id: "12321-4",
    title: "Contract",
    description: "Description",
    date: "17 apr 2025",
    status: "Expired",
  },
  {
    id: "12321-5",
    title: "Contract",
    description: "Description",
    date: "17 apr 2025",
    status: "Inactive",
  },
];

export default function ContractList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowDetails, setIsShowDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All Contract");
  const [filteredContracts, setFilteredContracts] = useState(contracts);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);

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
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedFilter === "All Contract") {
      setFilteredContracts(contracts);
    } else {
      setFilteredContracts(
        contracts.filter((contract) => contract.status === selectedFilter)
      );
    }
  }, [selectedFilter]);

  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setIsShowDetails(true);
  };

  const toggleDropdown = (taskId, event) => {
    event.stopPropagation();
    setActiveDropdownId(activeDropdownId === taskId ? null : taskId);
  };

  const handleCancelContract = (contractId) => {
    setSelectedTask(contracts.find((contract) => contract.id === contractId));
    setIsPeriodModalOpen(true);
  };

  const handlePauseContract = () => {
    setIsPauseModalOpen(true);
  };

  const handlePauseReasonSubmit = () => {
    setIsPauseModalOpen(false);
    setIsShowDetails(false);
    setSelectedTask(null);
    toast.success("Contract has been paused");
  };

  const handlePeriodSubmit = () => {
    setIsPeriodModalOpen(false);
    if (selectedTask) {
      const updatedContracts = contracts.map((contract) =>
        contract.id === selectedTask.id
          ? { ...contract, status: "Cancelled" }
          : contract
      );
      setFilteredContracts(updatedContracts);
    }
    setIsShowDetails(false);
    setSelectedTask(null);
    toast.success("Contract has been cancelled");
  };

  // Removed duplicate handleCancelContract function

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
          <h2 className="text-white oxanium_font text-2xl">Contract</h2>
          <div className="flex items-center gap-4">
            <div className="relative filter-dropdown">
              <button
                onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                className="bg-black text-sm cursor-pointer text-white px-4 py-2 rounded-xl border border-gray-800 flex items-center justify-between gap-2 min-w-[150px]"
              >
                {selectedFilter}
                <ChevronDown className="w-4 h-4" />
              </button>
              {filterDropdownOpen && (
                <div className="absolute right-0 text-sm mt-2 w-full bg-[#2F2F2F]/90 backdrop-blur-2xl rounded-xl border border-gray-800 shadow-lg z-10">
                  {["All Contract", "Active", "Inactive", "Expired"].map(
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
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center cursor-pointer gap-2 px-4 py-2 text-sm bg-[#F27A30] text-white rounded-xl hover:bg-[#e06b21] transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Contract</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredContracts.map((contract) => (
            <div
              key={contract.id}
              className="flex items-center justify-between bg-[#141414] p-4 rounded-xl hover:bg-[#1a1a1a] transition-colors"
            >
              <div className="flex flex-col items-start justify-start">
                <span className="text-white font-medium">{contract.id}</span>
                <span
                  className={`text-sm ${
                    contract.status === "Active"
                      ? "text-green-500"
                      : contract.status === "Inactive"
                      ? "text-red-500"
                      : contract.status === "Cancelled"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  {contract.status}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleViewDetails(contract)}
                  className="px-4 py-1.5 bg-black text-sm cursor-pointer text-white border border-gray-800 rounded-xl hover:bg-gray-900 transition-colors"
                >
                  View details
                </button>
                <div className="relative">
                  <button
                    onClick={(e) => toggleDropdown(contract.id, e)}
                    className="dropdown-trigger p-1 hover:bg-[#2a2a2a] rounded-full transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>

                  {activeDropdownId === contract.id && (
                    <div className="dropdown-menu absolute right-0 mt-2 w-32 bg-[#2F2F2F]/90 backdrop-blur-xl rounded-xl border border-gray-800 shadow-lg z-10">
                      <button className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 text-left">
                        Edit
                      </button>
                      <div className="h-[1px] bg-gray-700 w-[85%] mx-auto"></div>
                      <button
                        className="w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-800 text-left"
                        onClick={() => handleCancelContract(contract.id)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex open_sans_font items-center justify-center z-[1000]">
            <div className="bg-[#181818] p-3 w-full max-w-md mx-4 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-800">
                <div className="flex justify-between items-center">
                  <h2 className="text-base open_sans_font_700 text-white">
                    Add Contract
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-gray-800 rounded-xl"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="px-4 py-3  open_sans_font">
                <form className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-200 block pl-1">
                        Type
                      </label>
                      <select className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200 appearance-none">
                        <option value="">Select type</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-200 block pl-1">
                          Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter name"
                          className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-200 block pl-1">
                          Surname
                        </label>
                        <input
                          type="text"
                          placeholder="Enter surname"
                          className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-200 block pl-1">
                          Email
                        </label>
                        <input
                          type="email"
                          placeholder="Enter email"
                          className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-200 block pl-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          placeholder="Enter phone"
                          className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-200 block pl-1">
                        Address
                      </label>
                      <input
                        type="text"
                        placeholder="Enter address"
                        className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-200 block pl-1">
                        Credit card
                      </label>
                      <input
                        type="text"
                        placeholder="Enter credit card"
                        className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-200 block pl-1">
                        IBAN
                      </label>
                      <input
                        type="text"
                        placeholder="Enter IBAN"
                        className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-200 block pl-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        placeholder="Enter duration"
                        className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-200 block pl-1">
                        Discount
                      </label>
                      <select className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200 appearance-none">
                        <option value="">Select discount</option>
                      </select>
                    </div>
                  </div>
                  <div className="px-4 py-3 border-t border-gray-800">
                    <div className="flex flex-col gap-2">
                      <button className="w-full px-4 py-2 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors duration-200">
                        Upload to Scan
                      </button>
                      <div className="flex items-center gap-3 mt-3">

                    
                      <button
                        type="submit"
                        className="w-full px-4 py-2 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors duration-200"
                      >
                        Save
                      </button>

                      <button
                      onClick={()=>setIsModalOpen(false)}
                        type="button"
                        className="w-full px-4 py-2 bg-black text-red-500 text-sm font-medium rounded-xl hover:bg-gray-900 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {isShowDetails && selectedTask && (
          <div className="fixed inset-0 w-screen h-screen open_sans_font bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000]">
            <div className="bg-[#1C1C1C] rounded-xl lg:p-8 md:p-6 sm:p-4 p-4 w-full max-w-md relative">
              <button
                onClick={() => {
                  setIsShowDetails(false);
                  setSelectedTask(null);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="space-y-4 custom-scrollbar overflow-y-auto max-h-[70vh]">
                <div>
                  <h3 className="text-white text-xl font-bold">Contract</h3>
                  <p className="text-gray-400 mt-1">{selectedTask.id}</p>
                  <p className="text-gray-400 mt-1">Date 12-12-2024</p>
                </div>

                <div className="flex gap-2">
                  <button className="py-1.5 px-5 bg-[#3F74FF] text-white text-sm rounded-xl">
                    View PDF
                  </button>
                  <button className="py-1.5 px-5 bg-black text-white text-sm rounded-xl border border-gray-800">
                    Print PDF
                  </button>
                </div>

                <div className="bg-slate-500 h-[1px] w-full" />

                <div className="space-y-4">
                  <h3 className="text-white text-xl font-bold">Member</h3>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-400">Tariff / Type</p>
                      <p className="text-white">Type</p>
                    </div>

                    <div>
                      <p className="text-gray-400">Name</p>
                      <p className="text-white">Alex</p>
                    </div>

                    <div>
                      <p className="text-gray-400">Email</p>
                      <p className="text-white">-</p>
                    </div>

                    <div>
                      <p className="text-gray-400">Phone</p>
                      <p className="text-white">-</p>
                    </div>

                    <div>
                      <p className="text-gray-400">Address</p>
                      <p className="text-white">-</p>
                    </div>

                    <div>
                      <p className="text-gray-400">Credit Card no.</p>
                      <p className="text-white">-</p>
                    </div>

                    <div>
                      <p className="text-gray-400">IBAN</p>
                      <p className="text-white">-</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handlePauseContract}
                    className="py-2 px-5 bg-black text-white text-sm rounded-xl border border-gray-800"
                  >
                    Pause contract
                  </button>

                  <button
                    onClick={() => handleCancelContract(selectedTask.id)}
                    className="py-2 px-5 bg-black text-red-500 cursor-pointer text-sm rounded-xl border border-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isPauseModalOpen && (
          <div className="fixed inset-0 w-screen h-screen bg-black/50 flex items-center justify-center z-[1001]">
            <div className="bg-[#1C1C1C] rounded-xl p-6 w-full max-w-sm relative">
              <button
                onClick={() => {
                  setIsPauseModalOpen(false);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
              <h3 className="text-white text-lg font-semibold mb-4">
                Select a reason to pause
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Select</p>
                  <select className="w-full bg-[#141414] text-white text-sm rounded-xl px-3 py-2.5 outline-none border border-gray-800 appearance-none">
                    <option value="">Select a reason</option>
                    <option value="vacation">Vacation</option>
                    <option value="medical">Medical Leave</option>
                    <option value="financial">Financial Reasons</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <button
                  onClick={handlePauseReasonSubmit}
                  className="w-full py-2 px-4 bg-[#3F74FF] text-white text-sm rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {isPeriodModalOpen && (
          <div className="fixed inset-0 w-screen h-screen bg-black/50 flex items-center justify-center z-[1001]">
            <div className="bg-[#1C1C1C] rounded-xl p-6 w-full max-w-sm">
              <h3 className="text-white text-lg font-semibold mb-4">
                Select a period
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Select</p>
                  <select className="w-full bg-[#141414] text-white text-sm rounded-xl px-3 py-2.5 outline-none border border-gray-800 appearance-none">
                    <option value="">Input</option>
                    <option value="1week">1 Week</option>
                    <option value="2weeks">2 Weeks</option>
                    <option value="1month">1 Month</option>
                    <option value="3months">3 Months</option>
                  </select>
                </div>
                <button
                  onClick={handlePeriodSubmit}
                  className="w-full py-2 px-4 bg-[#3F74FF] text-white text-sm rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
