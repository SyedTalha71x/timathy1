/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
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
// Supported: PDF, JPG, PNG, GIF, DOCX, DOC, XLSX, XLS, TXT
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
      setError(t("documents.toast.noFileData"))
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
        if (result.messages && result.messages.length > 0) {
          console.log("Mammoth conversion messages:", result.messages)
        }
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
        setError(t("documents.viewer.unsupported", { type }))
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
            {t("documents.viewer.downloadInstead", "Download Instead")}
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
        {/* Header */}
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

        {/* Viewer Content */}
        <div className="flex-1 overflow-auto bg-surface-dark">{renderContent()}</div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border flex gap-3 flex-shrink-0">
          <button
            onClick={() => onDownload && onDownload(document)}
            className="flex-1 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            {t("documents.viewer.download", "Download")}
          </button>
          <button
            onClick={() => onPrint && onPrint(document)}
            className="flex-1 py-2.5 bg-surface-button text-content-primary rounded-xl hover:bg-surface-button-hover transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            {t("documents.viewer.print", "Print")}
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
  const { t } = useTranslation()
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
  const [viewingDocument, setViewingDocument] = useState([])
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

  // Refresh both documents and medical histories
  const refreshAllData = async () => {
    if (!entityId) {
      console.error('No entity ID found');
      return;
    }

    toast.loading(t("documents.toast.refreshing", "Refreshing data..."), { id: 'refresh' });

    try {
      // Refresh documents
      const docsResult = await dispatch(getDocumentsByEntityThunk({
        entityType,
        entityId: entityId
      })).unwrap();

      if (docsResult && Array.isArray(docsResult)) {
        const formattedDocs = docsResult.map(doc => ({
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

      // Refresh medical histories
      const historyResult = await dispatch(getResponsesByEntityThunk({
        entityType,
        entityId: entityId
      })).unwrap();

      let historiesData = null;
      if (historyResult?.data && Array.isArray(historyResult.data)) {
        historiesData = historyResult.data;
      } else if (historyResult?.responses && Array.isArray(historyResult.responses)) {
        historiesData = historyResult.responses;
      } else if (Array.isArray(historyResult)) {
        historiesData = historyResult;
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

      toast.success(t("documents.toast.refreshSuccess", "Data refreshed successfully"), { id: 'refresh' });
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error(t("documents.toast.refreshFailed", "Failed to refresh data"), { id: 'refresh' });
    }
  };

  // Load documents and medical histories when modal opens
  useEffect(() => {
    if (isOpen && entity && entityId) {
      refreshAllData();

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
            // Map _id to id for each item in each section to make radio buttons work
            const mappedForms = formsData.map(form => ({
              ...form,
              sections: form.sections?.map(section => ({
                ...section,
                items: section.items?.map(item => ({
                  ...item,
                  id: item._id // Add id field mapped from _id
                }))
              }))
            }));
            setAvailableForms(mappedForms);
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
        // Refresh all data immediately after upload
        await refreshAllData();
        toast.success(t("documents.toast.uploaded", { count: files.length }))
      } else {
        toast.error(t("documents.toast.uploadFailed", "Upload failed: Invalid response from server"))
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.message || t("documents.toast.uploadError", "Failed to upload documents"))
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
      toast.error(t("documents.toast.selectForm", "Please select a form template"))
      return
    }

    if (!signature) {
      toast.error(t("documents.toast.signatureRequired", "Please provide a signature"))
      return
    }

    try {
      const result = await dispatch(createResponseThunk({
        entityType,
        entityId: entityId,
        responseData: {
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
        // Refresh all data after submission
        await refreshAllData();
        
        toast.success(t("documents.toast.medicalSubmitted", "Medical history submitted successfully"))
        setShowFormModal(false)
        setSelectedForm(null)
        setFormAnswers({})
        setSignature(null)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error(t("documents.toast.medicalFailed", "Failed to submit medical history"))
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
        } else {
          await dispatch(deleteDocumentThunk({
            entityType: entityType,
            entityId: entityId,
            documentId: documentToDelete.id
          })).unwrap();
        }
        
        // Refresh all data after deletion
        await refreshAllData();
        
        toast.success(t("documents.toast.deleted"));
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(t("documents.toast.deleteFailed", "Failed to delete document"));
      }
      setDocumentToDelete(null);
    }
  };

  const startEditing = (doc) => {
    // sepaMandate and medicalHistory don't have file extensions
    if (doc.type === "medicalHistory" || doc.type === "sepaMandate") {
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
      toast.error(t("documents.toast.emptyName", "Document name cannot be empty"));
      return;
    }

    const originalDoc = filteredDocuments.find((doc) => doc.id === docId);

    try {
      if (originalDoc.type === "medicalHistory") {
        await dispatch(updateResponseThunk({
          responseId: docId,
          updateData: { title: newDocName.trim() }
        })).unwrap();
        setMedicalHistories(prev => prev.map((doc) =>
          doc.id === docId ? { ...doc, name: newDocName.trim() } : doc
        ));
      } else {
        // For regular documents, only send the displayName
        const updateData = {
          displayName: newDocName.trim()
        };

        await dispatch(updateDocumentMetadataThunk({
          documentId: docId,
          updateData: updateData
        })).unwrap();

        setDocuments(prev => prev.map((doc) =>
          doc.id === docId ? { ...doc, name: `${newDocName.trim()}.${doc.name.split('.').pop()}` } : doc
        ));
      }
      toast.success(t("documents.toast.renamed"));
    } catch (error) {
      console.error('Rename error:', error);
      toast.error(error.message || t("documents.toast.renameFailed", "Failed to rename document"));
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
      toast.success(tagExists ? t("documents.toast.tagRemoved", "Tag removed") : t("documents.toast.tagAdded", "Tag added"))
    } catch (error) {
      console.error('Tag update error:', error)
      toast.error(t("documents.toast.tagFailed", "Failed to update tags"))
    }
  }

  // ============================================
  // PDF Generation for Medical History (enhanced from V2)
  // ============================================
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
    const nameParts = (doc.name || 'Medical History Form').split(' - ')
    const formTitle = nameParts[0] || 'Medical History Form'
    const memberName = nameParts[1] || entityName || ''

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
    const headerInfo = `${doc.uploadDate || 'N/A'} • ${doc.signed ? 'Signed' : 'Unsigned'}`
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

    // Render answers
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

    // Signature section - compact with image support
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

      // Try to add signature as image (base64), fallback to text
      try {
        const signatureData = doc.signature

        if (signatureData.startsWith && signatureData.startsWith('data:image')) {
          // Detect image format from data URL
          let format = 'PNG'
          if (signatureData.includes('data:image/jpeg') || signatureData.includes('data:image/jpg')) {
            format = 'JPEG'
          } else if (signatureData.includes('data:image/png')) {
            format = 'PNG'
          }

          // Draw white background rectangle for signature
          pdf.setFillColor(255, 255, 255)
          pdf.setDrawColor(200, 200, 200)
          pdf.setLineWidth(0.2)
          pdf.roundedRect(margin, yPos, 55, 28, 2, 2, 'FD')

          // Add signature image to PDF
          pdf.addImage(signatureData, format, margin + 2, yPos + 1, 50, 25)
          yPos += 32

          pdf.setTextColor(...grayColor)
          pdf.setFontSize(7)
          pdf.setFont('helvetica', 'italic')
          pdf.text(`Signed: ${doc.uploadDate || 'N/A'}`, margin, yPos)
        } else {
          // Text signature fallback
          pdf.setFont('helvetica', 'normal')
          pdf.setTextColor(...grayColor)
          pdf.text(String(signatureData), margin, yPos)
        }
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

  // ============================================
  // PDF Generation for SEPA Mandate (enhanced from V2)
  // ============================================
  const generateSepaMandatePDF = async (doc) => {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 15
    const contentWidth = pageWidth - (margin * 2)
    let yPos = margin

    // Colors
    const primaryColor = [249, 115, 22]
    const textColor = [51, 51, 51]
    const grayColor = [100, 100, 100]

    const paymentDetails = doc.paymentDetails || {}
    const memberName = doc.memberName || entityName || ''
    const mandateNumber = paymentDetails.sepaMandateNumber || 'N/A'

    // Header bar
    pdf.setFillColor(...primaryColor)
    pdf.rect(0, 0, pageWidth, 30, 'F')

    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('SEPA Direct Debit Mandate', margin, 14)

    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`For: ${memberName}`, margin, 22)

    // Date and status (right side)
    pdf.setFontSize(9)
    const headerInfo = `${doc.uploadDate || 'N/A'} • ${doc.signed ? 'Signed' : 'Unsigned'}`
    pdf.text(headerInfo, pageWidth - margin, 14, { align: 'right' })

    yPos = 40

    // Mandate reference
    pdf.setFillColor(240, 240, 240)
    pdf.roundedRect(margin, yPos, contentWidth, 10, 1, 1, 'F')
    pdf.setTextColor(...textColor)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Mandate Reference', margin + 3, yPos + 4)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...grayColor)
    pdf.text(mandateNumber, margin + 3, yPos + 8)
    yPos += 16

    // Payment details section
    pdf.setFillColor(240, 240, 240)
    pdf.roundedRect(margin, yPos, contentWidth, 7, 1, 1, 'F')
    pdf.setTextColor(...textColor)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Payment Details', margin + 3, yPos + 5)
    yPos += 12

    const details = [
      { label: 'Account Holder', value: `${paymentDetails.accountHolderFirstName || ''} ${paymentDetails.accountHolderLastName || ''}`.trim() },
      { label: 'IBAN', value: paymentDetails.iban || 'N/A' },
      { label: 'BIC', value: paymentDetails.bic || 'N/A' },
      { label: 'Bank Name', value: paymentDetails.bankName || 'N/A' },
    ]

    details.forEach(({ label, value }) => {
      pdf.setDrawColor(...primaryColor)
      pdf.setLineWidth(0.5)
      pdf.line(margin, yPos, margin, yPos + 8)

      pdf.setTextColor(...textColor)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'bold')
      pdf.text(label, margin + 3, yPos + 3)

      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...grayColor)
      pdf.text(value || 'N/A', margin + 3, yPos + 7)

      yPos += 12
    })

    yPos += 4

    // Authorization text
    pdf.setFillColor(240, 240, 240)
    pdf.roundedRect(margin, yPos, contentWidth, 7, 1, 1, 'F')
    pdf.setTextColor(...textColor)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Authorization', margin + 3, yPos + 5)
    yPos += 12

    pdf.setTextColor(...grayColor)
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    const authText = `By signing this mandate form, I authorize the creditor to send instructions to my bank to debit my account in accordance with the instructions from the creditor. As part of my rights, I am entitled to a refund from my bank under the terms and conditions of my agreement with my bank. A refund must be claimed within 8 weeks starting from the date on which my account was debited.`
    const splitAuth = pdf.splitTextToSize(authText, contentWidth - 6)
    pdf.text(splitAuth, margin + 3, yPos)
    yPos += splitAuth.length * 4 + 8

    // Signature
    if (doc.signature) {
      pdf.setDrawColor(...primaryColor)
      pdf.setLineWidth(0.3)
      pdf.line(margin, yPos, pageWidth - margin, yPos)
      yPos += 5

      pdf.setTextColor(...textColor)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Signature', margin, yPos)
      yPos += 5

      try {
        const signatureData = doc.signature

        if (signatureData.startsWith && signatureData.startsWith('data:image')) {
          let format = 'PNG'
          if (signatureData.includes('data:image/jpeg') || signatureData.includes('data:image/jpg')) {
            format = 'JPEG'
          }

          pdf.setFillColor(255, 255, 255)
          pdf.setDrawColor(200, 200, 200)
          pdf.setLineWidth(0.2)
          pdf.roundedRect(margin, yPos, 55, 28, 2, 2, 'FD')

          pdf.addImage(signatureData, format, margin + 2, yPos + 1, 50, 25)
          yPos += 32

          pdf.setTextColor(...grayColor)
          pdf.setFontSize(7)
          pdf.setFont('helvetica', 'italic')
          pdf.text(`Signed: ${doc.uploadDate || 'N/A'}`, margin, yPos)
        } else {
          pdf.setFont('helvetica', 'normal')
          pdf.setTextColor(...grayColor)
          pdf.text(String(signatureData), margin, yPos)
        }
      } catch (err) {
        console.error('Error adding signature:', err)
        pdf.setTextColor(...grayColor)
        pdf.setFontSize(8)
        pdf.text('[Signature attached]', margin, yPos)
      }
    }

    // Footer
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

  // ============================================
  // Download Handler
  // ============================================
  const handleDownload = async (doc) => {
    if (doc.type === "medicalHistory") {
      toast.loading(t("documents.toast.generatingPdf", "Generating PDF..."), { id: 'download' })
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
      toast.loading(t("documents.toast.generatingPdf", "Generating PDF..."), { id: 'download' })
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

  // ============================================
  // Print Handler (enhanced from V2 with full format support)
  // ============================================
  const handlePrint = async (doc) => {
    // Medical history forms - generate PDF and print
    if (doc.type === "medicalHistory") {
      toast.loading(t("documents.toast.generatingPrint", "Preparing for printing..."), { id: 'print' })
      try {
        const pdf = await generateMedicalHistoryPDF(doc)
        const pdfBlob = pdf.output('blob')
        const pdfUrl = URL.createObjectURL(pdfBlob)
        const printWindow = window.open(pdfUrl, '_blank')
        if (printWindow) {
          printWindow.onload = () => {
            setTimeout(() => { printWindow.print() }, 500)
          }
        }
        toast.dismiss('print')
        toast.success(t("documents.toast.printPdfOpened", "Print dialog opened"))
      } catch (err) {
        console.error("Print error:", err)
        toast.dismiss('print')
        toast.error(t("documents.toast.printFailed", "Failed to prepare document for printing"))
      }
      return
    }

    // SEPA mandate - generate PDF and print
    if (doc.type === "sepaMandate") {
      toast.loading(t("documents.toast.generatingPrint", "Preparing for printing..."), { id: 'print' })
      try {
        const pdf = await generateSepaMandatePDF(doc)
        const pdfBlob = pdf.output('blob')
        const pdfUrl = URL.createObjectURL(pdfBlob)
        const printWindow = window.open(pdfUrl, '_blank')
        if (printWindow) {
          printWindow.onload = () => {
            setTimeout(() => { printWindow.print() }, 500)
          }
        }
        toast.dismiss('print')
        toast.success(t("documents.toast.printPdfOpened", "Print dialog opened"))
      } catch (err) {
        console.error("Print error:", err)
        toast.dismiss('print')
        toast.error(t("documents.toast.printFailed", "Failed to prepare document for printing"))
      }
      return
    }

    // For documents with a URL (from server/Cloudinary)
    if (doc.url) {
      const fileTypeLower = (doc.type || doc.url.split('.').pop()).toLowerCase()

      // PDF and images can be opened directly
      if (fileTypeLower === 'pdf' || ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileTypeLower)) {
        const printWindow = window.open(doc.url, '_blank')
        if (printWindow) {
          printWindow.onload = () => {
            setTimeout(() => { printWindow.print() }, 500)
          }
        }
        return
      }

      // For other formats with URL, fetch and process
      toast.loading(t("documents.toast.preparingPrint", { name: doc.name }), { id: 'print' })
      try {
        const response = await fetch(doc.url)
        const blob = await response.blob()
        await printFileBlob(blob, fileTypeLower, doc.name)
        toast.dismiss('print')
        toast.success(t("documents.toast.printOpened", "Print dialog opened"))
      } catch (err) {
        console.error("Print error:", err)
        toast.dismiss('print')
        toast.error(t("documents.toast.printError", "Failed to print document"))
      }
      return
    }

    // For local files (doc.file)
    if (doc.file) {
      toast.loading(t("documents.toast.preparingPrint", { name: doc.name }), { id: 'print' })
      try {
        await printFileBlob(doc.file, doc.type?.toLowerCase(), doc.name)
        toast.dismiss('print')
        toast.success(t("documents.toast.printOpened", "Print dialog opened"))
      } catch (err) {
        console.error("Print error:", err)
        toast.dismiss('print')
        toast.error(t("documents.toast.printError", "Failed to print document"))
      }
      return
    }

    toast.error(t("documents.toast.noFileForPrint", "No file available to print"))
  }

  // Helper: print a file blob based on type
  const printFileBlob = async (file, fileType, fileName) => {
    // PDF and images - open in new window and print
    if (fileType === 'pdf' || ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileType)) {
      const url = URL.createObjectURL(file)
      const printWindow = window.open(url, '_blank')
      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print()
            URL.revokeObjectURL(url)
          }, 500)
        }
      }
      return
    }

    // DOCX - convert to HTML and print (with images)
    if (fileType === 'doc' || fileType === 'docx') {
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
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${fileName}</title>
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
        setTimeout(() => { printWindow.print() }, 500)
      }
      return
    }

    // Excel - convert to HTML table and print
    if (fileType === 'xls' || fileType === 'xlsx') {
      const arrayBuffer = await file.arrayBuffer()
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
            <title>${fileName}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
              table { border-collapse: collapse; width: 100%; margin: 1em 0; }
              td, th { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
              th { background: #f5f5f5; font-weight: bold; }
              h2 { margin-top: 2em; }
              @media print { h2 { page-break-before: auto; } }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
          </html>
        `)
        printWindow.document.close()
        setTimeout(() => { printWindow.print() }, 500)
      }
      return
    }

    // Text files
    if (fileType === 'txt' || fileType === 'csv') {
      const text = await file.text()
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${fileName}</title>
            <style>
              body { font-family: monospace; padding: 20px; white-space: pre-wrap; color: #000; }
            </style>
          </head>
          <body>${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</body>
          </html>
        `)
        printWindow.document.close()
        setTimeout(() => { printWindow.print() }, 500)
      }
      return
    }

    toast.error(t("documents.toast.printUnsupported", { type: fileType }))
  }

  // ============================================
  // View Document Handler (enhanced with SEPA PDF on-the-fly)
  // ============================================
  const handleViewDocument = async (doc) => {
    if (doc.type === "medicalHistory") {
      if (onViewAssessment) {
        onViewAssessment(doc);
      } else {
        setViewingDocument(doc);
      }
    } else if (doc.type === "sepaMandate") {
      // Generate PDF on-the-fly and open in viewer
      try {
        const pdf = await generateSepaMandatePDF(doc)
        const pdfBlob = pdf.output('blob')
        const pdfFile = new window.File([pdfBlob], `${doc.name}.pdf`, { type: 'application/pdf' })
        setViewingDocument({ ...doc, file: pdfFile, type: 'pdf' })
      } catch (err) {
        console.error('Error generating SEPA PDF for preview:', err)
        toast.error(t("documents.toast.previewFailed", "Failed to generate preview"))
      }
    } else if (doc.url) {
      // Open the Cloudinary URL directly
      window.open(doc.url, '_blank');
    } else {
      toast.error(t("documents.toast.noUrl", "No document URL available"));
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
      case "txt":
        return <FileText className="w-5 h-5 text-content-faint" />
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
              <h3 className="text-content-primary text-xl font-bold">{t("documents.medicalForm.title", "Medical History Form")}</h3>
              <button onClick={() => setShowFormModal(false)} className="text-content-muted hover:text-content-primary">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {!selectedForm ? (
                <div className="space-y-3">
                  <h4 className="text-content-primary font-medium mb-3">{t("documents.medicalForm.selectTemplate", "Select a Form Template")}</h4>
                  {availableForms.map(form => (
                    <button
                      key={form._id}
                      onClick={() => setSelectedForm(form)}
                      className="w-full text-left p-4 bg-surface-dark rounded-xl hover:bg-surface-button transition-colors"
                    >
                      <h5 className="text-content-primary font-medium">{form.title}</h5>
                      <p className="text-content-muted text-sm mt-1">
                        {form.sections?.length || 0} {t("documents.medicalForm.sections", "sections")}
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
                    ← {t("documents.medicalForm.backToForms", "Back to forms")}
                  </button>

                  <h4 className="text-content-primary font-medium">{selectedForm.title}</h4>

                  {selectedForm.sections?.map((section, idx) => (
                    <div key={section.id} className="bg-surface-dark p-4 rounded-xl">
                      <h5 className="text-content-primary font-medium mb-3">{section.name}</h5>
                      {section.items?.map((item, itemIdx) => (
                        <div key={item.id || item._id} className="mb-3">
                          <label className="block text-content-secondary text-sm mb-2">
                            {item.text}
                            {item.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          {item.type === 'yesno' && (
                            <div className="flex gap-4">
                              <label className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`question-${item.id || item._id}`}
                                  value="yes"
                                  checked={formAnswers[item.id || item._id] === "yes"}
                                  onChange={(e) => setFormAnswers(prev => ({ 
                                    ...prev, 
                                    [item.id || item._id]: e.target.value 
                                  }))}
                                />
                                <span>{t("common.yes", "Yes")}</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`question-${item.id || item._id}`}
                                  value="no"
                                  checked={formAnswers[item.id || item._id] === "no"}
                                  onChange={(e) => setFormAnswers(prev => ({ 
                                    ...prev, 
                                    [item.id || item._id]: e.target.value 
                                  }))}
                                />
                                <span>{t("common.no", "No")}</span>
                              </label>
                              {item.allowDontKnow && (
                                <label className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`question-${item.id || item._id}`}
                                    value="dontknow"
                                    checked={formAnswers[item.id || item._id] === "dontknow"}
                                    onChange={(e) => setFormAnswers(prev => ({ 
                                      ...prev, 
                                      [item.id || item._id]: e.target.value 
                                    }))}
                                  />
                                  <span>{t("common.dontKnow", "Don't know")}</span>
                                </label>
                              )}
                            </div>
                          )}
                          {item.type === 'text' && (
                            <textarea
                              className="w-full p-2 bg-surface-card border border-border rounded-lg text-content-primary"
                              rows="3"
                              value={formAnswers[item.id || item._id] || ''}
                              onChange={(e) => setFormAnswers(prev => ({ 
                                ...prev, 
                                [item.id || item._id]: e.target.value 
                              }))}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}

                  <div className="bg-surface-dark p-4 rounded-xl">
                    <label className="block text-content-secondary text-sm mb-2">{t("documents.medicalForm.signature", "Signature")}</label>
                    <input
                      type="text"
                      className="w-full p-2 bg-surface-card border border-border rounded-lg text-content-primary"
                      placeholder={t("documents.medicalForm.signaturePlaceholder", "Type your full name as signature")}
                      value={signature || ''}
                      onChange={(e) => setSignature(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={handleFormSubmit}
                    className="w-full py-2 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors"
                  >
                    {t("documents.medicalForm.submit", "Submit Form")}
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
          <h3 className="text-content-primary text-xl font-bold">{t("documents.title")}</h3>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary p-1">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:items-start gap-3">
            <p className="text-content-secondary">
              {t("documents.manageFor")} <span className="font-medium text-content-primary">{entityName}</span>
              <span className="text-content-faint text-sm block sm:inline sm:ml-2">
                {t(`documents.entityLabel.${entityType}`, { id: entityId })}
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
                  onClick={refreshAllData}
                  className="text-sm gap-2 px-4 py-2 bg-surface-button text-content-primary rounded-xl hover:bg-surface-button-hover transition-colors w-full sm:w-auto flex items-center justify-center"
                  title={t("documents.refresh", "Refresh Documents")}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t("documents.refresh", "Refresh")}
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
                {t("documents.tags", "Manage Tags")} ({tags.length})
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
                    ? t("documents.empty.general", { name: entityName })
                    : t("documents.empty.medical")
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
                                <span className="text-content-faint text-sm">.{getFileExtension(doc.name)}</span>
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
                                <span className="text-content-muted text-xs">• {Object.keys(doc.answers).length} {t("documents.answers", "answers")}</span>
                              )}
                              {doc.type === "sepaMandate" && (
                                <span className={`text-xs ${doc.signed ? 'text-accent-green' : 'text-amber-500'}`}>
                                  • {doc.signed ? t("documents.signed", "Signed") : t("documents.pendingSignature", "Pending signature")}
                                </span>
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
                                        title={t("documents.removeTag", "Remove tag")}
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
                            title={t("documents.addTag", "Add tag")}
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

                        <button onClick={() => handleViewDocument(doc)} className="p-2 bg-surface-dark text-content-secondary rounded-md hover:bg-surface-button transition-colors" title={t("documents.view", "View")}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDownload(doc)} className="p-2 bg-surface-dark text-content-secondary rounded-md hover:bg-surface-button transition-colors" title={t("documents.download", "Download")}>
                          <Download className="w-4 h-4" />
                        </button>
                        <button onClick={() => handlePrint(doc)} className="p-2 bg-surface-dark text-content-secondary rounded-md hover:bg-surface-button transition-colors" title={t("documents.print", "Print")}>
                          <Printer className="w-4 h-4" />
                        </button>
                        <button onClick={() => startEditing(doc)} className="p-2 bg-surface-dark text-content-secondary rounded-md hover:bg-surface-button transition-colors" title={t("documents.rename", "Rename")}>
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(doc.id)} className="p-2 bg-surface-dark text-accent-red rounded-md hover:bg-surface-button transition-colors" title={t("documents.delete.action", "Delete")}>
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
              {t("common.close", "Close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}