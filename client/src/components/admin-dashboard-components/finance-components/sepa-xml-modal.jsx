/* eslint-disable react/prop-types */
import { Calendar, X, Edit, Info, Search, ArrowUp, ArrowDown, ArrowUpDown, ChevronDown, Eye, EyeOff, User } from "lucide-react"
import { useEffect, useState, useMemo, useRef } from "react"

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
      <button onClick={(e) => { e.stopPropagation(); setIsRevealed(!isRevealed); }} className="p-0.5 text-gray-400 hover:text-white transition-colors flex-shrink-0" title={isRevealed ? "Hide IBAN" : "Show full IBAN"}>
        {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
      </button>
    </div>
  );
};

const SepaXmlModal = ({ isOpen, onClose, selectedPeriod, transactions, onGenerateXml, financialData, creditorInfo, currentUser = "Admin" }) => {
  const [selectedTransactions, setSelectedTransactions] = useState({})
  const [editedAmounts, setEditedAmounts] = useState({})
  const [customPeriod, setCustomPeriod] = useState({ startDate: "", endDate: "" })
  const [isCustomPeriodActive, setIsCustomPeriodActive] = useState(false)
  const [editingAmount, setEditingAmount] = useState(null)
  const [tempAmount, setTempAmount] = useState("")
  const [servicesModalOpen, setServicesModalOpen] = useState(false)
  const [selectedServices, setSelectedServices] = useState([])
  const [selectedStudioName, setSelectedStudioName] = useState("")
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false)
  const [shouldDownload, setShouldDownload] = useState(true)
  const [collectionDate, setCollectionDate] = useState("")
  const [claimsUntilDate, setClaimsUntilDate] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false)
  const [localSelectedPeriod, setLocalSelectedPeriod] = useState(selectedPeriod)
  const dropdownRef = useRef(null)
  const [columnWidths, setColumnWidths] = useState({ studio: 75, accountHolder: 75, iban: 65, mandate: 85, date: 65, status: 50, amount: 45, services: 28 })

  const defaultCreditorInfo = { name: "Fitness Studio Inc.", bankName: "Chase Bank", iban: "DE89370400440532013000", bic: "CHASUS33", creditorId: "US98ZZZ09999999999" }
  const activeCreditorInfo = creditorInfo || defaultCreditorInfo

  // IMPORTANT: Helper to get IBAN - ensures IBAN is always available
  const getTransactionIban = (tx) => {
    return tx.iban || tx.memberIban || tx.bankIban || "DE89370400440532013000"
  }

  // Helper to get account holder name (admin uses studioOwner)
  const getAccountHolder = (tx) => {
    return tx.studioOwner || tx.accountHolder || tx.memberName || "Unknown"
  }

  // Helper to get studio name
  const getStudioName = (tx) => {
    return tx.studioName || "Unknown Studio"
  }

  const handleColumnResize = (columnId, newWidth) => { setColumnWidths(prev => ({ ...prev, [columnId]: Math.max(50, newWidth) })) }
  const handleResizeMouseDown = (e, columnId) => {
    e.preventDefault(); e.stopPropagation();
    const startX = e.clientX; const startWidth = columnWidths[columnId];
    const handleMouseMove = (moveEvent) => { const diff = moveEvent.clientX - startX; handleColumnResize(columnId, startWidth + diff) };
    const handleMouseUp = () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp) };
    document.addEventListener('mousemove', handleMouseMove); document.addEventListener('mouseup', handleMouseUp)
  }

  useEffect(() => {
    const handleClickOutside = (event) => { if (window.innerWidth < 640) return; if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setPeriodDropdownOpen(false) };
    document.addEventListener("mousedown", handleClickOutside); document.addEventListener("touchstart", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside); document.removeEventListener("touchstart", handleClickOutside) }
  }, [])

  useEffect(() => {
    const initialSelected = {}; const initialAmounts = {};
    transactions.forEach((tx) => { if (tx.status === "Pending" || tx.status === "Failed") { initialSelected[tx.id] = true; initialAmounts[tx.id] = tx.amount } });
    setSelectedTransactions(initialSelected); setEditedAmounts(initialAmounts); setEditingAmount(null);
    setIsCustomPeriodActive(false); setLocalSelectedPeriod(selectedPeriod); setSearchTerm("");
    const today = new Date(); const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 7);
    setClaimsUntilDate(today.toISOString().split('T')[0]); setCollectionDate(nextWeek.toISOString().split('T')[0])
  }, [transactions, selectedPeriod])

  const periodTransactions = useMemo(() => {
    if (isCustomPeriodActive && customPeriod.startDate && customPeriod.endDate) {
      const allTransactions = Object.values(financialData || {}).flatMap(period => period?.transactions || [])
      return allTransactions.filter(tx => { const txDate = new Date(tx.date); const startDate = new Date(customPeriod.startDate); const endDate = new Date(customPeriod.endDate); return txDate >= startDate && txDate <= endDate })
    }
    if (financialData && financialData[localSelectedPeriod]) return financialData[localSelectedPeriod].transactions || [];
    return transactions
  }, [financialData, localSelectedPeriod, isCustomPeriodActive, customPeriod, transactions])

  const filteredTransactions = useMemo(() => {
    let filtered = periodTransactions.filter((tx) => tx.status === "Pending" || tx.status === "Failed")
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter((tx) =>
        getStudioName(tx).toLowerCase().includes(term) ||
        getAccountHolder(tx).toLowerCase().includes(term) ||
        getTransactionIban(tx).toLowerCase().includes(term) ||
        (tx.mandateNumber || '').toLowerCase().includes(term)
      )
    }
    return filtered
  }, [periodTransactions, searchTerm])

  const sortedTransactions = useMemo(() => {
    const sorted = [...filteredTransactions].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "studio": comparison = getStudioName(a).localeCompare(getStudioName(b)); break;
        case "accountHolder": comparison = getAccountHolder(a).localeCompare(getAccountHolder(b)); break;
        case "date": comparison = new Date(a.date) - new Date(b.date); break;
        case "status": comparison = a.status.localeCompare(b.status); break;
        case "amount": comparison = (editedAmounts[a.id] || a.amount) - (editedAmounts[b.id] || b.amount); break;
        case "iban": comparison = getTransactionIban(a).localeCompare(getTransactionIban(b)); break;
        case "mandate": comparison = (a.mandateNumber || "").localeCompare(b.mandateNumber || ""); break;
        default: comparison = 0
      }
      return sortDirection === "asc" ? comparison : -comparison
    });
    return sorted
  }, [filteredTransactions, sortBy, sortDirection, editedAmounts])

  const handleSort = (column) => { if (sortBy === column) setSortDirection(sortDirection === "asc" ? "desc" : "asc"); else { setSortBy(column); setSortDirection("asc") } }
  const getSortIcon = (column) => { if (sortBy !== column) return <ArrowUpDown size={14} className="text-gray-500" />; return sortDirection === "asc" ? <ArrowUp size={14} className="text-white" /> : <ArrowDown size={14} className="text-white" /> }
  const handleToggleTransaction = (id) => { setSelectedTransactions((prev) => ({ ...prev, [id]: !prev[id] })) }
  const handleStartEdit = (id, currentAmount) => { setEditingAmount(id); setTempAmount(currentAmount.toString()) }
  const handleSaveAmount = (id) => { const newAmount = Number.parseFloat(tempAmount) || 0; setEditedAmounts((prev) => ({ ...prev, [id]: newAmount })); setEditingAmount(null); setTempAmount("") }
  const handleCancelEdit = () => { setEditingAmount(null); setTempAmount("") }
  const handleGenerateXmlClick = () => { setConfirmationModalOpen(true) }

  const generatePaymentRunNumber = () => { const now = new Date(); const year = now.getFullYear(); const month = String(now.getMonth() + 1).padStart(2, '0'); const day = String(now.getDate()).padStart(2, '0'); const random = String(Math.floor(Math.random() * 9999)).padStart(4, '0'); return `PR-${year}${month}${day}-${random}` }

  const handleConfirmGeneration = () => {
    // CRITICAL: Map transactions with IBAN and admin fields explicitly included
    const selectedTxs = periodTransactions.filter((tx) => selectedTransactions[tx.id]).map((tx, index) => ({
      ...tx,
      amount: editedAmounts[tx.id] !== undefined ? editedAmounts[tx.id] : tx.amount,
      iban: getTransactionIban(tx),
      accountHolder: getAccountHolder(tx),
      studioName: getStudioName(tx),
      studioNumber: tx.studioNumber || tx.memberNumber || `S-${String(index + 1).padStart(5, '0')}`,
      bookingNumber: tx.bookingNumber || null,
      mandateNumber: tx.mandateNumber || `MNDT-${String(tx.id).padStart(6, '0')}`
    }));
    
    const period = isCustomPeriodActive ? `Custom: ${formatDateForDisplay(customPeriod.startDate)} - ${formatDateForDisplay(customPeriod.endDate)}` : localSelectedPeriod;
    const totalAmount = selectedTxs.reduce((sum, tx) => sum + tx.amount, 0);
    
    const paymentRunData = {
      id: Date.now(),
      paymentRunNumber: generatePaymentRunNumber(),
      createdAt: new Date().toISOString(),
      executedBy: currentUser,
      claimsUntilDate,
      collectionDate,
      period,
      transactions: selectedTxs,
      totalAmount,
      creditor: activeCreditorInfo,
      status: "generated"
    };
    
    onGenerateXml(selectedTxs, period, shouldDownload, paymentRunData);
    setConfirmationModalOpen(false);
    onClose()
  }

  const handleCancelGeneration = () => { setConfirmationModalOpen(false) }
  const handleSelectPeriod = (period) => { setLocalSelectedPeriod(period); setIsCustomPeriodActive(false); setPeriodDropdownOpen(false) }
  const handleCustomPeriodSelect = () => { const today = new Date().toISOString().split("T")[0]; setCustomPeriod((prev) => ({ startDate: prev.startDate || today, endDate: prev.endDate || today })); setIsCustomPeriodActive(true) }
  const handleApplyCustomPeriod = () => { if (customPeriod.startDate && customPeriod.endDate) { setLocalSelectedPeriod(`Custom: ${formatDateForDisplay(customPeriod.startDate)} - ${formatDateForDisplay(customPeriod.endDate)}`); setPeriodDropdownOpen(false) } }
  const handleShowServices = (services, studioName) => { setSelectedServices(services); setSelectedStudioName(studioName); setServicesModalOpen(true) }
  const handleSelectAll = (selected) => { const newSelected = {}; sortedTransactions.forEach((tx) => { newSelected[tx.id] = selected }); setSelectedTransactions((prev) => ({ ...prev, ...newSelected })) }

  const formatDateForDisplay = (dateString) => { if (!dateString) return ""; const date = new Date(dateString); return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) }
  const formatCurrency = (amount) => { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount) }

  if (!isOpen) return null

  const selectedCount = Object.values(selectedTransactions).filter(v => v).length
  const totalAmount = periodTransactions.filter((tx) => selectedTransactions[tx.id]).reduce((sum, tx) => sum + (editedAmounts[tx.id] || tx.amount), 0)
  const availablePeriods = financialData ? Object.keys(financialData) : []
  const getPeriodDisplayText = () => { if (isCustomPeriodActive && customPeriod.startDate && customPeriod.endDate) return `${formatDateForDisplay(customPeriod.startDate)} - ${formatDateForDisplay(customPeriod.endDate)}`; return localSelectedPeriod }

  return (
    <div className="fixed inset-0 bg-black/70 flex p-2 items-center justify-center z-50">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-5xl max-h-[80vh] flex flex-col overflow-visible">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-white text-lg font-medium">Run Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {/* Period Selection & Payment Run Settings */}
        <div className="p-4 border-b border-gray-800 overflow-visible">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative" ref={dropdownRef}>
              <label className="block text-xs text-gray-500 mb-1">Period</label>
              <button onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)} className="w-full bg-[#141414] text-white px-3 py-2 rounded-xl border border-[#333333] hover:border-[#3F74FF] flex items-center gap-2 text-sm transition-colors">
                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm flex-1 text-left truncate">{getPeriodDisplayText()}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${periodDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {periodDropdownOpen && (
                <div className="hidden sm:block absolute z-40 mt-2 w-full min-w-[280px] bg-[#1F1F1F] border border-gray-700 rounded-xl shadow-lg overflow-hidden">
                  <div className="py-1 max-h-[40vh] overflow-y-auto">
                    <div className="px-3 py-1.5 text-xs text-gray-500 font-medium border-b border-gray-700">Select Period</div>
                    {availablePeriods.map((period) => (
                      <button key={period} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-800 transition-colors ${localSelectedPeriod === period && !isCustomPeriodActive ? 'text-white bg-gray-800/50' : 'text-gray-300'}`} onClick={() => handleSelectPeriod(period)}>{period}</button>
                    ))}
                  </div>
                  <div className="border-t border-gray-700">
                    <button className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-800 transition-colors flex items-center gap-2 ${isCustomPeriodActive ? 'text-white bg-gray-800/50' : 'text-gray-300'}`} onClick={handleCustomPeriodSelect}><Calendar className="w-4 h-4" />Custom Period</button>
                    {isCustomPeriodActive && (
                      <div className="px-4 py-3 bg-[#141414] border-t border-gray-700">
                        <div className="flex flex-col gap-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div><label className="block text-xs text-gray-500 mb-1">Start Date</label><input type="date" value={customPeriod.startDate} onChange={(e) => setCustomPeriod((prev) => ({ ...prev, startDate: e.target.value }))} className="w-full bg-[#1C1C1C] text-white px-3 py-2 rounded-lg border border-gray-700 text-sm focus:border-[#3F74FF] focus:outline-none white-calendar-icon" /></div>
                            <div><label className="block text-xs text-gray-500 mb-1">End Date</label><input type="date" value={customPeriod.endDate} onChange={(e) => setCustomPeriod((prev) => ({ ...prev, endDate: e.target.value }))} className="w-full bg-[#1C1C1C] text-white px-3 py-2 rounded-lg border border-gray-700 text-sm focus:border-[#3F74FF] focus:outline-none white-calendar-icon" /></div>
                          </div>
                          <button onClick={handleApplyCustomPeriod} disabled={!customPeriod.startDate || !customPeriod.endDate} className="w-full py-2 bg-[#3F74FF] text-white rounded-lg text-sm hover:bg-[#3F74FF]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Apply</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div><label className="block text-xs text-gray-500 mb-1">Claims Through</label><input type="date" value={claimsUntilDate} onChange={(e) => setClaimsUntilDate(e.target.value)} className="w-full bg-[#141414] text-white px-3 py-2 rounded-xl border border-[#333333] text-sm focus:border-[#3F74FF] focus:outline-none white-calendar-icon" /></div>
            <div><label className="block text-xs text-gray-500 mb-1">Collection Date</label><input type="date" value={collectionDate} onChange={(e) => setCollectionDate(e.target.value)} className="w-full bg-[#141414] text-white px-3 py-2 rounded-xl border border-[#333333] text-sm focus:border-[#3F74FF] focus:outline-none white-calendar-icon" /></div>
            <div><label className="block text-xs text-gray-500 mb-1">Executed By</label><div className="flex items-center gap-2 bg-[#141414] text-white px-3 py-2 rounded-xl border border-[#333333]"><User className="w-4 h-4 text-gray-400" /><span className="text-sm">{currentUser}</span></div></div>
          </div>
        </div>

        {/* Mobile Period Dropdown */}
        {periodDropdownOpen && (
          <div className="sm:hidden fixed inset-0 z-[60] flex items-center justify-center bg-black/50" onClick={(e) => { if (e.target === e.currentTarget) { setPeriodDropdownOpen(false); setIsCustomPeriodActive(false) } }}>
            <div className="bg-[#1F1F1F] border border-gray-700 rounded-xl shadow-lg w-[90%] max-w-[340px] max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700"><span className="text-white font-medium">Select Period</span><button type="button" onClick={() => { setPeriodDropdownOpen(false); setIsCustomPeriodActive(false) }} className="text-gray-400 hover:text-white p-1 touch-manipulation"><X className="w-5 h-5" /></button></div>
              <div className="py-1 max-h-[40vh] overflow-y-auto">
                {availablePeriods.map((period) => (<button type="button" key={period} className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-800 active:bg-gray-700 transition-colors touch-manipulation ${localSelectedPeriod === period && !isCustomPeriodActive ? 'text-white bg-[#3F74FF]' : 'text-gray-300'}`} onClick={() => { setLocalSelectedPeriod(period); setIsCustomPeriodActive(false); setPeriodDropdownOpen(false) }}>{period}</button>))}
              </div>
              <div className="border-t border-gray-700">
                <button type="button" className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-800 active:bg-gray-700 transition-colors flex items-center gap-2 touch-manipulation ${isCustomPeriodActive ? 'text-white bg-[#3F74FF]' : 'text-gray-300'}`} onClick={() => { const today = new Date().toISOString().split("T")[0]; setCustomPeriod((prev) => ({ startDate: prev.startDate || today, endDate: prev.endDate || today })); setIsCustomPeriodActive(!isCustomPeriodActive) }}><Calendar className="w-4 h-4" />Custom Period</button>
                {isCustomPeriodActive && (
                  <div className="px-4 py-3 bg-[#141414] border-t border-gray-700">
                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-xs text-gray-500 mb-1">Start Date</label><input type="date" value={customPeriod.startDate} onChange={(e) => setCustomPeriod((prev) => ({ ...prev, startDate: e.target.value }))} className="w-full bg-[#1C1C1C] text-white px-3 py-2 rounded-lg border border-gray-700 text-sm focus:border-[#3F74FF] focus:outline-none white-calendar-icon touch-manipulation" /></div>
                        <div><label className="block text-xs text-gray-500 mb-1">End Date</label><input type="date" value={customPeriod.endDate} onChange={(e) => setCustomPeriod((prev) => ({ ...prev, endDate: e.target.value }))} className="w-full bg-[#1C1C1C] text-white px-3 py-2 rounded-lg border border-gray-700 text-sm focus:border-[#3F74FF] focus:outline-none white-calendar-icon touch-manipulation" /></div>
                      </div>
                      <button type="button" onClick={() => { if (customPeriod.startDate && customPeriod.endDate) { setLocalSelectedPeriod(`Custom: ${formatDateForDisplay(customPeriod.startDate)} - ${formatDateForDisplay(customPeriod.endDate)}`); setIsCustomPeriodActive(false); setPeriodDropdownOpen(false) } }} disabled={!customPeriod.startDate || !customPeriod.endDate} className="w-full py-2.5 bg-[#3F74FF] text-white rounded-lg text-sm hover:bg-[#3F74FF]/90 active:bg-[#3F74FF]/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation">Apply</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-800">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <input type="search" placeholder="Search by studio, account holder, IBAN, or mandate..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-10 bg-[#141414] text-white rounded-xl pl-12 pr-4 w-full text-sm outline-none border border-[#333333] focus:border-[#3F74FF] transition-colors" />
          </div>
        </div>

        <div className="p-4 overflow-y-auto flex-grow min-h-[200px]">
          {sortedTransactions.length > 0 ? (
            <>
              <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
                <p className="text-gray-300 text-sm">Review and select transactions to include in the SEPA XML file:</p>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm rounded-lg bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F] transition-colors" onClick={() => handleSelectAll(true)}>Select All</button>
                  <button className="px-3 py-1 text-sm rounded-lg bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F] transition-colors" onClick={() => handleSelectAll(false)}>Deselect All</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="text-sm text-gray-300 border-collapse w-full" style={{ minWidth: '700px' }}>
                  <thead className="text-xs text-gray-400 uppercase bg-[#141414]">
                    <tr>
                      <th className="px-1.5 py-2 w-8 rounded-tl-lg"><input type="checkbox" className="rounded bg-black border-gray-700 text-[#3F74FF] focus:ring-[#3F74FF]" checked={sortedTransactions.length > 0 && sortedTransactions.every(tx => selectedTransactions[tx.id])} onChange={() => { const allSelected = sortedTransactions.every(tx => selectedTransactions[tx.id]); handleSelectAll(!allSelected) }} /></th>
                      {/* Studio Name Column */}
                      <th className="px-1.5 md:px-2 py-2 text-left hover:bg-[#1C1C1C] transition-colors relative" style={{ width: `${columnWidths.studio}px`, minWidth: '60px' }}><div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("studio")}><span className="hidden md:inline">Studio</span><span className="md:hidden">Studio</span>{getSortIcon("studio")}</div><div className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group" onMouseDown={(e) => handleResizeMouseDown(e, 'studio')} style={{ touchAction: 'none' }}><div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-gray-600 group-hover:bg-[#3F74FF] transition-colors" /></div></th>
                      {/* Account Holder Column */}
                      <th className="px-1.5 md:px-2 py-2 text-left hover:bg-[#1C1C1C] transition-colors relative" style={{ width: `${columnWidths.accountHolder}px`, minWidth: '60px' }}><div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("accountHolder")}><span className="hidden md:inline">Account Holder</span><span className="md:hidden">Holder</span>{getSortIcon("accountHolder")}</div><div className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group" onMouseDown={(e) => handleResizeMouseDown(e, 'accountHolder')} style={{ touchAction: 'none' }}><div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-gray-600 group-hover:bg-[#3F74FF] transition-colors" /></div></th>
                      {/* Amount Column */}
                      <th className="px-1.5 md:px-2 py-2 text-right hover:bg-[#1C1C1C] transition-colors relative" style={{ width: `${columnWidths.amount}px`, minWidth: '40px' }}><div className="flex items-center justify-end gap-1 cursor-pointer" onClick={() => handleSort("amount")}><span className="hidden md:inline">Amount</span><span className="md:hidden">Amt</span>{getSortIcon("amount")}</div><div className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group" onMouseDown={(e) => handleResizeMouseDown(e, 'amount')} style={{ touchAction: 'none' }}><div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-gray-600 group-hover:bg-[#3F74FF] transition-colors" /></div></th>
                      {/* Services Column */}
                      <th className="px-1.5 py-2 text-center relative" style={{ width: `${columnWidths.services}px`, minWidth: '25px' }}><span className="hidden md:inline">Services</span><span className="md:hidden">Svc</span><div className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group" onMouseDown={(e) => handleResizeMouseDown(e, 'services')} style={{ touchAction: 'none' }}><div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-gray-600 group-hover:bg-[#3F74FF] transition-colors" /></div></th>
                      {/* Status Column */}
                      <th className="px-1.5 md:px-2 py-2 text-left hover:bg-[#1C1C1C] transition-colors relative" style={{ width: `${columnWidths.status}px`, minWidth: '35px' }}><div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("status")}><span className="hidden md:inline">Status</span><span className="md:hidden">St.</span>{getSortIcon("status")}</div><div className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group" onMouseDown={(e) => handleResizeMouseDown(e, 'status')} style={{ touchAction: 'none' }}><div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-gray-600 group-hover:bg-[#3F74FF] transition-colors" /></div></th>
                      {/* IBAN Column */}
                      <th className="px-1.5 md:px-2 py-2 text-left hover:bg-[#1C1C1C] transition-colors relative" style={{ width: `${columnWidths.iban}px`, minWidth: '55px' }}><div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("iban")}>IBAN {getSortIcon("iban")}</div><div className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group" onMouseDown={(e) => handleResizeMouseDown(e, 'iban')} style={{ touchAction: 'none' }}><div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-gray-600 group-hover:bg-[#3F74FF] transition-colors" /></div></th>
                      {/* Mandate Column */}
                      <th className="px-1.5 md:px-2 py-2 text-left hover:bg-[#1C1C1C] transition-colors relative" style={{ width: `${columnWidths.mandate}px`, minWidth: '50px' }}><div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("mandate")}><span className="hidden md:inline">Mandate Number</span><span className="md:hidden">Mandate</span>{getSortIcon("mandate")}</div><div className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group" onMouseDown={(e) => handleResizeMouseDown(e, 'mandate')} style={{ touchAction: 'none' }}><div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-gray-600 group-hover:bg-[#3F74FF] transition-colors" /></div></th>
                      {/* Date Column */}
                      <th className="px-1.5 md:px-2 py-2 text-left rounded-tr-lg hover:bg-[#1C1C1C] transition-colors relative" style={{ width: `${columnWidths.date}px`, minWidth: '50px' }}><div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("date")}>Date {getSortIcon("date")}</div><div className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group" onMouseDown={(e) => handleResizeMouseDown(e, 'date')} style={{ touchAction: 'none' }}><div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-gray-600 group-hover:bg-[#3F74FF] transition-colors" /></div></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTransactions.map((tx) => (
                      <tr key={tx.id} className={`border-b border-gray-800 ${!selectedTransactions[tx.id] ? "opacity-50" : ""}`}>
                        <td className="px-1.5 py-2"><input type="checkbox" className="rounded bg-black border-gray-700 text-[#3F74FF] focus:ring-[#3F74FF]" checked={selectedTransactions[tx.id] || false} onChange={() => handleToggleTransaction(tx.id)} /></td>
                        <td className="px-1.5 md:px-2 py-2 text-xs truncate">{getStudioName(tx)}</td>
                        <td className="px-1.5 md:px-2 py-2 text-xs truncate">{getAccountHolder(tx)}</td>
                        <td className="px-1.5 md:px-2 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {editingAmount === tx.id ? (<><input type="number" value={tempAmount} onChange={(e) => setTempAmount(e.target.value)} className="w-12 md:w-16 bg-[#141414] text-white px-1 py-0.5 rounded border border-gray-700 text-xs focus:border-[#3F74FF] focus:outline-none" autoFocus onKeyDown={(e) => { if (e.key === "Enter") handleSaveAmount(tx.id); if (e.key === "Escape") handleCancelEdit() }} /><button onClick={() => handleSaveAmount(tx.id)} className="p-0.5 rounded text-xs bg-green-500 hover:bg-green-600 text-white">✔</button></>) : (<><span className={`text-xs ${!selectedTransactions[tx.id] ? "text-gray-500" : "text-white"}`}>{formatCurrency(editedAmounts[tx.id] || tx.amount)}</span><button onClick={() => handleStartEdit(tx.id, editedAmounts[tx.id] || tx.amount)} disabled={!selectedTransactions[tx.id]} className={`p-0.5 rounded ${!selectedTransactions[tx.id] ? "text-gray-600 cursor-not-allowed" : "text-gray-400 hover:text-white"}`}><Edit className="w-2.5 h-2.5" /></button></>)}
                          </div>
                        </td>
                        <td className="px-1.5 py-2 text-center"><button onClick={() => handleShowServices(tx.services, getStudioName(tx))} className="text-blue-400 hover:text-blue-300" disabled={!selectedTransactions[tx.id]}><Info className="w-3 h-3" /></button></td>
                        <td className="px-1.5 md:px-2 py-2"><span className={`md:hidden px-1 py-0.5 rounded text-xs font-medium ${tx.status === "Pending" ? "bg-[#f59e0b] text-white" : "bg-[#ef4444] text-white"}`}>{tx.status === "Pending" ? "P" : "F"}</span><span className={`hidden md:inline px-2 py-1 rounded text-xs font-medium ${tx.status === "Pending" ? "bg-[#f59e0b] text-white" : "bg-[#ef4444] text-white"}`}>{tx.status}</span></td>
                        <td className="px-1.5 md:px-2 py-2 text-xs"><MaskedIban iban={getTransactionIban(tx)} /></td>
                        <td className="px-1.5 md:px-2 py-2 text-xs truncate">{tx.mandateNumber || `MNDT-${tx.id.toString().padStart(6, '0')}`}</td>
                        <td className="px-1.5 md:px-2 py-2 text-xs">{new Date(tx.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="bg-[#141414] p-6 rounded-xl text-center"><p className="text-gray-400 text-sm">{searchTerm ? "No transactions found matching your search." : "No pending or failed transactions for this period."}</p></div>
          )}
        </div>

        {/* Services Modal */}
        {servicesModalOpen && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
            <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col mx-4">
              <div className="p-4 border-b border-gray-800 flex justify-between items-center"><h2 className="text-white text-lg font-medium">Services Breakdown</h2><button onClick={() => setServicesModalOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button></div>
              <div className="p-4 overflow-y-auto flex-grow">
                <div className="mb-4"><h3 className="text-white font-medium mb-2">{selectedStudioName}</h3><p className="text-gray-400 text-sm">Service breakdown for this studio</p></div>
                <div className="space-y-3">{selectedServices.map((service, index) => (<div key={index} className="bg-[#141414] p-3 rounded-lg"><div className="flex justify-between items-start mb-1"><span className="text-white font-medium text-sm">{service.name}</span><span className="text-white font-semibold text-sm">{formatCurrency(service.cost)}</span></div><p className="text-gray-400 text-xs">{service.description}</p></div>))}</div>
                <div className="mt-4 pt-4 border-t border-gray-800"><div className="flex justify-between items-center"><span className="text-white font-semibold text-sm">Total Amount</span><span className="text-white font-bold text-lg">{formatCurrency(selectedServices.reduce((sum, service) => sum + service.cost, 0))}</span></div></div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {confirmationModalOpen && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30">
            <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md mx-4">
              <div className="p-4 border-b border-gray-800"><h2 className="text-white text-lg font-medium">Generate SEPA XML</h2></div>
              <div className="p-4">
                <p className="text-gray-300 text-sm mb-4">Are you sure you want to generate the SEPA XML file?</p>
                <div className="bg-[#141414] p-3 rounded-lg mb-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Selected transactions:</span><span className="text-white font-medium">{selectedCount}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Total amount:</span><span className="text-white font-medium">{formatCurrency(totalAmount)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Period:</span><span className="text-white font-medium">{isCustomPeriodActive ? `${formatDateForDisplay(customPeriod.startDate)} - ${formatDateForDisplay(customPeriod.endDate)}` : localSelectedPeriod}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Claims through:</span><span className="text-white font-medium">{formatDateForDisplay(claimsUntilDate)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Collection date:</span><span className="text-white font-medium">{formatDateForDisplay(collectionDate)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Executed by:</span><span className="text-white font-medium">{currentUser}</span></div>
                </div>
                <div className="flex items-center gap-2 mb-4"><input type="checkbox" id="shouldDownload" checked={shouldDownload} onChange={(e) => setShouldDownload(e.target.checked)} className="rounded bg-black border-gray-700 text-[#3F74FF] focus:ring-[#3F74FF]" /><label htmlFor="shouldDownload" className="text-sm text-gray-300">Download SEPA XML file automatically</label></div>
              </div>
              <div className="p-4 border-t border-gray-800 flex justify-end gap-3">
                <button onClick={handleCancelGeneration} className="px-4 py-2 rounded-xl text-sm bg-[#2F2F2F] text-white hover:bg-[#3F3F3F] transition-colors">Cancel</button>
                <button onClick={handleConfirmGeneration} className="px-4 py-2 rounded-xl text-sm bg-[#3F74FF] text-white hover:bg-[#3F74FF]/90 transition-colors">Generate XML</button>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-gray-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm bg-[#2F2F2F] text-white hover:bg-[#3F3F3F] transition-colors">Cancel</button>
          <button onClick={handleGenerateXmlClick} className="px-4 py-2 rounded-xl text-sm bg-[#3F74FF] text-white hover:bg-[#3F74FF]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!Object.values(selectedTransactions).some((v) => v)}>Generate SEPA XML</button>
        </div>
      </div>
    </div>
  )
}

export default SepaXmlModal
