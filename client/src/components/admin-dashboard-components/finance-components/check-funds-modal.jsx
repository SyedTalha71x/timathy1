/* eslint-disable react/prop-types */
import { Check, X, Search, ArrowUp, ArrowDown, ArrowUpDown, Eye, EyeOff, Info } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

// Masked IBAN Component
const MaskedIban = ({ iban, className = "" }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  if (!iban) return <span className="text-gray-500">-</span>;

  const maskIban = (ibanStr) => {
    if (ibanStr.length <= 8) return ibanStr;
    const start = ibanStr.slice(0, 4);
    const end = ibanStr.slice(-4);
    const middleLength = ibanStr.length - 8;
    const masked = '*'.repeat(Math.min(middleLength, 8));
    return `${start}${masked}${end}`;
  };

  const displayValue = isRevealed ? iban : maskIban(iban);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className="font-mono text-xs whitespace-nowrap">{displayValue}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsRevealed(!isRevealed);
        }}
        className="p-0.5 text-gray-400 hover:text-white transition-colors flex-shrink-0"
        title={isRevealed ? "Hide IBAN" : "Show full IBAN"}
      >
        {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
      </button>
    </div>
  );
};

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
  
  // Services modal state
  const [servicesModalOpen, setServicesModalOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedStudioName, setSelectedStudioName] = useState("");
  
  // Column widths state for resizable table (admin: studio + accountHolder instead of member)
  const [columnWidths, setColumnWidths] = useState({
    studio: 80,
    accountHolder: 80,
    amount: 45,
    services: 28,
    iban: 70,
    mandate: 90,
    date: 70,
    status: 120
  });

  // Helper to get account holder name (admin uses studioOwner)
  const getAccountHolder = (tx) => {
    return tx.studioOwner || tx.accountHolder || tx.memberName || "Unknown";
  };

  // Helper to get studio name
  const getStudioName = (tx) => {
    return tx.studioName || "Unknown Studio";
  };
  
  // Handle show services
  const handleShowServices = (services, studioName) => {
    setSelectedServices(services || []);
    setSelectedStudioName(studioName);
    setServicesModalOpen(true);
  };
  
  // Handle column resize
  const handleColumnResize = (columnId, newWidth) => {
    setColumnWidths(prev => ({
      ...prev,
      [columnId]: Math.max(50, newWidth)
    }));
  };
  
  // Mouse down handler for resize
  const handleResizeMouseDown = (e, columnId) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startX = e.clientX;
    const startWidth = columnWidths[columnId];
    
    const handleMouseMove = (moveEvent) => {
      const diff = moveEvent.clientX - startX;
      handleColumnResize(columnId, startWidth + diff);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

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

  // Filter transactions based on search term (admin: search by studio, account holder, IBAN, mandate)
  const filteredTransactions = useMemo(() => {
    if (!searchTerm) return allCheckingTransactions;
    
    const term = searchTerm.toLowerCase();
    return allCheckingTransactions.filter((tx) =>
      getStudioName(tx).toLowerCase().includes(term) ||
      getAccountHolder(tx).toLowerCase().includes(term) ||
      tx.iban?.toLowerCase().includes(term) ||
      tx.mandateNumber?.toLowerCase().includes(term)
    );
  }, [allCheckingTransactions, searchTerm]);

  // Sort filtered transactions (admin: sort by studio, accountHolder instead of member)
  const sortedTransactions = useMemo(() => {
    const sorted = [...filteredTransactions].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "studio":
          comparison = getStudioName(a).localeCompare(getStudioName(b));
          break;
        case "accountHolder":
          comparison = getAccountHolder(a).localeCompare(getAccountHolder(b));
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
        case "iban":
          comparison = (a.iban || "").localeCompare(b.iban || "");
          break;
        case "mandate":
          comparison = (a.mandateNumber || "").localeCompare(b.mandateNumber || "");
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

  // Set all selected transactions to a specific status
  const handleSetAllSelectedStatus = (status) => {
    const newStatuses = { ...transactionStatuses };
    
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
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-6xl max-h-[80vh] overflow-hidden flex flex-col mx-4">
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
              placeholder="Search by studio, account holder, IBAN, or mandate..."
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
                <p className="text-gray-300 text-sm">
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
                  <div className="flex flex-wrap items-center gap-3">
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
                <table className="text-sm text-gray-300 border-collapse w-full" style={{ minWidth: '700px' }}>
                  <thead className="text-xs text-gray-400 uppercase bg-[#141414]">
                    <tr>
                      <th className="px-1.5 py-2 w-8 rounded-tl-lg">
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
                      {/* Studio Name Column */}
                      <th 
                        className="px-1.5 md:px-2 py-2 text-left hover:bg-[#1C1C1C] transition-colors relative"
                        style={{ width: `${columnWidths.studio}px`, minWidth: '60px' }}
                      >
                        <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("studio")}>
                          <span className="hidden md:inline">Studio</span>
                          <span className="md:hidden">Studio</span>
                          {getSortIcon("studio")}
                        </div>
                        <div 
                          className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group"
                          onMouseDown={(e) => handleResizeMouseDown(e, 'studio')}
                          style={{ touchAction: 'none' }}
                        >
                          <div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-gray-600 group-hover:bg-[#3F74FF] transition-colors" />
                        </div>
                      </th>
                      {/* Account Holder Column */}
                      <th 
                        className="px-1.5 md:px-2 py-2 text-left hover:bg-[#1C1C1C] transition-colors relative"
                        style={{ width: `${columnWidths.accountHolder}px`, minWidth: '60px' }}
                      >
                        <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("accountHolder")}>
                          <span className="hidden md:inline">Account Holder</span>
                          <span className="md:hidden">Holder</span>
                          {getSortIcon("accountHolder")}
                        </div>
                        <div 
                          className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group"
                          onMouseDown={(e) => handleResizeMouseDown(e, 'accountHolder')}
                          style={{ touchAction: 'none' }}
                        >
                          <div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-gray-600 group-hover:bg-[#3F74FF] transition-colors" />
                        </div>
                      </th>
                      {/* Amount Column */}
                      <th 
                        className="px-1.5 md:px-2 py-2 text-right cursor-pointer hover:bg-[#1C1C1C] transition-colors relative"
                        onClick={() => handleSort("amount")}
                        style={{ width: `${columnWidths.amount}px`, minWidth: '40px' }}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <span className="hidden md:inline">Amount</span>
                          <span className="md:hidden">Amt</span>
                          {getSortIcon("amount")}
                        </div>
                        <div 
                          className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group"
                          onMouseDown={(e) => handleResizeMouseDown(e, 'amount')}
                          style={{ touchAction: 'none' }}
                        >
                          <div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-gray-600 group-hover:bg-[#3F74FF] transition-colors" />
                        </div>
                      </th>
                      {/* Services Column */}
                      <th 
                        className="px-1.5 md:px-2 py-2 text-center relative"
                        style={{ width: `${columnWidths.services}px`, minWidth: '25px' }}
                      >
                        <span className="hidden md:inline">Services</span>
                        <span className="md:hidden">Svc</span>
                        <div 
                          className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group"
                          onMouseDown={(e) => handleResizeMouseDown(e, 'services')}
                          style={{ touchAction: 'none' }}
                        >
                          <div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-gray-600 group-hover:bg-[#3F74FF] transition-colors" />
                        </div>
                      </th>
                      {/* Status Column */}
                      <th 
                        className="px-1.5 md:px-2 py-2 text-left hover:bg-[#1C1C1C] transition-colors relative"
                        style={{ width: `${columnWidths.status}px`, minWidth: '100px' }}
                      >
                        <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("status")}>
                          Status {getSortIcon("status")}
                        </div>
                        <div 
                          className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group"
                          onMouseDown={(e) => handleResizeMouseDown(e, 'status')}
                          style={{ touchAction: 'none' }}
                        >
                          <div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-gray-600 group-hover:bg-[#3F74FF] transition-colors" />
                        </div>
                      </th>
                      {/* IBAN Column */}
                      <th 
                        className="px-1.5 md:px-2 py-2 text-left hover:bg-[#1C1C1C] transition-colors relative"
                        style={{ width: `${columnWidths.iban}px`, minWidth: '60px' }}
                      >
                        <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("iban")}>
                          IBAN {getSortIcon("iban")}
                        </div>
                        <div 
                          className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group"
                          onMouseDown={(e) => handleResizeMouseDown(e, 'iban')}
                          style={{ touchAction: 'none' }}
                        >
                          <div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-gray-600 group-hover:bg-[#3F74FF] transition-colors" />
                        </div>
                      </th>
                      {/* Mandate Column */}
                      <th 
                        className="px-1.5 md:px-2 py-2 text-left hover:bg-[#1C1C1C] transition-colors relative"
                        style={{ width: `${columnWidths.mandate}px`, minWidth: '60px' }}
                      >
                        <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("mandate")}>
                          <span className="hidden md:inline">Mandate Number</span>
                          <span className="md:hidden">Mandate</span>
                          {getSortIcon("mandate")}
                        </div>
                        <div 
                          className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group"
                          onMouseDown={(e) => handleResizeMouseDown(e, 'mandate')}
                          style={{ touchAction: 'none' }}
                        >
                          <div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-gray-600 group-hover:bg-[#3F74FF] transition-colors" />
                        </div>
                      </th>
                      {/* Date Column */}
                      <th 
                        className="px-1.5 md:px-2 py-2 text-left rounded-tr-lg hover:bg-[#1C1C1C] transition-colors relative"
                        style={{ width: `${columnWidths.date}px`, minWidth: '50px' }}
                      >
                        <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("date")}>
                          Date {getSortIcon("date")}
                        </div>
                        <div 
                          className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group"
                          onMouseDown={(e) => handleResizeMouseDown(e, 'date')}
                          style={{ touchAction: 'none' }}
                        >
                          <div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-gray-600 group-hover:bg-[#3F74FF] transition-colors" />
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
                          <td className="px-1.5 py-2">
                            <input
                              type="checkbox"
                              className="rounded bg-black border-gray-700 text-orange-500 focus:ring-orange-500"
                              checked={isSelected || false}
                              onChange={() => handleToggleTransaction(tx.id)}
                            />
                          </td>
                          <td className="px-1.5 md:px-2 py-2 text-xs truncate">{getStudioName(tx)}</td>
                          <td className="px-1.5 md:px-2 py-2 text-xs truncate">{getAccountHolder(tx)}</td>
                          <td className="px-1.5 md:px-2 py-2 text-right text-xs">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(tx.amount)}
                          </td>
                          <td className="px-1.5 md:px-2 py-2 text-center">
                            <button
                              onClick={() => handleShowServices(tx.services, getStudioName(tx))}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <Info className="w-3 h-3" />
                            </button>
                          </td>
                          <td className="px-1.5 md:px-2 py-2">
                            {isSelected ? (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleUpdateStatus(tx.id, "Successful")}
                                  className={`px-1 md:px-2 py-0.5 md:py-1 rounded md:rounded-lg text-xs font-medium transition-colors ${
                                    currentStatus === "Successful"
                                      ? "bg-[#10b981] text-white"
                                      : "bg-[#2F2F2F] text-gray-400 hover:bg-[#3F3F3F]"
                                  }`}
                                >
                                  <span className="hidden md:inline">Successful</span>
                                  <span className="md:hidden">S</span>
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(tx.id, "Failed")}
                                  className={`px-1 md:px-2 py-0.5 md:py-1 rounded md:rounded-lg text-xs font-medium transition-colors ${
                                    currentStatus === "Failed"
                                      ? "bg-[#ef4444] text-white"
                                      : "bg-[#2F2F2F] text-gray-400 hover:bg-[#3F3F3F]"
                                  }`}
                                >
                                  <span className="hidden md:inline">Failed</span>
                                  <span className="md:hidden">F</span>
                                </button>
                              </div>
                            ) : (
                              <>
                                <span className="hidden md:inline text-white bg-[#f59e0b] px-2 py-1 rounded-lg text-xs">
                                  Pending
                                </span>
                                <span className="md:hidden text-white bg-[#f59e0b] px-1 py-0.5 rounded text-xs">
                                  P
                                </span>
                              </>
                            )}
                          </td>
                          <td className="px-1.5 md:px-2 py-2 text-xs">
                            <MaskedIban iban={tx.iban || "DE89370400440532013000"} />
                          </td>
                          <td className="px-1.5 md:px-2 py-2 text-xs truncate">
                            {tx.mandateNumber || `MNDT-${tx.id.toString().padStart(6, '0')}`}
                          </td>
                          <td className="px-1.5 md:px-2 py-2 text-xs">
                            {new Date(tx.date).toLocaleDateString()}
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

        {/* Services Modal */}
        {servicesModalOpen && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
            <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col mx-4">
              <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <h2 className="text-white text-lg font-medium">Services Breakdown</h2>
                <button onClick={() => setServicesModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto flex-grow">
                <div className="mb-4">
                  <h3 className="text-white font-medium mb-2">{selectedStudioName}</h3>
                  <p className="text-gray-400 text-sm">Service breakdown for this studio</p>
                </div>

                <div className="space-y-3">
                  {selectedServices.map((service, index) => (
                    <div key={index} className="bg-[#141414] p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-white font-medium text-sm">{service.name}</span>
                        <span className="text-white font-semibold text-sm">${service.cost?.toFixed(2) || '0.00'}</span>
                      </div>
                      <p className="text-gray-400 text-xs">{service.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold text-sm">Total Amount</span>
                    <span className="text-white font-bold text-lg">
                      ${selectedServices.reduce((sum, service) => sum + (service.cost || 0), 0).toFixed(2)} USD
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckFundsModal;
