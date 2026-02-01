/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { X, Upload, Trash, Edit2, File, FileText, FilePlus, Eye, Download, Check, Edit, Copy, User, ChevronDown, ChevronUp } from "lucide-react"
import { toast } from "react-hot-toast"
import { Printer } from "lucide-react"
import { EditContractModal } from "./edit-contract-modal"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"

export function DocumentManagementModal({ contract, onClose }) {
  const navigate = useNavigate()
  const [documents, setDocuments] = useState(contract.files || [])
  const [isUploading, setIsUploading] = useState(false)
  const [editingDocId, setEditingDocId] = useState(null)
  const [newDocName, setNewDocName] = useState("")
  const [viewingDocument, setViewingDocument] = useState(null)
  const [showEditContract, setShowEditContract] = useState(false)
  const [editingContract, setEditingContract] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState(null)
  const fileInputRef = useRef(null)
  const [activePeriod, setActivePeriod] = useState("current")
  const [showContractDetails, setShowContractDetails] = useState(true)

  // Copy states for contract details
  const [copiedFirstName, setCopiedFirstName] = useState(false)
  const [copiedLastName, setCopiedLastName] = useState(false)
  const [copiedIban, setCopiedIban] = useState(false)
  const [copiedSepa, setCopiedSepa] = useState(false)
  const [copiedContractNumber, setCopiedContractNumber] = useState(false)
  const [copiedContractType, setCopiedContractType] = useState(false)
  const [copiedPeriod, setCopiedPeriod] = useState(false)

  // Helper to get first and last name from memberName
  const getFirstAndLastName = (fullName) => {
    const parts = fullName?.trim().split(" ") || []
    const firstName = parts[0] || ""
    const lastName = parts.length > 1 ? parts.slice(1).join(" ") : ""
    return { firstName, lastName }
  }

  const { firstName, lastName } = getFirstAndLastName(contract.memberName)

  // Copy handler
  const handleCopy = async (text, setCopied) => {
    try {
      await navigator.clipboard.writeText(text || "")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatPeriod = () => {
    return `${contract.startDate} - ${contract.endDate}`
  }

  // Navigate to member with search filter
  const redirectToMember = () => {
    onClose() // Close the modal first
    // Navigate to members page with member name as search parameter
    navigate("/dashboard/members", { 
      state: { 
        searchQuery: contract.memberName,
        memberId: contract.memberId,
        fromContract: true
      } 
    })
  }

  const contractPeriods = [
    {
      id: "current",
      name: "Current Period",
      startDate: contract.startDate,
      endDate: contract.endDate,
      status: "active",
    },
    {
      id: "previous-1",
      name: "Previous Period 1",
      startDate: "2022-01-01",
      endDate: "2023-01-01",
      status: "completed",
    },
    {
      id: "previous-2",
      name: "Previous Period 2",
      startDate: "2021-01-01",
      endDate: "2022-01-01",
      status: "completed",
    },
  ]

  const sampleDocuments = [
    {
      id: "doc-1",
      name: "Contract Agreement.pdf",
      type: "pdf",
      size: "1.2 MB",
      uploadDate: "2023-05-15",
      isSignedContract: false,
      periodId: "current",
    },
    {
      id: "doc-2",
      name: "Payment Schedule.xlsx",
      type: "xlsx",
      size: "0.8 MB",
      uploadDate: "2023-05-16",
      isSignedContract: false,
      periodId: "current",
    },
    {
      id: "doc-3",
      name: "Unsigned Contract",
      type: "unsigned",
      size: "N/A",
      uploadDate: "2023-05-10",
      isSignedContract: false,
      isUnsigned: true,
      periodId: "current",
      contractData: {
        fullName: contract.memberName,
        rateType: "Basic",
        tarifMindestlaufzeit: "12 months",
        preisProWoche: "42.90",
        startbox: "Yes",
        mindestlaufzeit: "12 months",
        startDerMitgliedschaft: "2023-06-01",
        startDesTrainings: "2023-06-01",
        vertragsverlaengerungsdauer: "1 Week",
        kuendigungsfrist: "1 Month",
      },
    },
  ]

  const displayDocuments = documents.length > 0 ? documents : sampleDocuments

  const filteredDocuments = displayDocuments.filter((doc) => doc.periodId === activePeriod)

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (documentToDelete) {
      setDocuments(displayDocuments.filter((doc) => doc.id !== documentToDelete.id))
      toast.success("Document deleted successfully")
      setDeleteModalOpen(false)
      setDocumentToDelete(null)
    }
  }

  // Handle delete button click
  const handleDeleteClick = (doc) => {
    setDocumentToDelete(doc)
    setDeleteModalOpen(true)
  }

  // Handle delete modal close
  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false)
    setDocumentToDelete(null)
  }

  const handleUnsignedContractClick = (doc) => {
    if (doc.isUnsigned) {
      setEditingContract(doc)
      setShowEditContract(true)
      return
    }
    handleViewDocument(doc)
  }

  const handleSaveSignedContract = (signedContractData) => {
    const newSignedContract = {
      id: `doc-signed-${Date.now()}`,
      name: `${contract.memberName} - Signed Contract.pdf`,
      type: "pdf",
      size: "1.5 MB",
      uploadDate: new Date().toISOString().split("T")[0],
      isSignedContract: true,
      periodId: activePeriod,
      contractData: signedContractData,
    }

    const updatedDocuments = displayDocuments.filter((doc) => !doc.isUnsigned).concat(newSignedContract)

    setDocuments(updatedDocuments)
    setShowEditContract(false)
    setEditingContract(null)
  }

  const handleUploadClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]

    const invalidFiles = files.filter((file) => !validTypes.includes(file.type))
    if (invalidFiles.length > 0) {
      toast.error(`${invalidFiles.length} file(s) have unsupported formats`)
      return
    }

    const largeFiles = files.filter((file) => file.size > 10 * 1024 * 1024)
    if (largeFiles.length > 0) {
      toast.error(`${largeFiles.length} file(s) exceed the 10MB size limit`)
      return
    }

    setIsUploading(true)
    toast.loading(`Uploading ${files.length} document(s)...`)

    setTimeout(() => {
      const newDocs = files.map((file) => ({
        id: `doc-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: getFileExtension(file.name),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split("T")[0],
        file: file,
        isSignedContract: false,
        periodId: activePeriod,
      }))

      setDocuments([...displayDocuments, ...newDocs])
      setIsUploading(false)
      toast.dismiss()
      toast.success(`${files.length} document(s) uploaded successfully`)
    }, 1500)
  }

  const getFileExtension = (filename) => {
    return filename.split(".").pop().toLowerCase()
  }

  const handleViewDocument = (doc) => {
    setViewingDocument(doc)
  }

  const handleDownload = (doc) => {
    if (doc.file) {
      const url = URL.createObjectURL(doc.file)
      const a = document.createElement("a")
      a.href = url
      a.download = doc.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else {
      toast.success(`Downloading ${doc.name}...`)
    }
  }

  const handlePrint = (doc) => {
    toast.success(`Preparing ${doc.name} for printing...`)
  }

  const startEditing = (doc) => {
    setEditingDocId(doc.id)
    setNewDocName(doc.name.replace(`.${doc.type}`, ""))
  }

  const saveDocName = (docId) => {
    if (!newDocName.trim()) {
      toast.error("Document name cannot be empty")
      return
    }

    const doc = displayDocuments.find((d) => d.id === docId)
    const updatedDocs = displayDocuments.map((d) =>
      d.id === docId ? { ...d, name: `${newDocName}.${doc.type}` } : d
    )

    setDocuments(updatedDocs)
    setEditingDocId(null)
    setNewDocName("")
    toast.success("Document renamed successfully")
  }

  const toggleSignedContract = (docId) => {
    const updatedDocs = displayDocuments.map((d) =>
      d.id === docId ? { ...d, isSignedContract: !d.isSignedContract } : d
    )
    setDocuments(updatedDocs)

    const doc = displayDocuments.find((d) => d.id === docId)
    if (!doc.isSignedContract) {
      toast.success("Marked as Signed Contract")
    } else {
      toast.success("Removed Signed Contract tag")
    }
  }

  const getDocumentIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />
      case "xlsx":
      case "xls":
        return <File className="w-5 h-5 text-green-500" />
      case "docx":
      case "doc":
        return <FileText className="w-5 h-5 text-blue-500" />
      case "jpg":
      case "jpeg":
      case "png":
        return <File className="w-5 h-5 text-purple-500" />
      case "unsigned":
        return <FileText className="w-5 h-5 text-orange-500" />
      default:
        return <File className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <>
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        documentName={documentToDelete?.name || ""}
      />

      {showEditContract && editingContract && (
        <EditContractModal
          onClose={() => {
            setShowEditContract(false)
            setEditingContract(null)
          }}
          onSave={handleSaveSignedContract}
          contractData={editingContract.contractData}
          memberName={contract.memberName}
        />
      )}

      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1001] p-2 sm:p-4">
        {viewingDocument && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-[1002]">
            <div className="bg-white rounded-lg max-w-4xl max-h-[80vh] overflow-auto w-full">
              <div className="sticky top-0 bg-gray-100 p-3 flex justify-between items-center border-b">
                <h3 className="font-medium">{viewingDocument.name}</h3>
                <button onClick={() => setViewingDocument(null)} className="p-1 rounded-full hover:bg-gray-200">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <div className="bg-gray-100 p-8 rounded text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Document preview would appear here.</p>
                  <p className="text-gray-500 text-sm mt-2">
                    {viewingDocument.type.toUpperCase()} document • {viewingDocument.size}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-800">
            <h3 className="text-white text-lg sm:text-xl font-medium">Contract Details</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Contract Details Section - Collapsible */}
            <div className="border-b border-gray-800">
              <button
                onClick={() => setShowContractDetails(!showContractDetails)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-[#252525] transition-colors"
              >
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Contract Information</span>
                {showContractDetails ? (
                  <ChevronUp size={18} className="text-gray-400" />
                ) : (
                  <ChevronDown size={18} className="text-gray-400" />
                )}
              </button>
              
              {showContractDetails && (
                <div className="px-4 pb-4 space-y-4">
                  {/* Contract Info Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Contract Number</p>
                      <div className="flex items-center gap-2">
                        <p className="text-white">{contract.id || "-"}</p>
                        {contract.id && (
                          <button
                            onClick={() => handleCopy(contract.id, setCopiedContractNumber)}
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                            title="Copy contract number"
                          >
                            {copiedContractNumber ? (
                              <Check size={14} className="text-green-500" />
                            ) : (
                              <Copy size={14} className="text-gray-400 hover:text-white" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Contract Type</p>
                      <div className="flex items-center gap-2">
                        <p className="text-white">{contract.contractType || "-"}</p>
                        {contract.contractType && (
                          <button
                            onClick={() => handleCopy(contract.contractType, setCopiedContractType)}
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                            title="Copy contract type"
                          >
                            {copiedContractType ? (
                              <Check size={14} className="text-green-500" />
                            ) : (
                              <Copy size={14} className="text-gray-400 hover:text-white" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Contract Period</p>
                      <div className="flex items-center gap-2">
                        <p className="text-white">{formatPeriod()}</p>
                        <button
                          onClick={() => handleCopy(formatPeriod(), setCopiedPeriod)}
                          className="p-1 hover:bg-gray-700 rounded transition-colors"
                          title="Copy contract period"
                        >
                          {copiedPeriod ? (
                            <Check size={14} className="text-green-500" />
                          ) : (
                            <Copy size={14} className="text-gray-400 hover:text-white" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="pt-2 border-t border-gray-800">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">Member Information</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">First Name</p>
                        <div className="flex items-center gap-2">
                          <p className="text-white">{firstName || "-"}</p>
                          {firstName && (
                            <button
                              onClick={() => handleCopy(firstName, setCopiedFirstName)}
                              className="p-1 hover:bg-gray-700 rounded transition-colors"
                              title="Copy first name"
                            >
                              {copiedFirstName ? (
                                <Check size={14} className="text-green-500" />
                              ) : (
                                <Copy size={14} className="text-gray-400 hover:text-white" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Last Name</p>
                        <div className="flex items-center gap-2">
                          <p className="text-white">{lastName || "-"}</p>
                          {lastName && (
                            <button
                              onClick={() => handleCopy(lastName, setCopiedLastName)}
                              className="p-1 hover:bg-gray-700 rounded transition-colors"
                              title="Copy last name"
                            >
                              {copiedLastName ? (
                                <Check size={14} className="text-green-500" />
                              ) : (
                                <Copy size={14} className="text-gray-400 hover:text-white" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">IBAN</p>
                        <div className="flex items-center gap-2">
                          <p className="text-white">{contract.iban || "-"}</p>
                          {contract.iban && (
                            <button
                              onClick={() => handleCopy(contract.iban, setCopiedIban)}
                              className="p-1 hover:bg-gray-700 rounded transition-colors"
                              title="Copy IBAN"
                            >
                              {copiedIban ? (
                                <Check size={14} className="text-green-500" />
                              ) : (
                                <Copy size={14} className="text-gray-400 hover:text-white" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">SEPA Mandate Number</p>
                        <div className="flex items-center gap-2">
                          <p className="text-white">{contract.sepaMandate || "-"}</p>
                          {contract.sepaMandate && (
                            <button
                              onClick={() => handleCopy(contract.sepaMandate, setCopiedSepa)}
                              className="p-1 hover:bg-gray-700 rounded transition-colors"
                              title="Copy SEPA mandate"
                            >
                              {copiedSepa ? (
                                <Check size={14} className="text-green-500" />
                              ) : (
                                <Copy size={14} className="text-gray-400 hover:text-white" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Go to Member Button */}
                  <div className="pt-2">
                    <button
                      onClick={redirectToMember}
                      className="bg-[#3F74FF] text-sm text-white px-4 py-2 rounded-xl hover:bg-[#3F74FF]/90 flex items-center gap-2"
                    >
                      <User size={16} />
                      Go to Member
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Document Management Section */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex flex-col gap-3">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Documents</p>

                <div className="flex flex-wrap gap-2">
                  {contractPeriods.map((period) => (
                    <button
                      key={period.id}
                      onClick={() => setActivePeriod(period.id)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        activePeriod === period.id
                          ? "bg-[#F27A30] text-white"
                          : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                      }`}
                    >
                      {period.name}
                      <span className="ml-1 text-xs opacity-75">
                        ({period.startDate} - {period.endDate})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-b border-gray-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-gray-400 text-sm">
                  Upload documents for:{" "}
                  <span className="text-white font-medium">
                    {contractPeriods.find((p) => p.id === activePeriod)?.name}
                  </span>
                </p>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleUploadClick}
                    className="text-sm gap-2 px-4 py-2 bg-[#3F74FF] text-white rounded-xl hover:bg-[#2563eb] transition-colors w-full sm:w-auto flex items-center justify-center"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </button>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
              </div>
            </div>

            {filteredDocuments.length === 0 && (
              <div className="bg-[#141414] p-4 rounded-xl mb-4 mx-4 mt-4">
                <h4 className="text-white font-medium mb-2">How to sign and upload your contract:</h4>
                <ol className="text-gray-400 text-sm space-y-2 list-decimal pl-5">
                  <li>Generate the contract with or without digital signature</li>
                  <li>If using paper signature, print the document</li>
                  <li>Have all parties sign the printed document</li>
                  <li>Scan or take a clear photo of all signed pages</li>
                  <li>Upload the document and mark it as "Signed Contract"</li>
                </ol>
              </div>
            )}

            <div className="p-4">
              {isUploading && (
                <div className="bg-[#141414] p-4 rounded-xl mb-3 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-md flex items-center justify-center">
                      <FilePlus className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-gray-700 rounded-md"></div>
                      <div className="w-8 h-8 bg-gray-700 rounded-md"></div>
                      <div className="w-8 h-8 bg-gray-700 rounded-md"></div>
                    </div>
                  </div>
                </div>
              )}

              {filteredDocuments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No documents available for this contract period.</p>
                  <button
                    onClick={handleUploadClick}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#3F74FF] text-white rounded-xl hover:bg-[#2563eb] transition-colors mx-auto"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Your First Document
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredDocuments.map((doc) => (
                    <div key={doc.id} className="bg-[#141414] p-4 rounded-xl hover:bg-[#1a1a1a] transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 bg-[#2a2a2a] rounded-md flex items-center justify-center">
                            {getDocumentIcon(doc.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            {editingDocId === doc.id ? (
                              <div className="flex flex-col sm:flex-row gap-2">
                                <div className="flex-1 flex items-center bg-black text-white px-2 py-1 rounded border border-gray-700 w-full">
                                  <input
                                    type="text"
                                    value={newDocName}
                                    onChange={(e) => setNewDocName(e.target.value)}
                                    className="bg-transparent border-none outline-none flex-1 w-full"
                                    autoFocus
                                  />
                                  <span className="text-gray-500">.{doc.type}</span>
                                </div>
                                <div className="flex gap-2 mt-2 sm:mt-0">
                                  <button
                                    onClick={() => saveDocName(doc.id)}
                                    className="px-2 py-1 bg-blue-500 text-white rounded flex-1 sm:flex-none"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingDocId(null)}
                                    className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 flex-1 sm:flex-none"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="text-white font-medium truncate">
                                  {doc.name}
                                  {doc.isSignedContract && (
                                    <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                                      Signed Contract
                                    </span>
                                  )}
                                  {doc.isUnsigned && (
                                    <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                                      Unsigned Contract
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {doc.size !== "N/A" && `${doc.size} • `}Uploaded on {doc.uploadDate}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                        {editingDocId !== doc.id && (
                          <div className="flex gap-2 mt-3 sm:mt-0 justify-end">
                            <button
                              onClick={() => handleUnsignedContractClick(doc)}
                              className="p-2 bg-[#2a2a2a] text-gray-300 rounded-md hover:bg-[#333] transition-colors"
                              title={doc.isUnsigned ? "Edit Contract" : "View"}
                            >
                              {doc.isUnsigned === true ? <Edit className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            {!doc.isUnsigned && (
                              <>
                                <button
                                  onClick={() => handleDownload(doc)}
                                  className="p-2 bg-[#2a2a2a] text-gray-300 rounded-md hover:bg-[#333] transition-colors"
                                  title="Download"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handlePrint(doc)}
                                  className="p-2 bg-[#2a2a2a] text-gray-300 rounded-md hover:bg-[#333] transition-colors"
                                  title="Print"
                                >
                                  <Printer className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => startEditing(doc)}
                              className="p-2 bg-[#2a2a2a] text-gray-300 rounded-md hover:bg-[#333] transition-colors"
                              title="Rename"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(doc)}
                              className="p-2 bg-[#2a2a2a] text-red-400 rounded-md hover:bg-[#333] transition-colors"
                              title="Delete"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800 flex justify-end flex-shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#3F74FF] text-sm text-white rounded-xl hover:bg-[#2563eb] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
