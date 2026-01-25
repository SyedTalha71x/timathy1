/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect, useMemo } from "react"
import { X, Upload, Trash, Edit2, File, FileText, FilePlus, Eye, Download, Check, Tag, Pencil, Printer, ClipboardList, AlertCircle } from "lucide-react"
import { toast } from "react-hot-toast"
import TagManagerModal from "./TagManagerModal"

// ============================================
// Required Libraries for Document Preview:
// npm install mammoth xlsx jspdf
// ============================================
import * as mammoth from "mammoth"
import * as XLSX from "xlsx"
import { jsPDF } from "jspdf"

// ============================================
// Delete Confirmation Modal
// ============================================
function DeleteConfirmationModal({ isOpen, onClose, onConfirm, documentName }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[90]">
      <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-md p-6 mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div>
            <h3 className="text-white text-lg font-medium">Delete Document</h3>
            <p className="text-gray-400 text-sm">This action cannot be undone</p>
          </div>
        </div>
        
        <div className="bg-[#141414] p-4 rounded-xl mb-6">
          <p className="text-gray-300 mb-2">Are you sure you want to delete this document?</p>
          <p className="text-white font-medium truncate">{documentName}</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Document Viewer Modal (supports all formats locally)
// Supported: PDF, JPG, PNG, GIF, DOCX, DOC, XLSX, XLS, TXT
// ============================================
function DocumentViewerModal({ isOpen, onClose, document, onDownload, onPrint }) {
  const [content, setContent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fileType = document?.type?.toLowerCase()

  // Reset state when document changes
  useEffect(() => {
    if (!isOpen || !document) {
      setContent(null)
      setIsLoading(true)
      setError(null)
      setCurrentPage(1)
      setTotalPages(1)
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
          await loadPdf(file)
          break
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'webp':
        case 'bmp':
          await loadImage(file)
          break
        case 'txt':
        case 'csv':
          await loadText(file)
          break
        case 'doc':
        case 'docx':
          await loadDocx(file)
          break
        case 'xls':
        case 'xlsx':
          await loadExcel(file)
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

  // PDF Loading - uses browser's native PDF viewer via iframe
  const loadPdf = async (file) => {
    const url = URL.createObjectURL(file)
    setContent({ type: 'pdf', url })
  }

  // Image Loading
  const loadImage = async (file) => {
    const url = URL.createObjectURL(file)
    setContent({ type: 'image', url })
  }

  // Text/CSV Loading
  const loadText = async (file) => {
    const text = await file.text()
    setContent({ type: 'text', text })
  }

  // DOCX Loading (using mammoth) - with image support
  const loadDocx = async (file) => {
    const arrayBuffer = await file.arrayBuffer()
    
    // Configure mammoth to convert images to base64
    const options = {
      arrayBuffer,
      convertImage: mammoth.images.imgElement(function(image) {
        return image.read("base64").then(function(imageBuffer) {
          return {
            src: "data:" + image.contentType + ";base64," + imageBuffer
          }
        })
      })
    }
    
    const result = await mammoth.convertToHtml(options)
    
    // Add note about limitations if there were any messages
    let html = result.value
    if (result.messages && result.messages.length > 0) {
      console.log("Mammoth conversion messages:", result.messages)
    }
    
    setContent({ type: 'html', html })
  }

  // Excel Loading (using xlsx)
  const loadExcel = async (file) => {
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    
    // Get all sheets
    const sheets = workbook.SheetNames.map(name => ({
      name,
      data: XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1 })
    }))
    
    setContent({ type: 'excel', sheets })
    setTotalPages(sheets.length)
  }

  // Cleanup URLs on unmount
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
            <iframe 
              src={content.url} 
              className="w-full h-full border-0"
              title={document.name}
            />
          </div>
        )

      case 'image':
        return (
          <div className="flex items-center justify-center p-4 h-full">
            <img 
              src={content.url} 
              alt={document.name} 
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            />
          </div>
        )

      case 'text':
        return (
          <div className="p-6 h-full overflow-auto">
            <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono bg-[#0d0d0d] p-4 rounded-lg">
              {content.text}
            </pre>
          </div>
        )

      case 'html':
        return (
          <div className="p-4 sm:p-6 overflow-auto" style={{ maxHeight: 'calc(95vh - 140px)' }}>
            <div 
              className="docx-preview max-w-none p-6 rounded-lg"
              dangerouslySetInnerHTML={{ __html: content.html }}
              style={{
                backgroundColor: '#ffffff',
                color: '#1f2937',
                lineHeight: '1.6',
                fontSize: '14px',
              }}
            />
            <style>{`
              .docx-preview,
              .docx-preview * {
                color: #1f2937 !important;
              }
              .docx-preview h1, .docx-preview h2, .docx-preview h3, 
              .docx-preview h4, .docx-preview h5, .docx-preview h6 {
                color: #111827 !important;
                font-weight: 600;
                margin-top: 1.5em;
                margin-bottom: 0.5em;
              }
              .docx-preview h1 { font-size: 2em; }
              .docx-preview h2 { font-size: 1.5em; }
              .docx-preview h3 { font-size: 1.25em; }
              .docx-preview p { 
                color: #1f2937 !important; 
                margin-bottom: 1em;
              }
              .docx-preview span {
                color: #1f2937 !important;
              }
              .docx-preview ul, .docx-preview ol { 
                color: #1f2937 !important;
                padding-left: 1.5em;
                margin-bottom: 1em;
              }
              .docx-preview li { 
                margin-bottom: 0.25em; 
                color: #1f2937 !important;
              }
              .docx-preview table {
                border-collapse: collapse;
                width: 100%;
                margin-bottom: 1em;
              }
              .docx-preview td, .docx-preview th {
                border: 1px solid #d1d5db;
                padding: 8px;
                color: #1f2937 !important;
              }
              .docx-preview th {
                background-color: #f3f4f6;
                font-weight: 600;
              }
              .docx-preview a { color: #3b82f6 !important; }
              .docx-preview strong, .docx-preview b { font-weight: 600; }
              .docx-preview em, .docx-preview i { font-style: italic; }
              .docx-preview img {
                max-width: 100%;
                height: auto;
                margin: 1em 0;
                border-radius: 4px;
              }
            `}</style>
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
                      currentPage === idx + 1
                        ? 'bg-[#3F74FF] text-white'
                        : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#333]'
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
                        <td 
                          key={cellIdx} 
                          className="px-4 py-2 border border-gray-800 text-gray-300 whitespace-nowrap"
                        >
                          {cell ?? ''}
                        </td>
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
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[90] p-2 sm:p-4">
      <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-7xl h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <h3 className="text-white text-lg font-medium truncate">{document.name}</h3>
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded uppercase flex-shrink-0">
              {document.type}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Viewer Content - takes all available space */}
        <div className="flex-1 overflow-auto bg-[#161616]">
          {renderContent()}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-800 flex gap-3 flex-shrink-0">
          <button
            onClick={() => onDownload && onDownload(document)}
            className="flex-1 py-2.5 bg-[#3F74FF] text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={() => onPrint && onPrint(document)}
            className="flex-1 py-2.5 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Main Document Management Modal
// ============================================
export default function DocumentManagementModal({ 
  entity,
  entityType = "member", // "member" | "lead"
  isOpen, 
  onClose, 
  onDocumentsUpdate,
  // Optional assessment callbacks
  onCreateAssessment,
  onViewAssessment,
  // Optional: custom sections config
  sections = [
    { id: "general", label: "General Documents", icon: File },
    { id: "medicalHistory", label: "Medical History", icon: ClipboardList },
  ],
  // Optional: assessment templates for inline creation
  assessmentTemplates = null,
}) {
  const [documents, setDocuments] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [editingDocId, setEditingDocId] = useState(null)
  const [newDocName, setNewDocName] = useState("")
  const [viewingDocument, setViewingDocument] = useState(null)
  const [activeSection, setActiveSection] = useState("general")
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false)
  const [configuredTags, setConfiguredTags] = useState([
    { id: "tag-1", name: "Contract", color: "#EF4444" },
    { id: "tag-2", name: "Proposal", color: "#F59E0B" },
    { id: "tag-3", name: "Medical History", color: "#10B981" },
    { id: "tag-4", name: "Follow-up", color: "#3B82F6" },
  ])
  const [documentToDelete, setDocumentToDelete] = useState(null)
  const fileInputRef = useRef(null)

  // Get entity display name
  const entityName = entity 
    ? `${entity.firstName || entity.name || ''} ${entity.lastName || entity.surname || ''}`.trim()
    : ''

  // Track documents length for proper re-render
  const entityDocumentsLength = entity?.documents?.length || 0
  const entityDocumentsKey = entity?.documents?.map(d => `${d.id}-${d.uploadDate}`).join(',') || ''

  // Load documents when modal opens or entity documents change
  useEffect(() => {
    if (isOpen && entity) {
      // Deep copy to ensure we have the latest data
      const freshDocuments = entity.documents ? [...entity.documents] : []
      setDocuments(freshDocuments)
    }
  }, [isOpen, entity?.id, entityDocumentsLength, entityDocumentsKey])

  // Update parent when documents change (but not on initial load)
  const isInitialMount = useRef(true)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    if (isOpen && entity && onDocumentsUpdate && documents.length > 0) {
      onDocumentsUpdate(entity.id, documents)
    }
  }, [documents])

  const filteredDocuments = documents.filter(doc => doc.section === activeSection)

  if (!isOpen || !entity) return null

  // ============================================
  // File Handlers
  // ============================================
  const handleUploadClick = () => {
    fileInputRef.current?.click()
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
        section: activeSection,
        tags: []
      }))

      setDocuments(prev => [...prev, ...newDocs])
      setIsUploading(false)
      toast.dismiss()
      toast.success(`${files.length} document(s) uploaded successfully`)
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }, 1500)
  }

  // Helper function to generate PDF for medical history forms
  const generateMedicalHistoryPDF = async (doc) => {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 15
    const contentWidth = pageWidth - (margin * 2)
    let yPos = margin
    
    // Colors
    const primaryColor = [249, 115, 22] // Orange-500
    const textColor = [51, 51, 51]
    const grayColor = [100, 100, 100]
    
    // Parse document name to get form title and member name
    // Format: "Form Title - Member Name"
    const nameParts = (doc.name || 'Medical History Form').split(' - ')
    const formTitle = nameParts[0] || 'Medical History Form'
    const memberName = nameParts[1] || ''
    
    // Helper to add new page if needed
    const checkPageBreak = (neededHeight) => {
      if (yPos + neededHeight > pageHeight - 20) {
        pdf.addPage()
        yPos = margin
        return true
      }
      return false
    }
    
    // Compact Header
    pdf.setFillColor(...primaryColor)
    pdf.rect(0, 0, pageWidth, 30, 'F')
    
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text(formTitle, margin, 14)
    
    // Member name below title
    if (memberName) {
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`For: ${memberName}`, margin, 22)
    }
    
    // Date and status in header (right side)
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    const headerInfo = `${doc.uploadDate || 'N/A'} â€¢ ${doc.signed ? 'Signed' : 'Unsigned'}`
    pdf.text(headerInfo, pageWidth - margin, 14, { align: 'right' })
    
    yPos = 40
    
    // Sample sections structure (matching the form modal)
    const sampleAssessmentSections = [
      {
        id: 1,
        name: "Questions before trial training",
        items: [
          { id: 1, text: "How did you hear about us?", number: 1 },
          { id: 2, text: "Are you ready for your EMS training today?", number: 2 },
          { id: 3, text: "Are you 'sport healthy'?", number: 3 },
          { id: 4, text: "What goals are you pursuing?", number: 4 }
        ]
      },
      {
        id: 2,
        name: "Contraindications: Checklist",
        items: [
          { id: 6, text: "Arteriosclerosis, arterial circulation disorders", number: 5 },
          { id: 7, text: "Abdominal wall and inguinal hernias", number: 6 },
          { id: 8, text: "Cancer diseases", number: 7 },
          { id: 9, text: "Stents and bypasses that have been active for less than 6 months", number: 8 }
        ]
      }
    ]
    
    // Render answers directly (no "Responses" heading)
    if (doc.answers && Object.keys(doc.answers).length > 0) {
      // Try to match answers to known questions
      sampleAssessmentSections.forEach(section => {
        const sectionAnswers = section.items.filter(item => doc.answers[item.id] !== undefined)
        
        if (sectionAnswers.length > 0) {
          checkPageBreak(15)
          
          // Section header - compact
          pdf.setFillColor(240, 240, 240)
          pdf.roundedRect(margin, yPos, contentWidth, 7, 1, 1, 'F')
          pdf.setTextColor(...textColor)
          pdf.setFontSize(10)
          pdf.setFont('helvetica', 'bold')
          pdf.text(section.name, margin + 3, yPos + 5)
          yPos += 10
          
          sectionAnswers.forEach(item => {
            const answer = doc.answers[item.id]
            const displayAnswer = answer === true || answer === 'yes' ? 'Yes' : 
                                  answer === false || answer === 'no' ? 'No' : 
                                  answer === 'dontknow' ? "Don't know" : String(answer)
            
            checkPageBreak(12)
            
            // Compact Q&A line
            pdf.setDrawColor(...primaryColor)
            pdf.setLineWidth(0.5)
            pdf.line(margin, yPos, margin, yPos + 8)
            
            pdf.setTextColor(...textColor)
            pdf.setFontSize(8)
            pdf.setFont('helvetica', 'bold')
            const questionText = `${item.number}. ${item.text}`
            const splitQuestion = pdf.splitTextToSize(questionText, contentWidth - 50)
            pdf.text(splitQuestion, margin + 3, yPos + 4)
            
            // Answer on same line or next if question wraps
            pdf.setFont('helvetica', 'normal')
            pdf.setTextColor(...grayColor)
            const answerX = contentWidth - 30
            pdf.text(displayAnswer, margin + answerX, yPos + 4)
            
            yPos += 6 + (splitQuestion.length > 1 ? (splitQuestion.length - 1) * 3 : 0)
          })
          
          yPos += 4
        }
      })
      
      // Add any answers not matched to known questions
      const knownIds = sampleAssessmentSections.flatMap(s => s.items.map(i => i.id))
      const unknownAnswers = Object.entries(doc.answers).filter(([id]) => !knownIds.includes(parseInt(id)))
      
      if (unknownAnswers.length > 0) {
        checkPageBreak(15)
        
        pdf.setFillColor(240, 240, 240)
        pdf.roundedRect(margin, yPos, contentWidth, 7, 1, 1, 'F')
        pdf.setTextColor(...textColor)
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Additional Information', margin + 3, yPos + 5)
        yPos += 10
        
        unknownAnswers.forEach(([id, answer], idx) => {
          const displayAnswer = answer === true || answer === 'yes' ? 'Yes' : 
                                answer === false || answer === 'no' ? 'No' : 
                                answer === 'dontknow' ? "Don't know" : String(answer)
          
          checkPageBreak(10)
          
          pdf.setDrawColor(...primaryColor)
          pdf.setLineWidth(0.5)
          pdf.line(margin, yPos, margin, yPos + 6)
          
          pdf.setTextColor(...textColor)
          pdf.setFontSize(8)
          pdf.setFont('helvetica', 'bold')
          pdf.text(`Q${idx + 1}`, margin + 3, yPos + 4)
          
          pdf.setFont('helvetica', 'normal')
          pdf.setTextColor(...grayColor)
          pdf.text(displayAnswer, margin + contentWidth - 30, yPos + 4)
          
          yPos += 8
        })
      }
    }
    
    // Signature section - compact
    if (doc.signature) {
      checkPageBreak(45)
      
      yPos += 5
      
      // Signature line
      pdf.setDrawColor(...primaryColor)
      pdf.setLineWidth(0.3)
      pdf.line(margin, yPos, pageWidth - margin, yPos)
      yPos += 5
      
      pdf.setTextColor(...textColor)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Signature', margin, yPos)
      yPos += 5
      
      // Add signature image - detect format from data URL
      try {
        const signatureData = doc.signature
        
        // Detect image format from data URL
        let format = 'PNG'
        if (signatureData.includes('data:image/jpeg') || signatureData.includes('data:image/jpg')) {
          format = 'JPEG'
        } else if (signatureData.includes('data:image/png')) {
          format = 'PNG'
        }
        
        // Draw white background rectangle for signature (in case of transparent PNG)
        pdf.setFillColor(255, 255, 255)
        pdf.setDrawColor(200, 200, 200)
        pdf.setLineWidth(0.2)
        pdf.roundedRect(margin, yPos, 55, 28, 2, 2, 'FD')
        
        // Add signature image to PDF (slightly inset from the box)
        pdf.addImage(signatureData, format, margin + 2, yPos + 1, 50, 25)
        yPos += 32
        
        pdf.setTextColor(...grayColor)
        pdf.setFontSize(7)
        pdf.setFont('helvetica', 'italic')
        pdf.text(`Signed: ${doc.uploadDate || 'N/A'}`, margin, yPos)
      } catch (err) {
        console.error('Error adding signature:', err)
        pdf.setTextColor(...grayColor)
        pdf.setFontSize(8)
        pdf.text('[Signature attached]', margin, yPos)
      }
    }
    
    // Footer on each page - minimal
    const pageCount = pdf.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i)
      pdf.setFontSize(7)
      pdf.setTextColor(...grayColor)
      pdf.text(
        `Page ${i}/${pageCount}`,
        pageWidth / 2,
        pageHeight - 8,
        { align: 'center' }
      )
    }
    
    return pdf
  }

  const handleDownload = async (doc) => {
    // Special handling for medical history forms - generate PDF
    if (doc.type === "medicalHistory") {
      toast.loading(`Generating PDF...`, { id: 'download' })
      
      try {
        const pdf = await generateMedicalHistoryPDF(doc)
        const fileName = `${doc.name.replace(/\s+/g, '_')}.pdf`
        pdf.save(fileName)
        
        toast.dismiss('download')
        toast.success(`${fileName} downloaded`)
      } catch (err) {
        console.error('PDF generation error:', err)
        toast.dismiss('download')
        toast.error('Failed to generate PDF')
      }
      return
    }
    
    toast.success(`Downloading ${doc.name}...`)
    if (doc.file) {
      const url = URL.createObjectURL(doc.file)
      const a = document.createElement("a")
      a.href = url
      a.download = doc.name
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }
  }

  const handlePrint = async (doc) => {
    // Special handling for medical history forms - use PDF
    if (doc.type === "medicalHistory") {
      toast.loading(`Generating PDF for printing...`, { id: 'print' })
      
      try {
        const pdf = await generateMedicalHistoryPDF(doc)
        
        // Create blob URL and open in new window for printing
        const pdfBlob = pdf.output('blob')
        const pdfUrl = URL.createObjectURL(pdfBlob)
        
        const printWindow = window.open(pdfUrl, '_blank')
        if (printWindow) {
          printWindow.onload = () => {
            setTimeout(() => {
              printWindow.print()
            }, 500)
          }
        }
        
        toast.dismiss('print')
        toast.success("PDF print dialog opened")
        return
      } catch (err) {
        console.error("Print error:", err)
        toast.dismiss('print')
        toast.error("Failed to generate PDF for printing")
        return
      }
    }

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
      
      // For DOCX - convert to HTML and print (with images)
      if (fileType === 'doc' || fileType === 'docx') {
        const arrayBuffer = await doc.file.arrayBuffer()
        
        // Configure mammoth to convert images to base64
        const options = {
          arrayBuffer,
          convertImage: mammoth.images.imgElement(function(image) {
            return image.read("base64").then(function(imageBuffer) {
              return {
                src: "data:" + image.contentType + ";base64," + imageBuffer
              }
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
                body {
                  font-family: Arial, sans-serif;
                  padding: 40px;
                  max-width: 800px;
                  margin: 0 auto;
                  color: #000;
                  line-height: 1.6;
                }
                h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; }
                p { margin-bottom: 1em; }
                img { max-width: 100%; height: auto; }
                table { border-collapse: collapse; width: 100%; margin: 1em 0; }
                td, th { border: 1px solid #ccc; padding: 8px; }
                @media print {
                  body { padding: 20px; }
                  img { max-width: 100%; }
                }
              </style>
            </head>
            <body>
              ${result.value}
            </body>
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
      
      // For Excel - convert to HTML table and print
      if (fileType === 'xls' || fileType === 'xlsx') {
        const arrayBuffer = await doc.file.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        
        let htmlContent = ''
        workbook.SheetNames.forEach((sheetName, idx) => {
          const sheet = workbook.Sheets[sheetName]
          const html = XLSX.utils.sheet_to_html(sheet)
          htmlContent += `<h2>${sheetName}</h2>${html}`
          if (idx < workbook.SheetNames.length - 1) {
            htmlContent += '<div style="page-break-after: always;"></div>'
          }
        })
        
        const printWindow = window.open('', '_blank')
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>${doc.name}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
                table { border-collapse: collapse; width: 100%; margin: 1em 0; }
                td, th { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
                th { background: #f5f5f5; font-weight: bold; }
                h2 { margin-top: 2em; }
                @media print {
                  h2 { page-break-before: auto; }
                }
              </style>
            </head>
            <body>
              ${htmlContent}
            </body>
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

  const handleViewDocument = (doc) => {
    // Medical history forms use the AssessmentFormModal in view mode
    if (doc.type === "medicalHistory" && onViewAssessment) {
      onViewAssessment(doc)
    } else {
      setViewingDocument(doc)
    }
  }

  const handleCreateAssessmentClick = () => {
    if (onCreateAssessment) {
      onCreateAssessment()
    }
  }

  // ============================================
  // Document Management
  // ============================================
  const getFileExtension = (filename) => {
    if (!filename) return ""
    const parts = filename.split(".")
    return parts.length > 1 ? parts.pop().toLowerCase() : ""
  }

  const handleDelete = (docId) => {
    const doc = documents.find(d => d.id === docId)
    setDocumentToDelete(doc)
  }

  const confirmDelete = () => {
    if (documentToDelete) {
      setDocuments(prev => prev.filter((doc) => doc.id !== documentToDelete.id))
      toast.success("Document deleted successfully")
      setDocumentToDelete(null)
    }
  }

  const startEditing = (doc) => {
    // Only filled-out medical history forms (type === "medicalHistory") don't have file extension
    if (doc.type === "medicalHistory") {
      setEditingDocId(doc.id)
      setNewDocName(doc.name)
    } else {
      const nameParts = doc.name.split(".")
      const extension = nameParts.pop()
      const nameWithoutExtension = nameParts.join(".")
      setEditingDocId(doc.id)
      setNewDocName(nameWithoutExtension)
    }
  }

  const saveDocName = (docId) => {
    if (newDocName.trim() === "") {
      toast.error("Document name cannot be empty")
      return
    }

    const originalDoc = documents.find((doc) => doc.id === docId)
    
    let finalName
    // Only filled-out medical history forms (type === "medicalHistory") don't have file extension
    if (originalDoc.type === "medicalHistory") {
      finalName = newDocName.trim()
    } else {
      const originalExtension = originalDoc.name.split(".").pop()
      finalName = `${newDocName.trim()}.${originalExtension}`
    }

    setDocuments(prev => prev.map((doc) => (doc.id === docId ? { ...doc, name: finalName } : doc)))
    setEditingDocId(null)
    toast.success("Document renamed successfully")
  }

  // ============================================
  // Tag Management
  // ============================================
  const toggleDocumentTag = (docId, tagId) => {
    const doc = documents.find(d => d.id === docId)
    if (!doc) return

    const currentTags = doc.tags || []
    // Normalize tagId for comparison (can be String or Number)
    const normalizedTagId = typeof tagId === 'string' && !isNaN(tagId) ? Number(tagId) : tagId
    
    const tagExists = currentTags.some(id => 
      id === normalizedTagId || String(id) === String(tagId)
    )
    
    const newTags = tagExists
      ? currentTags.filter(id => String(id) !== String(tagId))
      : [...currentTags, normalizedTagId]

    setDocuments(prev => prev.map(d => 
      d.id === docId ? { ...d, tags: newTags } : d
    ))
  }

  const handleAddTag = (newTag) => {
    if (!newTag || !newTag.name) return
    setConfiguredTags([...configuredTags, newTag])
    toast.success("Tag created successfully")
  }

  const handleDeleteTag = (tagId) => {
    setConfiguredTags(configuredTags.filter(tag => tag.id !== tagId))
    toast.success("Tag deleted successfully")
  }

  const handleSaveTags = (tags) => {
    setConfiguredTags(tags)
  }

  // ============================================
  // UI Helpers
  // ============================================
  const getDocumentIcon = (type, section) => {
    // Only filled-out medical history forms (type === "medicalHistory") should have neutral icon
    // Regular uploaded files in medicalHistory section should have colorful icons based on file type
    if (type === "medicalHistory") {
      return <ClipboardList className="w-5 h-5 text-white" />
    }
    
    if (!type) return <File className="w-5 h-5 text-gray-400" />

    const fileType = type.toLowerCase()
    switch (fileType) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />
      case "xlsx":
      case "xls":
        return <FileText className="w-5 h-5 text-green-500" />
      case "docx":
      case "doc":
        return <FileText className="w-5 h-5 text-blue-500" />
      case "jpg":
      case "jpeg":
      case "png":
        return <File className="w-5 h-5 text-purple-500" />
      case "txt":
        return <FileText className="w-5 h-5 text-gray-500" />
      default:
        return <File className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!documentToDelete}
        onClose={() => setDocumentToDelete(null)}
        onConfirm={confirmDelete}
        documentName={documentToDelete?.name}
      />

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={!!viewingDocument}
        onClose={() => setViewingDocument(null)}
        document={viewingDocument}
        onDownload={handleDownload}
        onPrint={handlePrint}
      />

      {/* Tag Manager Modal */}
      <TagManagerModal
        isOpen={isTagManagerOpen}
        onClose={() => setIsTagManagerOpen(false)}
        tags={configuredTags}
        onSave={handleSaveTags}
        onAddTag={handleAddTag}
        onDeleteTag={handleDeleteTag}
      />

      {/* Main Modal */}
      <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-800">
          <h3 className="text-white text-lg sm:text-xl font-medium">
            Document Management
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Entity Info & Actions */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex flex-col sm:items-start gap-3">
            <p className="text-gray-300">
              Manage documents for <span className="font-medium text-white">{entityName}</span>
              <span className="text-gray-500 text-sm block sm:inline sm:ml-2">
                {entityType === "lead" ? `Lead #${entity.id}` : entityType === "staff" ? `Staff #${entity.id}` : `Member #${entity.id}`}
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-2 w-full justify-between">
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleUploadClick}
                  disabled={isUploading}
                  className="text-sm gap-2 px-4 py-2 bg-[#3F74FF] text-white rounded-xl transition-colors w-full sm:w-auto flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? "Uploading..." : "Upload Document"}
                </button>
                {activeSection === "medicalHistory" && onCreateAssessment && (
                  <button
                    onClick={handleCreateAssessmentClick}
                    className="text-sm gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors w-full sm:w-auto flex items-center justify-center"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Fill Out Medical History
                  </button>
                )}
              </div>
              <button
                onClick={() => setIsTagManagerOpen(true)}
                className="text-sm gap-2 px-4 py-2 bg-[#2a2a2a] text-white rounded-xl hover:bg-[#333] transition-colors w-full sm:w-auto flex items-center justify-center border border-gray-700"
              >
                <Tag className="w-4 h-4 mr-2" />
                Tags
              </button>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              multiple 
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
            />
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-gray-800">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  activeSection === section.id
                    ? "text-white border-b-2 border-[#3F74FF]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {section.label}
              </button>
            )
          })}
        </div>

        {/* Document List */}
        <div className="flex-1 overflow-y-auto p-4">
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
              <div className="bg-[#141414] p-6 rounded-xl">
                <File className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">
                  {activeSection === "general" 
                    ? `No documents uploaded yet for ${entityName}`
                    : "No medical history records yet"
                  }
                </p>
                <p className="text-gray-500 text-sm">
                  {activeSection === "general"
                    ? "Click 'Upload Document' to add files"
                    : "Click 'Fill Out Medical History' to get started"
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="bg-[#141414] p-4 rounded-xl hover:bg-[#1a1a1a] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Document Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-[#2a2a2a] rounded-md flex items-center justify-center flex-shrink-0">
                        {getDocumentIcon(doc.type, doc.section)}
                      </div>
                      <div className="flex-1 min-w-0">
                        {editingDocId === doc.id ? (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className="flex-1 flex items-center bg-black text-white px-2 py-1 rounded border border-gray-700 w-full">
                              <input
                                type="text"
                                value={newDocName}
                                onChange={(e) => setNewDocName(e.target.value)}
                                className="bg-transparent border-none outline-none flex-1 w-full text-sm"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveDocName(doc.id)
                                  if (e.key === 'Escape') setEditingDocId(null)
                                }}
                              />
                              {doc.type !== "medicalHistory" && (
                                <span className="text-gray-500 text-sm">.{getFileExtension(doc.name)}</span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => saveDocName(doc.id)}
                                className="p-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingDocId(null)}
                                className="p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h4 className="text-white font-medium text-sm truncate">{doc.name}</h4>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <p className="text-gray-400 text-xs">{doc.size}</p>
                              <span className="text-gray-600">-</span>
                              <p className="text-gray-400 text-xs">{doc.uploadDate}</p>
                              {doc.type === "medicalHistory" && doc.answers && (
                                <span className="text-gray-400 text-xs">â€¢ {Object.keys(doc.answers).length} answers</span>
                              )}
                            </div>
                            
                            {/* Tags display */}
                            {doc.tags && doc.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {doc.tags.map((tagId) => {
                                  const tag = configuredTags.find(t => String(t.id) === String(tagId))
                                  return tag ? (
                                    <span
                                      key={tagId}
                                      className="px-2 py-0.5 rounded-md text-xs flex items-center gap-1 text-white"
                                      style={{ backgroundColor: tag.color }}
                                    >
                                      <Tag size={10} />
                                      {tag.name}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          toggleDocumentTag(doc.id, tagId)
                                        }}
                                        className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                                        title="Remove tag"
                                      >
                                        <X size={10} />
                                      </button>
                                    </span>
                                  ) : null
                                })}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {editingDocId !== doc.id && (
                      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                        {/* Tag selector */}
                        <div className="relative">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                toggleDocumentTag(doc.id, e.target.value)
                                e.target.value = ""
                              }
                            }}
                            className="p-2 bg-[#2a2a2a] text-gray-300 rounded-md text-xs border border-gray-700 hover:bg-[#333] hover:border-[#3F74FF] transition-colors cursor-pointer"
                            title="Add tag"
                          >
                            <option value="">+ Tag</option>
                            {configuredTags.filter(tag => !doc.tags?.some(id => String(id) === String(tag.id))).map((tag) => (
                              <option key={tag.id} value={tag.id}>
                                {tag.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        
                        <button
                          onClick={() => handleViewDocument(doc)}
                          className="p-2 bg-[#2a2a2a] text-gray-300 rounded-md hover:bg-[#333] transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
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
                        <button
                          onClick={() => startEditing(doc)}
                          className="p-2 bg-[#2a2a2a] text-gray-300 rounded-md hover:bg-[#333] transition-colors"
                          title="Rename"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
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

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="text-xs text-gray-500">
              <p>Supported: PDF, JPG, PNG, DOC, DOCX, TXT</p>
              <p>Max size: 10MB per file</p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#3F74FF] text-sm text-white rounded-xl hover:bg-blue-600 transition-colors w-full sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
