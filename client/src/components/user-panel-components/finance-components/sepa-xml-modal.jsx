/* eslint-disable react/prop-types */
import { Calendar, Download, X, Edit, Info, Search, ArrowUp, ArrowDown, ArrowUpDown, ChevronDown, Play } from "lucide-react"
import { useEffect, useState, useMemo, useRef } from "react"

// eslint-disable-next-line no-unused-vars
const SepaXmlModal = ({ isOpen, onClose, selectedPeriod, transactions, onGenerateXml, onUpdateStatus, financialData }) => {
  const [selectedTransactions, setSelectedTransactions] = useState({})
  const [editedAmounts, setEditedAmounts] = useState({})
  const [customPeriod, setCustomPeriod] = useState({
    startDate: "",
    endDate: "",
  })
  const [isCustomPeriodActive, setIsCustomPeriodActive] = useState(false)
  const [editingAmount, setEditingAmount] = useState(null)
  const [tempAmount, setTempAmount] = useState("")
  const [servicesModalOpen, setServicesModalOpen] = useState(false)
  const [selectedServices, setSelectedServices] = useState([])
  const [selectedStudioName, setSelectedStudioName] = useState("")
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false)
  const [shouldDownload, setShouldDownload] = useState(true)
  
  // New state for search and sorting
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")
  
  // New state for period selection dropdown
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false)
  const [localSelectedPeriod, setLocalSelectedPeriod] = useState(selectedPeriod)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setPeriodDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    // Initialize selected transactions (only Pending and Failed)
    const initialSelected = {}
    const initialAmounts = {}

    transactions.forEach((tx) => {
      if (tx.status === "Pending" || tx.status === "Failed") {
        initialSelected[tx.id] = true
        initialAmounts[tx.id] = tx.amount
      }
    })

    setSelectedTransactions(initialSelected)
    setEditedAmounts(initialAmounts)
    setEditingAmount(null) // Reset editing state

    // Reset custom period when modal opens
    setIsCustomPeriodActive(false)
    setLocalSelectedPeriod(selectedPeriod)
    setSearchTerm("")
  }, [transactions, selectedPeriod])

  // Filter transactions based on search term
  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter((tx) => tx.status === "Pending" || tx.status === "Failed")
    
    if (searchTerm) {
      filtered = filtered.filter((tx) =>
        tx.memberName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    return filtered
  }, [transactions, searchTerm])

  // Sort filtered transactions
  const sortedTransactions = useMemo(() => {
    const sorted = [...filteredTransactions].sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case "member":
          comparison = a.memberName.localeCompare(b.memberName)
          break
        case "date":
          comparison = new Date(a.date) - new Date(b.date)
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
        case "amount":
          const amountA = editedAmounts[a.id] || a.amount
          const amountB = editedAmounts[b.id] || b.amount
          comparison = amountA - amountB
          break
        default:
          comparison = 0
      }
      
      return sortDirection === "asc" ? comparison : -comparison
    })
    
    return sorted
  }, [filteredTransactions, sortBy, sortDirection, editedAmounts])

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

  const handleToggleTransaction = (id) => {
    setSelectedTransactions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleStartEdit = (id, currentAmount) => {
    setEditingAmount(id)
    setTempAmount(currentAmount.toString())
  }

  const handleSaveAmount = (id) => {
    const newAmount = Number.parseFloat(tempAmount) || 0
    setEditedAmounts((prev) => ({
      ...prev,
      [id]: newAmount,
    }))
    setEditingAmount(null)
    setTempAmount("")
  }

  const handleCancelEdit = () => {
    setEditingAmount(null)
    setTempAmount("")
  }

  const handleGenerateXmlClick = () => {
    setConfirmationModalOpen(true)
  }

  const handleConfirmGeneration = () => {
    const selectedTxs = transactions
      .filter((tx) => selectedTransactions[tx.id])
      .map((tx) => ({
        ...tx,
        amount: editedAmounts[tx.id],
      }))

    const period = isCustomPeriodActive 
      ? `Custom: ${formatDateForDisplay(customPeriod.startDate)} – ${formatDateForDisplay(customPeriod.endDate)}` 
      : localSelectedPeriod

    onGenerateXml(selectedTxs, period, shouldDownload)
    setConfirmationModalOpen(false)
    onClose()
  }

  const handleCancelGeneration = () => {
    setConfirmationModalOpen(false)
  }

  const handleSelectPeriod = (period) => {
    setLocalSelectedPeriod(period)
    setIsCustomPeriodActive(false)
    setPeriodDropdownOpen(false)
  }

  const handleCustomPeriodSelect = () => {
    // Initialize with today's date if empty
    const today = new Date().toISOString().split("T")[0]
    setCustomPeriod((prev) => ({
      startDate: prev.startDate || today,
      endDate: prev.endDate || today,
    }))
    setIsCustomPeriodActive(true)
    // Keep dropdown open to show date inputs
  }

  const handleApplyCustomPeriod = () => {
    if (customPeriod.startDate && customPeriod.endDate) {
      setLocalSelectedPeriod(`Custom: ${formatDateForDisplay(customPeriod.startDate)} – ${formatDateForDisplay(customPeriod.endDate)}`)
      setPeriodDropdownOpen(false)
    }
  }

  const handleShowServices = (services, studioName) => {
    setSelectedServices(services)
    setSelectedStudioName(studioName)
    setServicesModalOpen(true)
  }

  const handleSelectAll = (selected) => {
    const newSelected = {}
    sortedTransactions.forEach((tx) => {
      newSelected[tx.id] = selected
    })
    setSelectedTransactions((prev) => ({
      ...prev,
      ...newSelected,
    }))
  }

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  if (!isOpen) return null

  const selectedCount = Object.values(selectedTransactions).filter(v => v).length
  const totalAmount = transactions
    .filter((tx) => selectedTransactions[tx.id])
    .reduce((sum, tx) => sum + (editedAmounts[tx.id] || tx.amount), 0)

  // Get available periods from financialData
  const availablePeriods = financialData ? Object.keys(financialData) : []

  // Get display text for period button
  const getPeriodDisplayText = () => {
    if (isCustomPeriodActive && customPeriod.startDate && customPeriod.endDate) {
      return `${formatDateForDisplay(customPeriod.startDate)} – ${formatDateForDisplay(customPeriod.endDate)}`
    }
    return localSelectedPeriod
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex p-2 items-center justify-center z-50">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-white text-lg font-medium">Run Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Period Selection - Integrated Custom Period */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm">Period:</span>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)}
                className="bg-[#141414] text-white px-4 py-2.5 rounded-xl border border-[#333333] hover:border-[#3F74FF] flex items-center gap-3 text-sm min-w-[200px] transition-colors"
              >
                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm flex-1 text-left truncate">{getPeriodDisplayText()}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${periodDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {periodDropdownOpen && (
                <div className="absolute z-20 mt-2 w-full min-w-[320px] bg-[#1F1F1F] border border-gray-700 rounded-xl shadow-lg overflow-hidden">
                  {/* Preset Periods */}
                  <div className="py-1">
                    <div className="px-3 py-1.5 text-xs text-gray-500 font-medium border-b border-gray-700">
                      Select Period
                    </div>
                    {availablePeriods.map((period) => (
                      <button
                        key={period}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-800 transition-colors ${
                          localSelectedPeriod === period && !isCustomPeriodActive
                            ? 'text-white bg-gray-800/50' 
                            : 'text-gray-300'
                        }`}
                        onClick={() => handleSelectPeriod(period)}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Period Section */}
                  <div className="border-t border-gray-700">
                    <button
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-800 transition-colors flex items-center gap-2 ${
                        isCustomPeriodActive ? 'text-white bg-gray-800/50' : 'text-gray-300'
                      }`}
                      onClick={handleCustomPeriodSelect}
                    >
                      <Calendar className="w-4 h-4" />
                      Custom Period
                    </button>
                    
                    {/* Date Inputs - Show when custom period is selected */}
                    {isCustomPeriodActive && (
                      <div className="px-4 py-3 bg-[#141414] border-t border-gray-700">
                        <div className="flex flex-col gap-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                              <input
                                type="date"
                                value={customPeriod.startDate}
                                onChange={(e) => setCustomPeriod((prev) => ({ ...prev, startDate: e.target.value }))}
                                className="w-full bg-[#1C1C1C] text-white px-3 py-2 rounded-lg border border-gray-700 text-sm focus:border-[#3F74FF] focus:outline-none white-calendar-icon"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">End Date</label>
                              <input
                                type="date"
                                value={customPeriod.endDate}
                                onChange={(e) => setCustomPeriod((prev) => ({ ...prev, endDate: e.target.value }))}
                                className="w-full bg-[#1C1C1C] text-white px-3 py-2 rounded-lg border border-gray-700 text-sm focus:border-[#3F74FF] focus:outline-none white-calendar-icon"
                              />
                            </div>
                          </div>
                          <button
                            onClick={handleApplyCustomPeriod}
                            disabled={!customPeriod.startDate || !customPeriod.endDate}
                            className="w-full py-2 bg-[#3F74FF] text-white rounded-lg text-sm hover:bg-[#3F74FF]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
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
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-300 text-sm">
                  Review and select transactions to include in the SEPA XML file:
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
              <div className="overflow-x-auto">
                <div className="min-w-[700px]">
                  <table className="w-full text-sm text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-[#141414]">
                    <tr>
                      <th className="px-3 py-2 w-12 rounded-tl-lg">
                        <input 
                          type="checkbox" 
                          className="rounded bg-black border-gray-700 text-orange-500 focus:ring-orange-500"
                          checked={sortedTransactions.length > 0 && sortedTransactions.every(tx => selectedTransactions[tx.id])}
                          onChange={() => {
                            const allSelected = sortedTransactions.every(tx => selectedTransactions[tx.id])
                            handleSelectAll(!allSelected)
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
                        className="px-3 py-2 text-right cursor-pointer hover:bg-[#1C1C1C] transition-colors"
                        onClick={() => handleSort("amount")}
                      >
                        <div className="flex items-center justify-end gap-1">
                          Amount {getSortIcon("amount")}
                        </div>
                      </th>
                      <th className="px-3 py-2 text-center rounded-tr-lg">Services</th>
                    </tr>
                    </thead>
                    <tbody>
                      {sortedTransactions.map((tx) => (
                        <tr
                          key={tx.id}
                          className={`border-b border-gray-800 ${
                            !selectedTransactions[tx.id] ? "opacity-50" : ""
                          }`}
                        >
                          <td className="px-3 py-2">
                            <input
                              type="checkbox"
                              className="rounded bg-black border-gray-700 text-orange-500 focus:ring-orange-500"
                              checked={selectedTransactions[tx.id] || false}
                              onChange={() => handleToggleTransaction(tx.id)}
                            />
                          </td>
                          <td className="px-2 sm:px-3 py-2 text-xs sm:text-sm">{tx.memberName}</td>
                          <td className="px-2 sm:px-3 py-2 text-xs sm:text-sm">{new Date(tx.date).toLocaleDateString()}</td>
                          <td className="px-2 sm:px-3 py-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                tx.status === "Pending"
                                  ? "bg-[#f59e0b] text-white"
                                  : "bg-[#ef4444] text-white"
                              }`}
                            >
                              {tx.status}
                            </span>
                          </td>
                          <td className="px-2 sm:px-3 py-2 text-right">
                            <div className="flex items-center justify-end gap-1 sm:gap-2">
                              {editingAmount === tx.id ? (
                                <>
                                  <input
                                    type="number"
                                    value={tempAmount}
                                    onChange={(e) => setTempAmount(e.target.value)}
                                    className="w-16 sm:w-20 bg-[#141414] text-white px-2 py-1 rounded border border-gray-700 text-xs sm:text-sm focus:border-orange-500 focus:outline-none"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") handleSaveAmount(tx.id)
                                      if (e.key === "Escape") handleCancelEdit()
                                    }}
                                  />
                                  <button
                                    onClick={() => handleSaveAmount(tx.id)}
                                    className="p-1 rounded text-xs bg-orange-500 hover:bg-orange-600 text-white"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="p-1 rounded bg-gray-600 hover:bg-gray-700 text-white text-xs px-2"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <span
                                    className={`text-xs sm:text-sm ${!selectedTransactions[tx.id] ? "text-gray-500" : "text-white"}`}
                                  >
                                    ${(editedAmounts[tx.id] || tx.amount).toFixed(2)}
                                  </span>
                                  <button
                                    onClick={() => handleStartEdit(tx.id, editedAmounts[tx.id] || tx.amount)}
                                    disabled={!selectedTransactions[tx.id]}
                                    className={`p-1 rounded hover:bg-gray-700 ${
                                      !selectedTransactions[tx.id]
                                        ? "text-gray-600 cursor-not-allowed"
                                        : "text-gray-400 hover:text-white"
                                    }`}
                                  >
                                    <Edit className="w-3 h-3" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-2 sm:px-3 py-2 text-center">
                            <button
                              onClick={() => handleShowServices(tx.services, tx.studioName)}
                              className="text-blue-400 hover:text-blue-300"
                              disabled={!selectedTransactions[tx.id]}
                            >
                              <Info className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-[#141414] p-6 rounded-xl text-center">
              <p className="text-gray-400 text-sm">
                {searchTerm 
                  ? "No transactions found matching your search."
                  : "No pending or failed transactions for this period."
                }
              </p>
            </div>
          )}
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
                  <p className="text-gray-400 text-sm">Cost breakdown for this studio</p>
                </div>

                <div className="space-y-3">
                  {selectedServices.map((service, index) => (
                    <div key={index} className="bg-[#141414] p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-white font-medium text-sm">{service.name}</span>
                        <span className="text-white font-semibold text-sm">${service.cost.toFixed(2)}</span>
                      </div>
                      <p className="text-gray-400 text-xs">{service.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold text-sm">Total Amount</span>
                    <span className="text-white font-bold text-lg">
                      ${selectedServices.reduce((sum, service) => sum + service.cost, 0).toFixed(2)} USD
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {confirmationModalOpen && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30">
            <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md mx-4">
              <div className="p-4 border-b border-gray-800">
                <h2 className="text-white text-lg font-medium">Generate SEPA XML</h2>
              </div>

              <div className="p-4">
                <p className="text-gray-300 text-sm mb-4">
                  Are you sure you want to generate the SEPA XML file?
                </p>
                
                <div className="bg-[#141414] p-3 rounded-lg mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Selected transactions:</span>
                    <span className="text-white font-medium">{selectedCount}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Total amount:</span>
                    <span className="text-white font-medium">${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Period:</span>
                    <span className="text-white font-medium">
                      {isCustomPeriodActive 
                        ? `${formatDateForDisplay(customPeriod.startDate)} – ${formatDateForDisplay(customPeriod.endDate)}` 
                        : localSelectedPeriod}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="shouldDownload"
                    checked={shouldDownload}
                    onChange={(e) => setShouldDownload(e.target.checked)}
                    className="rounded bg-black border-gray-700 text-orange-500 focus:ring-orange-500"
                  />
                  <label htmlFor="shouldDownload" className="text-sm text-gray-300">
                    Download SEPA XML file automatically
                  </label>
                </div>
              </div>

              <div className="p-4 border-t border-gray-800 flex justify-end gap-3">
                <button
                  onClick={handleCancelGeneration}
                  className="px-4 py-2 rounded-xl text-sm bg-[#2F2F2F] text-white hover:bg-[#3F3F3F] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmGeneration}
                  className="px-4 py-2 rounded-xl text-sm bg-orange-500 text-white hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Generate XML
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm bg-[#2F2F2F] text-white hover:bg-[#3F3F3F] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerateXmlClick}
            className="px-4 py-2 rounded-xl text-sm bg-orange-500 text-white hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!Object.values(selectedTransactions).some((v) => v)}
          >
            <Play className="w-4 h-4" />
            Generate SEPA XML
          </button>
        </div>
      </div>
    </div>
  )
}

export default SepaXmlModal
