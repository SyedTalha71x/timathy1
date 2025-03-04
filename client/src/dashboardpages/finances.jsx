import { useState, useEffect } from "react"
import { Download, Calendar, ChevronDown } from "lucide-react"

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
      },
      {
        id: "tx-002",
        memberName: "Jane Smith",
        date: "2023-05-14",
        amount: 200,
        status: "Successful",
        type: "Monthly Payment",
      },
      {
        id: "tx-003",
        memberName: "Bob Johnson",
        date: "2023-05-12",
        amount: 150,
        status: "Failed",
        type: "Monthly Payment",
      },
      {
        id: "tx-004",
        memberName: "Alice Williams",
        date: "2023-05-10",
        amount: 300,
        status: "Pending",
        type: "Monthly Payment",
      },
      {
        id: "tx-005",
        memberName: "Charlie Brown",
        date: "2023-05-08",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
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
      },
      {
        id: "tx-102",
        memberName: "Jane Smith",
        date: "2023-04-14",
        amount: 200,
        status: "Successful",
        type: "Monthly Payment",
      },
      {
        id: "tx-103",
        memberName: "Bob Johnson",
        date: "2023-04-12",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
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
      },
      {
        id: "tx-202",
        memberName: "Jane Smith",
        date: "2023-02-14",
        amount: 200,
        status: "Failed",
        type: "Monthly Payment",
      },
      {
        id: "tx-203",
        memberName: "Bob Johnson",
        date: "2023-01-12",
        amount: 150,
        status: "Pending",
        type: "Monthly Payment",
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
      },
      {
        id: "tx-302",
        memberName: "Jane Smith",
        date: "2022-11-14",
        amount: 200,
        status: "Successful",
        type: "Monthly Payment",
      },
      {
        id: "tx-303",
        memberName: "Bob Johnson",
        date: "2022-10-12",
        amount: 150,
        status: "Failed",
        type: "Monthly Payment",
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
      },
      {
        id: "tx-402",
        memberName: "Jane Smith",
        date: "2023-02-14",
        amount: 200,
        status: "Successful",
        type: "Monthly Payment",
      },
      {
        id: "tx-403",
        memberName: "Bob Johnson",
        date: "2023-03-12",
        amount: 150,
        status: "Pending",
        type: "Monthly Payment",
      },
    ],
  },
}

export default function FinancesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("This Month")
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredTransactions, setFilteredTransactions] = useState(financialData[selectedPeriod].transactions)
  const [currentPage, setCurrentPage] = useState(1)
  const transactionsPerPage = 5

  useEffect(() => {
    // Filter transactions based on search term
    const filtered = financialData[selectedPeriod].transactions.filter(
      (transaction) =>
        transaction.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.type.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredTransactions(filtered)
    setCurrentPage(1) // Reset to first page when filter changes
  }, [searchTerm, selectedPeriod])

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
                {Object.keys(financialData).map((period) => (
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
              </div>
            )}
          </div>

          {/* Export button */}
          <button className="bg-[#3F74FF] text-white px-4 py-1.5 rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-[#3F74FF]/90 transition-colors w-full sm:w-auto">
            <Download className="w-4 h-4" />
            <span>Generate Sepa Xml</span>
          </button>
        </div>
      </div>

      {/* Financial summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#141414] p-4 rounded-xl">
          <h3 className="text-gray-400 text-sm mb-1">Total Revenue</h3>
          <p className="text-white text-xl font-semibold">
            {formatCurrency(financialData[selectedPeriod].totalRevenue)}
          </p>
        </div>
        <div className="bg-[#141414] p-4 rounded-xl">
          <h3 className="text-gray-400 text-sm mb-1">Successful Payments</h3>
          <p className="text-green-500 text-xl font-semibold">
            {formatCurrency(financialData[selectedPeriod].successfulPayments)}
          </p>
        </div>
        <div className="bg-[#141414] p-4 rounded-xl">
          <h3 className="text-gray-400 text-sm mb-1">Pending Payments</h3>
          <p className="text-yellow-500 text-xl font-semibold">
            {formatCurrency(financialData[selectedPeriod].pendingPayments)}
          </p>
        </div>
        <div className="bg-[#141414] p-4 rounded-xl">
          <h3 className="text-gray-400 text-sm mb-1">Failed Payments</h3>
          <p className="text-red-500 text-xl font-semibold">
            {formatCurrency(financialData[selectedPeriod].failedPayments)}
          </p>
        </div>
      </div>

      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-black text-white px-4 py-2.5 rounded-xl border border-gray-800 w-full focus:outline-none focus:ring-1 focus:ring-[#3F74FF] text-sm"
        />
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
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      transaction.status === "Successful"
                        ? "bg-green-900/30 text-green-500"
                        : transaction.status === "Pending"
                          ? "bg-yellow-900/30 text-yellow-500"
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
    </div>
  )
}

