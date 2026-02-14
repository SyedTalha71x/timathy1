/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X, FileText, Download, Calendar, ChevronDown, ArrowUp, ArrowDown, ArrowUpDown, Info, Search } from "lucide-react"
import { useEffect, useState, useRef, useMemo } from "react"
import * as XLSX from 'xlsx'
import CancelSaleConfirmationModal from "./cancel-sale-confirmation-modal"
import InvoicePreviewModal from "./invoice-preview-modal"
import DatePickerField from "../../shared/DatePickerField"

// Export Confirmation Modal Component
const ExportConfirmationModal = ({ isOpen, onClose, onConfirm, salesCount, totalAmount, selectedPeriod }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[10000002] p-4">
      <div className="bg-surface-base rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-content-primary text-lg font-medium">Confirm Export</h2>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mb-6">
          <p className="text-content-secondary mb-4">Are you sure you want to export the sales data as Excel?</p>
          
          {/* Export Details */}
          <div className="space-y-2">
            {/* Selected Period Display */}
            <div className="bg-surface-dark p-3 rounded-lg flex items-center gap-3">
              <Calendar className="w-4 h-4 text-content-muted" />
              <div>
                <p className="text-content-muted text-xs">Export Period</p>
                <p className="text-content-primary text-sm font-medium">{selectedPeriod || "Overall"}</p>
              </div>
            </div>
            
            {/* Record Count Display */}
            <div className="bg-surface-dark p-3 rounded-lg flex items-center gap-3">
              <FileText className="w-4 h-4 text-content-muted" />
              <div>
                <p className="text-content-muted text-xs">Records</p>
                <p className="text-content-primary text-sm font-medium">{salesCount} {salesCount === 1 ? 'transaction' : 'transactions'}</p>
              </div>
            </div>

            {/* Total Amount Display */}
            <div className="bg-surface-dark p-3 rounded-lg flex items-center gap-3">
              <Download className="w-4 h-4 text-content-muted" />
              <div>
                <p className="text-content-muted text-xs">Total Amount</p>
                <p className="text-content-primary text-sm font-medium">${totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-surface-button text-content-secondary px-4 py-2.5 rounded-xl hover:bg-surface-button-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="flex-1 bg-surface-button text-content-secondary px-4 py-2.5 rounded-xl hover:bg-surface-dark transition-colors"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  )
}

const SalesJournalModal = ({ salesHistory, onClose, cancelSale, downloadInvoice, salesFilter, setSalesFilter }) => {
  const [filteredSales, setFilteredSales] = useState(salesHistory)
  const [saleToCancel, setSaleToCancel] = useState(null)
  const [invoiceToView, setInvoiceToView] = useState(null)
  const [exportModalOpen, setExportModalOpen] = useState(false)
  
  // Period picker state
  const [selectedPeriod, setSelectedPeriod] = useState("Overall")
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false)
  const [isCustomPeriodExpanded, setIsCustomPeriodExpanded] = useState(false)
  const [customDates, setCustomDates] = useState({ startDate: "", endDate: "" })
  const [customDateRange, setCustomDateRange] = useState(null)
  const periodDropdownRef = useRef(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  
  // Member search state (like members.jsx)
  const [memberSearchQuery, setMemberSearchQuery] = useState("")
  const [showMemberDropdown, setShowMemberDropdown] = useState(false)
  const [showNoMembersOnly, setShowNoMembersOnly] = useState(false)
  const memberSearchRef = useRef(null)
  const memberInputRef = useRef(null)
  
  // Sorting state
  const [sortBy, setSortBy] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")
  
  // VAT tooltip state for mobile touch support
  const [activeVatTooltip, setActiveVatTooltip] = useState(null)

  // Period options
  const periodOptions = ["Overall", "Today", "This Week", "This Month", "Last Month", "This Year"]

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        // Close sub-modals first, then main modal
        if (activeVatTooltip) {
          setActiveVatTooltip(null)
          return
        }
        if (periodDropdownOpen) {
          setPeriodDropdownOpen(false)
          setIsCustomPeriodExpanded(false)
          return
        }
        if (invoiceToView) {
          setInvoiceToView(null)
          return
        }
        if (saleToCancel) {
          setSaleToCancel(null)
          return
        }
        if (exportModalOpen) {
          setExportModalOpen(false)
          return
        }
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [activeVatTooltip, periodDropdownOpen, invoiceToView, saleToCancel, exportModalOpen, onClose])
  
  // Close VAT tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeVatTooltip && !e.target.closest('.vat-tooltip-trigger')) {
        setActiveVatTooltip(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [activeVatTooltip])

  // Update dropdown position when opening
  useEffect(() => {
    if (periodDropdownOpen && periodDropdownRef.current) {
      const rect = periodDropdownRef.current.getBoundingClientRect()
      const isMobile = window.innerWidth < 640 // sm breakpoint
      
      if (isMobile) {
        // Center on mobile
        setDropdownPosition({
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          isMobile: true
        })
      } else {
        setDropdownPosition({
          top: rect.bottom + 8,
          left: Math.min(rect.left, window.innerWidth - 360),
          transform: 'none',
          isMobile: false
        })
      }
    }
  }, [periodDropdownOpen])

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  const getDateRangeFromPeriod = (period) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    switch (period) {
      case "Today":
        return { start: today, end: today }
      case "This Week": {
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        return { start: startOfWeek, end: endOfWeek }
      }
      case "This Month": {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        return { start: startOfMonth, end: endOfMonth }
      }
      case "Last Month": {
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
        return { start: startOfLastMonth, end: endOfLastMonth }
      }
      case "This Year": {
        const startOfYear = new Date(now.getFullYear(), 0, 1)
        const endOfYear = new Date(now.getFullYear(), 11, 31)
        return { start: startOfYear, end: endOfYear }
      }
      default:
        return null // "Overall" - no date filter
    }
  }

  // Get unique member names for autocomplete suggestions
  const getMemberSuggestions = () => {
    if (!memberSearchQuery.trim()) return []
    const uniqueMembers = [...new Set(salesHistory.map(s => s.member))].filter(m => m !== "No Member")
    return uniqueMembers
      .filter(m => m.toLowerCase().includes(memberSearchQuery.toLowerCase()))
      .filter(m => m.toLowerCase() !== salesFilter.member.toLowerCase())
      .slice(0, 6)
  }

  // Close member dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (memberSearchRef.current && !memberSearchRef.current.contains(e.target)) {
        setShowMemberDropdown(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  useEffect(() => {
    let filtered = salesHistory

    // Filter by type
    if (salesFilter.type !== "all") {
      filtered = filtered.filter((sale) =>
        sale.items.some((item) => (item.type || "").toLowerCase() === salesFilter.type.toLowerCase()),
      )
    }

    // Filter by member
    if (salesFilter.member) {
      filtered = filtered.filter((sale) => sale.member.toLowerCase().includes(salesFilter.member.toLowerCase()))
    }

    // Filter: show only "No Member" sales
    if (showNoMembersOnly) {
      filtered = filtered.filter((sale) => sale.member === "No Member")
    }

    // Filter by period/date range
    if (selectedPeriod !== "Overall") {
      if (selectedPeriod.startsWith("Custom:") && customDateRange) {
        filtered = filtered.filter((sale) => {
          const saleDate = new Date(sale.date)
          return saleDate >= new Date(customDateRange.start) && saleDate <= new Date(customDateRange.end)
        })
      } else {
        const dateRange = getDateRangeFromPeriod(selectedPeriod)
        if (dateRange) {
          filtered = filtered.filter((sale) => {
            const saleDate = new Date(sale.date)
            return saleDate >= dateRange.start && saleDate <= dateRange.end
          })
        }
      }
    }

    setFilteredSales(filtered)
  }, [salesHistory, salesFilter, selectedPeriod, customDateRange, showNoMembersOnly])

  // Handle sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (column) => {
    if (sortBy !== column) {
      return <ArrowUpDown size={14} className="text-content-faint" />
    }
    return sortDirection === "asc" 
      ? <ArrowUp size={14} className="text-content-primary" />
      : <ArrowDown size={14} className="text-content-primary" />
  }

  // Sort filtered sales
  const sortedSales = useMemo(() => {
    const sorted = [...filteredSales].sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case "member":
          comparison = a.member.localeCompare(b.member)
          break
        case "date":
          comparison = new Date(a.date) - new Date(b.date)
          break
        case "items":
          // Sort by first item name
          const aFirstItem = a.items[0]?.name || ""
          const bFirstItem = b.items[0]?.name || ""
          comparison = aFirstItem.localeCompare(bFirstItem)
          break
        case "type":
          // Sort by first item type
          const aFirstType = a.items[0]?.type || ""
          const bFirstType = b.items[0]?.type || ""
          comparison = aFirstType.localeCompare(bFirstType)
          break
        case "total":
          comparison = a.totalAmount - b.totalAmount
          break
        case "payment":
          comparison = a.paymentMethod.localeCompare(b.paymentMethod)
          break
        case "staff":
          // Sort by staff name
          const aStaff = a.soldBy || ''
          const bStaff = b.soldBy || ''
          comparison = aStaff.localeCompare(bStaff)
          break
        default:
          comparison = 0
      }
      
      return sortDirection === "asc" ? comparison : -comparison
    })
    
    return sorted
  }, [filteredSales, sortBy, sortDirection])

  // Calculate total amount for export modal
  const totalAmount = useMemo(() => {
    return sortedSales.reduce((sum, sale) => sum + sale.totalAmount, 0)
  }, [sortedSales])

  const handleExportToExcel = () => {
    // Helper function to calculate VAT
    const calculateVat = (sale) => {
      if (sale.vatApplied !== undefined) return Math.abs(sale.vatApplied)
      let totalVat = 0
      sale.items.forEach(item => {
        const itemTotal = Math.abs(item.price || 0) * item.quantity
        const vatRate = item.vatRate || 19
        const vatAmount = itemTotal * vatRate / (100 + vatRate)
        totalVat += vatAmount
      })
      return totalVat
    }

    // Prepare data for Excel
    const excelData = sortedSales.map((sale) => {
      const vatAmount = calculateVat(sale)
      const status = sale.isCancellation ? 'CANCELLATION' : sale.isCancelled ? 'CANCELLED' : 'Active'
      const netValue = (Math.abs(sale.totalAmount) - vatAmount) * (sale.totalAmount < 0 ? -1 : 1)
      const vatValue = vatAmount * (sale.totalAmount < 0 ? -1 : 1)
      
      return {
        "Status": status,
        "Member": sale.member,
        "Member Type": sale.memberType,
        "Date": sale.date,
        "Items": sale.items.map((item) => `${item.name} x${item.quantity}`).join(" | "),
        "Type": sale.items.map((item) => item.type).join(" | "),
        "Net": Math.round(netValue * 100) / 100,
        "VAT": Math.round(vatValue * 100) / 100,
        "Total": Math.round(sale.totalAmount * 100) / 100,
        "Payment Method": sale.paymentMethod,
        "Staff": sale.soldBy || "-",
        "Invoice Number": sale.invoiceNumber || "-",
      }
    })

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(excelData)

    // Set column widths for better readability
    worksheet['!cols'] = [
      { wch: 14 },  // Status
      { wch: 20 },  // Member
      { wch: 15 },  // Member Type
      { wch: 20 },  // Date
      { wch: 40 },  // Items
      { wch: 15 },  // Type
      { wch: 12 },  // Net
      { wch: 12 },  // VAT
      { wch: 12 },  // Total
      { wch: 15 },  // Payment Method
      { wch: 18 },  // Staff
      { wch: 18 },  // Invoice Number
    ]

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Journal")

    // Generate filename and download
    const fileName = `sales-journal_${selectedPeriod.replace(/[:\s]/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`
    XLSX.writeFile(workbook, fileName)
    setExportModalOpen(false)
  }

  const handleCancelSaleClick = (sale) => {
    setSaleToCancel(sale)
  }

  const handleConfirmCancel = () => {
    if (saleToCancel) {
      cancelSale(saleToCancel.id)
      setSaleToCancel(null)
    }
  }

  const handleViewInvoice = (sale) => {
    setInvoiceToView(sale)
  }

  const handleSelectPeriod = (period) => {
    setSelectedPeriod(period)
    setCustomDateRange(null)
    setIsCustomPeriodExpanded(false)
    setPeriodDropdownOpen(false)
  }

  const handleCustomPeriodClick = (e) => {
    e.stopPropagation()
    const today = new Date().toISOString().split("T")[0]
    setCustomDates((prev) => ({
      startDate: prev.startDate || today,
      endDate: prev.endDate || today,
    }))
    setIsCustomPeriodExpanded(true)
  }

  const handleApplyCustomPeriod = (e) => {
    e.stopPropagation()
    if (customDates.startDate && customDates.endDate) {
      const formattedStart = formatDateForDisplay(customDates.startDate)
      const formattedEnd = formatDateForDisplay(customDates.endDate)
      setSelectedPeriod(`Custom: ${formattedStart} - ${formattedEnd}`)
      setCustomDateRange({
        start: customDates.startDate,
        end: customDates.endDate
      })
      setPeriodDropdownOpen(false)
      setIsCustomPeriodExpanded(false)
    }
  }

  const closeDropdown = () => {
    setPeriodDropdownOpen(false)
    setIsCustomPeriodExpanded(false)
  }

  return (
    <>
      {saleToCancel && (
        <CancelSaleConfirmationModal
          sale={saleToCancel}
          onConfirm={handleConfirmCancel}
          onClose={() => setSaleToCancel(null)}
        />
      )}

      {invoiceToView && <InvoicePreviewModal sale={invoiceToView} onClose={() => setInvoiceToView(null)} />}

      <ExportConfirmationModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onConfirm={handleExportToExcel}
        salesCount={sortedSales.length}
        totalAmount={totalAmount}
        selectedPeriod={selectedPeriod}
      />

      {/* Period Dropdown Portal - Rendered outside modal for proper z-index */}
      {periodDropdownOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[10000001] bg-black/50 sm:bg-transparent" 
            onClick={closeDropdown}
          />
          {/* Dropdown content */}
          <div 
            className="fixed bg-surface-hover border border-border rounded-xl shadow-2xl max-h-[70vh] overflow-y-auto z-[10000002] w-[calc(100%-32px)] sm:w-[340px]"
            style={dropdownPosition.isMobile ? {
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              transform: dropdownPosition.transform,
              maxWidth: '340px',
            } : {
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: '340px',
            }}
          >
            {/* Preset Periods */}
            <div className="py-1">
              <div className="px-3 py-1.5 text-xs text-content-faint font-medium border-b border-border sticky top-0 bg-surface-hover">
                Select Period
              </div>
              {periodOptions.map((period) => (
                <button
                  key={period}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-surface-hover transition-colors ${
                    selectedPeriod === period && !selectedPeriod.startsWith("Custom:")
                      ? 'text-content-primary bg-surface-dark/50' 
                      : 'text-content-secondary'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelectPeriod(period)
                  }}
                >
                  {period}
                </button>
              ))}
            </div>
            
            {/* Custom Period Section */}
            <div className="border-t border-border">
              <button
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-surface-hover transition-colors flex items-center gap-2 ${
                  isCustomPeriodExpanded || selectedPeriod.startsWith("Custom:") ? 'text-content-primary bg-surface-dark/50' : 'text-content-secondary'
                }`}
                onClick={handleCustomPeriodClick}
              >
                <Calendar className="w-4 h-4" />
                Custom Period
              </button>
              
              {isCustomPeriodExpanded && (
                <div 
                  className="px-4 py-3 bg-surface-dark border-t border-border"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-content-faint mb-1">Start Date</label>
                        <div className="flex items-center bg-surface-base px-3 py-2 rounded-lg border border-border focus-within:border-primary transition-colors">
                          <span className="flex-1 text-sm text-content-primary">
                            {customDates.startDate ? customDates.startDate.split('-').reverse().join('.') : <span className="text-content-faint">DD.MM.YYYY</span>}
                          </span>
                          <DatePickerField
                            value={customDates.startDate}
                            onChange={(v) => setCustomDates((prev) => ({ ...prev, startDate: v }))}
                            iconSize={16}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-content-faint mb-1">End Date</label>
                        <div className="flex items-center bg-surface-base px-3 py-2 rounded-lg border border-border focus-within:border-primary transition-colors">
                          <span className="flex-1 text-sm text-content-primary">
                            {customDates.endDate ? customDates.endDate.split('-').reverse().join('.') : <span className="text-content-faint">DD.MM.YYYY</span>}
                          </span>
                          <DatePickerField
                            value={customDates.endDate}
                            onChange={(v) => setCustomDates((prev) => ({ ...prev, endDate: v }))}
                            iconSize={16}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleApplyCustomPeriod}
                      disabled={!customDates.startDate || !customDates.endDate}
                      className="w-full py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000000] p-2 sm:p-4">
        <div className="bg-surface-base rounded-xl w-full max-w-[95vw] sm:max-w-6xl max-h-[95vh] sm:max-h-[90vh] flex flex-col">
          <div className="p-3 sm:p-6 border-b border-border flex-shrink-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-2xl font-bold text-content-primary">Sales Journal</h2>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setExportModalOpen(true)}
                  className="px-3 sm:px-4 py-2 bg-surface-button rounded-lg text-content-primary text-xs sm:text-sm flex items-center gap-2 hover:bg-surface-button-hover transition-colors"
                  title="Export to Excel"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Export Excel</span>
                </button>
                <button onClick={onClose} className="p-2 hover:bg-surface-hover rounded-lg text-content-primary">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
              {/* Type Filter */}
              <div>
                <label className="block text-xs sm:text-sm text-content-faint mb-1">Type</label>
                <select
                  value={salesFilter.type}
                  onChange={(e) => setSalesFilter({ ...salesFilter, type: e.target.value })}
                  className="w-full p-2.5 bg-surface-dark rounded-xl text-content-primary text-xs sm:text-sm border border-border focus:border-primary outline-none transition-colors"
                >
                  <option value="all">All Types</option>
                  <option value="service">Service</option>
                  <option value="product">Product</option>
                </select>
              </div>
              
              {/* Member Filter */}
              <div ref={memberSearchRef}>
                <label className="block text-xs sm:text-sm text-content-faint mb-1">Member</label>
                <div className="relative">
                  <div
                    className="bg-surface-dark rounded-xl px-2.5 py-2 min-h-[42px] flex flex-wrap items-center gap-1.5 border border-border focus-within:border-primary transition-colors cursor-text"
                    onClick={() => memberInputRef.current?.focus()}
                  >
                    <Search className="text-content-muted flex-shrink-0" size={14} />
                    
                    {/* Selected member chip */}
                    {salesFilter.member && (
                      <div className="flex items-center gap-1.5 bg-primary/20 border border-primary/40 rounded-lg px-2 py-0.5 text-xs">
                        <div className="w-4 h-4 rounded bg-primary flex items-center justify-center text-white text-[8px] font-semibold flex-shrink-0">
                          {salesFilter.member.split(' ')[0]?.charAt(0)}{salesFilter.member.split(' ')[1]?.charAt(0) || ''}
                        </div>
                        <span className="text-content-primary whitespace-nowrap">{salesFilter.member}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSalesFilter({ ...salesFilter, member: "" }) }}
                          className="p-0.5 hover:bg-primary/30 rounded transition-colors"
                        >
                          <X size={10} className="text-content-muted" />
                        </button>
                      </div>
                    )}
                    
                    <input
                      ref={memberInputRef}
                      type="text"
                      placeholder={salesFilter.member ? "" : "Search member..."}
                      value={memberSearchQuery}
                      onChange={(e) => { setMemberSearchQuery(e.target.value); setShowMemberDropdown(true) }}
                      onFocus={() => memberSearchQuery && setShowMemberDropdown(true)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !memberSearchQuery && salesFilter.member) {
                          setSalesFilter({ ...salesFilter, member: "" })
                        } else if (e.key === 'Escape') {
                          setShowMemberDropdown(false)
                        }
                      }}
                      className="flex-1 min-w-[60px] bg-transparent outline-none text-xs sm:text-sm text-content-primary placeholder-content-faint"
                    />
                  </div>
                  
                  {/* Autocomplete dropdown */}
                  {showMemberDropdown && memberSearchQuery.trim() && getMemberSuggestions().length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-surface-hover border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                      {getMemberSuggestions().map((name) => (
                        <button
                          key={name}
                          onClick={() => {
                            setSalesFilter({ ...salesFilter, member: name })
                            setMemberSearchQuery("")
                            setShowMemberDropdown(false)
                            setShowNoMembersOnly(false)
                          }}
                          className="w-full px-3 py-2 flex items-center gap-2 hover:bg-surface-button transition-colors text-left"
                        >
                          <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-white text-[10px] font-semibold">
                            {name.split(' ')[0]?.charAt(0)}{name.split(' ')[1]?.charAt(0) || ''}
                          </div>
                          <span className="text-sm text-content-primary">{name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {showMemberDropdown && memberSearchQuery.trim() && getMemberSuggestions().length === 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-surface-hover border border-border rounded-xl shadow-lg z-50 p-3">
                      <p className="text-xs text-content-faint text-center">No members found</p>
                    </div>
                  )}
                </div>
                
                {/* No Member toggle */}
                <button
                  onClick={() => {
                    setShowNoMembersOnly(!showNoMembersOnly)
                    if (!showNoMembersOnly) { setSalesFilter({ ...salesFilter, member: "" }); setMemberSearchQuery("") }
                  }}
                  className={`mt-1.5 text-xs px-2 py-1 rounded-lg transition-colors ${
                    showNoMembersOnly 
                      ? 'bg-primary/20 text-primary border border-primary/40' 
                      : 'text-content-faint hover:text-content-muted'
                  }`}
                >
                  {showNoMembersOnly ? '✕ No Member filter' : 'Show No Member only'}
                </button>
              </div>
              
              {/* Period Picker */}
              <div>
                <label className="block text-xs sm:text-sm text-content-faint mb-1">Period</label>
                <div className="relative" ref={periodDropdownRef}>
                  <button
                    onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)}
                    className="w-full bg-surface-dark text-content-primary px-3 py-2.5 rounded-xl border border-border hover:border-primary flex items-center gap-2 text-xs sm:text-sm transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-content-muted flex-shrink-0" />
                    <span className="flex-1 text-left truncate">{selectedPeriod}</span>
                    <ChevronDown className={`w-4 h-4 text-content-muted flex-shrink-0 transition-transform ${periodDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto overflow-y-auto flex-1">
            <table className="w-full min-w-[900px]">
              <thead className="bg-surface-dark sticky top-0 z-10">
                <tr>
                  <th 
                    className="text-left p-2 sm:p-4 text-content-faint text-xs sm:text-sm cursor-pointer hover:bg-surface-base transition-colors"
                    onClick={() => handleSort("member")}
                  >
                    <div className="flex items-center gap-1">
                      Member {getSortIcon("member")}
                    </div>
                  </th>
                  <th 
                    className="text-left p-2 sm:p-4 text-content-faint text-xs sm:text-sm cursor-pointer hover:bg-surface-base transition-colors"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-1">
                      Date {getSortIcon("date")}
                    </div>
                  </th>
                  <th 
                    className="text-left p-2 sm:p-4 text-content-faint text-xs sm:text-sm cursor-pointer hover:bg-surface-base transition-colors"
                    onClick={() => handleSort("items")}
                  >
                    <div className="flex items-center gap-1">
                      Items {getSortIcon("items")}
                    </div>
                  </th>
                  <th 
                    className="text-left p-2 sm:p-4 text-content-faint text-xs sm:text-sm cursor-pointer hover:bg-surface-base transition-colors"
                    onClick={() => handleSort("type")}
                  >
                    <div className="flex items-center gap-1">
                      Type {getSortIcon("type")}
                    </div>
                  </th>
                  <th 
                    className="text-left p-2 sm:p-4 text-content-faint text-xs sm:text-sm cursor-pointer hover:bg-surface-base transition-colors min-w-[130px]"
                    onClick={() => handleSort("total")}
                  >
                    <div className="flex items-center gap-1">
                      Total {getSortIcon("total")}
                    </div>
                  </th>
                  <th 
                    className="text-left p-2 sm:p-4 text-content-faint text-xs sm:text-sm cursor-pointer hover:bg-surface-base transition-colors"
                    onClick={() => handleSort("payment")}
                  >
                    <div className="flex items-center gap-1">
                      Payment {getSortIcon("payment")}
                    </div>
                  </th>
                  <th 
                    className="text-left p-2 sm:p-4 text-content-faint text-xs sm:text-sm cursor-pointer hover:bg-surface-base transition-colors"
                    onClick={() => handleSort("staff")}
                  >
                    <div className="flex items-center gap-1">
                      Staff {getSortIcon("staff")}
                    </div>
                  </th>
                  <th className="text-left p-2 sm:p-4 text-content-faint text-xs sm:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedSales.map((sale, index) => {
                  // Calculate VAT breakdown for tooltip
                  const calculateVatBreakdown = () => {
                    let totalVat19 = 0
                    let totalVat7 = 0
                    let totalNet = 0
                    let totalGross = 0
                    
                    sale.items.forEach(item => {
                      const itemTotal = Math.abs(item.price || 0) * item.quantity
                      const vatRate = item.vatRate || 19
                      const netAmount = itemTotal / (1 + vatRate / 100)
                      const vatAmount = itemTotal - netAmount
                      
                      totalNet += netAmount
                      totalGross += itemTotal
                      if (vatRate === 7) {
                        totalVat7 += vatAmount
                      } else {
                        totalVat19 += vatAmount
                      }
                    })
                    
                    return { totalNet, totalVat19, totalVat7, totalGross }
                  }
                  
                  const vatBreakdown = calculateVatBreakdown()
                  const isCancellation = sale.isCancellation
                  const isCancelled = sale.isCancelled
                  // Open tooltip upward for last 2 entries to prevent cutoff
                  const isNearBottom = index >= sortedSales.length - 2
                  
                  return (
                  <tr 
                    key={sale.id} 
                    className={`border-b border-border hover:bg-surface-hover ${
                      isCancellation ? 'bg-red-900/20' : ''
                    } ${isCancelled ? 'text-content-faint' : ''}`}
                  >
                    <td className="p-2 sm:p-4">
                      <div className={`text-xs sm:text-sm ${isCancellation ? 'text-red-400' : isCancelled ? 'text-content-faint' : 'text-content-primary'}`}>
                        {sale.member}
                        {isCancelled && <span className="ml-2 text-xs bg-surface-button px-1.5 py-0.5 rounded">CANCELLED</span>}
                      </div>
                      {sale.member !== "No Member" && sale.memberType !== "N/A" && (
                        <div className={`text-xs ${isCancelled ? 'text-content-faint' : 'text-content-faint'}`}>{sale.memberType}</div>
                      )}
                    </td>
                    <td className={`p-2 sm:p-4 text-xs sm:text-sm ${isCancelled ? 'text-content-faint' : 'text-content-secondary'}`}>{sale.date}</td>
                    <td className="p-2 sm:p-4">
                      <div className="space-y-1">
                        {sale.items.map((item, idx) => (
                          <div key={idx} className="text-xs sm:text-sm">
                            <span className={isCancellation ? 'text-red-400' : isCancelled ? 'text-content-faint' : 'text-content-primary'}>{item.name}</span>
                            <span className={`ml-2 ${isCancelled ? 'text-content-faint' : 'text-content-faint'}`}>x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-2 sm:p-4">
                      <div className="space-y-1">
                        {sale.items.map((item, idx) => (
                          <div key={idx} className="text-xs mt-3">
                            <span className={`px-1 sm:px-2 py-1 rounded text-xs ${isCancelled ? 'bg-surface-dark text-content-faint' : 'bg-surface-button text-content-secondary'}`}>
                              {item.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-2 sm:p-4 min-w-[130px]">
                      <div 
                        className="relative inline-flex items-center gap-1 vat-tooltip-trigger"
                        onMouseEnter={() => setActiveVatTooltip(sale.id)}
                        onMouseLeave={() => setActiveVatTooltip(null)}
                      >
                        <span className={`font-semibold text-xs sm:text-sm ${
                          sale.totalAmount < 0 ? 'text-red-400' : isCancelled ? 'text-content-faint' : 'text-content-primary'
                        }`}>
                          {sale.totalAmount < 0 ? '-' : ''}${Math.abs(sale.totalAmount).toFixed(2)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveVatTooltip(activeVatTooltip === sale.id ? null : sale.id)
                          }}
                          className="text-content-faint hover:text-content-secondary cursor-pointer p-0.5"
                        >
                          <Info size={14} />
                        </button>
                        {/* VAT Breakdown Tooltip - position based on row location */}
                        {activeVatTooltip === sale.id && (
                          <div 
                            className={`absolute left-0 z-[10000001] ${
                              isNearBottom ? 'bottom-full pb-1' : 'top-full pt-1'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="bg-surface-dark border border-border rounded-lg p-3 shadow-2xl min-w-[180px]">
                              <div className="text-xs text-content-muted mb-2 font-medium">VAT Breakdown</div>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-content-muted">Net:</span>
                                  <span className="text-content-primary">${vatBreakdown.totalNet.toFixed(2)}</span>
                                </div>
                                {vatBreakdown.totalVat19 > 0 && (
                                  <div className="flex justify-between">
                                    <span className="text-content-muted">VAT 19%:</span>
                                    <span className="text-content-primary">${vatBreakdown.totalVat19.toFixed(2)}</span>
                                  </div>
                                )}
                                {vatBreakdown.totalVat7 > 0 && (
                                  <div className="flex justify-between">
                                    <span className="text-content-muted">VAT 7%:</span>
                                    <span className="text-content-primary">${vatBreakdown.totalVat7.toFixed(2)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between border-t border-border pt-1 mt-1">
                                  <span className="text-content-secondary font-medium">Gross:</span>
                                  <span className="text-content-primary font-medium">${vatBreakdown.totalGross.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className={`p-2 sm:p-4 text-xs sm:text-sm ${isCancelled ? 'text-content-faint' : 'text-content-secondary'}`}>{sale.paymentMethod}</td>
                    <td className={`p-2 sm:p-4 text-xs sm:text-sm ${isCancelled ? 'text-content-faint' : 'text-content-secondary'}`}>{sale.soldBy || '-'}</td>
                    <td className="p-2 sm:p-4">
                      <div className="flex gap-1 sm:gap-2">
                        {!isCancellation && (
                          <button
                            onClick={() => handleViewInvoice(sale)}
                            className="p-1 sm:p-2 bg-primary hover:bg-primary-hover rounded-lg text-white text-xs flex items-center justify-center"
                            title="View E-Invoice"
                          >
                            <FileText size={16} />
                          </button>
                        )}
                        {sale.canCancel && !isCancellation && (
                          <button
                            onClick={() => handleCancelSaleClick(sale)}
                            className="p-1 sm:p-2 bg-primary hover:bg-primary-hover rounded-lg text-white text-xs flex items-center justify-center"
                            title="Cancel Sale (24h limit)"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>

            {sortedSales.length === 0 && (
              <div className="text-center py-8 text-content-faint text-sm">No sales found matching the current filters.</div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default SalesJournalModal
