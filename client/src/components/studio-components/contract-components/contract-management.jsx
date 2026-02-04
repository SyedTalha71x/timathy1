/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { 
  X, Upload, Trash, Edit2, File, FileText, FilePlus, Eye, Download, Check, Edit, 
  Copy, User, ChevronDown, ChevronUp, RefreshCw, ArrowRightLeft, Clock, Calendar,
  AlertTriangle, AlertCircle, Printer
} from "lucide-react"
import { toast } from "react-hot-toast"
import { pdf } from "@react-pdf/renderer"
import ContractPDFDocument from "./ContractPDFDocument"


// ============================================
// Required Libraries:
// npm install mammoth xlsx @react-pdf/renderer
// ============================================
import * as mammoth from "mammoth"
import * as XLSX from "xlsx"

// ============================================
// Document Viewer Modal
// ============================================
function DocumentViewerModal({ isOpen, onClose, document, onDownload, onPrint }) {
  const [content, setContent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const fileType = document?.type?.toLowerCase()

  useEffect(() => {
    if (!isOpen || !document) {
      setContent(null)
      setIsLoading(true)
      setError(null)
      setCurrentPage(1)
      return
    }
    loadDocument()
  }, [isOpen, document])

  const loadDocument = async () => {
    if (!document?.file) {
      setError("No file data available")
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const file = document.file

      switch (fileType) {
        case 'pdf':
          const pdfUrl = URL.createObjectURL(file)
          setContent({ type: 'pdf', url: pdfUrl })
          break
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'webp':
          const imgUrl = URL.createObjectURL(file)
          setContent({ type: 'image', url: imgUrl })
          break
        case 'txt':
        case 'csv':
          const text = await file.text()
          setContent({ type: 'text', text })
          break
        case 'doc':
        case 'docx':
          const arrayBuffer = await file.arrayBuffer()
          const options = {
            arrayBuffer,
            convertImage: mammoth.images.imgElement(function(image) {
              return image.read("base64").then(function(imageBuffer) {
                return { src: "data:" + image.contentType + ";base64," + imageBuffer }
              })
            })
          }
          const result = await mammoth.convertToHtml(options)
          setContent({ type: 'html', html: result.value })
          break
        case 'xls':
        case 'xlsx':
          const xlsBuffer = await file.arrayBuffer()
          const workbook = XLSX.read(xlsBuffer, { type: 'array' })
          const sheets = workbook.SheetNames.map(name => ({
            name,
            data: XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1 })
          }))
          setContent({ type: 'excel', sheets })
          break
        default:
          setError(`File type .${fileType} is not supported for preview`)
      }
    } catch (err) {
      console.error("Error loading document:", err)
      setError(`Failed to load document: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    return () => {
      if (content?.url) {
        URL.revokeObjectURL(content.url)
      }
    }
  }, [content])

  if (!isOpen || !document) return null

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-400">Loading document...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <p className="text-white text-lg mb-2">Error Loading Document</p>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => onDownload && onDownload(document)}
            className="px-6 py-3 bg-[#3F74FF] text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Instead
          </button>
        </div>
      )
    }

    if (!content) return null

    switch (content.type) {
      case 'pdf':
        return (
          <div className="h-full w-full">
            <iframe src={content.url} className="w-full h-full border-0" title={document.name} />
          </div>
        )
      case 'image':
        return (
          <div className="flex items-center justify-center p-4 h-full">
            <img src={content.url} alt={document.name} className="max-w-full max-h-full object-contain rounded-lg shadow-lg" />
          </div>
        )
      case 'text':
        return (
          <div className="p-6 h-full overflow-auto">
            <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono bg-[#0d0d0d] p-4 rounded-lg">{content.text}</pre>
          </div>
        )
      case 'html':
        return (
          <div className="p-4 sm:p-6 overflow-auto" style={{ maxHeight: 'calc(95vh - 140px)' }}>
            <div 
              className="docx-preview max-w-none p-6 rounded-lg"
              dangerouslySetInnerHTML={{ __html: content.html }}
              style={{ backgroundColor: '#ffffff', color: '#1f2937', lineHeight: '1.6', fontSize: '14px' }}
            />
          </div>
        )
      case 'excel':
        const currentSheet = content.sheets[currentPage - 1]
        return (
          <div className="p-4 h-full overflow-auto">
            {content.sheets.length > 1 && (
              <div className="mb-4 flex gap-2 flex-wrap">
                {content.sheets.map((sheet, idx) => (
                  <button
                    key={sheet.name}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      currentPage === idx + 1 ? 'bg-[#3F74FF] text-white' : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#333]'
                    }`}
                  >
                    {sheet.name}
                  </button>
                ))}
              </div>
            )}
            <div className="overflow-auto bg-[#0d0d0d] rounded-lg">
              <table className="min-w-full text-sm">
                <tbody>
                  {currentSheet?.data.map((row, rowIdx) => (
                    <tr key={rowIdx} className={rowIdx === 0 ? 'bg-[#1a1a1a] font-semibold' : 'hover:bg-[#1a1a1a]'}>
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="px-4 py-2 border border-gray-800 text-gray-300 whitespace-nowrap">{cell ?? ''}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <File className="w-16 h-16 text-gray-500 mb-4" />
            <p className="text-white text-lg mb-2">Preview not available</p>
            <p className="text-gray-400">Please download the file to view it.</p>
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[1002] p-2 sm:p-4">
      <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-7xl h-[95vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <h3 className="text-white text-lg font-medium truncate">{document.name}</h3>
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded uppercase flex-shrink-0">{document.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onDownload && onDownload(document)} className="p-2 bg-[#2a2a2a] text-gray-300 rounded-lg hover:bg-[#333] transition-colors" title="Download">
              <Download className="w-5 h-5" />
            </button>
            <button onClick={() => onPrint && onPrint(document)} className="p-2 bg-[#2a2a2a] text-gray-300 rounded-lg hover:bg-[#333] transition-colors" title="Print">
              <Printer className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-[#141414]">{renderContent()}</div>
      </div>
    </div>
  )
}

// Status Tag Component
const ContractStatusTag = ({ status, pauseReason = null, pauseStartDate = null, pauseEndDate = null, cancelReason = null, cancelDate = null }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-600';
      case 'Ongoing': return 'bg-gray-600';
      case 'Paused': return 'bg-yellow-600';
      case 'Cancelled': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const hasTooltip = status === 'Paused' || status === 'Cancelled';
  const hasHoverEffect = status === 'Paused' || status === 'Cancelled';
  
  // Format date helper
  const formatD = (d) => d ? new Date(d).toLocaleDateString('de-DE') : null;

  // Build tooltip content for Paused
  const renderPauseTooltip = () => {
    if (status !== 'Paused') return null;
    return (
      <>
        {pauseReason && (
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-medium">Reason:</span>
            <span>{pauseReason}</span>
          </div>
        )}
        {pauseStartDate && pauseEndDate && (
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-medium">Period:</span>
            <span>{formatD(pauseStartDate)} - {formatD(pauseEndDate)}</span>
          </div>
        )}
        {pauseStartDate && !pauseEndDate && (
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-medium">Since:</span>
            <span>{formatD(pauseStartDate)}</span>
          </div>
        )}
        {!pauseReason && !pauseStartDate && (
          <span>Contract is paused</span>
        )}
      </>
    );
  };

  // Build tooltip content for Cancelled
  const renderCancelTooltip = () => {
    if (status !== 'Cancelled') return null;
    return (
      <>
        {cancelReason && (
          <div className="flex items-center gap-2">
            <span className="text-red-400 font-medium">Reason:</span>
            <span>{cancelReason}</span>
          </div>
        )}
        {cancelDate && (
          <div className="flex items-center gap-2">
            <span className="text-red-400 font-medium">Cancelled:</span>
            <span>{formatD(cancelDate)}</span>
          </div>
        )}
        {!cancelReason && !cancelDate && (
          <span>Contract was cancelled</span>
        )}
      </>
    );
  };

  return (
    <div className={`relative ${hasTooltip ? 'group' : ''} inline-flex`}>
      <span className={`${getStatusColor(status)} text-white px-2 py-0.5 rounded-lg text-xs font-medium transition-transform duration-200 ${hasHoverEffect ? 'cursor-pointer hover:scale-110' : ''}`}>
        {status}
      </span>
      {/* Custom Tooltip */}
      {hasTooltip && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/95 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg pointer-events-none">
          <div className="flex flex-col gap-1">
            {renderPauseTooltip()}
            {renderCancelTooltip()}
          </div>
          {/* Arrow pointing up */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/95" />
        </div>
      )}
    </div>
  );
};

export function ContractManagement({ contract, allContracts = [], onClose }) {
  const navigate = useNavigate()
  
  // Get all contracts for this member, sorted by start date (newest first)
  const memberContracts = allContracts
    .filter(c => c.memberId === contract.memberId)
    .sort((a, b) => {
      // Sort by start date (newest first)
      return new Date(b.startDate) - new Date(a.startDate);
    });

  // If no allContracts provided, just use the single contract
  const displayContracts = memberContracts.length > 0 ? memberContracts : [contract];

  // Track which contract is expanded (default: the clicked one)
  const [expandedContractId, setExpandedContractId] = useState(contract.id)
  
  // Track which contract's additional documents are expanded
  const [expandedDocsContractId, setExpandedDocsContractId] = useState(null)
  // Document states per contract
  const [contractDocuments, setContractDocuments] = useState(() => {
    const docs = {};
    displayContracts.forEach(c => {
      docs[c.id] = c.files || [];
    });
    return docs;
  });

  const [isUploading, setIsUploading] = useState(false)
  const [editingDocId, setEditingDocId] = useState(null)
  const [newDocName, setNewDocName] = useState("")
  const [viewingDocument, setViewingDocument] = useState(null)
  const [showEditContract, setShowEditContract] = useState(false)
  const [editingContract, setEditingContract] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState(null)
  const [activeContractForUpload, setActiveContractForUpload] = useState(contract.id)
  const fileInputRef = useRef(null)

  // Copy states
  const [copiedField, setCopiedField] = useState(null)

  // Helper to get first and last name from memberName
  const getFirstAndLastName = (fullName) => {
    const parts = fullName?.trim().split(" ") || []
    const firstName = parts[0] || ""
    const lastName = parts.length > 1 ? parts.slice(1).join(" ") : ""
    return { firstName, lastName }
  }

  const { firstName, lastName } = getFirstAndLastName(contract.memberName)

  // Copy handler
  const handleCopy = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text || "")
      setCopiedField(fieldName)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString('de-DE')
  }

  // Check if contract is expiring soon (within 30 days)
  const isExpiringSoon = (endDate) => {
    const today = new Date()
    const end = new Date(endDate)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return end <= thirtyDaysFromNow && end > today
  }

  // Check if contract is expired
  const isExpired = (endDate) => {
    return new Date(endDate) < new Date()
  }

  // Check if contract should show expiring warning
  // For auto-renewal contracts: only show if not indefinite and autoRenewalEndDate is approaching
  const shouldShowExpiring = (contractItem) => {
    if (!contractItem.autoRenewal) {
      return isExpiringSoon(contractItem.endDate)
    }
    // If renewal is indefinite, never show expiring
    if (contractItem.renewalIndefinite === true) {
      return false
    }
    // If auto-renewal with end date (limited renewal), check the final end date
    if (contractItem.autoRenewalEndDate) {
      return isExpiringSoon(contractItem.autoRenewalEndDate)
    }
    // Auto-renewal without end date (assume unlimited) - never show expiring
    return false
  }

  // Check if contract should show expired warning
  const shouldShowExpired = (contractItem) => {
    if (!contractItem.autoRenewal) {
      return isExpired(contractItem.endDate)
    }
    // If renewal is indefinite, never show expired
    if (contractItem.renewalIndefinite === true) {
      return false
    }
    if (contractItem.autoRenewalEndDate) {
      return isExpired(contractItem.autoRenewalEndDate)
    }
    return false
  }

  // Navigate to member with search filter
  const redirectToMember = () => {
    onClose()
    navigate("/dashboard/members", { 
      state: { 
        searchQuery: contract.memberName,
        memberId: contract.memberId,
        fromContract: true
      } 
    })
  }

  // Sample documents for demo (empty by default, contract PDF is handled separately)
  const getSampleDocuments = () => []

  const getDocumentsForContract = (contractId) => {
    const docs = contractDocuments[contractId] || []
    return docs.length > 0 ? docs : getSampleDocuments()
  }

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (documentToDelete) {
      const contractId = documentToDelete.contractId
      setContractDocuments(prev => ({
        ...prev,
        [contractId]: (prev[contractId] || []).filter(doc => doc.id !== documentToDelete.id)
      }))
      toast.success("Document deleted successfully")
      setDeleteModalOpen(false)
      setDocumentToDelete(null)
    }
  }

  const handleDeleteClick = (doc) => {
    setDocumentToDelete(doc)
    setDeleteModalOpen(true)
  }

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false)
    setDocumentToDelete(null)
  }

  const handleUploadClick = (contractId) => {
    setActiveContractForUpload(contractId)
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
      "text/plain",
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
        contractId: activeContractForUpload,
      }))

      setContractDocuments(prev => ({
        ...prev,
        [activeContractForUpload]: [...(prev[activeContractForUpload] || []), ...newDocs]
      }))
      setIsUploading(false)
      toast.dismiss()
      toast.success(`${files.length} document(s) uploaded successfully`)
      
      // Reset file input to allow re-selecting the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
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

  const handlePrint = async (doc) => {
    if (!doc.file) {
      toast.error("No file data available for printing")
      return
    }

    toast.loading(`Preparing ${doc.name} for printing...`, { id: 'print' })
    
    try {
      const fileType = doc.type?.toLowerCase()
      
      // For PDF and images - open in new window and print
      if (fileType === 'pdf' || ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileType)) {
        const url = URL.createObjectURL(doc.file)
        const printWindow = window.open(url, '_blank')
        if (printWindow) {
          printWindow.onload = () => {
            setTimeout(() => {
              printWindow.print()
              URL.revokeObjectURL(url)
            }, 500)
          }
        }
        toast.dismiss('print')
        toast.success("Print dialog opened")
        return
      }
      
      // For DOCX - convert to HTML and print
      if (fileType === 'doc' || fileType === 'docx') {
        const arrayBuffer = await doc.file.arrayBuffer()
        const options = {
          arrayBuffer,
          convertImage: mammoth.images.imgElement(function(image) {
            return image.read("base64").then(function(imageBuffer) {
              return { src: "data:" + image.contentType + ";base64," + imageBuffer }
            })
          })
        }
        const result = await mammoth.convertToHtml(options)
        
        const printWindow = window.open('', '_blank')
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>${doc.name}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #000; }
                img { max-width: 100%; height: auto; }
                table { border-collapse: collapse; width: 100%; }
                td, th { border: 1px solid #ddd; padding: 8px; }
              </style>
            </head>
            <body>${result.value}</body>
            </html>
          `)
          printWindow.document.close()
          setTimeout(() => {
            printWindow.print()
          }, 500)
        }
        toast.dismiss('print')
        toast.success("Print dialog opened")
        return
      }
      
      // For text files
      if (fileType === 'txt' || fileType === 'csv') {
        const text = await doc.file.text()
        const printWindow = window.open('', '_blank')
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>${doc.name}</title>
              <style>
                body { font-family: monospace; padding: 20px; white-space: pre-wrap; color: #000; }
              </style>
            </head>
            <body>${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</body>
            </html>
          `)
          printWindow.document.close()
          setTimeout(() => {
            printWindow.print()
          }, 500)
        }
        toast.dismiss('print')
        toast.success("Print dialog opened")
        return
      }
      
      toast.dismiss('print')
      toast.error(`Printing not supported for .${fileType} files`)
      
    } catch (err) {
      console.error("Print error:", err)
      toast.dismiss('print')
      toast.error("Failed to prepare document for printing")
    }
  }

  const startEditing = (doc) => {
    const nameParts = doc.name.split(".")
    const extension = nameParts.pop()
    const nameWithoutExtension = nameParts.join(".")
    setEditingDocId(doc.id)
    setNewDocName(nameWithoutExtension)
  }

  const saveDocName = (docId, contractId) => {
    if (!newDocName.trim()) {
      toast.error("Document name cannot be empty")
      return
    }

    setContractDocuments(prev => {
      const docs = prev[contractId] || []
      const doc = docs.find(d => d.id === docId)
      const originalExtension = getFileExtension(doc.name)
      return {
        ...prev,
        [contractId]: docs.map(d => d.id === docId ? { ...d, name: `${newDocName.trim()}.${originalExtension}` } : d)
      }
    })
    setEditingDocId(null)
    setNewDocName("")
    toast.success("Document renamed successfully")
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

  // Render a single contract card
  const renderContractCard = (contractItem, isExpanded) => {
    const documents = getDocumentsForContract(contractItem.id)
    const additionalDocsCount = documents.length
    const isCurrent = contractItem.status === 'Active' || contractItem.status === 'Paused' || contractItem.status === 'Ongoing'
    const isDocsExpanded = expandedDocsContractId === contractItem.id
    
    // Check if contract has form data (from ContractFormFillModal)
    const hasContractForm = !!(contractItem.contractFormSnapshot || contractItem.formData)
    
    // Ongoing contracts should not have actions available
    const isOngoing = contractItem.status === 'Ongoing'
    const canPerformActions = hasContractForm && !isOngoing
    
    // Get the contract form data for PDF generation
    const contractFormData = contractItem.contractFormSnapshot?.contractFormData || contractItem.formData?.contractFormData
    const formValues = contractItem.contractFormSnapshot?.formValues || contractItem.formData?.formValues || {}
    const systemValues = contractItem.contractFormSnapshot?.systemValues || contractItem.formData?.systemValues || {}
    
    // Generate PDF using @react-pdf/renderer
    const generateContractPDF = async () => {
      if (!contractFormData) {
        throw new Error('No contract form data available for PDF generation')
      }
      
      // Create PDF blob using @react-pdf/renderer
      const pdfBlob = await pdf(
        <ContractPDFDocument
          contractForm={contractFormData}
          formValues={formValues}
          systemValues={systemValues}
        />
      ).toBlob()
      
      return pdfBlob
    }
    
    // Handle contract view - opens PDF in new tab
    const handleViewContract = async (e) => {
      e.stopPropagation()
      if (!canPerformActions) {
        if (isOngoing) {
          toast.info('Contract is ongoing (draft). Complete the contract first.')
        } else {
          toast.info('No contract form data available. Fill out the contract form first.')
        }
        return
      }
      if (hasContractForm && contractFormData) {
        toast.loading('Generating PDF...', { id: 'pdf-view' })
        try {
          const pdfBlob = await generateContractPDF()
          const pdfUrl = URL.createObjectURL(pdfBlob)
          window.open(pdfUrl, '_blank')
          toast.dismiss('pdf-view')
          toast.success('PDF opened in new tab')
        } catch (error) {
          toast.dismiss('pdf-view')
          toast.error('Failed to generate PDF')
          console.error(error)
        }
      } else {
        toast.info('No contract form data available. Fill out the contract form first.')
      }
    }
    
    // Handle contract download - downloads PDF file
    const handleDownloadContract = async (e) => {
      e.stopPropagation()
      if (!canPerformActions) {
        if (isOngoing) {
          toast.info('Contract is ongoing (draft). Complete the contract first.')
        } else {
          toast.info('No contract form data available. Fill out the contract form first.')
        }
        return
      }
      if (hasContractForm && contractFormData) {
        toast.loading('Generating PDF...', { id: 'pdf-download' })
        try {
          const pdfBlob = await generateContractPDF()
          const fileName = `Contract_${contractItem.contractNumber || contractItem.id}_${contractItem.memberName?.replace(/\s+/g, '_') || 'Member'}.pdf`
          
          // Create download link
          const url = URL.createObjectURL(pdfBlob)
          const link = document.createElement('a')
          link.href = url
          link.download = fileName
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
          
          toast.dismiss('pdf-download')
          toast.success('PDF downloaded!')
        } catch (error) {
          toast.dismiss('pdf-download')
          toast.error('Failed to generate PDF')
          console.error(error)
        }
      } else {
        toast.info('No contract form data available. Fill out the contract form first.')
      }
    }
    
    // Handle contract print
    const handlePrintContract = async (e) => {
      e.stopPropagation()
      if (!canPerformActions) {
        if (isOngoing) {
          toast.info('Contract is ongoing (draft). Complete the contract first.')
        } else {
          toast.info('No contract form data available. Fill out the contract form first.')
        }
        return
      }
      if (hasContractForm && contractFormData) {
        toast.loading('Preparing for print...', { id: 'pdf-print' })
        try {
          const pdfBlob = await generateContractPDF()
          const pdfUrl = URL.createObjectURL(pdfBlob)
          const printWindow = window.open(pdfUrl, '_blank')
          if (printWindow) {
            printWindow.onload = () => {
              setTimeout(() => {
                printWindow.print()
              }, 500)
            }
          }
          toast.dismiss('pdf-print')
        } catch (error) {
          toast.dismiss('pdf-print')
          toast.error('Failed to generate PDF for printing')
          console.error(error)
        }
      } else {
        toast.info('No contract form data available. Fill out the contract form first.')
      }
    }
    
    return (
      <div 
        key={contractItem.id} 
        className={`bg-[#1a1a1a] rounded-xl overflow-hidden border ${
          isExpanded ? 'border-orange-500/50' : 'border-gray-800'
        } transition-all duration-200`}
      >
        {/* Contract Header - Always visible */}
        <div className="p-4 flex items-center justify-between hover:bg-[#222] transition-colors">
          <button
            onClick={() => setExpandedContractId(isExpanded ? null : contractItem.id)}
            className="flex items-center gap-4 flex-1"
          >
            <div className="w-10 h-10 bg-[#2a2a2a] rounded-xl flex items-center justify-center">
              <FileText size={20} className={isCurrent ? "text-orange-400" : "text-gray-500"} />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white font-medium">
                  Contract {contractItem.contractNumber || contractItem.id}
                </span>
                <ContractStatusTag 
                  status={contractItem.status} 
                  pauseReason={contractItem.pauseReason}
                  pauseStartDate={contractItem.pauseStartDate}
                  pauseEndDate={contractItem.pauseEndDate}
                  cancelReason={contractItem.cancelReason}
                  cancelDate={contractItem.cancelDate}
                />
                {contractItem.autoRenewal && contractItem.status === 'Active' && (
                  <div className="relative group inline-flex">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 flex items-center gap-1 cursor-pointer transition-transform duration-200 hover:scale-110">
                      <RefreshCw size={10} /> Auto Renewal
                    </span>
                    {/* Custom Tooltip */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/95 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg pointer-events-none">
                      <div className="flex items-center gap-2">
                        <RefreshCw size={10} className="text-orange-400" />
                        <span>
                          {contractItem.renewalIndefinite === true 
                            ? 'Unlimited auto renewal' 
                            : contractItem.autoRenewalEndDate 
                              ? `Auto renewal until ${formatDate(contractItem.autoRenewalEndDate)}` 
                              : 'Auto renewal enabled'}
                        </span>
                      </div>
                      {/* Arrow */}
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/95" />
                    </div>
                  </div>
                )}
                {shouldShowExpiring(contractItem) && contractItem.status === 'Active' && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 flex items-center gap-1">
                    <AlertTriangle size={10} /> Expiring
                  </span>
                )}
                {shouldShowExpired(contractItem) && contractItem.status === 'Active' && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                    Expired
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400 mt-0.5">
                <span>{contractItem.contractType}</span>
                <span>•</span>
                <span>{formatDate(contractItem.startDate)} - {formatDate(contractItem.endDate)}</span>
              </div>
            </div>
          </button>
          
          {/* Contract Actions - Eye, Download & Print */}
          <div className="flex items-center gap-1 mr-2">
            <button
              onClick={handleViewContract}
              disabled={!canPerformActions}
              className={`p-2 rounded-lg transition-colors ${
                canPerformActions 
                  ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' 
                  : 'bg-[#2a2a2a] text-gray-500 cursor-not-allowed'
              }`}
              title={isOngoing ? "Contract is ongoing (draft)" : hasContractForm ? "View Contract" : "No form data available"}
            >
              <Eye size={16} />
            </button>
            <button
              onClick={handleDownloadContract}
              disabled={!canPerformActions}
              className={`p-2 rounded-lg transition-colors ${
                canPerformActions 
                  ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' 
                  : 'bg-[#2a2a2a] text-gray-500 cursor-not-allowed'
              }`}
              title={isOngoing ? "Contract is ongoing (draft)" : hasContractForm ? "Download Contract" : "No form data available"}
            >
              <Download size={16} />
            </button>
            <button
              onClick={handlePrintContract}
              disabled={!canPerformActions}
              className={`p-2 rounded-lg transition-colors ${
                canPerformActions 
                  ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' 
                  : 'bg-[#2a2a2a] text-gray-500 cursor-not-allowed'
              }`}
              title={isOngoing ? "Contract is ongoing (draft)" : hasContractForm ? "Print Contract" : "No form data available"}
            >
              <Printer size={16} />
            </button>
          </div>
          
          <button
            onClick={() => setExpandedContractId(isExpanded ? null : contractItem.id)}
            className="p-1"
          >
            <ChevronDown 
              size={20} 
              className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-gray-800">
            {/* Contract Details */}
            <div className="p-4 bg-[#141414] space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {/* Contract Number */}
                <div className="bg-[#1a1a1a] rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Contract Number</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">{contractItem.contractNumber || contractItem.id}</span>
                    <button
                      onClick={() => handleCopy(contractItem.contractNumber || contractItem.id, `number-${contractItem.id}`)}
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                    >
                      {copiedField === `number-${contractItem.id}` ? (
                        <Check size={12} className="text-orange-500" />
                      ) : (
                        <Copy size={12} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Contract Type */}
                <div className="bg-[#1a1a1a] rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Contract Type</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">{contractItem.contractType}</span>
                    <button
                      onClick={() => handleCopy(contractItem.contractType, `type-${contractItem.id}`)}
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                    >
                      {copiedField === `type-${contractItem.id}` ? (
                        <Check size={12} className="text-orange-500" />
                      ) : (
                        <Copy size={12} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* IBAN */}
                {contractItem.iban && (
                  <div className="bg-[#1a1a1a] rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">IBAN</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white font-mono text-xs">{contractItem.iban}</span>
                      <button
                        onClick={() => handleCopy(contractItem.iban, `iban-${contractItem.id}`)}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                      >
                        {copiedField === `iban-${contractItem.id}` ? (
                          <Check size={12} className="text-orange-500" />
                        ) : (
                          <Copy size={12} className="text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* SEPA Mandate */}
                {contractItem.sepaMandate && (
                  <div className="bg-[#1a1a1a] rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">SEPA Mandate</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white">{contractItem.sepaMandate}</span>
                      <button
                        onClick={() => handleCopy(contractItem.sepaMandate, `sepa-${contractItem.id}`)}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                      >
                        {copiedField === `sepa-${contractItem.id}` ? (
                          <Check size={12} className="text-orange-500" />
                        ) : (
                          <Copy size={12} className="text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Auto Renewal */}
                <div className="bg-[#1a1a1a] rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Auto Renewal</p>
                  <span className={`text-sm ${contractItem.autoRenewal ? 'text-orange-400' : 'text-gray-400'}`}>
                    {contractItem.autoRenewal ? (
                      <span className="flex items-center gap-1 flex-wrap">
                        <RefreshCw size={12} /> Yes
                        <span className="text-orange-300/70 text-xs">
                          {contractItem.renewalIndefinite === true 
                            ? '(unlimited)' 
                            : contractItem.autoRenewalEndDate 
                              ? `(until ${formatDate(contractItem.autoRenewalEndDate)})` 
                              : ''}
                        </span>
                      </span>
                    ) : 'No'}
                  </span>
                </div>

                {/* Cancel Reason (if cancelled) */}
                {contractItem.status === 'Cancelled' && contractItem.cancelReason && (
                  <div className="bg-[#1a1a1a] rounded-lg p-3 col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Cancellation Reason</p>
                    <span className="text-sm text-red-400">{contractItem.cancelReason}</span>
                  </div>
                )}

                {/* Pause Info (if paused) */}
                {contractItem.status === 'Paused' && (
                  <>
                    {contractItem.pauseReason && (
                      <div className="bg-[#1a1a1a] rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Pause Reason</p>
                        <span className="text-sm text-yellow-400">{contractItem.pauseReason}</span>
                      </div>
                    )}
                    {contractItem.pauseStartDate && contractItem.pauseEndDate && (
                      <div className="bg-[#1a1a1a] rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Pause Period</p>
                        <span className="text-sm text-yellow-400">
                          {formatDate(contractItem.pauseStartDate)} - {formatDate(contractItem.pauseEndDate)}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Additional Documents Section - Collapsible */}
            <div className="p-4 pt-0">
              <button
                onClick={() => setExpandedDocsContractId(isDocsExpanded ? null : contractItem.id)}
                className="w-full flex items-center justify-between py-3 text-left"
              >
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-gray-300">Additional Documents</h4>
                  <span className="text-xs text-gray-500">({additionalDocsCount})</span>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-200 ${isDocsExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {isDocsExpanded && (
                <div className="mt-2">
                  <div className="flex justify-end mb-3">
                    <button
                      onClick={() => handleUploadClick(contractItem.id)}
                      className="text-xs gap-1 px-3 py-1.5 bg-[#3F74FF] text-white rounded-lg hover:bg-[#2563eb] transition-colors flex items-center"
                    >
                      <Upload className="w-3 h-3" />
                      Upload
                    </button>
                  </div>

                  {documents.length === 0 ? (
                    <div className="text-center py-4 bg-[#141414] rounded-lg">
                      <p className="text-gray-500 text-sm">No additional documents uploaded</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {documents.map((doc) => (
                        <div key={doc.id} className="bg-[#141414] p-3 rounded-lg hover:bg-[#1a1a1a] transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#2a2a2a] rounded-md flex items-center justify-center">
                              {getDocumentIcon(doc.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              {editingDocId === doc.id ? (
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={newDocName}
                                    onChange={(e) => setNewDocName(e.target.value)}
                                    className="flex-1 bg-black text-white px-2 py-1 rounded border border-gray-700 text-sm"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => saveDocName(doc.id, contractItem.id)}
                                    className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingDocId(null)}
                                    className="px-2 py-1 bg-gray-600 text-white rounded text-xs"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <p className="text-white text-sm truncate">{doc.name}</p>
                                  <p className="text-[10px] text-gray-500">
                                    {doc.size !== "N/A" && `${doc.size} • `}{doc.uploadDate}
                                  </p>
                                </>
                              )}
                            </div>
                            {editingDocId !== doc.id && (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleViewDocument(doc)}
                                  className="p-1.5 bg-[#2a2a2a] text-gray-300 rounded-md hover:bg-[#333] transition-colors"
                                  title="View"
                                >
                                  <Eye className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDownload(doc)}
                                  className="p-1.5 bg-[#2a2a2a] text-gray-300 rounded-md hover:bg-[#333] transition-colors"
                                  title="Download"
                                >
                                  <Download className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handlePrint(doc)}
                                  className="p-1.5 bg-[#2a2a2a] text-gray-300 rounded-md hover:bg-[#333] transition-colors"
                                  title="Print"
                                >
                                  <Printer className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => startEditing(doc)}
                                  className="p-1.5 bg-[#2a2a2a] text-gray-300 rounded-md hover:bg-[#333] transition-colors"
                                  title="Rename"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick({ ...doc, contractId: contractItem.id })}
                                  className="p-1.5 bg-[#2a2a2a] text-red-400 rounded-md hover:bg-[#333] transition-colors"
                                  title="Delete"
                                >
                                  <Trash className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Supported file types info */}
                  <p className="text-[10px] text-gray-500 mt-3">
                    Supported: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX, TXT • Max size: 10MB
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Delete Confirmation Modal - High z-index to appear above other modals */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1003]">
          <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-md p-6 mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div>
                <h3 className="text-white text-lg font-medium">Delete Document</h3>
                <p className="text-gray-400 text-sm">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="bg-[#141414] p-4 rounded-xl mb-6">
              <p className="text-gray-300 mb-2">Are you sure you want to delete this document?</p>
              <p className="text-white font-medium truncate">{documentToDelete?.name || ""}</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleDeleteModalClose}
                className="flex-1 px-4 py-2 text-sm bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        multiple 
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.txt"
      />

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={!!viewingDocument}
        onClose={() => setViewingDocument(null)}
        document={viewingDocument}
        onDownload={handleDownload}
        onPrint={handlePrint}
      />

      {/* Main Modal */}
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1001]">
        <div className="bg-[#0E0E0E] rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col border border-gray-800/50 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-semibold">
                {firstName.charAt(0)}{lastName.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{contract.memberName}</h2>
                <p className="text-xs text-gray-400">
                  {displayContracts.length} Contract{displayContracts.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={redirectToMember}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#2a2a2a] text-gray-300 rounded-lg hover:bg-[#333] transition-colors text-sm"
              >
                <User size={14} />
                Go to Member
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {displayContracts.map((contractItem) => 
              renderContractCard(contractItem, expandedContractId === contractItem.id)
            )}
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
