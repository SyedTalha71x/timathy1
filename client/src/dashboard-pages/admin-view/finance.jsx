/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import { Download, Calendar, ChevronDown, RefreshCw, Filter, Info, FileText } from "lucide-react"
import toast from "react-hot-toast"
import { IoIosMenu } from "react-icons/io"

import { financialData } from "../../utils/admin-panel-states/finance-states"
import Sidebar from "../../components/admin-dashboard-components/central-sidebar"

import CheckFundsModal from "../../components/admin-dashboard-components/studios-modal/check-funds-modal"
import SepaXmlModal from "../../components/admin-dashboard-components/studios-modal/sepa-xml-modal"
import ServicesModal from "../../components/admin-dashboard-components/finance-components/services-modal"
import DocumentsModal from "../../components/admin-dashboard-components/finance-components/documents-modal"
import DocumentViewerModal from "../../components/admin-dashboard-components/finance-components/document-viewer-modal"
import WebsiteLinkModal from "../../components/admin-dashboard-components/myarea-components/website-link-modal"
import WidgetSelectionModal from "../../components/admin-dashboard-components/myarea-components/widgets"
import ConfirmationModal from "../../components/admin-dashboard-components/myarea-components/confirmation-modal"
import ExportConfirmationModal from "../../components/admin-dashboard-components/finance-components/export-confirmation-modal"

export default function FinancesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("This Month")
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false)
  const [statusFilterOpen, setStatusFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [filteredTransactions, setFilteredTransactions] = useState(financialData[selectedPeriod]?.transactions || [])
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

  const [customPeriodStart, setCustomPeriodStart] = useState("")
  const [customPeriodEnd, setCustomPeriodEnd] = useState("")
  const [showCustomPeriodInput, setShowCustomPeriodInput] = useState(false)

  const [exportConfirmationOpen, setExportConfirmationOpen] = useState(false)


  const periodOptions = [
    "Overall",
    "This Month",
    "Last Month",
    "Last 3 Months",
    "Last 6 Months",
    "This Year",
    "Custom Period",
  ]

  const [sepaDocuments, setSepaDocuments] = useState([
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
  const [customPeriodModalOpen, setCustomPeriodModalOpen] = useState(false)

  const transactionsPerPage = 5
  const statusOptions = ["All", "Successful", "Pending", "Failed", "Check incoming funds"]

  // Calculate financial summary data
  const calculateFinancialSummary = () => {
    if (selectedPeriod === "Overall") {
      const allTransactions = Object.values(financialData).flatMap((period) => period.transactions || [])

      const successful = allTransactions
        .filter((tx) => tx.status === "Successful")
        .reduce((sum, tx) => sum + tx.amount, 0)

      const pending = allTransactions
        .filter((tx) => tx.status === "Pending" || tx.status === "Check incoming funds")
        .reduce((sum, tx) => sum + tx.amount, 0)

      const failed = allTransactions.filter((tx) => tx.status === "Failed").reduce((sum, tx) => sum + tx.amount, 0)

      return {
        totalRevenue: successful + pending + failed,
        successfulPayments: successful,
        pendingPayments: pending,
        failedPayments: failed,
        transactions: allTransactions,
      }
    } else if (selectedPeriod === "Custom Period" && customPeriodStart && customPeriodEnd) {
      const startDate = new Date(customPeriodStart)
      const endDate = new Date(customPeriodEnd)

      const customTransactions = Object.values(financialData)
        .flatMap((period) => period.transactions || [])
        .filter((transaction) => {
          const transactionDate = new Date(transaction.date)
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
    } else {
      // Safely access the period data with fallback
      const periodData = financialData[selectedPeriod] || {
        totalRevenue: 0,
        successfulPayments: 0,
        pendingPayments: 0,
        failedPayments: 0,
        transactions: [],
      }

      return periodData
    }
  }
  const financialSummary = calculateFinancialSummary()

  //sidebar related logic and states
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedMemberType, setSelectedMemberType] = useState("Studios Acquired")
  const [isRightWidgetModalOpen, setIsRightWidgetModalOpen] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, linkId: null })
  const [editingLink, setEditingLink] = useState(null)
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null)

  const [sidebarWidgets, setSidebarWidgets] = useState([
    { id: "sidebar-chart", type: "chart", position: 0 },
    { id: "sidebar-todo", type: "todo", position: 1 },
    { id: "sidebar-websiteLink", type: "websiteLink", position: 2 },
    { id: "sidebar-expiringContracts", type: "expiringContracts", position: 3 },
  ])

  const [todos, setTodos] = useState([
    {
      id: 1,
      title: "Review Design",
      description: "Review the new dashboard design",
      assignee: "Jack",
      dueDate: "2024-12-15",
      dueTime: "14:30",
    },
    {
      id: 2,
      title: "Team Meeting",
      description: "Weekly team sync",
      assignee: "Jack",
      dueDate: "2024-12-16",
      dueTime: "10:00",
    },
  ])

  const memberTypes = {
    "Studios Acquired": {
      data: [
        [30, 45, 60, 75, 90, 105, 120, 135, 150],
        [25, 40, 55, 70, 85, 100, 115, 130, 145],
      ],
      growth: "12%",
      title: "Studios Acquired",
    },
    Finance: {
      data: [
        [50000, 60000, 75000, 85000, 95000, 110000, 125000, 140000, 160000],
        [45000, 55000, 70000, 80000, 90000, 105000, 120000, 135000, 155000],
      ],
      growth: "8%",
      title: "Finance Statistics",
    },
    Leads: {
      data: [
        [120, 150, 180, 210, 240, 270, 300, 330, 360],
        [100, 130, 160, 190, 220, 250, 280, 310, 340],
      ],
      growth: "15%",
      title: "Leads Statistics",
    },
    Franchises: {
      data: [
        [120, 150, 180, 210, 240, 270, 300, 330, 360],
        [100, 130, 160, 190, 220, 250, 280, 310, 340],
      ],
      growth: "10%",
      title: "Franchises Acquired",
    },
  }

  const [customLinks, setCustomLinks] = useState([
    {
      id: "link1",
      url: "https://fitness-web-kappa.vercel.app/",
      title: "Timathy Fitness Town",
    },
    { id: "link2", url: "https://oxygengym.pk/", title: "Oxygen Gyms" },
    { id: "link3", url: "https://fitness-web-kappa.vercel.app/", title: "Timathy V1" },
  ])

  const [expiringContracts, setExpiringContracts] = useState([
    {
      id: 1,
      title: "Oxygen Gym Membership",
      expiryDate: "June 30, 2025",
      status: "Expiring Soon",
    },
    {
      id: 2,
      title: "Timathy Fitness Equipment Lease",
      expiryDate: "July 15, 2025",
      status: "Expiring Soon",
    },
    {
      id: 3,
      title: "Studio Space Rental",
      expiryDate: "August 5, 2025",
      status: "Expiring Soon",
    },
    {
      id: 4,
      title: "Insurance Policy",
      expiryDate: "September 10, 2025",
      status: "Expiring Soon",
    },
    {
      id: 5,
      title: "Software License",
      expiryDate: "October 20, 2025",
      status: "Expiring Soon",
    },
  ])

  // -------------- end of sidebar logic

  useEffect(() => {
    let transactions = []

    if (selectedPeriod === "Overall") {
      transactions = Object.values(financialData).flatMap((period) => period.transactions || [])
    } else if (selectedPeriod === "Custom Period" && customPeriodStart && customPeriodEnd) {
      const startDate = new Date(customPeriodStart)
      const endDate = new Date(customPeriodEnd)

      transactions = Object.values(financialData)
        .flatMap((period) => period.transactions || [])
        .filter((transaction) => {
          const transactionDate = new Date(transaction.date)
          return transactionDate >= startDate && transactionDate <= endDate
        })
    } else {
      transactions = financialData[selectedPeriod]?.transactions || []
    }

    const filtered = transactions.filter((transaction) => {
      const matchesSearch =
        transaction.studioName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.studioOwner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.type.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = selectedStatus === "All" || transaction.status === selectedStatus

      return matchesSearch && matchesStatus
    })

    setFilteredTransactions(filtered)
    setCurrentPage(1)
  }, [searchTerm, selectedPeriod, selectedStatus, customPeriodStart, customPeriodEnd])

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
      const updatedFinancialState = { ...financialState }
      if (!updatedFinancialState[selectedPeriod] || !updatedFinancialState[selectedPeriod].transactions) {
        // No period bucket to update; safely exit without throwing
        setEditingAmount(null)
        setEditAmount("")
        return
      }
      const periodData = { ...updatedFinancialState[selectedPeriod] }

      periodData.transactions = periodData.transactions.map((tx) =>
        tx.id === transactionId ? { ...tx, amount: newAmount } : tx,
      )

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
    const xmlContent = generateSepaXmlContent(selectedTransactions)
    const newDocument = {
      id: `doc-${Date.now()}`,
      filename: `SEPA_Payment_${new Date().toISOString().split("T")[0]}_${Date.now()}.xml`,
      createdAt: new Date().toISOString(),
      size: new Blob([xmlContent]).size,
      transactionCount: selectedTransactions.length,
      content: xmlContent,
    }

    setSepaDocuments((prev) => [newDocument, ...prev])

    const updatedFinancialState = { ...financialState }
    if (!updatedFinancialState[selectedPeriod] || !updatedFinancialState[selectedPeriod].transactions) {
      // Nothing to mutate within a specific period bucket; skip recalculation safely
      const element = document.createElement("a")
      const file = new Blob([xmlContent], { type: "application/xml" })
      element.href = URL.createObjectURL(file)
      element.download = newDocument.filename
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      alert("SEPA XML file generated and saved successfully!")
      return
    }
    const periodData = { ...updatedFinancialState[selectedPeriod] }

    periodData.transactions = periodData.transactions.map((tx) => {
      const selected = selectedTransactions.find((s) => s.id === tx.id)
      if (selected) {
        return {
          ...tx,
          status: "Check incoming funds",
          amount: selected.amount,
        }
      }
      return tx
    })

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
    if (!updatedFinancialState[selectedPeriod] || !updatedFinancialState[selectedPeriod].transactions) {
      alert("Statuses updated for selected transactions.")
      return
    }
    const periodData = { ...updatedFinancialState[selectedPeriod] }

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

  const hasCheckingTransactions =
    (selectedPeriod === "Overall"
      ? Object.values(financialData).flatMap((period) => period.transactions || [])
      : selectedPeriod === "Custom Period"
        ? filteredTransactions
        : financialData[selectedPeriod]?.transactions || []
    ).some((tx) => tx.status === "Check incoming funds") || false

  const getStatusColorClass = (status) => {
    switch (status) {
      case "Successful":
        return "bg-green-800/60 text-green-400"
      case "Pending":
        return "bg-yellow-800/60 text-yellow-400"
      case "Check incoming funds":
        return "bg-blue-800/60 text-blue-400"
      case "Failed":
        return "bg-red-800/60 text-red-400"
      default:
        return "bg-gray-800/60 text-gray-400"
    }
  }

  const getStatusColorClassModified = (status) => {
    switch (status) {
      case "Successful":
        return "bg-green-800/70"
      case "Pending":
        return "bg-yellow-800/70"
      case "Check incoming funds":
        return "bg-blue-800/70"
      case "Failed":
        return "bg-red-800/70"
      default:
        return "bg-gray-800/70"
    }
  }

  const handlePeriodSelect = (period) => {
    if (period === "Custom Period") {
      setCustomPeriodModalOpen(true)
      setPeriodDropdownOpen(false)
    } else {
      setSelectedPeriod(period)
      setShowCustomPeriodInput(false)
      setPeriodDropdownOpen(false)
    }
  }

  const handleApplyCustomPeriod = () => {
    if (customPeriodStart && customPeriodEnd) {
      setSelectedPeriod("Custom Period")
      setCustomPeriodModalOpen(false)
    } else {
      alert("Please select both start and end dates")
    }
  }

  // continue sidebar logic
  const updateCustomLink = (id, field, value) => {
    setCustomLinks((currentLinks) => currentLinks.map((link) => (link.id === id ? { ...link, [field]: value } : link)))
  }

  const removeCustomLink = (id) => {
    setConfirmationModal({ isOpen: true, linkId: id })
  }

  const handleAddSidebarWidget = (widgetType) => {
    const newWidget = {
      id: `sidebar-widget${Date.now()}`,
      type: widgetType,
      position: sidebarWidgets.length,
    }
    setSidebarWidgets((currentWidgets) => [...currentWidgets, newWidget])
    setIsRightWidgetModalOpen(false)
    toast.success(`${widgetType} widget has been added to sidebar Successfully`)
  }

  const confirmRemoveLink = () => {
    if (confirmationModal.linkId) {
      setCustomLinks((currentLinks) => currentLinks.filter((link) => link.id !== confirmationModal.linkId))
      toast.success("Website link removed successfully")
    }
    setConfirmationModal({ isOpen: false, linkId: null })
  }

  const getSidebarWidgetStatus = (widgetType) => {
    // Check if widget exists in sidebar widgets
    const existsInSidebar = sidebarWidgets.some((widget) => widget.type === widgetType)

    if (existsInSidebar) {
      return { canAdd: false, location: "sidebar" }
    }

    return { canAdd: true, location: null }
  }

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen)
  }

  return (
    <div
      className={`
      min-h-screen rounded-3xl bg-[#1C1C1C] text-white md:p-6 p-3
      transition-all duration-500 ease-in-out flex-1
      ${isRightSidebarOpen ? "lg:mr-86 mr-0" : "mr-0"}
    `}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2 justify-between w-full md:w-auto">
          <div className="flex  items-center gap-3">
            <h1 className="text-white oxanium_font text-xl md:text-2xl">Finances</h1>
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
          <div
            onClick={toggleRightSidebar}
            className="cursor-pointer lg:hidden md:hidden block text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md "
          >
            <IoIosMenu size={26} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Period selector */}
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)}
              className="bg-black text-white px-4 py-2 rounded-xl border border-gray-800 flex items-center justify-between gap-2 w-full sm:w-auto min-w=[180px] min-w-[180px]"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{selectedPeriod}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {periodDropdownOpen && (
              <div className="absolute z-10 mt-2 w-full bg-[#2F2F2F]/90 backdrop-blur-2xl rounded-xl border border-gray-800 shadow-lg max-h-80 overflow-y-auto">
                {periodOptions.map((period) => (
                  <div key={period}>
                    <button
                      className={`w-full px-4 py-2 text-sm text-gray-300 hover:bg-black text-left flex items-center justify-between ${selectedPeriod === period ? "bg-black/50" : ""}`}
                      onClick={() => handlePeriodSelect(period)}
                    >
                      <span>{period}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 items-center w-full sm:w-auto">
            <button
              onClick={() => setExportConfirmationOpen(true)}
              className={`bg-gray-600 cursor-pointer text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors ${isRightSidebarOpen ? 'px-3' : 'px-4'
                }`}
            >
              <Download className="w-4 h-4" />
              <span className={isRightSidebarOpen ? 'hidden xl:inline' : ''}>Export Excel</span>
            </button>
            <button
              onClick={() => setSepaModalOpen(true)}
              className="bg-[#3F74FF] text-white px-4 py-1.5 rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-[#3F74FF]/90 transition-colors w-full sm:w-auto"
            >
              <Download className="w-4 h-4" />
              <span> Run Payment</span>
            </button>

            <div
              onClick={toggleRightSidebar}
              className="cursor-pointer lg:block md:block hidden text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md "
            >
              <IoIosMenu size={26} />
            </div>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#141414] p-4 rounded-xl">
          <h3 className="text-gray-400 text-sm mb-1">Total Revenue</h3>
          <p className="text-white text-xl font-semibold">{formatCurrency(financialSummary.totalRevenue)}</p>
        </div>
        <div className="bg-[#141414] p-4 rounded-xl">
          <h3 className="text-gray-400 text-sm mb-1">Successful Payments</h3>
          <p className="text-green-500 text-xl font-semibold">{formatCurrency(financialSummary.successfulPayments)}</p>
        </div>
        <div className="bg-[#141414] p-4 rounded-xl">
          <h3 className="text-gray-400 text-sm mb-1">Pending Payments</h3>
          <p className="text-yellow-500 text-xl font-semibold">{formatCurrency(financialSummary.pendingPayments)}</p>
        </div>
        <div className="bg-[#141414] p-4 rounded-xl">
          <h3 className="text-gray-400 text-sm mb-1">Failed Payments</h3>
          <p className="text-red-500 text-xl font-semibold">{formatCurrency(financialSummary.failedPayments)}</p>
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
                    <span className={`inline-block w-3 h-3 rounded-full ${getStatusColorClassModified(status)}`}></span>
                  )}
                  <span className="text-gray-100">{status}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

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
                className={`border-b border-gray-800 ${index === paginatedTransactions.length - 1 ? "rounded-b-xl" : ""
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
                          {/* edit icon intentionally omitted */}
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
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColorClass(transaction.status)}`}
                  >
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTransactions.length === 0 && (
        <div className="bg-[#141414] p-8 rounded-xl text-center mt-4">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-lg mb-1">No transactions found</p>
          <p className="text-gray-500 text-sm">
            {searchTerm || selectedStatus !== "All" || (selectedPeriod !== "This Month" && selectedPeriod !== "Overall")
              ? "Try adjusting your filters or search terms"
              : selectedPeriod === "Custom Period"
                ? "No transactions found for the selected date range"
                : "There are no transactions available"}
          </p>
        </div>
      )}

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
                className={`px-3 py-1.5 rounded-xl transition-colors border ${currentPage === page
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

      {/* Custom Period Modal */}
      {customPeriodModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#2F2F2F] rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-white text-lg font-semibold mb-4">Select Custom Period</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Start Date</label>
                <input
                  type="date"
                  value={customPeriodStart}
                  onChange={(e) => setCustomPeriodStart(e.target.value)}
                  className="bg-[#1C1C1C] text-white px-3 py-2 rounded border border-gray-700 w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-2">End Date</label>
                <input
                  type="date"
                  value={customPeriodEnd}
                  onChange={(e) => setCustomPeriodEnd(e.target.value)}
                  className="bg-[#1C1C1C] text-white px-3 py-2 rounded border border-gray-700 w-full"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleApplyCustomPeriod}
                disabled={!customPeriodStart || !customPeriodEnd}
                className="bg-[#3F74FF] text-white px-4 py-2 rounded flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply Period
              </button>
              <button
                onClick={() => {
                  setCustomPeriodModalOpen(false)
                  setCustomPeriodStart("")
                  setCustomPeriodEnd("")
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ExportConfirmationModal
        isOpen={exportConfirmationOpen}
        onClose={() => setExportConfirmationOpen(false)}
        onConfirm={exportToCSV}
      />

      <SepaXmlModal
        isOpen={sepaModalOpen}
        onClose={() => setSepaModalOpen(false)}
        selectedPeriod={selectedPeriod}
        transactions={
          selectedPeriod === "Overall"
            ? Object.values(financialData).flatMap((period) => period.transactions || [])
            : selectedPeriod === "Custom Period"
              ? filteredTransactions
              : financialData[selectedPeriod]?.transactions || []
        }
        onGenerateXml={handleGenerateXml}
      />

      <CheckFundsModal
        isOpen={checkFundsModalOpen}
        onClose={() => setCheckFundsModalOpen(false)}
        transactions={
          selectedPeriod === "Overall"
            ? Object.values(financialData).flatMap((period) => period.transactions || [])
            : selectedPeriod === "Custom Period"
              ? filteredTransactions
              : financialData[selectedPeriod]?.transactions || []
        }
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

      {/* sidebar related modals */}

      <Sidebar
        isOpen={isRightSidebarOpen}
        onClose={() => setIsRightSidebarOpen(false)}
        widgets={sidebarWidgets}
        setWidgets={setSidebarWidgets}
        isEditing={isEditing}
        todos={todos}
        customLinks={customLinks}
        setCustomLinks={setCustomLinks}
        expiringContracts={expiringContracts}
        selectedMemberType={selectedMemberType}
        setSelectedMemberType={setSelectedMemberType}
        memberTypes={memberTypes}
        onAddWidget={() => setIsRightWidgetModalOpen(true)}
        updateCustomLink={updateCustomLink}
        removeCustomLink={removeCustomLink}
        editingLink={editingLink}
        setEditingLink={setEditingLink}
        openDropdownIndex={openDropdownIndex}
        setOpenDropdownIndex={setOpenDropdownIndex}
        onToggleEditing={()=>{ setIsEditing(!isEditing);}} // Add this line
        setTodos={setTodos}
      />

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, linkId: null })}
        onConfirm={confirmRemoveLink}
        title="Delete Website Link"
        message="Are you sure you want to delete this website link? This action cannot be undone."
      />

      <WidgetSelectionModal
        isOpen={isRightWidgetModalOpen}
        onClose={() => setIsRightWidgetModalOpen(false)}
        onSelectWidget={handleAddSidebarWidget}
        getWidgetStatus={getSidebarWidgetStatus}
        widgetArea="sidebar"
      />

      {editingLink && (
        <WebsiteLinkModal
          link={editingLink}
          onClose={() => setEditingLink(null)}
          updateCustomLink={updateCustomLink}
          setCustomLinks={setCustomLinks}
        />
      )}
    </div>
  )
}
