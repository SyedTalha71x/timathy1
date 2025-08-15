// admin panel finance code
/* eslint-disable react/prop-types */

import { useState, useEffect } from "react"
import { Download, Calendar, ChevronDown, RefreshCw, Filter, Info, X, FileText, Trash2, Eye } from "lucide-react"
import CheckFundsModal from "../../components/customer-dashboard/studios-modal/check-funds-modal"
import SepaXmlModal from "../../components/customer-dashboard/studios-modal/sepa-xml-modal"

const financialData = {
  "This Month": {
    totalRevenue: 12500,
    pendingPayments: 1800,
    failedPayments: 750,
    successfulPayments: 9950,
    transactions: [
      {
        id: "tx-001",
        studioName: "Creative Studio A",
        studioOwner: "John Doe",
        date: "2023-05-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Studio Rental", cost: 100, description: "Monthly studio space rental" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-002",
        studioName: "Design Hub Pro",
        studioOwner: "Jane Smith",
        date: "2023-05-14",
        amount: 200,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Premium Studio", cost: 150, description: "Large studio with premium equipment" },
          { name: "Storage", cost: 25, description: "Additional storage space" },
          { name: "Support Services", cost: 25, description: "Technical support and maintenance" },
        ],
      },
      {
        id: "tx-003",
        studioName: "Art Space Beta",
        studioOwner: "Bob Johnson",
        date: "2023-05-12",
        amount: 150,
        status: "Failed",
        type: "Monthly Payment",
        services: [
          { name: "Studio Rental", cost: 120, description: "Standard studio space" },
          { name: "Cleaning Service", cost: 30, description: "Weekly cleaning service" },
        ],
      },
      {
        id: "tx-004",
        studioName: "Media Works",
        studioOwner: "Alice Williams",
        date: "2023-05-10",
        amount: 300,
        status: "Pending",
        type: "Monthly Payment",
        services: [
          { name: "Premium Studio", cost: 200, description: "Large studio with premium equipment" },
          { name: "Equipment Rental", cost: 50, description: "Specialized equipment rental" },
          { name: "Technical Support", cost: 50, description: "Dedicated technical support" },
        ],
      },
      {
        id: "tx-005",
        studioName: "Creative Lab",
        studioOwner: "Charlie Brown",
        date: "2023-05-08",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Studio Rental", cost: 100, description: "Monthly studio space rental" },
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
        studioName: "Creative Studio A",
        studioOwner: "John Doe",
        date: "2023-04-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Studio Rental", cost: 100, description: "Monthly studio space rental" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-102",
        studioName: "Design Hub Pro",
        studioOwner: "Jane Smith",
        date: "2023-04-14",
        amount: 200,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Premium Studio", cost: 150, description: "Large studio with premium equipment" },
          { name: "Storage", cost: 25, description: "Additional storage space" },
          { name: "Support Services", cost: 25, description: "Technical support and maintenance" },
        ],
      },
      {
        id: "tx-103",
        studioName: "Art Space Beta",
        studioOwner: "Bob Johnson",
        date: "2023-04-12",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Studio Rental", cost: 120, description: "Standard studio space" },
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
        studioName: "Creative Studio A",
        studioOwner: "John Doe",
        date: "2023-03-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Studio Rental", cost: 100, description: "Monthly studio space rental" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-202",
        studioName: "Design Hub Pro",
        studioOwner: "Jane Smith",
        date: "2023-02-14",
        amount: 200,
        status: "Failed",
        type: "Monthly Payment",
        services: [
          { name: "Premium Studio", cost: 150, description: "Large studio with premium equipment" },
          { name: "Storage", cost: 25, description: "Additional storage space" },
          { name: "Support Services", cost: 25, description: "Technical support and maintenance" },
        ],
      },
      {
        id: "tx-203",
        studioName: "Art Space Beta",
        studioOwner: "Bob Johnson",
        date: "2023-01-12",
        amount: 150,
        status: "Pending",
        type: "Monthly Payment",
        services: [
          { name: "Studio Rental", cost: 120, description: "Standard studio space" },
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
        studioName: "Creative Studio A",
        studioOwner: "John Doe",
        date: "2022-12-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Studio Rental", cost: 100, description: "Monthly studio space rental" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-302",
        studioName: "Design Hub Pro",
        studioOwner: "Jane Smith",
        date: "2022-11-14",
        amount: 200,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Premium Studio", cost: 150, description: "Large studio with premium equipment" },
          { name: "Storage", cost: 25, description: "Additional storage space" },
          { name: "Support Services", cost: 25, description: "Technical support and maintenance" },
        ],
      },
      {
        id: "tx-303",
        studioName: "Art Space Beta",
        studioOwner: "Bob Johnson",
        date: "2022-10-12",
        amount: 150,
        status: "Failed",
        type: "Monthly Payment",
        services: [
          { name: "Studio Rental", cost: 120, description: "Standard studio space" },
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
        studioName: "Creative Studio A",
        studioOwner: "John Doe",
        date: "2023-01-15",
        amount: 150,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Studio Rental", cost: 100, description: "Monthly studio space rental" },
          { name: "Equipment Usage", cost: 30, description: "Professional equipment access" },
          { name: "Utilities", cost: 20, description: "Electricity and internet" },
        ],
      },
      {
        id: "tx-402",
        studioName: "Design Hub Pro",
        studioOwner: "Jane Smith",
        date: "2023-02-14",
        amount: 200,
        status: "Successful",
        type: "Monthly Payment",
        services: [
          { name: "Premium Studio", cost: 150, description: "Large studio with premium equipment" },
          { name: "Storage", cost: 25, description: "Additional storage space" },
          { name: "Support Services", cost: 25, description: "Technical support and maintenance" },
        ],
      },
      {
        id: "tx-403",
        studioName: "Art Space Beta",
        studioOwner: "Bob Johnson",
        date: "2023-03-12",
        amount: 150,
        status: "Pending",
        type: "Monthly Payment",
        services: [
          { name: "Studio Rental", cost: 120, description: "Standard studio space" },
          { name: "Cleaning Service", cost: 30, description: "Weekly cleaning service" },
        ],
      },
    ],
  },
}

// Services Modal Component
const ServicesModal = ({ isOpen, onClose, services, studioName }) => {
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
            <h3 className="text-white font-medium mb-2">{studioName}</h3>
            <p className="text-gray-400 text-sm">Cost breakdown for this studio</p>
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

// Documents Modal Component
const DocumentsModal = ({ isOpen, onClose, documents, onDeleteDocument, onViewDocument }) => {
  if (!isOpen) return null

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-400" />
            <h2 className="text-white text-lg font-medium">SEPA XML Documents</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-grow">
          {documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No SEPA XML documents generated yet</p>
              <p className="text-gray-500 text-sm mt-2">Generated XML files will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="bg-[#141414] p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-900/30 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{doc.filename}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                        <span>Generated: {formatDate(doc.createdAt)}</span>
                        <span>Size: {formatFileSize(doc.size)}</span>
                        <span>Transactions: {doc.transactionCount}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewDocument(doc)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                      title="View Document"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        const element = document.createElement("a")
                        const file = new Blob([doc.content], { type: "application/xml" })
                        element.href = URL.createObjectURL(file)
                        element.download = doc.filename
                        document.body.appendChild(element)
                        element.click()
                        document.body.removeChild(element)
                      }}
                      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteDocument(doc.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Document Viewer Modal Component
const DocumentViewerModal = ({ isOpen, onClose, document }) => {
  if (!isOpen || !document) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-400" />
            <h2 className="text-white text-lg font-medium">{document.filename}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-grow">
          <pre className="bg-[#0D1117] p-4 rounded-lg text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
            {document.content}
          </pre>
        </div>

        <div className="p-4 border-t border-gray-800 flex justify-end">
          <button
            onClick={() => {
              const element = document.createElement("a")
              const file = new Blob([document.content], { type: "application/xml" })
              element.href = URL.createObjectURL(file)
              element.download = document.filename
              document.body.appendChild(element)
              element.click()
              document.body.removeChild(element)
            }}
            className="bg-[#3F74FF] text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-[#3F74FF]/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
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
  const [editingAmount, setEditingAmount] = useState(null)
  const [editAmount, setEditAmount] = useState("")
  const [servicesModalOpen, setServicesModalOpen] = useState(false)
  const [selectedServices, setSelectedServices] = useState([])
  const [selectedStudioName, setSelectedStudioName] = useState("")
  const [documentsModalOpen, setDocumentsModalOpen] = useState(false)
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [sepaDocuments, setSepaDocuments] = useState([
    // Sample documents for demonstration
    {
      id: "doc-001",
      filename: "SEPA_Payment_2023-05-15.xml",
      createdAt: "2023-05-15T10:30:00Z",
      size: 2048,
      transactionCount: 3,
      content: `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03">
  <CstmrCdtTrfInitn>
    <GrpHdr>
      <MsgId>MSG-001-20230515</MsgId>
      <CreDtTm>2023-05-15T10:30:00</CreDtTm>
      <NbOfTxs>3</NbOfTxs>
      <CtrlSum>500.00</CtrlSum>
    </GrpHdr>
    <PmtInf>
      <PmtInfId>PMT-001</PmtInfId>
      <PmtMtd>TRF</PmtMtd>
      <ReqdExctnDt>2023-05-16</ReqdExctnDt>
      <Dbtr>
        <Nm>Studio Management Company</Nm>
      </Dbtr>
    </PmtInf>
  </CstmrCdtTrfInitn>
</Document>`,
    },
    {
      id: "doc-002",
      filename: "SEPA_Payment_2023-05-10.xml",
      createdAt: "2023-05-10T14:15:00Z",
      size: 1536,
      transactionCount: 2,
      content: `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03">
  <CstmrCdtTrfInitn>
    <GrpHdr>
      <MsgId>MSG-002-20230510</MsgId>
      <CreDtTm>2023-05-10T14:15:00</CreDtTm>
      <NbOfTxs>2</NbOfTxs>
      <CtrlSum>350.00</CtrlSum>
    </GrpHdr>
    <PmtInf>
      <PmtInfId>PMT-002</PmtInfId>
      <PmtMtd>TRF</PmtMtd>
      <ReqdExctnDt>2023-05-11</ReqdExctnDt>
      <Dbtr>
        <Nm>Studio Management Company</Nm>
      </Dbtr>
    </PmtInf>
  </CstmrCdtTrfInitn>
</Document>`,
    },
  ])

  const transactionsPerPage = 5

  // Get all possible status values
  const statusOptions = ["All", "Successful", "Pending", "Failed", "Check incoming funds"]

  useEffect(() => {
    // Filter transactions based on search term and selected status
    const filtered = financialData[selectedPeriod].transactions.filter((transaction) => {
      const matchesSearch =
        transaction.studioName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.studioOwner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.type.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = selectedStatus === "All" || transaction.status === selectedStatus

      return matchesSearch && matchesStatus
    })
    setFilteredTransactions(filtered)
    setCurrentPage(1) // Reset to first page when filter changes
  }, [searchTerm, selectedPeriod, selectedStatus])

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

  const handleEditAmount = (transactionId, currentAmount) => {
    setEditingAmount(transactionId)
    setEditAmount(currentAmount.toString())
  }

  const handleSaveAmount = (transactionId) => {
    const newAmount = Number.parseFloat(editAmount)
    if (!isNaN(newAmount) && newAmount > 0) {
      // Update the amount in the financial state
      const updatedFinancialState = { ...financialState }
      const periodData = { ...updatedFinancialState[selectedPeriod] }

      periodData.transactions = periodData.transactions.map((tx) =>
        tx.id === transactionId ? { ...tx, amount: newAmount } : tx,
      )

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
      periodData.totalRevenue = successful + pending + failed

      updatedFinancialState[selectedPeriod] = periodData
      setFinancialState(updatedFinancialState)
    }

    setEditingAmount(null)
    setEditAmount("")
  }

  const handleCancelEdit = () => {
    setEditingAmount(null)
    setEditAmount("")
  }

  const handleShowServices = (services, studioName) => {
    setSelectedServices(services)
    setSelectedStudioName(studioName)
    setServicesModalOpen(true)
  }

  const generateSepaXmlContent = (transactions) => {
    const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0)
    const timestamp = new Date().toISOString()
    const msgId = `MSG-${Date.now()}`

    return `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03">
  <CstmrCdtTrfInitn>
    <GrpHdr>
      <MsgId>${msgId}</MsgId>
      <CreDtTm>${timestamp}</CreDtTm>
      <NbOfTxs>${transactions.length}</NbOfTxs>
      <CtrlSum>${totalAmount.toFixed(2)}</CtrlSum>
    </GrpHdr>
    <PmtInf>
      <PmtInfId>PMT-${Date.now()}</PmtInfId>
      <PmtMtd>TRF</PmtMtd>
      <ReqdExctnDt>${new Date(Date.now() + 86400000).toISOString().split("T")[0]}</ReqdExctnDt>
      <Dbtr>
        <Nm>Studio Management Company</Nm>
      </Dbtr>
      ${transactions
        .map(
          (tx) => `
      <CdtTrfTxInf>
        <PmtId>
          <InstrId>${tx.id}</InstrId>
        </PmtId>
        <Amt>
          <InstdAmt Ccy="USD">${tx.amount.toFixed(2)}</InstdAmt>
        </Amt>
        <Cdtr>
          <Nm>${tx.studioName}</Nm>
        </Cdtr>
        <RmtInf>
          <Ustrd>${tx.type} - ${tx.studioOwner}</Ustrd>
        </RmtInf>
      </CdtTrfTxInf>`,
        )
        .join("")}
    </PmtInf>
  </CstmrCdtTrfInitn>
</Document>`
  }

  const handleGenerateXml = (selectedTransactions) => {
    // Generate XML content
    const xmlContent = generateSepaXmlContent(selectedTransactions)

    // Create new document
    const newDocument = {
      id: `doc-${Date.now()}`,
      filename: `SEPA_Payment_${new Date().toISOString().split("T")[0]}_${Date.now()}.xml`,
      createdAt: new Date().toISOString(),
      size: new Blob([xmlContent]).size,
      transactionCount: selectedTransactions.length,
      content: xmlContent,
    }

    // Add to documents list
    setSepaDocuments((prev) => [newDocument, ...prev])

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

    // Download the file
    const element = document.createElement("a")
    const file = new Blob([xmlContent], { type: "application/xml" })
    element.href = URL.createObjectURL(file)
    element.download = newDocument.filename
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    alert("SEPA XML file generated and saved successfully!")
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

  const handleDeleteDocument = (documentId) => {
    if (confirm("Are you sure you want to delete this document?")) {
      setSepaDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
    }
  }

  const handleViewDocument = (document) => {
    setSelectedDocument(document)
    setDocumentViewerOpen(true)
  }

  // Check if there are any transactions with "Check incoming funds" status
  const hasCheckingTransactions = financialState[selectedPeriod].transactions.some(
    (tx) => tx.status === "Check incoming funds",
  )

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

  return (
    <div className="bg-[#1C1C1C] p-4 md:p-6 rounded-3xl w-full">
      {/* Header with back button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-white oxanium_font text-xl md:text-2xl">Finances</h1>
          {/* Documents Icon */}
          <button
            onClick={() => setDocumentsModalOpen(true)}
            className="bg-[#2F2F2F] text-white p-2 rounded-xl border border-gray-800 hover:bg-[#2F2F2F]/90 transition-colors relative"
            title="View SEPA XML Documents"
          >
            <FileText className="w-5 h-5" />
            {sepaDocuments.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#3F74FF] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {sepaDocuments.length}
              </span>
            )}
          </button>
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
              </div>
            )}
          </div>

          {/* Export button */}
          <div className="flex gap-2 w-full sm:w-auto">
            {/* SEPA XML button */}
            <button
              onClick={() => setSepaModalOpen(true)}
              className="bg-[#3F74FF] text-white px-4 py-1.5 rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-[#3F74FF]/90 transition-colors w-full sm:w-auto"
            >
              <Download className="w-4 h-4" />
              <span> Run Payment</span>
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
          <p className="text-white text-xl font-semibold">
            {formatCurrency(financialState[selectedPeriod].totalRevenue)}
          </p>
        </div>
        <div className="bg-[#141414] p-4 rounded-xl">
          <h3 className="text-gray-400 text-sm mb-1">Successful Payments</h3>
          <p className="text-green-500 text-xl font-semibold">
            {formatCurrency(financialState[selectedPeriod].successfulPayments)}
          </p>
        </div>
        <div className="bg-[#141414] p-4 rounded-xl">
          <h3 className="text-gray-400 text-sm mb-1">Pending Payments</h3>
          <p className="text-yellow-500 text-xl font-semibold">
            {formatCurrency(financialState[selectedPeriod].pendingPayments)}
          </p>
        </div>
        <div className="bg-[#141414] p-4 rounded-xl">
          <h3 className="text-gray-400 text-sm mb-1">Failed Payments</h3>
          <p className="text-red-500 text-xl font-semibold">
            {formatCurrency(financialState[selectedPeriod].failedPayments)}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
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
                  className={`w-full px-4 py-2 text-sm text-left flex items-center space-x-2 hover:bg-black ${selectedStatus === status ? "bg-black/50" : ""}`}
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
                Studio
              </th>
              <th scope="col" className="px-4 py-3">
                Studio Owner
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
                <td className="px-4 py-3 font-medium">{transaction.studioName}</td>
                <td className="px-4 py-3">{transaction.studioOwner}</td>
                <td className="px-4 py-3">{formatDate(transaction.date)}</td>
                <td className="px-4 py-3">{transaction.type}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {editingAmount === transaction.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          className="bg-black text-white px-2 py-1 rounded border border-gray-700 w-20"
                          step="0.01"
                          min="0"
                        />
                        <button
                          onClick={() => handleSaveAmount(transaction.id)}
                          className="text-green-500 hover:text-green-400 text-xs"
                        >
                          Save
                        </button>
                        <button onClick={handleCancelEdit} className="text-red-500 hover:text-red-400 text-xs">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>{formatCurrency(transaction.amount)}</span>
                        <button
                          onClick={() => handleEditAmount(transaction.id, transaction.amount)}
                          className="text-gray-400 hover:text-white"
                        >
                          {/* <Edit2 className="w-3 h-3" /> */}
                        </button>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleShowServices(transaction.services, transaction.studioName)}
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
        transactions={financialState[selectedPeriod].transactions}
        onGenerateXml={handleGenerateXml}
      />

      <CheckFundsModal
        isOpen={checkFundsModalOpen}
        onClose={() => setCheckFundsModalOpen(false)}
        transactions={financialState[selectedPeriod].transactions}
        onUpdateStatuses={handleUpdateStatuses}
      />

      <ServicesModal
        isOpen={servicesModalOpen}
        onClose={() => setServicesModalOpen(false)}
        services={selectedServices}
        studioName={selectedStudioName}
      />

      <DocumentsModal
        isOpen={documentsModalOpen}
        onClose={() => setDocumentsModalOpen(false)}
        documents={sepaDocuments}
        onDeleteDocument={handleDeleteDocument}
        onViewDocument={handleViewDocument}
      />

      <DocumentViewerModal
        isOpen={documentViewerOpen}
        onClose={() => setDocumentViewerOpen(false)}
        document={selectedDocument}
      />
    </div>
  )
}
