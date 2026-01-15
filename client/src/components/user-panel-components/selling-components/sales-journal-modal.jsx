/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X, FileText, Download, Calendar, ChevronDown, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"
import { useEffect, useState, useRef, useMemo } from "react"
import CancelSaleConfirmationModal from "./cancel-sale-confirmation-modal"
import InvoicePreviewModal from "./invoice-preview-modal"

// Export Confirmation Modal Component
const ExportConfirmationModal = ({ isOpen, onClose, onConfirm, salesCount, totalAmount, selectedPeriod }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[10000002] p-4">
      <div className="bg-[#181818] rounded-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-500/20 p-3 rounded-full mb-4">
              <Download className="h-8 w-8 text-blue-500" />
            </div>
            <h2 className="text-white text-lg font-semibold text-center">
              Export Sales Data
            </h2>
            <p className="text-gray-400 text-center mt-2 text-sm">
              You are about to export the current filtered sales data to CSV format.
            </p>
          </div>

          <div className="bg-[#141414] rounded-xl p-4 mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Period:</span>
              <span className="text-white font-medium">{selectedPeriod}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Total Records:</span>
              <span className="text-white font-medium">{salesCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Amount:</span>
              <span className="text-white font-medium">${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-row justify-center items-center gap-3">
            <button
              onClick={onConfirm}
              className="w-full sm:w-auto px-8 py-2.5 bg-blue-600 text-sm text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Export CSV
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-2.5 bg-transparent text-sm text-white rounded-xl border border-[#333333] hover:bg-[#101010] transition-colors"
            >
              Cancel
            </button>
          </div>
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
  
  // Sorting state
  const [sortBy, setSortBy] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")

  // Period options
  const periodOptions = ["Overall", "Today", "This Week", "This Month", "Last Month", "This Year"]

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        // Close sub-modals first, then main modal
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
  }, [periodDropdownOpen, invoiceToView, saleToCancel, exportModalOpen, onClose])

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
  }, [salesHistory, salesFilter, selectedPeriod, customDateRange])

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
      return <ArrowUpDown size={14} className="text-gray-500" />
    }
    return sortDirection === "asc" 
      ? <ArrowUp size={14} className="text-white" />
      : <ArrowDown size={14} className="text-white" />
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
    const headers = ["Member", "Member Type", "Date", "Items", "Type", "Total", "Payment Method"]
    const csvContent = [
      headers.join(","),
      ...sortedSales.map((sale) =>
        [
          `"${sale.member}"`,
          `"${sale.memberType}"`,
          sale.date,
          `"${sale.items.map((item) => `${item.name} x${item.quantity}`).join("; ")}"`,
          `"${sale.items.map((item) => item.type).join("; ")}"`,
          sale.totalAmount.toFixed(2),
          sale.paymentMethod,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `sales-journal-${selectedPeriod.replace(/[:\s]/g, "_")}-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
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
      setSelectedPeriod(`Custom: ${formattedStart} – ${formattedEnd}`)
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
            className="fixed bg-[#1F1F1F] border border-gray-700 rounded-xl shadow-2xl max-h-[70vh] overflow-y-auto z-[10000002] w-[calc(100%-32px)] sm:w-[340px]"
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
              <div className="px-3 py-1.5 text-xs text-gray-500 font-medium border-b border-gray-700 sticky top-0 bg-[#1F1F1F]">
                Select Period
              </div>
              {periodOptions.map((period) => (
                <button
                  key={period}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-800 transition-colors ${
                    selectedPeriod === period && !selectedPeriod.startsWith("Custom:")
                      ? 'text-white bg-gray-800/50' 
                      : 'text-gray-300'
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
            <div className="border-t border-gray-700">
              <button
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-800 transition-colors flex items-center gap-2 ${
                  isCustomPeriodExpanded || selectedPeriod.startsWith("Custom:") ? 'text-white bg-gray-800/50' : 'text-gray-300'
                }`}
                onClick={handleCustomPeriodClick}
              >
                <Calendar className="w-4 h-4" />
                Custom Period
              </button>
              
              {isCustomPeriodExpanded && (
                <div 
                  className="px-4 py-3 bg-[#141414] border-t border-gray-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={customDates.startDate}
                          onChange={(e) => setCustomDates((prev) => ({ ...prev, startDate: e.target.value }))}
                          className="w-full bg-[#1C1C1C] text-white px-3 py-2 rounded-lg border border-gray-700 text-sm focus:border-[#3F74FF] focus:outline-none white-calendar-icon"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">End Date</label>
                        <input
                          type="date"
                          value={customDates.endDate}
                          onChange={(e) => setCustomDates((prev) => ({ ...prev, endDate: e.target.value }))}
                          className="w-full bg-[#1C1C1C] text-white px-3 py-2 rounded-lg border border-gray-700 text-sm focus:border-[#3F74FF] focus:outline-none white-calendar-icon"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleApplyCustomPeriod}
                      disabled={!customDates.startDate || !customDates.endDate}
                      className="w-full py-2 bg-[#3F74FF] text-white rounded-lg text-sm hover:bg-[#3F74FF]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="bg-[#181818] rounded-xl w-full max-w-[95vw] sm:max-w-6xl max-h-[95vh] sm:max-h-[90vh] flex flex-col">
          <div className="p-3 sm:p-6 border-b border-gray-700 flex-shrink-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-2xl font-bold text-white">Sales Journal</h2>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setExportModalOpen(true)}
                  className="px-3 sm:px-4 py-2 bg-gray-600 rounded-lg text-white text-xs sm:text-sm flex items-center gap-2 hover:bg-gray-500 transition-colors"
                  title="Export to Excel"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Export Excel</span>
                </button>
                <button onClick={onClose} className="p-2 hover:bg-zinc-700 rounded-lg text-white">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
              {/* Type Filter */}
              <div>
                <label className="block text-xs sm:text-sm text-zinc-400 mb-1">Type</label>
                <select
                  value={salesFilter.type}
                  onChange={(e) => setSalesFilter({ ...salesFilter, type: e.target.value })}
                  className="w-full p-2.5 bg-[#141414] rounded-xl text-white text-xs sm:text-sm border border-[#333333] focus:border-[#3F74FF] outline-none transition-colors"
                >
                  <option value="all">All Types</option>
                  <option value="service">Service</option>
                  <option value="product">Product</option>
                </select>
              </div>
              
              {/* Member Filter */}
              <div>
                <label className="block text-xs sm:text-sm text-zinc-400 mb-1">Member</label>
                <input
                  type="text"
                  value={salesFilter.member}
                  onChange={(e) => setSalesFilter({ ...salesFilter, member: e.target.value })}
                  placeholder="Search member..."
                  className="w-full p-2.5 bg-[#141414] rounded-xl text-white text-xs sm:text-sm border border-[#333333] focus:border-[#3F74FF] outline-none transition-colors"
                />
              </div>
              
              {/* Period Picker */}
              <div>
                <label className="block text-xs sm:text-sm text-zinc-400 mb-1">Period</label>
                <div className="relative" ref={periodDropdownRef}>
                  <button
                    onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)}
                    className="w-full bg-[#141414] text-white px-3 py-2.5 rounded-xl border border-[#333333] hover:border-[#3F74FF] flex items-center gap-2 text-xs sm:text-sm transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="flex-1 text-left truncate">{selectedPeriod}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${periodDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto overflow-y-auto flex-1">
            <table className="w-full min-w-[800px]">
              <thead className="bg-black sticky top-0 z-10">
                <tr>
                  <th 
                    className="text-left p-2 sm:p-4 text-zinc-400 text-xs sm:text-sm cursor-pointer hover:bg-[#1C1C1C] transition-colors"
                    onClick={() => handleSort("member")}
                  >
                    <div className="flex items-center gap-1">
                      Member {getSortIcon("member")}
                    </div>
                  </th>
                  <th 
                    className="text-left p-2 sm:p-4 text-zinc-400 text-xs sm:text-sm cursor-pointer hover:bg-[#1C1C1C] transition-colors"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-1">
                      Date {getSortIcon("date")}
                    </div>
                  </th>
                  <th 
                    className="text-left p-2 sm:p-4 text-zinc-400 text-xs sm:text-sm cursor-pointer hover:bg-[#1C1C1C] transition-colors"
                    onClick={() => handleSort("items")}
                  >
                    <div className="flex items-center gap-1">
                      Items {getSortIcon("items")}
                    </div>
                  </th>
                  <th 
                    className="text-left p-2 sm:p-4 text-zinc-400 text-xs sm:text-sm cursor-pointer hover:bg-[#1C1C1C] transition-colors"
                    onClick={() => handleSort("type")}
                  >
                    <div className="flex items-center gap-1">
                      Type {getSortIcon("type")}
                    </div>
                  </th>
                  <th 
                    className="text-left p-2 sm:p-4 text-zinc-400 text-xs sm:text-sm cursor-pointer hover:bg-[#1C1C1C] transition-colors"
                    onClick={() => handleSort("total")}
                  >
                    <div className="flex items-center gap-1">
                      Total {getSortIcon("total")}
                    </div>
                  </th>
                  <th 
                    className="text-left p-2 sm:p-4 text-zinc-400 text-xs sm:text-sm cursor-pointer hover:bg-[#1C1C1C] transition-colors"
                    onClick={() => handleSort("payment")}
                  >
                    <div className="flex items-center gap-1">
                      Payment {getSortIcon("payment")}
                    </div>
                  </th>
                  <th className="text-left p-2 sm:p-4 text-zinc-400 text-xs sm:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedSales.map((sale) => (
                  <tr key={sale.id} className="border-b border-gray-700 hover:bg-zinc-800/50">
                    <td className="p-2 sm:p-4">
                      <div className="text-white text-xs sm:text-sm">{sale.member}</div>
                      <div className="text-zinc-400 text-xs">{sale.memberType}</div>
                    </td>
                    <td className="p-2 sm:p-4 text-zinc-300 text-xs sm:text-sm">{sale.date}</td>
                    <td className="p-2 sm:p-4">
                      <div className="space-y-1">
                        {sale.items.map((item, idx) => (
                          <div key={idx} className="text-xs sm:text-sm">
                            <span className="text-white">{item.name}</span>
                            <span className="text-zinc-400 ml-2">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-2 sm:p-4">
                      <div className="space-y-1">
                        {sale.items.map((item, idx) => (
                          <div key={idx} className="text-xs mt-3">
                            <span className="px-1 sm:px-2 py-1 rounded text-xs bg-gray-600 text-white">
                              {item.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-2 sm:p-4 text-white font-semibold text-xs sm:text-sm">
                      ${sale.totalAmount.toFixed(2)}
                    </td>
                    <td className="p-2 sm:p-4 text-zinc-300 text-xs sm:text-sm">{sale.paymentMethod}</td>
                    <td className="p-2 sm:p-4">
                      <div className="flex gap-1 sm:gap-2">
                        <button
                          onClick={() => handleViewInvoice(sale)}
                          className="p-1 sm:p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-xs flex items-center justify-center"
                          title="View E-Invoice"
                        >
                          <FileText size={16} />
                        </button>
                        {sale.canCancel && (
                          <button
                            onClick={() => handleCancelSaleClick(sale)}
                            className="p-1 sm:p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-xs flex items-center justify-center"
                            title="Cancel Sale (24h limit)"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {sortedSales.length === 0 && (
              <div className="text-center py-8 text-zinc-400 text-sm">No sales found matching the current filters.</div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default SalesJournalModal
