/* eslint-disable react/prop-types */
import { Calendar, X, Edit, Info, Search, ArrowUp, ArrowDown, ArrowUpDown, ChevronDown, Eye, EyeOff, User } from "lucide-react"
import { useEffect, useState, useMemo, useRef } from "react"
import DatePickerField from "../../../components/shared/DatePickerField"

// Masked IBAN Component
const MaskedIban = ({ iban, className = "" }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  if (!iban) return <span className="text-content-faint">-</span>;
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
      <button onClick={(e) => { e.stopPropagation(); setIsRevealed(!isRevealed); }} className="p-0.5 text-content-muted hover:text-content-primary transition-colors flex-shrink-0" title={isRevealed ? "Hide IBAN" : "Show full IBAN"}>
        {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
      </button>
    </div>
  );
};

const SepaXmlModal = ({ isOpen, onClose, selectedPeriod, transactions, onGenerateXml, financialData, creditorInfo, currentUser = "John Smith" }) => {
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
  const [columnWidths, setColumnWidths] = useState({ member: 85, iban: 65, mandate: 85, date: 65, status: 50, amount: 45, services: 28 })

  const defaultCreditorInfo = { name: "Fitness Studio Inc.", bankName: "Chase Bank", iban: "DE89370400440532013000", bic: "CHASUS33", creditorId: "US98ZZZ09999999999" }
  const activeCreditorInfo = creditorInfo || defaultCreditorInfo

  // IMPORTANT: Helper to get IBAN - ensures IBAN is always available
  const getTransactionIban = (tx) => {
    // Check multiple possible IBAN field names
    return tx.iban || tx.memberIban || tx.bankIban || "DE89370400440532013000"
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
    if (searchTerm) filtered = filtered.filter((tx) => tx.memberName.toLowerCase().includes(searchTerm.toLowerCase()) || getTransactionIban(tx).toLowerCase().includes(searchTerm.toLowerCase()) || (tx.mandateNumber || '').toLowerCase().includes(searchTerm.toLowerCase()))
    return filtered
  }, [periodTransactions, searchTerm])

  const sortedTransactions = useMemo(() => {
    const sorted = [...filteredTransactions].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "member": comparison = a.memberName.localeCompare(b.memberName); break;
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
  const getSortIcon = (column) => { if (sortBy !== column) return <ArrowUpDown size={14} className="text-content-faint" />; return sortDirection === "asc" ? <ArrowUp size={14} className="text-content-primary" /> : <ArrowDown size={14} className="text-content-primary" /> }
  const handleToggleTransaction = (id) => { setSelectedTransactions((prev) => ({ ...prev, [id]: !prev[id] })) }
  const handleStartEdit = (id, currentAmount) => { setEditingAmount(id); setTempAmount(currentAmount.toString()) }
  const handleSaveAmount = (id) => { const newAmount = Number.parseFloat(tempAmount) || 0; setEditedAmounts((prev) => ({ ...prev, [id]: newAmount })); setEditingAmount(null); setTempAmount("") }
  const handleCancelEdit = () => { setEditingAmount(null); setTempAmount("") }
  const handleGenerateXmlClick = () => { setConfirmationModalOpen(true) }

  const generatePaymentRunNumber = () => { const now = new Date(); const year = now.getFullYear(); const month = String(now.getMonth() + 1).padStart(2, '0'); const day = String(now.getDate()).padStart(2, '0'); const random = String(Math.floor(Math.random() * 9999)).padStart(4, '0'); return `PR-${year}${month}${day}-${random}` }

  const handleConfirmGeneration = () => {
    // CRITICAL: Map transactions with IBAN explicitly included
    const selectedTxs = periodTransactions.filter((tx) => selectedTransactions[tx.id]).map((tx, index) => ({
      ...tx,
      // Ensure amount is updated if edited
      amount: editedAmounts[tx.id] !== undefined ? editedAmounts[tx.id] : tx.amount,
      // IMPORTANT: Explicitly set IBAN using helper function
      iban: getTransactionIban(tx),
      // Set other required fields with fallbacks
      accountHolder: tx.accountHolder || tx.memberName,
      memberNumber: tx.memberNumber || `M-${String(index + 1).padStart(5, '0')}`,
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
      transactions: selectedTxs, // This now has IBAN explicitly set
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
  const formatDateDisplay = (dateString) => { if (!dateString) return ""; const [y, m, d] = dateString.split('-'); return `${d}.${m}.${y}` }
  const formatCurrency = (amount) => { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount) }

  if (!isOpen) return null

  const selectedCount = Object.values(selectedTransactions).filter(v => v).length
  const totalAmount = periodTransactions.filter((tx) => selectedTransactions[tx.id]).reduce((sum, tx) => sum + (editedAmounts[tx.id] || tx.amount), 0)
  const availablePeriods = financialData ? Object.keys(financialData) : []
  const getPeriodDisplayText = () => { if (isCustomPeriodActive && customPeriod.startDate && customPeriod.endDate) return `${formatDateForDisplay(customPeriod.startDate)} - ${formatDateForDisplay(customPeriod.endDate)}`; return localSelectedPeriod }

  return (
    <div className="fixed inset-0 bg-black/70 flex p-2 items-center justify-center z-50">
      <div className="bg-surface-base rounded-xl w-full max-w-5xl max-h-[80vh] flex flex-col overflow-visible">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="text-content-primary text-lg font-medium">Run Payment</h2>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary"><X className="w-5 h-5" /></button>
        </div>

        {/* Period Selection & Payment Run Settings */}
        <div className="p-4 border-b border-border overflow-visible">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative" ref={dropdownRef}>
              <label className="block text-xs text-content-faint mb-1">Period</label>
              <button onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)} className="w-full bg-surface-dark text-content-primary px-3 py-2 rounded-xl border border-border hover:border-primary flex items-center gap-2 text-sm transition-colors">
                <Calendar className="w-4 h-4 text-content-muted flex-shrink-0" />
                <span className="text-sm flex-1 text-left truncate">{getPeriodDisplayText()}</span>
                <ChevronDown className={`w-4 h-4 text-content-muted flex-shrink-0 transition-transform ${periodDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {periodDropdownOpen && (
                <div className="hidden sm:block absolute z-40 mt-2 w-full min-w-[280px] bg-surface-hover border border-border rounded-xl shadow-lg overflow-hidden">
                  <div className="py-1 max-h-[40vh] overflow-y-auto">
                    <div className="px-3 py-1.5 text-xs text-content-faint font-medium border-b border-border">Select Period</div>
                    {availablePeriods.map((period) => (
                      <button key={period} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-surface-hover transition-colors ${localSelectedPeriod === period && !isCustomPeriodActive ? 'text-content-primary bg-surface-hover/50' : 'text-content-secondary'}`} onClick={() => handleSelectPeriod(period)}>{period}</button>
                    ))}
                  </div>
                  <div className="border-t border-border">
                    <button className={`w-full text-left px-4 py-2.5 text-sm hover:bg-surface-hover transition-colors flex items-center gap-2 ${isCustomPeriodActive ? 'text-content-primary bg-surface-hover/50' : 'text-content-secondary'}`} onClick={handleCustomPeriodSelect}><Calendar className="w-4 h-4" />Custom Period</button>
                    {isCustomPeriodActive && (
                      <div className="px-4 py-3 bg-surface-dark border-t border-border">
                        <div className="flex flex-col gap-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div><label className="block text-xs text-content-faint mb-1">Start Date</label><div className="w-full flex items-center justify-between bg-surface-base text-sm rounded-lg px-3 py-2 border border-border"><span className={customPeriod.startDate ? "text-content-primary" : "text-content-faint"}>{customPeriod.startDate ? formatDateDisplay(customPeriod.startDate) : "Select"}</span><DatePickerField value={customPeriod.startDate} onChange={(val) => setCustomPeriod((prev) => ({ ...prev, startDate: val }))} /></div></div>
                            <div><label className="block text-xs text-content-faint mb-1">End Date</label><div className="w-full flex items-center justify-between bg-surface-base text-sm rounded-lg px-3 py-2 border border-border"><span className={customPeriod.endDate ? "text-content-primary" : "text-content-faint"}>{customPeriod.endDate ? formatDateDisplay(customPeriod.endDate) : "Select"}</span><DatePickerField value={customPeriod.endDate} onChange={(val) => setCustomPeriod((prev) => ({ ...prev, endDate: val }))} /></div></div>
                          </div>
                          <button onClick={handleApplyCustomPeriod} disabled={!customPeriod.startDate || !customPeriod.endDate} className="w-full py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Apply</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div><label className="block text-xs text-content-faint mb-1">Claims Through</label><div className="w-full flex items-center justify-between bg-surface-dark text-sm rounded-xl px-3 py-2 border border-border"><span className={claimsUntilDate ? "text-content-primary" : "text-content-faint"}>{claimsUntilDate ? formatDateDisplay(claimsUntilDate) : "Select date"}</span><DatePickerField value={claimsUntilDate} onChange={(val) => setClaimsUntilDate(val)} /></div></div>
            <div><label className="block text-xs text-content-faint mb-1">Collection Date</label><div className="w-full flex items-center justify-between bg-surface-dark text-sm rounded-xl px-3 py-2 border border-border"><span className={collectionDate ? "text-content-primary" : "text-content-faint"}>{collectionDate ? formatDateDisplay(collectionDate) : "Select date"}</span><DatePickerField value={collectionDate} onChange={(val) => setCollectionDate(val)} /></div></div>
            <div><label className="block text-xs text-content-faint mb-1">Executed By</label><div className="flex items-center gap-2 bg-surface-dark text-content-primary px-3 py-2 rounded-xl border border-border"><User className="w-4 h-4 text-content-muted" /><span className="text-sm">{currentUser}</span></div></div>
          </div>
        </div>

        {/* Mobile Period Dropdown */}
        {periodDropdownOpen && (
          <div className="sm:hidden fixed inset-0 z-[60] flex items-center justify-center bg-black/50" onClick={(e) => { if (e.target === e.currentTarget) { setPeriodDropdownOpen(false); setIsCustomPeriodActive(false) } }}>
            <div className="bg-surface-hover border border-border rounded-xl shadow-lg w-[90%] max-w-[340px] max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-border"><span className="text-content-primary font-medium">Select Period</span><button type="button" onClick={() => { setPeriodDropdownOpen(false); setIsCustomPeriodActive(false) }} className="text-content-muted hover:text-content-primary p-1 touch-manipulation"><X className="w-5 h-5" /></button></div>
              <div className="py-1 max-h-[40vh] overflow-y-auto">
                {availablePeriods.map((period) => (<button type="button" key={period} className={`w-full text-left px-4 py-3 text-sm hover:bg-surface-hover active:bg-surface-button transition-colors touch-manipulation ${localSelectedPeriod === period && !isCustomPeriodActive ? 'text-white bg-primary' : 'text-content-secondary'}`} onClick={() => { setLocalSelectedPeriod(period); setIsCustomPeriodActive(false); setPeriodDropdownOpen(false) }}>{period}</button>))}
              </div>
              <div className="border-t border-border">
                <button type="button" className={`w-full text-left px-4 py-3 text-sm hover:bg-surface-hover active:bg-surface-button transition-colors flex items-center gap-2 touch-manipulation ${isCustomPeriodActive ? 'text-white bg-primary' : 'text-content-secondary'}`} onClick={() => { const today = new Date().toISOString().split("T")[0]; setCustomPeriod((prev) => ({ startDate: prev.startDate || today, endDate: prev.endDate || today })); setIsCustomPeriodActive(!isCustomPeriodActive) }}><Calendar className="w-4 h-4" />Custom Period</button>
                {isCustomPeriodActive && (
                  <div className="px-4 py-3 bg-surface-dark border-t border-border">
                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-xs text-content-faint mb-1">Start Date</label><div className="w-full flex items-center justify-between bg-surface-base text-sm rounded-lg px-3 py-2 border border-border"><span className={customPeriod.startDate ? "text-content-primary" : "text-content-faint"}>{customPeriod.startDate ? formatDateDisplay(customPeriod.startDate) : "Select"}</span><DatePickerField value={customPeriod.startDate} onChange={(val) => setCustomPeriod((prev) => ({ ...prev, startDate: val }))} /></div></div>
                        <div><label className="block text-xs text-content-faint mb-1">End Date</label><div className="w-full flex items-center justify-between bg-surface-base text-sm rounded-lg px-3 py-2 border border-border"><span className={customPeriod.endDate ? "text-content-primary" : "text-content-faint"}>{customPeriod.endDate ? formatDateDisplay(customPeriod.endDate) : "Select"}</span><DatePickerField value={customPeriod.endDate} onChange={(val) => setCustomPeriod((prev) => ({ ...prev, endDate: val }))} /></div></div>
                      </div>
                      <button type="button" onClick={() => { if (customPeriod.startDate && customPeriod.endDate) { setLocalSelectedPeriod(`Custom: ${formatDateForDisplay(customPeriod.startDate)} - ${formatDateForDisplay(customPeriod.endDate)}`); setIsCustomPeriodActive(false); setPeriodDropdownOpen(false) } }} disabled={!customPeriod.startDate || !customPeriod.endDate} className="w-full py-2.5 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover active:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation">Apply</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted w-4 h-4 pointer-events-none" />
            <input type="search" placeholder="Search by member, IBAN, or mandate number..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-10 bg-surface-dark text-content-primary rounded-xl pl-12 pr-4 w-full text-sm outline-none border border-border focus:border-primary transition-colors" />
          </div>
        </div>

        <div className="p-4 overflow-y-auto flex-grow min-h-[200px]">
          {sortedTransactions.length > 0 ? (
            <>
              <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
                <p className="text-content-secondary text-sm">Review and select transactions to include in the SEPA XML file:</p>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm rounded-lg bg-surface-button text-content-secondary hover:bg-surface-button-hover transition-colors" onClick={() => handleSelectAll(true)}>Select All</button>
                  <button className="px-3 py-1 text-sm rounded-lg bg-surface-button text-content-secondary hover:bg-surface-button-hover transition-colors" onClick={() => handleSelectAll(false)}>Deselect All</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="text-sm text-content-secondary border-collapse w-full" style={{ minWidth: '600px' }}>
                  <thead className="text-xs text-content-muted uppercase bg-surface-dark">
                    <tr>
                      <th className="px-1.5 py-2 w-8 rounded-tl-lg"><input type="checkbox" className="rounded bg-black border-border text-primary focus:ring-primary" checked={sortedTransactions.length > 0 && sortedTransactions.every(tx => selectedTransactions[tx.id])} onChange={() => { const allSelected = sortedTransactions.every(tx => selectedTransactions[tx.id]); handleSelectAll(!allSelected) }} /></th>
                      <th className="px-1.5 md:px-2 py-2 text-left transition-colors relative" style={{ width: `${columnWidths.member}px`, minWidth: '60px' }}><div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("member")}><span className="hidden md:inline">Member</span><span className="md:hidden">Name</span>{getSortIcon("member")}</div><div className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group" onMouseDown={(e) => handleResizeMouseDown(e, 'member')} style={{ touchAction: 'none' }}><div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-border group-hover:bg-primary transition-colors" /></div></th>
                      <th className="px-1.5 md:px-2 py-2 text-right transition-colors relative" style={{ width: `${columnWidths.amount}px`, minWidth: '40px' }}><div className="flex items-center justify-end gap-1 cursor-pointer" onClick={() => handleSort("amount")}><span className="hidden md:inline">Amount</span><span className="md:hidden">Amt</span>{getSortIcon("amount")}</div><div className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group" onMouseDown={(e) => handleResizeMouseDown(e, 'amount')} style={{ touchAction: 'none' }}><div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-border group-hover:bg-primary transition-colors" /></div></th>
                      <th className="px-1.5 py-2 text-center relative" style={{ width: `${columnWidths.services}px`, minWidth: '25px' }}><span className="hidden md:inline">Services</span><span className="md:hidden">Svc</span><div className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group" onMouseDown={(e) => handleResizeMouseDown(e, 'services')} style={{ touchAction: 'none' }}><div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-border group-hover:bg-primary transition-colors" /></div></th>
                      <th className="px-1.5 md:px-2 py-2 text-left transition-colors relative" style={{ width: `${columnWidths.status}px`, minWidth: '35px' }}><div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("status")}><span className="hidden md:inline">Status</span><span className="md:hidden">St.</span>{getSortIcon("status")}</div><div className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group" onMouseDown={(e) => handleResizeMouseDown(e, 'status')} style={{ touchAction: 'none' }}><div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-border group-hover:bg-primary transition-colors" /></div></th>
                      <th className="px-1.5 md:px-2 py-2 text-left transition-colors relative" style={{ width: `${columnWidths.iban}px`, minWidth: '55px' }}><div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("iban")}>IBAN {getSortIcon("iban")}</div><div className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group" onMouseDown={(e) => handleResizeMouseDown(e, 'iban')} style={{ touchAction: 'none' }}><div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-border group-hover:bg-primary transition-colors" /></div></th>
                      <th className="px-1.5 md:px-2 py-2 text-left transition-colors relative" style={{ width: `${columnWidths.mandate}px`, minWidth: '50px' }}><div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("mandate")}><span className="hidden md:inline">Mandate Number</span><span className="md:hidden">Mandate</span>{getSortIcon("mandate")}</div><div className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group" onMouseDown={(e) => handleResizeMouseDown(e, 'mandate')} style={{ touchAction: 'none' }}><div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-border group-hover:bg-primary transition-colors" /></div></th>
                      <th className="px-1.5 md:px-2 py-2 text-left rounded-tr-lg transition-colors relative" style={{ width: `${columnWidths.date}px`, minWidth: '50px' }}><div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("date")}>Date {getSortIcon("date")}</div><div className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group" onMouseDown={(e) => handleResizeMouseDown(e, 'date')} style={{ touchAction: 'none' }}><div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-border group-hover:bg-primary transition-colors" /></div></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTransactions.map((tx) => (
                      <tr key={tx.id} className={`border-b border-border ${!selectedTransactions[tx.id] ? "opacity-50" : ""}`}>
                        <td className="px-1.5 py-2"><input type="checkbox" className="rounded bg-black border-border text-primary focus:ring-primary" checked={selectedTransactions[tx.id] || false} onChange={() => handleToggleTransaction(tx.id)} /></td>
                        <td className="px-1.5 md:px-2 py-2 text-xs truncate">{tx.memberName}</td>
                        <td className="px-1.5 md:px-2 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {editingAmount === tx.id ? (<><input type="number" value={tempAmount} onChange={(e) => setTempAmount(e.target.value)} className="w-12 md:w-16 bg-surface-dark text-content-primary px-1 py-0.5 rounded border border-border text-xs focus:border-primary focus:outline-none" autoFocus onKeyDown={(e) => { if (e.key === "Enter") handleSaveAmount(tx.id); if (e.key === "Escape") handleCancelEdit() }} /><button onClick={() => handleSaveAmount(tx.id)} className="p-0.5 rounded text-xs bg-green-500 hover:bg-green-600 text-white">✔</button></>) : (<><span className={`text-xs ${!selectedTransactions[tx.id] ? "text-content-faint" : "text-content-primary"}`}>{formatCurrency(editedAmounts[tx.id] || tx.amount)}</span><button onClick={() => handleStartEdit(tx.id, editedAmounts[tx.id] || tx.amount)} disabled={!selectedTransactions[tx.id]} className={`p-0.5 rounded ${!selectedTransactions[tx.id] ? "text-content-faint cursor-not-allowed" : "text-content-muted hover:text-content-primary"}`}><Edit className="w-2.5 h-2.5" /></button></>)}
                          </div>
                        </td>
                        <td className="px-1.5 py-2 text-center"><button onClick={() => handleShowServices(tx.services, tx.memberName)} className="text-primary hover:text-primary-hover" disabled={!selectedTransactions[tx.id]}><Info className="w-3 h-3" /></button></td>
                        <td className="px-1.5 md:px-2 py-2"><span className={`md:hidden px-1 py-0.5 rounded text-xs font-medium ${tx.status === "Pending" ? "bg-yellow-500 text-white" : "bg-red-500 text-white"}`}>{tx.status === "Pending" ? "P" : "F"}</span><span className={`hidden md:inline px-2 py-1 rounded text-xs font-medium ${tx.status === "Pending" ? "bg-yellow-500 text-white" : "bg-red-500 text-white"}`}>{tx.status}</span></td>
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
            <div className="bg-surface-dark p-6 rounded-xl text-center"><p className="text-content-muted text-sm">{searchTerm ? "No transactions found matching your search." : "No pending or failed transactions for this period."}</p></div>
          )}
        </div>

        {/* Services Modal */}
        {servicesModalOpen && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
            <div className="bg-surface-base rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col mx-4">
              <div className="p-4 border-b border-border flex justify-between items-center"><h2 className="text-content-primary text-lg font-medium text-content-primary">Services Breakdown</h2><button onClick={() => setServicesModalOpen(false)} className="text-content-muted hover:text-content-primary"><X className="w-5 h-5" /></button></div>
              <div className="p-4 overflow-y-auto flex-grow">
                <div className="mb-4"><h3 className="text-content-primary font-medium mb-2">{selectedStudioName}</h3><p className="text-content-muted text-sm">Cost breakdown for this member</p></div>
                <div className="space-y-3">{selectedServices.map((service, index) => (<div key={index} className="bg-surface-dark p-3 rounded-lg"><div className="flex justify-between items-start mb-1"><span className="text-content-primary font-medium text-sm">{service.name}</span><span className="text-content-primary font-semibold text-sm">{formatCurrency(service.cost)}</span></div><p className="text-content-muted text-xs">{service.description}</p></div>))}</div>
                <div className="mt-4 pt-4 border-t border-border"><div className="flex justify-between items-center"><span className="text-content-primary font-semibold text-sm">Total Amount</span><span className="text-content-primary font-bold text-lg">{formatCurrency(selectedServices.reduce((sum, service) => sum + service.cost, 0))}</span></div></div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {confirmationModalOpen && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30">
            <div className="bg-surface-base rounded-xl w-full max-w-md mx-4">
              <div className="p-4 border-b border-border"><h2 className="text-content-primary text-lg font-medium">Generate SEPA XML</h2></div>
              <div className="p-4">
                <p className="text-content-secondary text-sm mb-4">Are you sure you want to generate the SEPA XML file?</p>
                <div className="bg-surface-dark p-3 rounded-lg mb-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-content-muted">Selected transactions:</span><span className="text-content-primary font-medium">{selectedCount}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-content-muted">Total amount:</span><span className="text-content-primary font-medium">{formatCurrency(totalAmount)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-content-muted">Period:</span><span className="text-content-primary font-medium">{isCustomPeriodActive ? `${formatDateForDisplay(customPeriod.startDate)} - ${formatDateForDisplay(customPeriod.endDate)}` : localSelectedPeriod}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-content-muted">Claims through:</span><span className="text-content-primary font-medium">{formatDateForDisplay(claimsUntilDate)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-content-muted">Collection date:</span><span className="text-content-primary font-medium">{formatDateForDisplay(collectionDate)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-content-muted">Executed by:</span><span className="text-content-primary font-medium">{currentUser}</span></div>
                </div>
                <div className="flex items-center gap-2 mb-4"><input type="checkbox" id="shouldDownload" checked={shouldDownload} onChange={(e) => setShouldDownload(e.target.checked)} className="rounded bg-black border-border text-primary focus:ring-primary" /><label htmlFor="shouldDownload" className="text-sm text-content-secondary">Download SEPA XML file automatically</label></div>
              </div>
              <div className="p-4 border-t border-border flex justify-end gap-3">
                <button onClick={handleCancelGeneration} className="px-4 py-2 rounded-xl text-sm bg-surface-button text-content-secondary hover:bg-surface-button-hover transition-colors">Cancel</button>
                <button onClick={handleConfirmGeneration} className="px-4 py-2 rounded-xl text-sm bg-primary text-white hover:bg-primary-hover transition-colors">Generate XML</button>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-border flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm bg-surface-button text-content-secondary hover:bg-surface-button-hover transition-colors">Cancel</button>
          <button onClick={handleGenerateXmlClick} className="px-4 py-2 rounded-xl text-sm bg-primary text-white hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!Object.values(selectedTransactions).some((v) => v)}>Generate SEPA XML</button>
        </div>
      </div>
    </div>
  )
}

export default SepaXmlModal
