/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo, useRef } from "react"
import { Calendar, ChevronDown, RefreshCw, Info, X, FileText, Eye, EyeOff, Search, Play, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"

import { financialData } from "../../utils/admin-panel-states/finance-states"

import CheckFundsModal from "../../components/admin-dashboard-components/finance-components/check-funds-modal"
import SepaXmlModal from "../../components/admin-dashboard-components/finance-components/sepa-xml-modal"
import ServicesModal from "../../components/admin-dashboard-components/finance-components/service-modal"
import PaymentRunsModal from "../../components/admin-dashboard-components/finance-components/payment-runs-modal"
import SepaXmlSuccessModal from "../../components/admin-dashboard-components/finance-components/sepa-xml-success-modal"
import SuccessModal from "../../components/admin-dashboard-components/finance-components/check-funds-success-modal"

// Default creditor info - configure for your organization
const defaultCreditorInfo = {
  name: "Studio Management Company",
  bankName: "Chase Bank",
  iban: "DE89370400440532013000",
  bic: "CHASUS33",
  creditorId: "US98ZZZ09999999999"
}

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

export default function FinancesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("This Month")
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false)
  const [isCustomPeriodExpanded, setIsCustomPeriodExpanded] = useState(false)
  const [inlineCustomDates, setInlineCustomDates] = useState({ startDate: "", endDate: "" })
  const periodDropdownRef = useRef(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState(financialData[selectedPeriod]?.transactions || [])
  const [sepaModalOpen, setSepaModalOpen] = useState(false)
  const [financialState, setFinancialState] = useState(financialData)
  const [checkFundsModalOpen, setCheckFundsModalOpen] = useState(false)
  const [servicesModalOpen, setServicesModalOpen] = useState(false)
  const [selectedServices, setSelectedServices] = useState([])
  const [selectedStudioName, setSelectedStudioName] = useState("")
  const [customDateRange, setCustomDateRange] = useState(null)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")
  const [sepaSuccessModalOpen, setSepaSuccessModalOpen] = useState(false)
  const [generatedFileInfo, setGeneratedFileInfo] = useState({ fileName: '', transactionCount: 0, totalAmount: 0 })
  const [shouldAutoDownload, setShouldAutoDownload] = useState(true)

  // Payment Runs state
  const [paymentRunsModalOpen, setPaymentRunsModalOpen] = useState(false)
  const [paymentRuns, setPaymentRuns] = useState([])

  const [columnWidths, setColumnWidths] = useState({ studio: 80, accountHolder: 90, iban: 70, mandate: 90, date: 70, type: 50, amount: 45, services: 30, status: 70 })
  const resizingRef = useRef(null)

  const handleColumnResize = (columnId, newWidth) => { setColumnWidths(prev => ({ ...prev, [columnId]: Math.max(50, newWidth) })) }
  const handleResizeMouseDown = (e, columnId) => {
    e.preventDefault(); e.stopPropagation();
    const startX = e.clientX; const startWidth = columnWidths[columnId];
    const handleMouseMove = (moveEvent) => { const diff = moveEvent.clientX - startX; handleColumnResize(columnId, startWidth + diff) };
    const handleMouseUp = () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp); resizingRef.current = null };
    resizingRef.current = columnId;
    document.addEventListener('mousemove', handleMouseMove); document.addEventListener('mouseup', handleMouseUp)
  }

  const statusOptions = [
    { id: "Successful", label: "Successful", color: "#10b981" },
    { id: "Pending", label: "Pending", color: "#f59e0b" },
    { id: "Failed", label: "Failed", color: "#ef4444" },
    { id: "Check incoming funds", label: "Check incoming funds", color: "#3b82f6" },
  ]

  const handleSort = (column) => { if (sortBy === column) { setSortDirection(sortDirection === "asc" ? "desc" : "asc") } else { setSortBy(column); setSortDirection("asc") } }
  const getSortIcon = (column) => { if (sortBy !== column) return <ArrowUpDown size={14} className="text-gray-500" />; return sortDirection === "asc" ? <ArrowUp size={14} className="text-white" /> : <ArrowDown size={14} className="text-white" /> }

  useEffect(() => {
    let currentTransactions = financialState[selectedPeriod]?.transactions || []
    if (customDateRange && selectedPeriod.startsWith("Custom")) {
      const allTransactions = Object.values(financialState).flatMap((period) => period.transactions || [])
      currentTransactions = allTransactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date); const startDate = new Date(customDateRange.start); const endDate = new Date(customDateRange.end);
        return transactionDate >= startDate && transactionDate <= endDate
      })
    }
    const filtered = currentTransactions.filter((transaction) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        (transaction.studioName && transaction.studioName.toLowerCase().includes(searchLower)) ||
        (transaction.studioOwner && transaction.studioOwner.toLowerCase().includes(searchLower)) ||
        (transaction.iban && transaction.iban.toLowerCase().includes(searchLower)) ||
        (transaction.mandateNumber && transaction.mandateNumber.toLowerCase().includes(searchLower))
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(transaction.status)
      return matchesSearch && matchesStatus
    })
    setFilteredTransactions(filtered)
  }, [searchTerm, selectedPeriod, selectedStatuses, customDateRange, financialState])

  useEffect(() => {
    const handleClickOutside = (event) => { if (window.innerWidth < 768) return; if (periodDropdownRef.current && !periodDropdownRef.current.contains(event.target)) { setPeriodDropdownOpen(false); setIsCustomPeriodExpanded(false) } };
    document.addEventListener("mousedown", handleClickOutside); document.addEventListener("touchstart", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside); document.removeEventListener("touchstart", handleClickOutside) }
  }, [])

  const sortedTransactions = useMemo(() => {
    const sorted = [...filteredTransactions].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "studio": comparison = (a.studioName || "").localeCompare(b.studioName || ""); break;
        case "accountHolder": comparison = (a.studioOwner || "").localeCompare(b.studioOwner || ""); break;
        case "date": comparison = new Date(a.date) - new Date(b.date); break;
        case "type": comparison = a.type.localeCompare(b.type); break;
        case "amount": comparison = a.amount - b.amount; break;
        case "status": comparison = a.status.localeCompare(b.status); break;
        case "iban": comparison = (a.iban || "").localeCompare(b.iban || ""); break;
        case "mandate": comparison = (a.mandateNumber || "").localeCompare(b.mandateNumber || ""); break;
        default: comparison = 0
      }
      return sortDirection === "asc" ? comparison : -comparison
    });
    return sorted
  }, [filteredTransactions, sortBy, sortDirection])

  const formatCurrency = (amount) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
  const formatDate = (dateString) => { const date = new Date(dateString); return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) }
  const formatDateForDisplay = (dateString) => { const date = new Date(dateString); return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}` }

  const handleShowServices = (services, studioName) => { setSelectedServices(services); setSelectedStudioName(studioName); setServicesModalOpen(true) }
  const handleApplyInlineCustomPeriod = () => { if (inlineCustomDates.startDate && inlineCustomDates.endDate) { setSelectedPeriod(`Custom: ${formatDateForDisplay(inlineCustomDates.startDate)} - ${formatDateForDisplay(inlineCustomDates.endDate)}`); setCustomDateRange({ start: inlineCustomDates.startDate, end: inlineCustomDates.endDate }); setPeriodDropdownOpen(false); setIsCustomPeriodExpanded(false) } }
  const handleCustomPeriodClick = () => { const today = new Date().toISOString().split("T")[0]; setInlineCustomDates((prev) => ({ startDate: prev.startDate || today, endDate: prev.endDate || today })); setIsCustomPeriodExpanded(true) }
  const handleSelectPeriod = (period) => { setSelectedPeriod(period); setCustomDateRange(null); setIsCustomPeriodExpanded(false); setPeriodDropdownOpen(false) }
  const handleDeletePaymentRun = (runId) => { setPaymentRuns((prev) => prev.filter((run) => run.id !== runId)) }

  const handleGenerateXml = (selectedTransactions, period, shouldDownload = true, paymentRunData = null) => {
    const updatedFinancialState = { ...financialState }
    const selectedIds = selectedTransactions.map(tx => tx.id)
    const selectedAmounts = {}; selectedTransactions.forEach(tx => { selectedAmounts[tx.id] = tx.amount });

    Object.keys(updatedFinancialState).forEach(periodKey => {
      if (!updatedFinancialState[periodKey]?.transactions) return;
      const periodData = { ...updatedFinancialState[periodKey] }; let hasChanges = false;
      periodData.transactions = periodData.transactions.map((tx) => { if (selectedIds.includes(tx.id)) { hasChanges = true; return { ...tx, status: "Check incoming funds", amount: selectedAmounts[tx.id] || tx.amount } } return tx });
      if (hasChanges) {
        const successful = periodData.transactions.filter((tx) => tx.status === "Successful").reduce((sum, tx) => sum + tx.amount, 0)
        const pending = periodData.transactions.filter((tx) => tx.status === "Pending").reduce((sum, tx) => sum + tx.amount, 0)
        const checkingFunds = periodData.transactions.filter((tx) => tx.status === "Check incoming funds").reduce((sum, tx) => sum + tx.amount, 0)
        const failed = periodData.transactions.filter((tx) => tx.status === "Failed").reduce((sum, tx) => sum + tx.amount, 0)
        periodData.successfulPayments = successful; periodData.pendingPayments = pending; periodData.checkingFunds = checkingFunds; periodData.failedPayments = failed;
        updatedFinancialState[periodKey] = periodData
      }
    })
    setFinancialState(updatedFinancialState)

    const totalAmount = selectedTransactions.reduce((sum, tx) => sum + tx.amount, 0)
    const fileName = `sepa_payment_${period.replace(/\s+/g, "_")}_${new Date().toISOString().split('T')[0]}.xml`

    if (paymentRunData) {
      setPaymentRuns(prev => [paymentRunData, ...prev])
    }

    setShouldAutoDownload(shouldDownload)
    setGeneratedFileInfo({ fileName, transactionCount: selectedTransactions.length, totalAmount })
    setSepaSuccessModalOpen(true)
  }

  const handleUpdateStatuses = (updatedTransactions) => {
    const updatedFinancialState = { ...financialState }
    const updatedMap = {}; updatedTransactions.forEach(tx => { updatedMap[tx.id] = tx.status });
    Object.keys(updatedFinancialState).forEach(periodKey => {
      if (!updatedFinancialState[periodKey]?.transactions) return;
      const periodData = { ...updatedFinancialState[periodKey] }; let hasChanges = false;
      periodData.transactions = periodData.transactions.map((tx) => { if (updatedMap[tx.id]) { hasChanges = true; return { ...tx, status: updatedMap[tx.id] } } return tx });
      if (hasChanges) {
        const successful = periodData.transactions.filter((tx) => tx.status === "Successful").reduce((sum, tx) => sum + tx.amount, 0)
        const pending = periodData.transactions.filter((tx) => tx.status === "Pending").reduce((sum, tx) => sum + tx.amount, 0)
        const checkingFunds = periodData.transactions.filter((tx) => tx.status === "Check incoming funds").reduce((sum, tx) => sum + tx.amount, 0)
        const failed = periodData.transactions.filter((tx) => tx.status === "Failed").reduce((sum, tx) => sum + tx.amount, 0)
        periodData.successfulPayments = successful; periodData.pendingPayments = pending; periodData.checkingFunds = checkingFunds; periodData.failedPayments = failed;
        updatedFinancialState[periodKey] = periodData
      }
    })
    setFinancialState(updatedFinancialState); setSuccessMessage("Transaction statuses updated successfully!"); setSuccessModalOpen(true)
  }

  const hasCheckingTransactionsAnyPeriod = useMemo(() => Object.values(financialState).some(periodData => periodData?.transactions?.some((tx) => tx.status === "Check incoming funds")), [financialState])

  const getStatusColorClass = (status) => {
    switch (status) {
      case "Successful": return "bg-[#10b981] text-white";
      case "Pending": return "bg-[#f59e0b] text-white";
      case "Check incoming funds": return "bg-[#3b82f6] text-white";
      case "Failed": return "bg-[#ef4444] text-white";
      default: return "bg-gray-500 text-white"
    }
  }

  const getCurrentPeriodData = () => {
    const defaultData = { totalRevenue: 0, successfulPayments: 0, pendingPayments: 0, checkingFunds: 0, failedPayments: 0, transactions: [] }
    if (customDateRange && selectedPeriod.startsWith("Custom")) {
      const allTransactions = Object.values(financialState).flatMap((period) => period?.transactions || [])
      const customTransactions = allTransactions.filter((transaction) => { const transactionDate = new Date(transaction.date); const startDate = new Date(customDateRange.start); const endDate = new Date(customDateRange.end); return transactionDate >= startDate && transactionDate <= endDate })
      const successful = customTransactions.filter((tx) => tx.status === "Successful").reduce((sum, tx) => sum + tx.amount, 0)
      const pending = customTransactions.filter((tx) => tx.status === "Pending").reduce((sum, tx) => sum + tx.amount, 0)
      const checkingFunds = customTransactions.filter((tx) => tx.status === "Check incoming funds").reduce((sum, tx) => sum + tx.amount, 0)
      const failed = customTransactions.filter((tx) => tx.status === "Failed").reduce((sum, tx) => sum + tx.amount, 0)
      return { totalRevenue: successful + pending + checkingFunds + failed, successfulPayments: successful, pendingPayments: pending, checkingFunds: checkingFunds, failedPayments: failed, transactions: customTransactions }
    }
    const periodData = financialState[selectedPeriod] || defaultData
    if (periodData.transactions) {
      const checkingFunds = periodData.transactions.filter((tx) => tx.status === "Check incoming funds").reduce((sum, tx) => sum + tx.amount, 0)
      const pending = periodData.transactions.filter((tx) => tx.status === "Pending").reduce((sum, tx) => sum + tx.amount, 0)
      return { ...periodData, pendingPayments: pending, checkingFunds: checkingFunds }
    }
    return periodData
  }

  const currentPeriodData = getCurrentPeriodData()
  const toggleStatusFilter = (statusId) => { setSelectedStatuses(prev => prev.includes(statusId) ? prev.filter(s => s !== statusId) : [...prev, statusId]) }

  return (
    <div className="min-h-screen rounded-3xl bg-[#1C1C1C] text-white md:p-6 p-3 transition-all duration-500 ease-in-out flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl text-white font-bold">Finances</h1>
          {/* Payment Runs Button */}
          <button onClick={() => setPaymentRunsModalOpen(true)} className="bg-black text-white p-2 rounded-xl border border-gray-800 hover:bg-[#2F2F2F]/90 transition-colors relative" title="View Payment Run History">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            {paymentRuns.length > 0 && (<span className="absolute -top-2 -right-2 bg-gray-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{paymentRuns.length}</span>)}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative" ref={periodDropdownRef}>
            <button onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)} className="bg-[#141414] text-white px-3 sm:px-4 py-2 rounded-xl border border-[#333333] hover:border-[#3F74FF] flex items-center gap-2 text-xs sm:text-sm transition-colors">
              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className={`hidden sm:inline ${selectedPeriod.startsWith("Custom:") ? '' : 'truncate max-w-[120px]'}`}>{selectedPeriod}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${periodDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {periodDropdownOpen && (
              <div className="hidden md:block absolute right-0 z-40 mt-2 min-w-[320px] bg-[#1F1F1F] border border-gray-700 rounded-xl shadow-lg overflow-hidden top-full">
                <div className="py-1">
                  <div className="px-3 py-1.5 text-xs text-gray-500 font-medium border-b border-gray-700">Select Period</div>
                  {Object.keys(financialState).map((period) => (<button key={period} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-800 transition-colors ${selectedPeriod === period && !selectedPeriod.startsWith("Custom:") ? 'text-white bg-gray-800/50' : 'text-gray-300'}`} onClick={() => handleSelectPeriod(period)}>{period}</button>))}
                </div>
                <div className="border-t border-gray-700">
                  <button className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-800 transition-colors flex items-center gap-2 ${isCustomPeriodExpanded || selectedPeriod.startsWith("Custom:") ? 'text-white bg-gray-800/50' : 'text-gray-300'}`} onClick={handleCustomPeriodClick}><Calendar className="w-4 h-4" />Custom Period</button>
                  {isCustomPeriodExpanded && (
                    <div className="px-4 py-3 bg-[#141414] border-t border-gray-700">
                      <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div><label className="block text-xs text-gray-500 mb-1">Start Date</label><input type="date" value={inlineCustomDates.startDate} onChange={(e) => setInlineCustomDates((prev) => ({ ...prev, startDate: e.target.value }))} className="w-full bg-[#1C1C1C] text-white px-3 py-2 rounded-lg border border-gray-700 text-sm focus:border-[#3F74FF] focus:outline-none white-calendar-icon" /></div>
                          <div><label className="block text-xs text-gray-500 mb-1">End Date</label><input type="date" value={inlineCustomDates.endDate} onChange={(e) => setInlineCustomDates((prev) => ({ ...prev, endDate: e.target.value }))} className="w-full bg-[#1C1C1C] text-white px-3 py-2 rounded-lg border border-gray-700 text-sm focus:border-[#3F74FF] focus:outline-none white-calendar-icon" /></div>
                        </div>
                        <button onClick={handleApplyInlineCustomPeriod} disabled={!inlineCustomDates.startDate || !inlineCustomDates.endDate} className="w-full py-2 bg-[#3F74FF] text-white rounded-lg text-sm hover:bg-[#3F74FF]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Apply</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <button onClick={() => setSepaModalOpen(true)} className="hidden md:flex bg-[#3F74FF] hover:bg-[#3F74FF]/90 text-white px-3 sm:px-4 py-2 rounded-xl items-center gap-2 text-xs sm:text-sm transition-colors"><Play className="w-4 h-4" /><span className="hidden lg:inline">Run Payment</span></button>
          {hasCheckingTransactionsAnyPeriod && (<button onClick={() => setCheckFundsModalOpen(true)} className="hidden md:flex bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white px-3 sm:px-4 py-2 rounded-xl items-center gap-2 text-xs sm:text-sm transition-colors"><RefreshCw className="w-4 h-4" /><span className="hidden lg:inline">Check Funds</span></button>)}
        </div>
      </div>

      {/* Mobile Period Dropdown */}
      {periodDropdownOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={(e) => { if (e.target === e.currentTarget) { setPeriodDropdownOpen(false); setIsCustomPeriodExpanded(false) } }}>
          <div data-mobile-period-modal className="bg-[#1F1F1F] border border-gray-700 rounded-xl shadow-lg w-[90%] max-w-[340px] max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700"><span className="text-white font-medium">Select Period</span><button type="button" onClick={() => { setPeriodDropdownOpen(false); setIsCustomPeriodExpanded(false) }} className="text-gray-400 hover:text-white p-1 touch-manipulation"><X className="w-5 h-5" /></button></div>
            <div className="py-1 max-h-[40vh] overflow-y-auto">{Object.keys(financialState).map((period) => (<button type="button" key={period} className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-800 active:bg-gray-700 transition-colors touch-manipulation ${selectedPeriod === period && !selectedPeriod.startsWith("Custom:") ? 'text-white bg-[#3F74FF]' : 'text-gray-300'}`} onClick={() => { setSelectedPeriod(period); setCustomDateRange(null); setIsCustomPeriodExpanded(false); setPeriodDropdownOpen(false) }}>{period}</button>))}</div>
            <div className="border-t border-gray-700">
              <button type="button" className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-800 active:bg-gray-700 transition-colors flex items-center gap-2 touch-manipulation ${isCustomPeriodExpanded || selectedPeriod.startsWith("Custom:") ? 'text-white bg-[#3F74FF]' : 'text-gray-300'}`} onClick={() => { const today = new Date().toISOString().split("T")[0]; setInlineCustomDates((prev) => ({ startDate: prev.startDate || today, endDate: prev.endDate || today })); setIsCustomPeriodExpanded(!isCustomPeriodExpanded) }}><Calendar className="w-4 h-4" />Custom Period</button>
              {isCustomPeriodExpanded && (
                <div className="px-4 py-3 bg-[#141414] border-t border-gray-700">
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="block text-xs text-gray-500 mb-1">Start Date</label><input type="date" value={inlineCustomDates.startDate} onChange={(e) => setInlineCustomDates((prev) => ({ ...prev, startDate: e.target.value }))} className="w-full bg-[#1C1C1C] text-white px-3 py-2 rounded-lg border border-gray-700 text-sm focus:border-[#3F74FF] focus:outline-none white-calendar-icon touch-manipulation" /></div>
                      <div><label className="block text-xs text-gray-500 mb-1">End Date</label><input type="date" value={inlineCustomDates.endDate} onChange={(e) => setInlineCustomDates((prev) => ({ ...prev, endDate: e.target.value }))} className="w-full bg-[#1C1C1C] text-white px-3 py-2 rounded-lg border border-gray-700 text-sm focus:border-[#3F74FF] focus:outline-none white-calendar-icon touch-manipulation" /></div>
                    </div>
                    <button type="button" onClick={() => { if (inlineCustomDates.startDate && inlineCustomDates.endDate) { setCustomDateRange({ start: inlineCustomDates.startDate, end: inlineCustomDates.endDate }); setSelectedPeriod(`Custom: ${formatDateForDisplay(inlineCustomDates.startDate)} - ${formatDateForDisplay(inlineCustomDates.endDate)}`); setIsCustomPeriodExpanded(false); setPeriodDropdownOpen(false) } }} disabled={!inlineCustomDates.startDate || !inlineCustomDates.endDate} className="w-full py-2.5 bg-[#3F74FF] text-white rounded-lg text-sm hover:bg-[#3F74FF]/90 active:bg-[#3F74FF]/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation">Apply</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-4 sm:mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input type="text" placeholder="Search by studio, account holder, IBAN, or mandate..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-2 pl-9 sm:pl-10 border border-[#333333] focus:border-[#3F74FF] transition-colors" />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 mb-4 sm:mb-6 grid-cols-2 lg:grid-cols-5">
        <div className="bg-[#141414] p-3 sm:p-4 rounded-xl"><h3 className="text-gray-400 text-xs sm:text-sm mb-1">Total Revenue</h3><p className="text-white text-base sm:text-xl font-semibold">{formatCurrency(currentPeriodData.totalRevenue)}</p></div>
        <div className="bg-[#141414] p-3 sm:p-4 rounded-xl"><h3 className="text-gray-400 text-xs sm:text-sm mb-1">Successful</h3><p className="text-green-500 text-base sm:text-xl font-semibold">{formatCurrency(currentPeriodData.successfulPayments)}</p></div>
        <div className="bg-[#141414] p-3 sm:p-4 rounded-xl"><h3 className="text-gray-400 text-xs sm:text-sm mb-1">Pending</h3><p className="text-yellow-500 text-base sm:text-xl font-semibold">{formatCurrency(currentPeriodData.pendingPayments)}</p></div>
        <div className="bg-[#141414] p-3 sm:p-4 rounded-xl"><h3 className="text-gray-400 text-xs sm:text-sm mb-1">Check Funds</h3><p className="text-blue-500 text-base sm:text-xl font-semibold">{formatCurrency(currentPeriodData.checkingFunds || 0)}</p></div>
        <div className="bg-[#141414] p-3 sm:p-4 rounded-xl"><h3 className="text-gray-400 text-xs sm:text-sm mb-1">Failed</h3><p className="text-red-500 text-base sm:text-xl font-semibold">{formatCurrency(currentPeriodData.failedPayments)}</p></div>
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 items-center">
        {statusOptions.map(status => (<button key={status.id} onClick={() => toggleStatusFilter(status.id)} className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${selectedStatuses.includes(status.id) ? "text-white" : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"}`} style={{ backgroundColor: selectedStatuses.includes(status.id) ? status.color : undefined }}><span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedStatuses.includes(status.id) ? 'white' : status.color }} />{status.label}</button>))}
        {selectedStatuses.length > 0 && (<button onClick={() => setSelectedStatuses([])} className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F] flex items-center gap-1.5"><X size={12} />Clear All</button>)}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: '700px' }}>
          <table className="text-sm text-left text-gray-300 border-collapse w-full">
            <thead className="text-xs text-gray-400 uppercase bg-[#141414]">
              <tr>
                <th scope="col" className="px-1.5 md:px-3 py-2 rounded-tl-xl hover:bg-[#1C1C1C] transition-colors relative" style={{ width: `${columnWidths.studio}px`, minWidth: '60px' }}>
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("studio")}><span className="hidden md:inline">Studio Name</span><span className="md:hidden">Studio</span>{getSortIcon("studio")}</div>
                  <div className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group" onMouseDown={(e) => handleResizeMouseDown(e, 'studio')} style={{ touchAction: 'none' }}><div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-gray-600 group-hover:bg-[#3F74FF] transition-colors" /></div>
                </th>
                <th scope="col" className="px-1.5 md:px-3 py-2 hover:bg-[#1C1C1C] transition-colors relative" style={{ width: `${columnWidths.accountHolder}px`, minWidth: '60px' }}>
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("accountHolder")}><span className="hidden md:inline">Account Holder</span><span className="md:hidden">Holder</span>{getSortIcon("accountHolder")}</div>
                  <div className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group" onMouseDown={(e) => handleResizeMouseDown(e, 'accountHolder')} style={{ touchAction: 'none' }}><div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-gray-600 group-hover:bg-[#3F74FF] transition-colors" /></div>
                </th>
                <th scope="col" className="px-1.5 md:px-3 py-2 hover:bg-[#1C1C1C] transition-colors relative" style={{ width: `${columnWidths.amount}px`, minWidth: '40px' }}>
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("amount")}><span className="hidden md:inline">Amount</span><span className="md:hidden">Amt</span>{getSortIcon("amount")}</div>
                  <div className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group" onMouseDown={(e) => handleResizeMouseDown(e, 'amount')} style={{ touchAction: 'none' }}><div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-gray-600 group-hover:bg-[#3F74FF] transition-colors" /></div>
                </th>
                <th scope="col" className="px-1.5 md:px-2 py-2 relative" style={{ width: `${columnWidths.services}px`, minWidth: '25px' }}>
                  <span className="hidden md:inline">Services</span><span className="md:hidden">Svc</span>
                  <div className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group" onMouseDown={(e) => handleResizeMouseDown(e, 'services')} style={{ touchAction: 'none' }}><div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-gray-600 group-hover:bg-[#3F74FF] transition-colors" /></div>
                </th>
                <th scope="col" className="px-1.5 md:px-3 py-2 cursor-pointer hover:bg-[#1C1C1C] transition-colors relative" style={{ width: `${columnWidths.status}px`, minWidth: '40px' }} onClick={() => handleSort("status")}>
                  <div className="flex items-center gap-1"><span className="hidden md:inline">Status</span><span className="md:hidden">St.</span>{getSortIcon("status")}</div>
                  <div className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group" onMouseDown={(e) => handleResizeMouseDown(e, 'status')} style={{ touchAction: 'none' }}><div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-gray-600 group-hover:bg-[#3F74FF] transition-colors" /></div>
                </th>
                <th scope="col" className="px-1.5 md:px-3 py-2 hover:bg-[#1C1C1C] transition-colors relative" style={{ width: `${columnWidths.iban}px`, minWidth: '60px' }}>
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("iban")}>IBAN {getSortIcon("iban")}</div>
                  <div className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group" onMouseDown={(e) => handleResizeMouseDown(e, 'iban')} style={{ touchAction: 'none' }}><div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-gray-600 group-hover:bg-[#3F74FF] transition-colors" /></div>
                </th>
                <th scope="col" className="px-1.5 md:px-3 py-2 hover:bg-[#1C1C1C] transition-colors relative" style={{ width: `${columnWidths.mandate}px`, minWidth: '50px' }}>
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("mandate")}><span className="hidden md:inline">Mandate Number</span><span className="md:hidden">Mandate</span>{getSortIcon("mandate")}</div>
                  <div className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group" onMouseDown={(e) => handleResizeMouseDown(e, 'mandate')} style={{ touchAction: 'none' }}><div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-gray-600 group-hover:bg-[#3F74FF] transition-colors" /></div>
                </th>
                <th scope="col" className="px-1.5 md:px-3 py-2 hover:bg-[#1C1C1C] transition-colors relative" style={{ width: `${columnWidths.date}px`, minWidth: '50px' }}>
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("date")}>Date {getSortIcon("date")}</div>
                  <div className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group" onMouseDown={(e) => handleResizeMouseDown(e, 'date')} style={{ touchAction: 'none' }}><div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-gray-600 group-hover:bg-[#3F74FF] transition-colors" /></div>
                </th>
                <th scope="col" className="px-1.5 md:px-3 py-2 rounded-tr-xl hover:bg-[#1C1C1C] transition-colors relative" style={{ width: `${columnWidths.type}px`, minWidth: '40px' }}>
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("type")}>Type {getSortIcon("type")}</div>
                  <div className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize z-20 group" onMouseDown={(e) => handleResizeMouseDown(e, 'type')} style={{ touchAction: 'none' }}><div className="absolute right-1 top-1/4 bottom-1/4 w-0.5 bg-gray-600 group-hover:bg-[#3F74FF] transition-colors" /></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((transaction, index) => (
                <tr key={transaction.id} className={`border-b border-gray-800 ${index === sortedTransactions.length - 1 ? "rounded-b-xl" : ""}`}>
                  <td className="px-1.5 md:px-3 py-2 text-xs truncate">{transaction.studioName}</td>
                  <td className="px-1.5 md:px-3 py-2 text-xs truncate">{transaction.studioOwner}</td>
                  <td className="px-1.5 md:px-3 py-2 text-xs">{formatCurrency(transaction.amount)}</td>
                  <td className="px-1.5 md:px-2 py-2"><button onClick={() => handleShowServices(transaction.services, transaction.studioName)} className="text-blue-400 hover:text-blue-300"><Info className="w-3.5 h-3.5" /></button></td>
                  <td className="px-1.5 md:px-3 py-2"><span className={`md:hidden px-1.5 py-0.5 rounded text-xs font-medium ${getStatusColorClass(transaction.status)}`}>{transaction.status === "Successful" ? "S" : transaction.status === "Pending" ? "P" : transaction.status === "Failed" ? "F" : "C"}</span><span className={`hidden md:inline px-2 py-1 rounded-lg text-xs font-medium ${getStatusColorClass(transaction.status)}`}>{transaction.status}</span></td>
                  <td className="px-1.5 md:px-3 py-2 text-xs"><MaskedIban iban={transaction.iban || "DE89370400440532013000"} /></td>
                  <td className="px-1.5 md:px-3 py-2 text-xs truncate">{transaction.mandateNumber || `MNDT-${transaction.id.toString().padStart(6, '0')}`}</td>
                  <td className="px-1.5 md:px-3 py-2 text-xs">{formatDate(transaction.date)}</td>
                  <td className="px-1.5 md:px-3 py-2 text-xs truncate">{transaction.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {sortedTransactions.length === 0 && (<div className="bg-[#141414] p-4 md:p-6 rounded-xl text-center mt-3 md:mt-4"><p className="text-gray-400 text-sm md:text-base">No transactions found matching your criteria.</p></div>)}

      {/* Modals */}
      <SepaXmlModal
        isOpen={sepaModalOpen}
        onClose={() => setSepaModalOpen(false)}
        selectedPeriod={selectedPeriod}
        transactions={currentPeriodData.transactions}
        onGenerateXml={handleGenerateXml}
        financialData={financialState}
        currentUser="Admin"
        creditorInfo={defaultCreditorInfo}
      />

      <PaymentRunsModal
        isOpen={paymentRunsModalOpen}
        onClose={() => setPaymentRunsModalOpen(false)}
        paymentRuns={paymentRuns}
        onDeletePaymentRun={handleDeletePaymentRun}
      />

      <CheckFundsModal
        isOpen={checkFundsModalOpen}
        onClose={() => setCheckFundsModalOpen(false)}
        transactions={currentPeriodData.transactions}
        onUpdateStatuses={handleUpdateStatuses}
        financialState={financialState}
      />

      <ServicesModal
        isOpen={servicesModalOpen}
        onClose={() => setServicesModalOpen(false)}
        services={selectedServices}
        studioName={selectedStudioName}
      />

      <SepaXmlSuccessModal
        isOpen={sepaSuccessModalOpen}
        onClose={() => setSepaSuccessModalOpen(false)}
        fileName={generatedFileInfo.fileName}
        transactionCount={generatedFileInfo.transactionCount}
        totalAmount={generatedFileInfo.totalAmount}
        shouldAutoDownload={shouldAutoDownload}
      />

      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="Success"
        message={successMessage}
        buttonText="Continue"
      />

      {/* Floating Action Buttons - Mobile */}
      <div className="md:hidden fixed bottom-4 right-4 flex flex-col gap-3 z-30">
        {hasCheckingTransactionsAnyPeriod && (<button onClick={() => setCheckFundsModalOpen(true)} className="bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white p-4 rounded-xl shadow-lg transition-all active:scale-95" aria-label="Check Incoming Funds"><RefreshCw size={22} /></button>)}
        <button onClick={() => setSepaModalOpen(true)} className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 text-white p-4 rounded-xl shadow-lg transition-all active:scale-95" aria-label="Run Payment"><Play size={22} /></button>
      </div>
    </div>
  )
}
