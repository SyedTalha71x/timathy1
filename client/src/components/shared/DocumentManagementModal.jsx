/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect, useMemo } from "react"
import { X, Upload, Trash, Edit2, File, FileText, FilePlus, Eye, Download, Check, Tag, Pencil, Printer, ClipboardList, AlertCircle, CreditCard, RefreshCw } from "lucide-react"
import { toast } from "react-hot-toast"
import TagManagerModal from "./TagManagerModal"
import api from '../../services/apiClient';
// ============================================
// Required Libraries for Document Preview:
// npm install mammoth xlsx jspdf
// ============================================
import * as mammoth from "mammoth"
import * as XLSX from "xlsx"
import { jsPDF } from "jspdf"
import { useDispatch, useSelector } from "react-redux"

// Import your thunks
import {
  updateStaffThunk,
  uploadDocumentThunk,
  deleteDocumentThunk,
  updateDocumentMetadataThunk,
  getDocumentsByEntityThunk,
  getDocumentByIdThunk
} from "../../features/staff/staffSlice"

import {
  getAllFormThunk,
  generateResponsePDFThunk,
  getResponseByIdThunk,
  getResponsesByEntityThunk,
  createResponseThunk,
  updateResponseThunk,
  deleteResponseThunk
} from '../../features/medicalHistory/medicalHistorySlice'

// Import tags thunks
import { getTagsThunk } from '../../features/todos/todosSlice'

// ============================================
// Delete Confirmation Modal
// ============================================
function DeleteConfirmationModal({ isOpen, onClose, onConfirm, documentName }) {
  const { t } = useTranslation()
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
      <div className="bg-surface-card rounded-xl w-full max-w-md p-6 mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div>
            <h3 className="text-content-primary text-xl font-bold">{t("documents.delete.title")}</h3>
            <p className="text-content-muted text-sm">{t("documents.delete.cannotUndo")}</p>
          </div>
        </div>

        <div className="bg-surface-dark p-4 rounded-xl mb-6">
          <p className="text-content-secondary mb-2">{t("documents.delete.confirm")}</p>
          <p className="text-content-primary font-medium truncate">{documentName}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm bg-surface-button text-content-primary rounded-xl hover:bg-surface-button-hover transition-colors"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
          >
            {t("common.delete")}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Document Viewer Modal (supports all formats locally)
// ============================================
function DocumentViewerModal({ isOpen, onClose, document, onDownload, onPrint }) {
  const { t } = useTranslation()
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
    if (!document?.url && !document?.file) {
      setError("No file data available")
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // If we have a URL, use it directly for PDFs and images
      if (document.url) {
        const fileTypeLower = fileType || document.url.split('.').pop().toLowerCase()

        // For PDFs, use iframe directly
        if (fileTypeLower === 'pdf') {
          setContent({ type: 'pdf', url: document.url })
          setIsLoading(false)
          return
        }

        // For images, use direct URL
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(fileTypeLower)) {
          setContent({ type: 'image', url: document.url })
          setIsLoading(false)
          return
        }

        // For other files, fetch and process
        const response = await fetch(document.url)
        const blob = await response.blob()
        await loadFile(blob, fileTypeLower)
      } else if (document.file) {
        await loadFile(document.file, fileType)
      }
    } catch (err) {
      console.error("Error loading document:", err)
      setError(`Failed to load document: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const loadFile = async (file, type) => {
    switch (type) {
      case 'pdf':
        const url = URL.createObjectURL(file)
        setContent({ type: 'pdf', url })
        break
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
      case 'bmp':
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
          convertImage: mammoth.images.imgElement(function (image) {
            return image.read("base64").then(function (imageBuffer) {
              return {
                src: "data:" + image.contentType + ";base64," + imageBuffer
              }
            })
          })
        }
        const result = await mammoth.convertToHtml(options)
        setContent({ type: 'html', html: result.value })
        break
      case 'xls':
      case 'xlsx':
        const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' })
        const sheets = workbook.SheetNames.map(name => ({
          name,
          data: XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1 })
        }))
        setContent({ type: 'excel', sheets })
        setTotalPages(sheets.length)
        break
      default:
        setError(`File type .${type} is not supported for preview`)
    }
  }

  useEffect(() => {
    return () => {
      if (content?.url && content.url.startsWith('blob:')) {
        URL.revokeObjectURL(content.url)
      }
    }
  }, [content])

  if (!isOpen || !document) return null

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-content-muted">{t("documents.viewer.loading")}</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <AlertCircle className="w-16 h-16 text-accent-red mb-4" />
          <p className="text-content-primary text-lg mb-2">{t("documents.viewer.error")}</p>
          <p className="text-content-muted mb-6">{error}</p>
          <button
            onClick={() => onDownload && onDownload(document)}
            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors flex items-center gap-2"
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
            <pre className="text-content-secondary text-sm whitespace-pre-wrap font-mono bg-surface-base p-4 rounded-lg">
              {content.text}
            </pre>
          </div>
        )
      case 'html':
        return (
          <div className="p-4 sm:p-6 overflow-auto" style={{ maxHeight: 'calc(95vh - 140px)' }}>
            <div className="docx-preview max-w-none p-6 rounded-lg" dangerouslySetInnerHTML={{ __html: content.html }} />
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
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${currentPage === idx + 1
                      ? 'bg-primary text-white'
                      : 'bg-surface-dark text-content-secondary hover:bg-surface-button'
                      }`}
                  >
                    {sheet.name}
                  </button>
                ))}
              </div>
            )}
            <div className="overflow-auto bg-surface-base rounded-lg">
              <table className="min-w-full text-sm">
                <tbody>
                  {currentSheet?.data.map((row, rowIdx) => (
                    <tr key={rowIdx} className={rowIdx === 0 ? 'bg-surface-dark font-semibold' : 'hover:bg-surface-dark'}>
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="px-4 py-2 border border-border text-content-secondary whitespace-nowrap">
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
            <File className="w-16 h-16 text-content-faint mb-4" />
            <p className="text-content-primary text-lg mb-2">{t("documents.viewer.noPreview")}</p>
            <p className="text-content-muted">{t("documents.viewer.noPreviewDesc")}</p>
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-2 sm:p-4">
      <div className="bg-surface-card rounded-xl w-full max-w-7xl h-[95vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <h3 className="text-content-primary text-lg font-medium truncate">{document.name}</h3>
            <span className="text-xs text-content-faint bg-surface-dark px-2 py-1 rounded uppercase flex-shrink-0">
              {document.type}
            </span>
          </div>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-auto bg-surface-dark">{renderContent()}</div>
        <div className="p-4 border-t border-border flex gap-3 flex-shrink-0">
          <button onClick={() => onDownload && onDownload(document)} className="flex-1 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Download
          </button>
          <button onClick={() => onPrint && onPrint(document)} className="flex-1 py-2.5 bg-surface-button text-content-primary rounded-xl hover:bg-surface-button-hover transition-colors flex items-center justify-center gap-2">
            <Printer className="w-4 h-4" /> Print
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
  entityType = "member",
  isOpen,
  onClose,
  onDocumentsUpdate,
  onCreateAssessment,
  onViewAssessment,
  sections = [
    { id: "general", label: "General Documents", icon: File },
    { id: "medicalHistory", label: "Medical History", icon: ClipboardList },
  ],
  assessmentTemplates = null,
}) {
  const dispatch = useDispatch();

  // Redux Selectors
  const { staff = [], documents: staffDocuments = [], loading: staffLoading } = useSelector((state) => state.staff);
  const { medical = [], history = [], loading: medicalLoading } = useSelector((state) => state.medical);
  const { tags = [] } = useSelector((state) => state.todos);

  // Local state
  const [documents, setDocuments] = useState([])
  const [medicalHistories, setMedicalHistories] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [editingDocId, setEditingDocId] = useState(null)
  const [newDocName, setNewDocName] = useState("")
  const [viewingDocument, setViewingDocument] = useState(null)
  const [activeSection, setActiveSection] = useState("general")
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState(null)
  const [showFormModal, setShowFormModal] = useState(false)
  const [availableForms, setAvailableForms] = useState([])
  const [selectedForm, setSelectedForm] = useState(null)
  const [formAnswers, setFormAnswers] = useState({})
  const [signature, setSignature] = useState(null)
  const fileInputRef = useRef(null)

  // Helper to get entity ID safely
  const getEntityId = () => {
    if (!entity) return null;
    return entity._id || entity.id || null;
  };

  const entityName = entity ? `${entity.firstName || entity.name || ''} ${entity.lastName || entity.surname || ''}`.trim() : ''
  const entityId = getEntityId();

  // Load tags when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(getTagsThunk())
    }
  }, [isOpen, dispatch])

  // Refresh documents function
  const refreshDocuments = async () => {
    if (!entityId) {
      console.error('No entity ID found');
      return;
    }

    try {
      const result = await dispatch(getDocumentsByEntityThunk({
        entityType,
        entityId: entityId
      })).unwrap();

      if (result && Array.isArray(result)) {
        const formattedDocs = result.map(doc => ({
          id: doc._id,
          name: doc.displayName || doc.originalName,
          type: doc.originalName?.split('.').pop().toLowerCase() || 'file',
          size: doc.size ? `${(doc.size / (1024 * 1024)).toFixed(1)} MB` : 'N/A',
          uploadDate: new Date(doc.uploadDate || doc.createdAt).toISOString().split('T')[0],
          url: doc.url,
          section: doc.section || 'general',
          tags: doc.tags || [],
          file: null
        }));
        setDocuments(formattedDocs);
      }
    } catch (error) {
      console.error('Error refreshing documents:', error);
    }
  };

  // Load documents and medical histories when modal opens
  useEffect(() => {
    if (isOpen && entity && entityId) {
      refreshDocuments();

      // Fetch medical histories
      const fetchHistories = async () => {
        try {
          const result = await dispatch(getResponsesByEntityThunk({
            entityType,
            entityId: entityId
          })).unwrap();

          let historiesData = null;
          if (result?.data && Array.isArray(result.data)) {
            historiesData = result.data;
          } else if (result?.responses && Array.isArray(result.responses)) {
            historiesData = result.responses;
          } else if (Array.isArray(result)) {
            historiesData = result;
          }

          if (historiesData && historiesData.length > 0) {
            const formattedHistories = historiesData.map(history => ({
              id: history._id,
              name: history.title || 'Medical History',
              type: "medicalHistory",
              size: "N/A",
              uploadDate: new Date(history.createdAt).toISOString().split('T')[0],
              section: "medicalHistory",
              tags: history.tags || [],
              answers: history.answers,
              signature: history.signature,
              signed: !!history.signature,
              formTemplateId: history.formTemplateId
            }));
            setMedicalHistories(formattedHistories);
          } else {
            setMedicalHistories([]);
          }
        } catch (error) {
          console.error('Error fetching medical histories:', error);
          setMedicalHistories([]);
        }
      };

      fetchHistories();

      // Fetch available form templates
      const fetchForms = async () => {
        try {
          const result = await dispatch(getAllFormThunk()).unwrap();
          let formsData = null;
          if (result?.forms && Array.isArray(result.forms)) {
            formsData = result.forms;
          } else if (Array.isArray(result)) {
            formsData = result;
          }
          if (formsData && formsData.length > 0) {
            setAvailableForms(formsData);
          } else {
            setAvailableForms([]);
          }
        } catch (error) {
          console.error('Error fetching forms:', error);
          setAvailableForms([]);
        }
      };

      fetchForms();
    }
  }, [isOpen, entity, entityId, dispatch, entityType]);

  // Combine documents and medical histories for display
  const allDocuments = useMemo(() => {
    if (activeSection === "medicalHistory") {
      return medicalHistories
    }
    return documents
  }, [activeSection, documents, medicalHistories])

  const filteredDocuments = allDocuments

  if (!isOpen || !entity) return null

  // Helper function to get tag details by ID
  const getTagById = (tagId) => {
    return tags.find(tag => tag._id === tagId || tag.id === tagId)
  }

  // ============================================
  // File Handlers
  // ============================================
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }


  const handleFileChange = async (e) => {
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
      toast.error(t("documents.toast.unsupportedFormat", { count: invalidFiles.length }))
      return
    }

    const largeFiles = files.filter((file) => file.size > 10 * 1024 * 1024)
    if (largeFiles.length > 0) {
      toast.error(t("documents.toast.sizeLimitExceeded", { count: largeFiles.length }))
      return
    }

    setIsUploading(true)
    toast.loading(t("documents.toast.uploading", { count: files.length }))

    try {
      const formData = new FormData()
      formData.append('section', activeSection)
      formData.append('tags', JSON.stringify([]))

      files.forEach((file) => {
        formData.append('documents', file)
      })

      const result = await dispatch(uploadDocumentThunk({
        entityType,
        entityId: entityId,
        formData
      })).unwrap()

      if (result.success && result.documents) {
        // Refresh documents immediately after upload
        await refreshDocuments();
        toast.success(`${files.length} document(s) uploaded successfully`)
      } else {
        toast.error('Upload failed: Invalid response from server')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Failed to upload documents')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      toast.dismiss()
    }
  }

  // ============================================
  // Medical History Form Handlers
  // ============================================
  const handleCreateAssessmentClick = () => {
    setShowFormModal(true)
  }

  const handleFormSubmit = async () => {
    if (!selectedForm) {
      toast.error('Please select a form template')
      return
    }

    if (!signature) {
      toast.error('Please provide a signature')
      return
    }

    try {
      const result = await dispatch(createResponseThunk({
        entityType,
        entityId: entityId,
        data: {
          formTemplateId: selectedForm._id,
          answers: formAnswers,
          signature: signature,
          signatureLocation: window.location.href,
          entityName: entityName,
          title: selectedForm.title,
          tagsId: []
        }
      })).unwrap()

      if (result.success) {
        const newHistory = {
          id: result.data._id,
          name: result.data.title,
          type: "medicalHistory",
          size: "N/A",
          uploadDate: new Date(result.data.createdAt).toISOString().split('T')[0],
          section: "medicalHistory",
          tagsId: result.data.tags || [],
          answers: result.data.answers,
          signature: result.data.signature,
          signed: !!result.data.signature
        }

        setMedicalHistories(prev => [newHistory, ...prev])
        toast.success('Medical history submitted successfully')
        setShowFormModal(false)
        setSelectedForm(null)
        setFormAnswers({})
        setSignature(null)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error('Failed to submit medical history')
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
    const doc = filteredDocuments.find(d => d.id === docId)
    setDocumentToDelete(doc)
  }

  const confirmDelete = async () => {
    if (documentToDelete) {
      try {
        if (documentToDelete.type === "medicalHistory") {
          await dispatch(deleteResponseThunk(documentToDelete.id)).unwrap();
          setMedicalHistories(prev => prev.filter((doc) => doc.id !== documentToDelete.id));
        } else {
          await dispatch(deleteDocumentThunk({
            entityType: entityType,
            entityId: entityId,
            documentId: documentToDelete.id
          })).unwrap();
          setDocuments(prev => prev.filter((doc) => doc.id !== documentToDelete.id));
        }
        toast.success("Document deleted successfully");
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete document');
      }
      setDocumentToDelete(null);
    }
  };

  const startEditing = (doc) => {
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

  const saveDocName = async (docId) => {
    if (newDocName.trim() === "") {
      toast.error("Document name cannot be empty");
      return;
    }

    const originalDoc = filteredDocuments.find((doc) => doc.id === docId);

    try {
      if (originalDoc.type === "medicalHistory") {
        await dispatch(updateResponseThunk({
          id: docId,
          data: { title: newDocName.trim() }
        })).unwrap();
        setMedicalHistories(prev => prev.map((doc) =>
          doc.id === docId ? { ...doc, name: newDocName.trim() } : doc
        ));
      } else {
        // For regular documents, only send the displayName
        const updateData = {
          displayName: newDocName.trim()
        };

        console.log('Sending update:', updateData);

        await dispatch(updateDocumentMetadataThunk({
          documentId: docId,
          updateData: updateData
        })).unwrap();

        setDocuments(prev => prev.map((doc) =>
          doc.id === docId ? { ...doc, name: `${newDocName.trim()}.${doc.name.split('.').pop()}` } : doc
        ));
      }
      toast.success("Document renamed successfully");
    } catch (error) {
      console.error('Rename error:', error);
      toast.error(error.message || 'Failed to rename document');
    }
    setEditingDocId(null);
  };

  // ============================================
  // Tag Management
  // ============================================
  const toggleDocumentTag = async (docId, tagId) => {
    const doc = filteredDocuments.find(d => d.id === docId)
    if (!doc) return

    const currentTags = doc.tags || []
    const tagExists = currentTags.some(id => String(id) === String(tagId))
    const newTags = tagExists
      ? currentTags.filter(id => String(id) !== String(tagId))
      : [...currentTags, tagId]

    try {
      if (doc.type === "medicalHistory") {
        await dispatch(updateResponseThunk({
          responseId: docId,
          updateData: { tagsId: newTags }
        })).unwrap()
        setMedicalHistories(prev => prev.map(d =>
          d.id === docId ? { ...d, tags: newTags } : d
        ))
      } else {
        await dispatch(updateDocumentMetadataThunk({
          documentId: docId,
          updateData: { tagsId: newTags }
        })).unwrap()
        setDocuments(prev => prev.map(d =>
          d.id === docId ? { ...d, tags: newTags } : d
        ))
      }
      toast.success(tagExists ? 'Tag removed' : 'Tag added')
    } catch (error) {
      console.error('Tag update error:', error)
      toast.error('Failed to update tags')
    }
  }

  // ============================================
  // PDF Generation for Medical History
  // ============================================
  const generateMedicalHistoryPDF = async (doc) => {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 15
    const contentWidth = pageWidth - (margin * 2)
    let yPos = margin

    const primaryColor = [249, 115, 22]
    const textColor = [51, 51, 51]
    const grayColor = [100, 100, 100]

    pdf.setFillColor(...primaryColor)
    pdf.rect(0, 0, pageWidth, 30, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text(doc.name, margin, 14)

    if (entityName) {
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`For: ${entityName}`, margin, 22)
    }

    yPos = 40

    if (doc.answers && Object.keys(doc.answers).length > 0) {
      pdf.setFillColor(240, 240, 240)
      pdf.roundedRect(margin, yPos, contentWidth, 7, 1, 1, 'F')
      pdf.setTextColor(...textColor)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Responses', margin + 3, yPos + 5)
      yPos += 15

      Object.entries(doc.answers).forEach(([key, value]) => {
        if (yPos > pageHeight - 50) {
          pdf.addPage()
          yPos = margin
        }

        pdf.setFontSize(9)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(...textColor)
        pdf.text(key, margin, yPos)
        yPos += 6

        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(...grayColor)
        const answerText = typeof value === 'object' ? JSON.stringify(value) : String(value)
        const splitAnswer = pdf.splitTextToSize(answerText, contentWidth - 10)
        pdf.text(splitAnswer, margin + 5, yPos)
        yPos += splitAnswer.length * 5 + 5
      })
    }

    if (doc.signature) {
      yPos += 10
      pdf.setDrawColor(...primaryColor)
      pdf.setLineWidth(0.3)
      pdf.line(margin, yPos, pageWidth - margin, yPos)
      yPos += 5
      pdf.setTextColor(...textColor)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Signature', margin, yPos)
      yPos += 8
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...grayColor)
      pdf.text(doc.signature, margin, yPos)
    }

    return pdf
  }

  const generateSepaMandatePDF = async (doc) => {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const margin = 15
    let yPos = margin

    const primaryColor = [249, 115, 22]

    pdf.setFillColor(...primaryColor)
    pdf.rect(0, 0, pageWidth, 30, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('SEPA Direct Debit Mandate', margin, 14)

    return pdf
  }

  const handleDownload = async (doc) => {
    if (doc.type === "medicalHistory") {
      toast.loading(`Generating PDF...`, { id: 'download' })
      try {
        const pdf = await generateMedicalHistoryPDF(doc)
        const fileName = `${doc.name.replace(/\s+/g, '_')}.pdf`
        pdf.save(fileName)
        toast.dismiss('download')
        toast.success(t("documents.toast.downloaded", { name: fileName }))
      } catch (err) {
        console.error('PDF generation error:', err)
        toast.dismiss('download')
        toast.error(t("documents.toast.pdfFailed"))
      }
      return
    }

    if (doc.type === "sepaMandate") {
      toast.loading(`Generating PDF...`, { id: 'download' })
      try {
        const pdf = await generateSepaMandatePDF(doc)
        const fileName = `${doc.name.replace(/\s+/g, '_')}.pdf`
        pdf.save(fileName)
        toast.dismiss('download')
        toast.success(t("documents.toast.downloaded", { name: fileName }))
      } catch (err) {
        console.error('PDF generation error:', err)
        toast.dismiss('download')
        toast.error(t("documents.toast.pdfFailed"))
      }
      return
    }

    if (doc.url) {
      window.open(doc.url, '_blank')
    } else if (doc.file) {
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
    if (doc.type === "medicalHistory") {
      toast.loading(`Preparing for printing...`, { id: 'print' })
      try {
        const pdf = await generateMedicalHistoryPDF(doc)
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
        toast.success("Print dialog opened")
      } catch (err) {
        console.error("Print error:", err)
        toast.dismiss('print')
        toast.error("Failed to prepare document for printing")
      }
      return
    }

    if (doc.type === "sepaMandate") {
      toast.loading(`Preparing for printing...`, { id: 'print' })
      try {
        const pdf = await generateSepaMandatePDF(doc)
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
        toast.success("Print dialog opened")
      } catch (err) {
        console.error("Print error:", err)
        toast.dismiss('print')
        toast.error("Failed to prepare document for printing")
      }
      return
    }

    if (doc.url) {
      const printWindow = window.open(doc.url, '_blank')
      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print()
          }, 500)
        }
      }
    } else if (doc.file) {
      const url = URL.createObjectURL(doc.file)
      const printWindow = window.open(url, '_blank')
      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print()
          }, 500)
        }
      }
    }
  }



  const handleViewDocument = (doc) => {
    console.log('Viewing document:', doc);

    if (doc.type === "medicalHistory") {
      if (onViewAssessment) {
        onViewAssessment(doc);
      } else {
        setViewingDocument(doc);
      }
    } else if (doc.url) {
      // Open the Cloudinary URL directly - now it will work!
      window.open(doc.url, '_blank');
    } else {
      toast.error('No document URL available');
    }
  };
  // ============================================
  // UI Helpers
  // ============================================
  const getDocumentIcon = (type, section) => {
    if (type === "medicalHistory") {
      return <ClipboardList className="w-5 h-5 text-white" />
    }
    if (type === "sepaMandate") {
      return <CreditCard className="w-5 h-5 text-white" />
    }
    if (!type) return <File className="w-5 h-5 text-content-muted" />

    const fileType = type.toLowerCase()
    switch (fileType) {
      case "pdf":
        return <FileText className="w-5 h-5 text-accent-red" />
      case "xlsx":
      case "xls":
        return <FileText className="w-5 h-5 text-accent-green" />
      case "docx":
      case "doc":
        return <FileText className="w-5 h-5 text-blue-500" />
      case "jpg":
      case "jpeg":
      case "png":
        return <File className="w-5 h-5 text-purple-500" />
      default:
        return <File className="w-5 h-5 text-content-muted" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-2 sm:p-4">
      <DeleteConfirmationModal
        isOpen={!!documentToDelete}
        onClose={() => setDocumentToDelete(null)}
        onConfirm={confirmDelete}
        documentName={documentToDelete?.name}
      />

      <DocumentViewerModal
        isOpen={!!viewingDocument}
        onClose={() => setViewingDocument(null)}
        document={viewingDocument}
        onDownload={handleDownload}
        onPrint={handlePrint}
      />

      <TagManagerModal
        isOpen={isTagManagerOpen}
        onClose={() => setIsTagManagerOpen(false)}
        tags={tags}
        onSave={() => {
          dispatch(getTagsThunk())
        }}
      />

      {/* Form Selection Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-2 sm:p-4">
          <div className="bg-surface-card rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h3 className="text-content-primary text-xl font-bold">Medical History Form</h3>
              <button onClick={() => setShowFormModal(false)} className="text-content-muted hover:text-content-primary">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {!selectedForm ? (
                <div className="space-y-3">
                  <h4 className="text-content-primary font-medium mb-3">Select a Form Template</h4>
                  {availableForms.map(form => (
                    <button
                      key={form._id}
                      onClick={() => setSelectedForm(form)}
                      className="w-full text-left p-4 bg-surface-dark rounded-xl hover:bg-surface-button transition-colors"
                    >
                      <h5 className="text-content-primary font-medium">{form.title}</h5>
                      <p className="text-content-muted text-sm mt-1">
                        {form.sections?.length || 0} sections
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => setSelectedForm(null)}
                    className="text-primary text-sm flex items-center gap-1 mb-4"
                  >
                    ← Back to forms
                  </button>

                  <h4 className="text-content-primary font-medium">{selectedForm.title}</h4>

                  {selectedForm.sections?.map((section, idx) => (
                    <div key={section.id} className="bg-surface-dark p-4 rounded-xl">
                      <h5 className="text-content-primary font-medium mb-3">{section.name}</h5>
                      {section.items?.map((item, itemIdx) => (
                        <div key={item.id} className="mb-3">
                          <label className="block text-content-secondary text-sm mb-2">
                            {item.text}
                            {item.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          {item.type === 'yesno' && (
                            <div className="flex gap-4">
                              <label className="flex items-center gap-2">
                                <input type="radio" name={`question-${item.id}`} value="yes" onChange={(e) => setFormAnswers(prev => ({ ...prev, [item.id]: e.target.value }))} />
                                <span>Yes</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input type="radio" name={`question-${item.id}`} value="no" onChange={(e) => setFormAnswers(prev => ({ ...prev, [item.id]: e.target.value }))} />
                                <span>No</span>
                              </label>
                            </div>
                          )}
                          {item.type === 'text' && (
                            <textarea
                              className="w-full p-2 bg-surface-card border border-border rounded-lg text-content-primary"
                              rows="3"
                              onChange={(e) => setFormAnswers(prev => ({ ...prev, [item.id]: e.target.value }))}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}

                  <div className="bg-surface-dark p-4 rounded-xl">
                    <label className="block text-content-secondary text-sm mb-2">Signature</label>
                    <input
                      type="text"
                      className="w-full p-2 bg-surface-card border border-border rounded-lg text-content-primary"
                      placeholder="Type your full name as signature"
                      onChange={(e) => setSignature(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={handleFormSubmit}
                    className="w-full py-2 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors"
                  >
                    Submit Form
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Modal */}
      <div className="bg-surface-card rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-3 sm:p-4 border-b border-border">
          <h3 className="text-content-primary text-xl font-bold">Document Management</h3>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary p-1">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:items-start gap-3">
            <p className="text-content-secondary">
              {t("documents.manageFor")} <span className="font-medium text-content-primary">{entityName}</span>
              <span className="text-content-faint text-sm block sm:inline sm:ml-2">
                {entityType === "lead" ? `Lead #${entityId}` : entityType === "staff" ? `Staff #${entityId}` : `Member #${entityId}`}
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-2 w-full justify-between">
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleUploadClick}
                  disabled={isUploading}
                  className="text-sm gap-2 px-4 py-2 bg-primary text-white rounded-xl transition-colors w-full sm:w-auto flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? t("documents.uploading") : t("documents.upload")}
                </button>
                <button
                  onClick={refreshDocuments}
                  className="text-sm gap-2 px-4 py-2 bg-surface-button text-content-primary rounded-xl hover:bg-surface-button-hover transition-colors w-full sm:w-auto flex items-center justify-center"
                  title="Refresh Documents"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </button>
                {activeSection === "medicalHistory" && onCreateAssessment && (
                  <button
                    onClick={handleCreateAssessmentClick}
                    className="text-sm gap-2 px-4 py-2 bg-surface-button text-content-primary rounded-xl hover:bg-surface-button-hover transition-colors w-full sm:w-auto flex items-center justify-center"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    {t("documents.fillMedical")}
                  </button>
                )}
              </div>
              <button
                onClick={() => setIsTagManagerOpen(true)}
                className="text-sm gap-2 px-4 py-2 bg-surface-dark text-content-primary rounded-xl hover:bg-surface-button transition-colors w-full sm:w-auto flex items-center justify-center border border-border"
              >
                <Tag className="w-4 h-4 mr-2" />
                Manage Tags ({tags.length})
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

        <div className="flex border-b border-border">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeSection === section.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-content-muted hover:text-content-primary"
                  }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {section.label}
              </button>
            )
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {(isUploading || staffLoading || medicalLoading) && (
            <div className="bg-surface-dark p-4 rounded-xl mb-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-surface-button rounded-md flex items-center justify-center">
                  <FilePlus className="w-5 h-5 text-content-faint" />
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-surface-button rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-surface-button rounded w-1/4"></div>
                </div>
              </div>
            </div>
          )}

          {filteredDocuments.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-surface-dark p-6 rounded-xl">
                <File className="w-12 h-12 text-content-faint mx-auto mb-4" />
                <p className="text-content-muted mb-4">
                  {activeSection === "general"
                    ? `No documents uploaded yet for ${entityName}`
                    : "No medical history records yet"
                  }
                </p>
                <p className="text-content-faint text-sm">
                  {activeSection === "general"
                    ? t("documents.empty.hintGeneral")
                    : t("documents.empty.hintMedical")
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="bg-surface-dark p-4 rounded-xl hover:bg-surface-dark transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-surface-dark rounded-md flex items-center justify-center flex-shrink-0">
                        {getDocumentIcon(doc.type, doc.section)}
                      </div>
                      <div className="flex-1 min-w-0">
                        {editingDocId === doc.id ? (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className="flex-1 flex items-center bg-surface-dark text-content-primary px-2 py-1 rounded border border-border w-full">
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
                              {doc.type !== "medicalHistory" && doc.type !== "sepaMandate" && (
                                <span className="text-content-faint text-sm">.{doc.name.split('.').pop()}</span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => saveDocName(doc.id)} className="p-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors">
                                <Check className="w-4 h-4" />
                              </button>
                              <button onClick={() => setEditingDocId(null)} className="p-2 bg-surface-button text-content-primary rounded-md hover:bg-surface-button-hover transition-colors">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h4 className="text-content-primary font-medium text-sm truncate">{doc.name}</h4>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <p className="text-content-muted text-xs">{doc.size}</p>
                              <span className="text-content-faint">-</span>
                              <p className="text-content-muted text-xs">{doc.uploadDate}</p>
                              {doc.type === "medicalHistory" && doc.answers && (
                                <span className="text-content-muted text-xs">• {Object.keys(doc.answers).length} answers</span>
                              )}
                            </div>

                            {/* Tags display */}
                            {doc.tags && doc.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {doc.tags.map((tagId) => {
                                  const tag = getTagById(tagId)
                                  return tag ? (
                                    <span
                                      key={tagId}
                                      className="px-2 py-0.5 rounded-md text-xs flex items-center gap-1 text-white"
                                      style={{ backgroundColor: tag.color || '#6B7280' }}
                                    >
                                      <Tag size={10} />
                                      {tag.name}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          toggleDocumentTag(doc.id, tagId)
                                        }}
                                        className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
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

                    {editingDocId !== doc.id && (
                      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                        <div className="relative">
                          <select
                            onChange={async (e) => {
                              if (e.target.value) {
                                await toggleDocumentTag(doc.id, e.target.value)
                                e.target.value = ""
                              }
                            }}
                            className="p-2 bg-surface-dark text-content-secondary rounded-md text-xs border border-border hover:bg-surface-button hover:border-primary transition-colors cursor-pointer"
                          >
                            <option value="">+ Tag</option>
                            {tags
                              .filter(tag => !doc.tags?.some(id => String(id) === String(tag._id || tag.id)))
                              .map((tag) => (
                                <option key={tag._id || tag.id} value={tag._id || tag.id}>
                                  {tag.name}
                                </option>
                              ))}
                          </select>
                        </div>

                        <button onClick={() => handleViewDocument(doc)} className="p-2 bg-surface-dark text-content-secondary rounded-md hover:bg-surface-button transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDownload(doc)} className="p-2 bg-surface-dark text-content-secondary rounded-md hover:bg-surface-button transition-colors" title="Download">
                          <Download className="w-4 h-4" />
                        </button>
                        <button onClick={() => handlePrint(doc)} className="p-2 bg-surface-dark text-content-secondary rounded-md hover:bg-surface-button transition-colors" title="Print">
                          <Printer className="w-4 h-4" />
                        </button>
                        <button onClick={() => startEditing(doc)} className="p-2 bg-surface-dark text-content-secondary rounded-md hover:bg-surface-button transition-colors" title="Rename">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(doc.id)} className="p-2 bg-surface-dark text-accent-red rounded-md hover:bg-surface-button transition-colors" title="Delete">
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

        <div className="p-4 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="text-xs text-content-faint">
              <p>{t("documents.supported")}</p>
              <p>{t("documents.maxSize")}</p>
            </div>
            <button onClick={onClose} className="px-6 py-2 bg-primary text-sm text-white rounded-xl hover:bg-primary-hover transition-colors w-full sm:w-auto">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}