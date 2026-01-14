/* eslint-disable react/prop-types */
import { Check, X, Search, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

const CheckFundsModal = ({
  isOpen,
  onClose,
  transactions,
  onUpdateStatuses,
  financialState,
}) => {
  const [transactionStatuses, setTransactionStatuses] = useState({});
  const [selectedTransactions, setSelectedTransactions] = useState({});
  
  // New state for search and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  // Get all transactions with "Check incoming funds" status from ALL periods
  const allCheckingTransactions = useMemo(() => {
    if (!financialState) return transactions.filter((tx) => tx.status === "Check incoming funds");
    
    const allTransactions = [];
    Object.values(financialState).forEach(periodData => {
      if (periodData?.transactions) {
        periodData.transactions.forEach(tx => {
          if (tx.status === "Check incoming funds") {
            allTransactions.push(tx);
          }
        });
      }
    });
    return allTransactions;
  }, [financialState, transactions]);

  useEffect(() => {
    // Initialize with all transactions that have "Check incoming funds" status
    const initialSelected = {};
    const initialStatuses = {};
    
    allCheckingTransactions.forEach((tx) => {
      initialSelected[tx.id] = true;
      initialStatuses[tx.id] = "Successful"; // Default status
    });
    
    setSelectedTransactions(initialSelected);
    setTransactionStatuses(initialStatuses);
    setSearchTerm("");
  }, [allCheckingTransactions]);

  // Filter transactions based on search term
  const filteredTransactions = useMemo(() => {
    if (!searchTerm) return allCheckingTransactions;
    
    return allCheckingTransactions.filter((tx) =>
      tx.memberName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allCheckingTransactions, searchTerm]);

  // Sort filtered transactions
  const sortedTransactions = useMemo(() => {
    const sorted = [...filteredTransactions].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "member":
          comparison = a.memberName.localeCompare(b.memberName);
          break;
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "status":
          const statusA = transactionStatuses[a.id] || "Successful";
          const statusB = transactionStatuses[b.id] || "Successful";
          comparison = statusA.localeCompare(statusB);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
    
    return sorted;
  }, [filteredTransactions, sortBy, sortDirection, transactionStatuses]);

  // Handle sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) {
      return <ArrowUpDown size={14} className="text-gray-500" />;
    }
    return sortDirection === "asc" 
      ? <ArrowUp size={14} className="text-white" />
      : <ArrowDown size={14} className="text-white" />;
  };

  const handleToggleTransaction = (id) => {
    setSelectedTransactions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleUpdateStatus = (id, status) => {
    setTransactionStatuses((prev) => ({
      ...prev,
      [id]: status,
    }));
  };

  const handleUpdateStatuses = () => {
    const txToUpdate = Object.keys(selectedTransactions)
      .filter((id) => selectedTransactions[id])
      .map((id) => allCheckingTransactions.find((tx) => tx.id === id))
      .filter(Boolean)
      .map((tx) => ({
        ...tx,
        status: transactionStatuses[tx.id] || "Successful",
      }));

    onUpdateStatuses(txToUpdate);
    onClose();
  };

  const handleSelectAll = (selected) => {
    const newSelected = {};
    const newStatuses = { ...transactionStatuses };
    
    sortedTransactions.forEach((tx) => {
      newSelected[tx.id] = selected;
      // Only set default status if we're selecting and it doesn't have one yet
      if (selected && !newStatuses[tx.id]) {
        newStatuses[tx.id] = "Successful";
      }
    });
    
    setSelectedTransactions((prev) => ({
      ...prev,
      ...newSelected,
    }));
    setTransactionStatuses(newStatuses);
  };

  // New function to set all selected transactions to a specific status
  const handleSetAllSelectedStatus = (status) => {
    const newStatuses = { ...transactionStatuses };
    
    // Update status for all selected transactions
    Object.keys(selectedTransactions).forEach((id) => {
      if (selectedTransactions[id]) {
        newStatuses[id] = status;
      }
    });
    
    setTransactionStatuses(newStatuses);
  };

  if (!isOpen) return null;

  const selectedCount = Object.values(selectedTransactions).filter(Boolean).length;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col mx-4">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-white text-lg font-medium">
            Check Incoming Funds
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-800">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <input
              type="search"
              placeholder="Search by member name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 bg-[#141414] text-white rounded-xl pl-12 pr-4 w-full text-sm outline-none border border-[#333333] focus:border-[#3F74FF] transition-colors"
            />
          </div>
        </div>

        <div className="p-4 overflow-y-auto flex-grow">
          {sortedTransactions.length > 0 ? (
            <>
              <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
                <p className="text-gray-300">
                  Update the status of pending transactions:
                </p>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 text-sm rounded-lg bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F] transition-colors"
                    onClick={() => handleSelectAll(true)}
                  >
                    Select All
                  </button>
                  <button
                    className="px-3 py-1 text-sm rounded-lg bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F] transition-colors"
                    onClick={() => handleSelectAll(false)}
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {/* Bulk status update buttons */}
              {selectedCount > 0 && (
                <div className="mb-4 p-3 bg-[#141414] rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-300 text-sm">
                      Set all selected ({selectedCount}) to:
                    </span>
                    <button
                      onClick={() => handleSetAllSelectedStatus("Successful")}
                      className="px-3 py-1 text-sm rounded-lg bg-[#10b981] text-white hover:bg-[#10b981]/80 transition-colors"
                    >
                      Successful
                    </button>
                    <button
                      onClick={() => handleSetAllSelectedStatus("Failed")}
                      className="px-3 py-1 text-sm rounded-lg bg-[#ef4444] text-white hover:bg-[#ef4444]/80 transition-colors"
                    >
                      Failed
                    </button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-gray-300 min-w-[500px]">
                  <thead className="text-xs text-gray-400 uppercase bg-[#141414]">
                    <tr>
                      <th className="px-3 py-2 w-12 rounded-tl-lg">
                        <input
                          type="checkbox"
                          className="rounded bg-black border-gray-700 text-orange-500 focus:ring-orange-500"
                          checked={
                            sortedTransactions.length > 0 &&
                            sortedTransactions.every((tx) => selectedTransactions[tx.id])
                          }
                          onChange={() => {
                            const allSelected = sortedTransactions.every((tx) => selectedTransactions[tx.id]);
                            handleSelectAll(!allSelected);
                          }}
                        />
                      </th>
                      <th 
                        className="px-3 py-2 text-left cursor-pointer hover:bg-[#1C1C1C] transition-colors"
                        onClick={() => handleSort("member")}
                      >
                        <div className="flex items-center gap-1">
                          Member {getSortIcon("member")}
                        </div>
                      </th>
                      <th 
                        className="px-3 py-2 text-left cursor-pointer hover:bg-[#1C1C1C] transition-colors"
                        onClick={() => handleSort("date")}
                      >
                        <div className="flex items-center gap-1">
                          Date {getSortIcon("date")}
                        </div>
                      </th>
                      <th 
                        className="px-3 py-2 text-left cursor-pointer hover:bg-[#1C1C1C] transition-colors"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center gap-1">
                          Status {getSortIcon("status")}
                        </div>
                      </th>
                      <th 
                        className="px-3 py-2 text-right rounded-tr-lg cursor-pointer hover:bg-[#1C1C1C] transition-colors"
                        onClick={() => handleSort("amount")}
                      >
                        <div className="flex items-center justify-end gap-1">
                          Amount {getSortIcon("amount")}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTransactions.map((tx) => {
                      const isSelected = selectedTransactions[tx.id];
                      const currentStatus = transactionStatuses[tx.id] || "Successful";
                      
                      return (
                        <tr 
                          key={tx.id} 
                          className={`border-b border-gray-800 ${
                            !isSelected ? "opacity-50" : ""
                          } transition-colors`}
                        >
                          <td className="px-3 py-2">
                            <input
                              type="checkbox"
                              className="rounded bg-black border-gray-700 text-orange-500 focus:ring-orange-500"
                              checked={isSelected || false}
                              onChange={() => handleToggleTransaction(tx.id)}
                            />
                          </td>
                          <td className="px-3 py-2">{tx.memberName}</td>
                          <td className="px-3 py-2">
                            {new Date(tx.date).toLocaleDateString()}
                          </td>
                          <td className="px-3 py-2">
                            {isSelected ? (
                              // Side-by-side status buttons for selected transactions
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleUpdateStatus(tx.id, "Successful")}
                                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                                    currentStatus === "Successful"
                                      ? "bg-[#10b981] text-white"
                                      : "bg-[#2F2F2F] text-gray-400 hover:bg-[#3F3F3F]"
                                  }`}
                                >
                                  Successful
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(tx.id, "Failed")}
                                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                                    currentStatus === "Failed"
                                      ? "bg-[#ef4444] text-white"
                                      : "bg-[#2F2F2F] text-gray-400 hover:bg-[#3F3F3F]"
                                  }`}
                                >
                                  Failed
                                </button>
                              </div>
                            ) : (
                              // Show pending status for non-selected
                              <span className="text-white bg-[#f59e0b] px-2 py-1 rounded-lg text-xs">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(tx.amount)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="bg-[#141414] p-6 rounded-xl text-center">
              <p className="text-gray-400">
                {searchTerm 
                  ? "No transactions found matching your search."
                  : "No transactions are pending fund verification."
                }
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm bg-[#2F2F2F] text-white hover:bg-[#3F3F3F] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateStatuses}
            className="px-4 py-2 rounded-xl text-sm bg-orange-500 text-white hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!Object.values(selectedTransactions).some((v) => v)}
          >
            <Check className="w-4 h-4" />
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckFundsModal;
