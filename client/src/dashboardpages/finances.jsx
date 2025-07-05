/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState, useEffect } from "react"
import { Download, Calendar, ChevronDown, RefreshCw, Filter, Info, X } from "lucide-react"
import CheckFundsModal from "../components/finance-components/check-funds-modal"
import SepaXmlModal from "../components/finance-components/sepa-xml-modal"

const financialData = {
  "This Month": {
    totalRevenue: 12500,
    pendingPayments: 1800,
    failedPayments: 750,
    successfulPayments: 9950,
    transactions: [
      {
        id: "tx-001",
        memberName: "John Doe",
        date: "2023-05-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-002",
        memberName: "Jane Smith",
        date: "2023-05-14",
        amount: 200,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 150, description: "Premium membership with extra benefits" },
          { name: "Storage", cost: 25, description: "Additional storage space" },
          { name: "Support Services", cost: 25, description: "Technical support and maintenance" },
        ],
      },
      {
        id: "tx-003",
        memberName: "Bob Johnson",
        date: "2023-05-12",
        amount: 150,
        status: "Failed",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 120, description: "Monthly membership fee" },
          { name: "Cleaning Service", cost: 30, description: "Weekly cleaning service" },
        ],
      },
      {
        id: "tx-004",
        memberName: "Alice Williams",
        date: "2023-05-10",
        amount: 300,
        status: "Pending",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 200, description: "Premium membership with extra benefits" },
          { name: "Equipment Rental", cost: 50, description: "Specialized equipment rental" },
          { name: "Technical Support", cost: 50, description: "Dedicated technical support" },
        ],
      },
      {
        id: "tx-005",
        memberName: "Charlie Brown",
        date: "2023-05-08",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
    ],
  },
  "Last Month": {
    totalRevenue: 11800,
    pendingPayments: 1200,
    failedPayments: 600,
    successfulPayments: 10000,
    transactions: [
      {
        id: "tx-101",
        memberName: "John Doe",
        date: "2023-04-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-102",
        memberName: "Jane Smith",
        date: "2023-04-14",
        amount: 200,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 150, description: "Premium membership with extra benefits" },
          { name: "Storage", cost: 25, description: "Additional storage space" },
          { name: "Support Services", cost: 25, description: "Technical support and maintenance" },
        ],
      },
      {
        id: "tx-103",
        memberName: "Bob Johnson",
        date: "2023-04-12",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 120, description: "Monthly membership fee" },
          { name: "Cleaning Service", cost: 30, description: "Weekly cleaning service" },
        ],
      },
    ],
  },
  "Last 3 Months": {
    totalRevenue: 35400,
    pendingPayments: 3600,
    failedPayments: 1800,
    successfulPayments: 30000,
    transactions: [
      {
        id: "tx-201",
        memberName: "John Doe",
        date: "2023-03-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-202",
        memberName: "Jane Smith",
        date: "2023-02-14",
        amount: 200,
        status: "Failed",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 150, description: "Premium membership with extra benefits" },
          { name: "Storage", cost: 25, description: "Additional storage space" },
          { name: "Support Services", cost: 25, description: "Technical support and maintenance" },
        ],
      },
      {
        id: "tx-203",
        memberName: "Bob Johnson",
        date: "2023-01-12",
        amount: 150,
        status: "Pending",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 120, description: "Monthly membership fee" },
          { name: "Cleaning Service", cost: 30, description: "Weekly cleaning service" },
        ],
      },
    ],
  },
  "Last 6 Months": {
    totalRevenue: 70800,
    pendingPayments: 7200,
    failedPayments: 3600,
    successfulPayments: 60000,
    transactions: [
      {
        id: "tx-301",
        memberName: "John Doe",
        date: "2022-12-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-302",
        memberName: "Jane Smith",
        date: "2022-11-14",
        amount: 200,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 150, description: "Premium membership with extra benefits" },
          { name: "Storage", cost: 25, description: "Additional storage space" },
          { name: "Support Services", cost: 25, description: "Technical support and maintenance" },
        ],
      },
      {
        id: "tx-303",
        memberName: "Bob Johnson",
        date: "2022-10-12",
        amount: 150,
        status: "Failed",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 120, description: "Monthly membership fee" },
          { name: "Cleaning Service", cost: 30, description: "Weekly cleaning service" },
        ],
      },
    ],
  },
  "This Year": {
    totalRevenue: 141600,
    pendingPayments: 14400,
    failedPayments: 7200,
    successfulPayments: 120000,
    transactions: [
      {
        id: "tx-401",
        memberName: "John Doe",
        date: "2023-01-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-402",
        memberName: "Jane Smith",
        date: "2023-02-14",
        amount: 200,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 150, description: "Premium membership with extra benefits" },
          { name: "Storage", cost: 25, description: "Additional storage space" },
          { name: "Support Services", cost: 25, description: "Technical support and maintenance" },
        ],
      },
      {
        id: "tx-403",
        memberName: "Bob Johnson",
        date: "2023-03-12",
        amount: 150,
        status: "Pending",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 120, description: "Monthly membership fee" },
          { name: "Cleaning Service", cost: 30, description: "Weekly cleaning service" },
        ],
      },
    ],
  },
  Overall: {
    totalRevenue: 284100,
    pendingPayments: 28800,
    failedPayments: 14400,
    successfulPayments: 240900,
    transactions: [
      // Combined transactions from all periods
      {
        id: "tx-001",
        memberName: "John Doe",
        date: "2023-05-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-002",
        memberName: "Jane Smith",
        date: "2023-05-14",
        amount: 200,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Premium Membership", cost: 150, description: "Premium membership with extra benefits" },
          { name: "Storage", cost: 25, description: "Additional storage space" },
          { name: "Support Services", cost: 25, description: "Technical support and maintenance" },
        ],
      },
      {
        id: "tx-101",
        memberName: "John Doe",
        date: "2023-04-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-201",
        memberName: "John Doe",
        date: "2023-03-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Basic Membership", cost: 100, description: "Monthly membership fee" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
    ],
  },
}

// Services Modal Component
const ServicesModal = ({ isOpen, onClose, services, memberName }) => {
  if (!isOpen) return null

  const totalCost = services.reduce((sum, service) => sum + service.cost, 0)

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-white text-lg font-medium">Services Breakdown</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-grow">
          <div className="mb-4">
            <h3 className="text-white font-medium mb-2">{memberName}</h3>
            <p className="text-gray-400 text-sm">Service breakdown for this member</p>
          </div>
          <div className="space-y-3">
            {services.map((service, index) => (
              <div key={index} className="bg-[#141414] p-3 rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-white font-medium">{service.name}</span>
                  <span className="text-white font-semibold">${service.cost.toFixed(2)}</span>
                </div>
                <p className="text-gray-400 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex justify-between items-center">
              <span className="text-white font-semibold">Total Amount</span>
              <span className="text-white font-bold text-lg">${totalCost.toFixed(2)} USD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Custom Date Range Modal Component
const CustomDateModal = ({ isOpen, onClose, onApply }) => {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  if (!isOpen) return null

  const handleApply = () => {
    if (startDate && endDate) {
      onApply(startDate, endDate)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-lg font-medium">Custom Date Range</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-black text-white px-4 white-calendar-icon  py-2 rounded-xl border border-gray-800 w-full focus:outline-none focus:ring-1 focus:ring-[#3F74FF]"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-black text-white white-calendar-icon px-4 py-2 rounded-xl border border-gray-800 w-full focus:outline-none focus:ring-1 focus:ring-[#3F74FF]"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!startDate || !endDate}
              className="flex-1 bg-[#3F74FF] text-white px-4 py-2 rounded-xl hover:bg-[#3F74FF]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FinancesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("This Month")
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false)
  const [statusFilterOpen, setStatusFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [filteredTransactions, setFilteredTransactions] = useState(financialData[selectedPeriod].transactions)
  const [currentPage, setCurrentPage] = useState(1)
  const [sepaModalOpen, setSepaModalOpen] = useState(false)
  const [financialState, setFinancialState] = useState(financialData)
  const [checkFundsModalOpen, setCheckFundsModalOpen] = useState(false)
  const [servicesModalOpen, setServicesModalOpen] = useState(false)
  const [selectedServices, setSelectedServices] = useState([])
  const [selectedMemberName, setSelectedMemberName] = useState("")
  const [customDateModalOpen, setCustomDateModalOpen] = useState(false)
  const [customDateRange, setCustomDateRange] = useState(null)

  const transactionsPerPage = 5

  // Get all possible status values
  const statusOptions = ["All", "Successful", "Pending", "Failed", "Check incoming funds"]

  // Enhanced period options with Overall and Custom
  const periodOptions = [
    ...Object.keys(financialState),
    ...(customDateRange ? [`Custom (${customDateRange.start} to ${customDateRange.end})`] : []),
  ]

  useEffect(() => {
    // Filter transactions based on search term and selected status
    let currentTransactions = financialData[selectedPeriod]?.transactions || []

    // If custom date range is selected, filter by date
    if (customDateRange && selectedPeriod.startsWith("Custom")) {
      const allTransactions = Object.values(financialData).flatMap((period) => period.transactions)
      currentTransactions = allTransactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date)
        const startDate = new Date(customDateRange.start)
        const endDate = new Date(customDateRange.end)
        return transactionDate >= startDate && transactionDate <= endDate
      })
    }

    const filtered = currentTransactions.filter((transaction) => {
      const matchesSearch =
        transaction.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = selectedStatus === "All" || transaction.status === selectedStatus
      return matchesSearch && matchesStatus
    })

    setFilteredTransactions(filtered)
    setCurrentPage(1) // Reset to first page when filter changes
  }, [searchTerm, selectedPeriod, selectedStatus, customDateRange])

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage)
  const startIndex = (currentPage - 1) * transactionsPerPage
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + transactionsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleShowServices = (services, memberName) => {
    setSelectedServices(services)
    setSelectedMemberName(memberName)
    setServicesModalOpen(true)
  }

  const handleCustomDateApply = (startDate, endDate) => {
    setCustomDateRange({ start: startDate, end: endDate })
    setSelectedPeriod(`Custom (${startDate} to ${endDate})`)
  }

  // CSV Export Function
  const exportToCSV = () => {
    const headers = ["Member Name", "Date", "Type", "Amount", "Status", "Services"]
    const csvData = filteredTransactions.map((transaction) => [
      transaction.memberName,
      formatDate(transaction.date),
      transaction.type,
      transaction.amount,
      transaction.status,
      transaction.services.map((service) => `${service.name}: $${service.cost}`).join("; "),
    ])

    const csvContent = [headers.join(","), ...csvData.map((row) => row.map((field) => `"${field}"`).join(","))].join(
      "\n",
    )

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `financial_data_${selectedPeriod.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`,
    )
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleGenerateXml = (selectedTransactions) => {
    // In a real application, this would generate and download the XML file
    console.log("Generating SEPA XML for:", selectedTransactions)
    // Update transaction statuses
    const updatedFinancialState = { ...financialState }
    const periodData = { ...updatedFinancialState[selectedPeriod] }

    // Update transaction statuses to "Check incoming funds"
    periodData.transactions = periodData.transactions.map((tx) => {
      const selected = selectedTransactions.find((s) => s.id === tx.id)
      if (selected) {
        return {
          ...tx,
          status: "Check incoming funds",
          amount: selected.amount, // Update amount if edited
        }
      }
      return tx
    })

    // Recalculate summary data
    const successful = periodData.transactions
      .filter((tx) => tx.status === "Successful")
      .reduce((sum, tx) => sum + tx.amount, 0)
    const pending = periodData.transactions
      .filter((tx) => tx.status === "Pending" || tx.status === "Check incoming funds")
      .reduce((sum, tx) => sum + tx.amount, 0)
    const failed = periodData.transactions
      .filter((tx) => tx.status === "Failed")
      .reduce((sum, tx) => sum + tx.amount, 0)

    periodData.successfulPayments = successful
    periodData.pendingPayments = pending
    periodData.failedPayments = failed

    updatedFinancialState[selectedPeriod] = periodData
    setFinancialState(updatedFinancialState)

    // Simulate file download
    alert("SEPA XML file generated successfully!")
  }

  const handleUpdateStatuses = (updatedTransactions) => {
    const updatedFinancialState = { ...financialState }
    const periodData = { ...updatedFinancialState[selectedPeriod] }

    // Update transaction statuses
    periodData.transactions = periodData.transactions.map((tx) => {
      const updated = updatedTransactions.find((u) => u.id === tx.id)
      if (updated) {
        return {
          ...tx,
          status: updated.status,
        }
      }
      return tx
    })

    // Recalculate summary data
    const successful = periodData.transactions
      .filter((tx) => tx.status === "Successful")
      .reduce((sum, tx) => sum + tx.amount, 0)
    const pending = periodData.transactions
      .filter((tx) => tx.status === "Pending" || tx.status === "Check incoming funds")
      .reduce((sum, tx) => sum + tx.amount, 0)
    const failed = periodData.transactions
      .filter((tx) => tx.status === "Failed")
      .reduce((sum, tx) => sum + tx.amount, 0)

    periodData.successfulPayments = successful
    periodData.pendingPayments = pending
    periodData.failedPayments = failed

    updatedFinancialState[selectedPeriod] = periodData
    setFinancialState(updatedFinancialState)
    alert("Transaction statuses updated successfully!")
  }

  // Check if there are any transactions with "Check incoming funds" status
  const hasCheckingTransactions =
    financialState[selectedPeriod]?.transactions?.some((tx) => tx.status === "Check incoming funds") || false

  // Get status color class based on status value
  const getStatusColorClass = (status) => {
    switch (status) {
      case "Successful":
        return "bg-green-900/30 text-green-500"
      case "Pending":
        return "bg-yellow-900/30 text-yellow-500"
      case "Check incoming funds":
        return "bg-blue-900/30 text-blue-500"
      case "Failed":
        return "bg-red-900/30 text-red-500"
      default:
        return "bg-gray-900/30 text-gray-500"
    }
  }

  // Get current period data
  const getCurrentPeriodData = () => {
    if (customDateRange && selectedPeriod.startsWith("Custom")) {
      // Calculate custom period data
      const allTransactions = Object.values(financialData).flatMap((period) => period.transactions)
      const customTransactions = allTransactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date)
        const startDate = new Date(customDateRange.start)
        const endDate = new Date(customDateRange.end)
        return transactionDate >= startDate && transactionDate <= endDate
      })

      const successful = customTransactions
        .filter((tx) => tx.status === "Successful")
        .reduce((sum, tx) => sum + tx.amount, 0)
      const pending = customTransactions
        .filter((tx) => tx.status === "Pending" || tx.status === "Check incoming funds")
        .reduce((sum, tx) => sum + tx.amount, 0)
      const failed = customTransactions.filter((tx) => tx.status === "Failed").reduce((sum, tx) => sum + tx.amount, 0)

      return {
        totalRevenue: successful + pending + failed,
        successfulPayments: successful,
        pendingPayments: pending,
        failedPayments: failed,
        transactions: customTransactions,
      }
    }
    return financialState[selectedPeriod] || financialData[selectedPeriod]
  }

  const currentPeriodData = getCurrentPeriodData()

  return (
    <div className="bg-[#1C1C1C] p-4 md:p-6 rounded-3xl w-full">
      {/* Header with back button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-white oxanium_font text-xl md:text-2xl">Finances</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Period selector */}
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)}
              className="bg-black text-white px-4 py-2 rounded-xl border border-gray-800 flex items-center justify-between gap-2 w-full sm:w-auto min-w-[180px]"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{selectedPeriod}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {periodDropdownOpen && (
              <div className="absolute z-10 mt-2 w-full bg-[#2F2F2F]/90 backdrop-blur-2xl rounded-xl border border-gray-800 shadow-lg">
                {Object.keys(financialState).map((period) => (
                  <button
                    key={period}
                    className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-black text-left"
                    onClick={() => {
                      setSelectedPeriod(period)
                      setPeriodDropdownOpen(false)
                    }}
                  >
                    {period}
                  </button>
                ))}
                <button
                  className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-black text-left border-t border-gray-700"
                  onClick={() => {
                    setCustomDateModalOpen(true)
                    setPeriodDropdownOpen(false)
                  }}
                >
                  Custom Period
                </button>
              </div>
            )}
          </div>
          {/* Export buttons */}
          <div className="flex gap-2 w-full sm:w-auto">
            {/* CSV Export button */}
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-1.5 rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-green-600/90 transition-colors w-full sm:w-auto"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            {/* SEPA XML button */}
            <button
              onClick={() => setSepaModalOpen(true)}
              className="bg-[#3F74FF] text-white px-4 py-1.5 rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-[#3F74FF]/90 transition-colors w-full sm:w-auto"
            >
              <Download className="w-4 h-4" />
              <span>Run Payment</span>
            </button>
            {/* Check Funds button - only show if there are transactions to check */}
            {hasCheckingTransactions && (
              <button
                onClick={() => setCheckFundsModalOpen(true)}
                className="bg-[#2F2F2F] text-white px-4 py-1.5 rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-[#2F2F2F]/90 transition-colors w-full sm:w-auto"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Check Incoming Funds</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Financial summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#141414] p-4 rounded-xl">
          <h3 className="text-gray-400 text-sm mb-1">Total Revenue</h3>
          <p className="text-white text-xl font-semibold">{formatCurrency(currentPeriodData.totalRevenue)}</p>
        </div>
        <div className="bg-[#141414] p-4 rounded-xl">
          <h3 className="text-gray-400 text-sm mb-1">Successful Payments</h3>
          <p className="text-green-500 text-xl font-semibold">{formatCurrency(currentPeriodData.successfulPayments)}</p>
        </div>
        <div className="bg-[#141414] p-4 rounded-xl">
          <h3 className="text-gray-400 text-sm mb-1">Pending Payments</h3>
          <p className="text-yellow-500 text-xl font-semibold">{formatCurrency(currentPeriodData.pendingPayments)}</p>
        </div>
        <div className="bg-[#141414] p-4 rounded-xl">
          <h3 className="text-gray-400 text-sm mb-1">Failed Payments</h3>
          <p className="text-red-500 text-xl font-semibold">{formatCurrency(currentPeriodData.failedPayments)}</p>
        </div>
      </div>

      {/* Search and Filter row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* Search input */}
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-black text-white px-4 py-2.5 rounded-xl border border-gray-800 w-full focus:outline-none focus:ring-1 focus:ring-[#3F74FF] text-sm"
          />
        </div>
        {/* Status filter */}
        <div className="relative">
          <button
            onClick={() => setStatusFilterOpen(!statusFilterOpen)}
            className="bg-black text-white px-4 py-2.5 rounded-xl border border-gray-800 flex items-center justify-between gap-2 min-w-[180px] w-full sm:w-auto"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">Status: {selectedStatus}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {statusFilterOpen && (
            <div className="absolute right-0 z-10 mt-2 w-full bg-[#2F2F2F]/90 backdrop-blur-2xl rounded-xl border border-gray-800 shadow-lg">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  className={`w-full px-4 py-2 text-sm text-left flex items-center space-x-2 hover:bg-black ${
                    selectedStatus === status ? "bg-black/50" : ""
                  }`}
                  onClick={() => {
                    setSelectedStatus(status)
                    setStatusFilterOpen(false)
                  }}
                >
                  {status !== "All" && (
                    <span className={`inline-block w-3 h-3 rounded-full ${getStatusColorClass(status)}`}></span>
                  )}
                  <span className="text-gray-300">{status}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transactions table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-[#141414]">
            <tr>
              <th scope="col" className="px-4 py-3 rounded-tl-xl">
                Member
              </th>
              <th scope="col" className="px-4 py-3">
                Date
              </th>
              <th scope="col" className="px-4 py-3">
                Type
              </th>
              <th scope="col" className="px-4 py-3">
                Amount
              </th>
              <th scope="col" className="px-4 py-3">
                Services
              </th>
              <th scope="col" className="px-4 py-3 rounded-tr-xl">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map((transaction, index) => (
              <tr
                key={transaction.id}
                className={`border-b border-gray-800 ${
                  index === paginatedTransactions.length - 1 ? "rounded-b-xl" : ""
                }`}
              >
                <td className="px-4 py-3">{transaction.memberName}</td>
                <td className="px-4 py-3">{formatDate(transaction.date)}</td>
                <td className="px-4 py-3">{transaction.type}</td>
                <td className="px-4 py-3">{formatCurrency(transaction.amount)}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleShowServices(transaction.services, transaction.memberName)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      transaction.status === "Successful"
                        ? "bg-green-900/30 text-green-500"
                        : transaction.status === "Pending"
                          ? "bg-yellow-900/30 text-yellow-500"
                          : transaction.status === "Check incoming funds"
                            ? "bg-blue-900/30 text-blue-500"
                            : "bg-red-900/30 text-red-500"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No transactions message */}
      {filteredTransactions.length === 0 && (
        <div className="bg-[#141414] p-6 rounded-xl text-center mt-4">
          <p className="text-gray-400">No transactions found matching your criteria.</p>
        </div>
      )}

      {/* Pagination */}
      {filteredTransactions.length > transactionsPerPage && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-xl bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors border border-gray-800"
          >
            Previous
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1.5 rounded-xl transition-colors border ${
                  currentPage === page
                    ? "bg-[#3F74FF] text-white border-transparent"
                    : "bg-black text-white border-gray-800 hover:bg-gray-900"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-xl bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors border border-gray-800"
          >
            Next
          </button>
        </div>
      )}

      <SepaXmlModal
        isOpen={sepaModalOpen}
        onClose={() => setSepaModalOpen(false)}
        selectedPeriod={selectedPeriod}
        transactions={currentPeriodData.transactions}
        onGenerateXml={handleGenerateXml}
      />
      <CheckFundsModal
        isOpen={checkFundsModalOpen}
        onClose={() => setCheckFundsModalOpen(false)}
        transactions={currentPeriodData.transactions}
        onUpdateStatuses={handleUpdateStatuses}
      />
      <ServicesModal
        isOpen={servicesModalOpen}
        onClose={() => setServicesModalOpen(false)}
        services={selectedServices}
        memberName={selectedMemberName}
      />
      <CustomDateModal
        isOpen={customDateModalOpen}
        onClose={() => setCustomDateModalOpen(false)}
        onApply={handleCustomDateApply}
      />
    </div>
  )
}
