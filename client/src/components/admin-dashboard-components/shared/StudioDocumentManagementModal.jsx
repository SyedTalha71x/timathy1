/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react"
import { X, Upload, Trash, Edit2, File, FileText, FilePlus, Eye, Download, Check, Tag, Printer, AlertCircle } from "lucide-react"
import { toast } from "react-hot-toast"
import TagManagerModal from "./TagManagerModal"

// ============================================
// Required Libraries for Document Preview:
// npm install mammoth xlsx
// ============================================
import * as mammoth from "mammoth"
import * as XLSX from "xlsx"

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

  const loadPdf = async (file) => {
    const url = URL.createObjectURL(file)
    setContent({ type: 'pdf', url })
  }

  const loadImage = async (file) => {
    const url = URL.createObjectURL(file)
    setContent({ type: 'image', url })
  }

  const loadText = async (file) => {
    const text = await file.text()
    setContent({ type: 'text', text })
  }

  const loadDocx = async (file) => {
    const arrayBuffer = await file.arrayBuffer()
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
    setContent({ type: 'html', html: result.value })
  }

  const loadExcel = async (file) => {
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    const sheets = workbook.SheetNames.map(name => ({
      name,
      data: XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1 })
    }))
    setContent({ type: 'excel', sheets })
    setTotalPages(sheets.length)
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
              .docx-preview, .docx-preview * { color: #1f2937 !important; }
              .docx-preview h1, .docx-preview h2, .docx-preview h3, 
              .docx-preview h4, .docx-preview h5, .docx-preview h6 {
                color: #111827 !important; font-weight: 600; margin-top: 1.5em; margin-bottom: 0.5em;
              }
              .docx-preview h1 { font-size: 2em; }
              .docx-preview h2 { font-size: 1.5em; }
              .docx-preview h3 { font-size: 1.25em; }
              .docx-preview p { color: #1f2937 !important; margin-bottom: 1em; }
              .docx-preview span { color: #1f2937 !important; }
              .docx-preview ul, .docx-preview ol { color: #1f2937 !important; padding-left: 1.5em; margin-bottom: 1em; }
              .docx-preview li { margin-bottom: 0.25em; color: #1f2937 !important; }
              .docx-preview table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
              .docx-preview td, .docx-preview th { border: 1px solid #d1d5db; padding: 8px; color: #1f2937 !important; }
              .docx-preview th { background-color: #f3f4f6; font-weight: 600; }
              .docx-preview a { color: #3b82f6 !important; }
              .docx-preview strong, .docx-preview b { font-weight: 600; }
              .docx-preview em, .docx-preview i { font-style: italic; }
              .docx-preview img { max-width: 100%; height: auto; margin: 1em 0; border-radius: 4px; }
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
        
        <div className="flex-1 overflow-auto bg-[#161616]">
          {renderContent()}
        </div>

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
// Main Studio Document Management Modal
// (No medical history, no sections/tabs, simple document upload & management)
// ============================================
export default function StudioDocumentManagementModal({ 
  studio,
  isOpen, 
  onClose, 
  onDocumentsUpdate,
}) {
  const [documents, setDocuments] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [editingDocId, setEditingDocId] = useState(null)
  const [newDocName, setNewDocName] = useState("")
  const [viewingDocument, setViewingDocument] = useState(null)
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false)
  const [configuredTags, setConfiguredTags] = useState([
    { id: "tag-1", name: "Contract", color: "#EF4444" },
    { id: "tag-2", name: "Invoice", color: "#F59E0B" },
    { id: "tag-3", name: "Legal", color: "#10B981" },
    { id: "tag-4", name: "Report", color: "#3B82F6" },
  ])
  const [documentToDelete, setDocumentToDelete] = useState(null)
  const fileInputRef = useRef(null)

  const studioName = studio?.name || ''

  const entityDocumentsLength = studio?.documents?.length || 0
  const entityDocumentsKey = studio?.documents?.map(d => `${d.id}-${d.uploadDate}`).join(',') || ''

  useEffect(() => {
    if (isOpen && studio) {
      const freshDocuments = studio.documents ? [...studio.documents] : []
      setDocuments(freshDocuments)
    }
  }, [isOpen, studio?.id, entityDocumentsLength, entityDocumentsKey])

  const isInitialMount = useRef(true)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    if (isOpen && studio && onDocumentsUpdate && documents.length > 0) {
      onDocumentsUpdate(studio.id, documents)
    }
  }, [documents])

  if (!isOpen || !studio) return null

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
        section: "general",
        tags: []
      }))

      setDocuments(prev => [...prev, ...newDocs])
      setIsUploading(false)
      toast.dismiss()
      toast.success(`${files.length} document(s) uploaded successfully`)
      
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }, 1500)
  }

  const handleDownload = async (doc) => {
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
    if (!doc.file) {
      toast.error("No file data available for printing")
      return
    }

    toast.loading(`Preparing ${doc.name} for printing...`, { id: 'print' })
    
    try {
      const fileType = doc.type?.toLowerCase()
      
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
            <!DOCTYPE html><html><head><title>${doc.name}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #000; line-height: 1.6; }
              h1, h2, h3 { margin-top: 1.5em; margin-bottom: 0.5em; }
              p { margin-bottom: 1em; }
              img { max-width: 100%; height: auto; }
              table { border-collapse: collapse; width: 100%; margin: 1em 0; }
              td, th { border: 1px solid #ccc; padding: 8px; }
            </style></head><body>${result.value}</body></html>
          `)
          printWindow.document.close()
          setTimeout(() => printWindow.print(), 500)
        }
        toast.dismiss('print')
        toast.success("Print dialog opened")
        return
      }
      
      if (fileType === 'xls' || fileType === 'xlsx') {
        const arrayBuffer = await doc.file.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        let htmlContent = ''
        workbook.SheetNames.forEach((sheetName, idx) => {
          const sheet = workbook.Sheets[sheetName]
          const html = XLSX.utils.sheet_to_html(sheet)
          htmlContent += `<h2>${sheetName}</h2>${html}`
          if (idx < workbook.SheetNames.length - 1) htmlContent += '<div style="page-break-after: always;"></div>'
        })
        const printWindow = window.open('', '_blank')
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html><html><head><title>${doc.name}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
              table { border-collapse: collapse; width: 100%; margin: 1em 0; }
              td, th { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
              th { background: #f5f5f5; font-weight: bold; }
            </style></head><body>${htmlContent}</body></html>
          `)
          printWindow.document.close()
          setTimeout(() => printWindow.print(), 500)
        }
        toast.dismiss('print')
        toast.success("Print dialog opened")
        return
      }
      
      if (fileType === 'txt' || fileType === 'csv') {
        const text = await doc.file.text()
        const printWindow = window.open('', '_blank')
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html><html><head><title>${doc.name}</title>
            <style>body { font-family: monospace; padding: 20px; white-space: pre-wrap; color: #000; }</style>
            </head><body>${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</body></html>
          `)
          printWindow.document.close()
          setTimeout(() => printWindow.print(), 500)
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
    setViewingDocument(doc)
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
    const nameParts = doc.name.split(".")
    const extension = nameParts.pop()
    const nameWithoutExtension = nameParts.join(".")
    setEditingDocId(doc.id)
    setNewDocName(nameWithoutExtension)
  }

  const saveDocName = (docId) => {
    if (newDocName.trim() === "") {
      toast.error("Document name cannot be empty")
      return
    }

    const originalDoc = documents.find((doc) => doc.id === docId)
    const originalExtension = originalDoc.name.split(".").pop()
    const finalName = `${newDocName.trim()}.${originalExtension}`

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
  const getDocumentIcon = (type) => {
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

        {/* Studio Info & Actions */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex flex-col sm:items-start gap-3">
            <p className="text-gray-300">
              Manage documents for <span className="font-medium text-white">{studioName}</span>
              <span className="text-gray-500 text-sm block sm:inline sm:ml-2">
                Studio #{String(studio.studioNumber || studio.id).padStart(5, '0')}
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-2 w-full justify-between">
              <button
                onClick={handleUploadClick}
                disabled={isUploading}
                className="text-sm gap-2 px-4 py-2 bg-[#3F74FF] text-white rounded-xl transition-colors w-full sm:w-auto flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload Document"}
              </button>
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

          {documents.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-[#141414] p-6 rounded-xl">
                <File className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">
                  No documents uploaded yet for {studioName}
                </p>
                <p className="text-gray-500 text-sm">
                  Click &apos;Upload Document&apos; to add files
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="bg-[#141414] p-4 rounded-xl hover:bg-[#1a1a1a] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Document Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-[#2a2a2a] rounded-md flex items-center justify-center flex-shrink-0">
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
                                className="bg-transparent border-none outline-none flex-1 w-full text-sm"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveDocName(doc.id)
                                  if (e.key === 'Escape') setEditingDocId(null)
                                }}
                              />
                              <span className="text-gray-500 text-sm">.{getFileExtension(doc.name)}</span>
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
