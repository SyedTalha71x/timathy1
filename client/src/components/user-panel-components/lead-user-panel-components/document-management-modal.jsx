/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react"
import { X, Upload, Trash, Edit2, File, FileText, FilePlus, Eye, Download, Check, Tag, FileSignature, Pencil, ClipboardList, Printer } from "lucide-react"
import { toast } from "react-hot-toast"
import TagManagerModal from "../../shared/TagManagerModal"

export function LeadDocumentModal({ 
  lead, 
  isOpen, 
  onClose, 
  onCreateAssessment,
  onEditAssessment,
  onViewAssessment,
  onDocumentsUpdate
}) {
  // Dokumente direkt vom Lead
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

  // Load documents from lead when modal opens or lead.documents changes
  useEffect(() => {
    if (isOpen && lead) {
      setDocuments(lead.documents || [])
    }
  }, [isOpen, lead, lead?.documents])

  // Update parent when documents change
  useEffect(() => {
    if (isOpen && lead && onDocumentsUpdate) {
      onDocumentsUpdate(lead.id, documents)
    }
  }, [documents, isOpen, lead, onDocumentsUpdate])

  const documentCategories = [
    { id: "contract", label: "Contract", color: "text-red-500" },
    { id: "proposal", label: "Proposal", color: "text-orange-500" },
    { id: "medicalHistory", label: "Medical History", color: "text-green-500" },
    { id: "followup", label: "Follow-up", color: "text-blue-500" },
    { id: "correspondence", label: "Correspondence", color: "text-purple-500" },
  ]

  // Filter documents by active section
  const filteredDocuments = documents.filter(doc => doc.section === activeSection)

  if (!isOpen || !lead) return null

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
        category: "other",
        section: activeSection,
        tags: []
      }))

      setDocuments([...documents, ...newDocs])
      setIsUploading(false)
      toast.dismiss()
      toast.success(`${files.length} document(s) uploaded successfully`)
    }, 1500)
  }

  const handleDownload = (doc) => {
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

  const handlePrint = (doc) => {
    toast.success(`Printing ${doc.name}...`)
    if (doc.file) {
      const url = URL.createObjectURL(doc.file)
      const printWindow = window.open(url)
      printWindow.onload = () => {
        printWindow.print()
        setTimeout(() => {
          printWindow.close()
          URL.revokeObjectURL(url)
        }, 100)
      }
    }
  }

  const handleViewDocument = (doc) => {
    setViewingDocument(doc)
    toast.success(`Viewing ${doc.name}...`)
  }

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
      setDocuments(documents.filter((doc) => doc.id !== documentToDelete.id))
      toast.success("Document deleted successfully")
      setDocumentToDelete(null)
    }
  }

  const startEditing = (doc) => {
    if (doc.type === "medicalHistory" || doc.section === "medicalHistory") {
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
    if (originalDoc.type === "medicalHistory" || originalDoc.section === "medicalHistory") {
      finalName = newDocName.trim()
    } else {
      const originalExtension = originalDoc.name.split(".").pop()
      finalName = `${newDocName.trim()}.${originalExtension}`
    }

    setDocuments(documents.map((doc) => (doc.id === docId ? { ...doc, name: finalName } : doc)))
    setEditingDocId(null)
    toast.success("Document renamed successfully")
  }

  const changeDocumentCategory = (docId, category) => {
    setDocuments(documents.map((doc) => (doc.id === docId ? { ...doc, category } : doc)))
    toast.success("Document category updated")
  }

  const getDocumentIcon = (type, section) => {
    if (section === "medicalHistory" || type === "medicalHistory") {
      return <ClipboardList className="w-5 h-5 text-white" />
    }

    if (!type) {
      return <File className="w-5 h-5 text-gray-400" />
    }

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

  const getCategoryColor = (category) => {
    const categoryObj = documentCategories.find(cat => cat.id === category)
    return categoryObj ? categoryObj.color : "text-gray-500"
  }

  const getCategoryLabel = (category) => {
    const categoryObj = documentCategories.find(cat => cat.id === category)
    return categoryObj ? categoryObj.label : ""
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

  const toggleDocumentTag = (docId, tagId) => {
    const doc = documents.find(d => d.id === docId)
    if (!doc) return

    const currentTags = doc.tags || []
    // Konvertiere tagId zu gleichem Typ für Vergleich (kann String oder Number sein)
    const normalizedTagId = typeof tagId === 'string' && !isNaN(tagId) ? Number(tagId) : tagId
    
    const tagExists = currentTags.some(id => 
      id === normalizedTagId || String(id) === String(tagId)
    )
    
    const newTags = tagExists
      ? currentTags.filter(id => String(id) !== String(tagId))
      : [...currentTags, normalizedTagId]

    setDocuments(documents.map(doc => 
      doc.id === docId ? { ...doc, tags: newTags } : doc
    ))
  }

  const handleCreateAssessment = () => {
    if (onCreateAssessment) {
      onCreateAssessment(lead)
    }
  }

  const handleEditAssessment = (doc) => {
    if (onEditAssessment) {
      onEditAssessment(lead, doc)
    }
  }

  const handleViewAssessment = (doc) => {
    if (onViewAssessment) {
      onViewAssessment(lead, doc)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-60 p-2 sm:p-4">

      {/* Delete Confirmation Modal */}
      {documentToDelete && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-[80]">
          <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-md p-6 mx-4">
            <h3 className="text-white text-lg font-semibold mb-4">Delete Document</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete "{documentToDelete.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDocumentToDelete(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tag Manager Modal */}
      <TagManagerModal
        isOpen={isTagManagerOpen}
        onClose={() => setIsTagManagerOpen(false)}
        tags={configuredTags}
        onAddTag={handleAddTag}
        onDeleteTag={handleDeleteTag}
      />

      {/* Viewing Document Modal */}
      {viewingDocument && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-[80] p-4">
          <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <h3 className="text-white text-lg font-medium">{viewingDocument.name}</h3>
              <button
                onClick={() => setViewingDocument(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6 bg-[#161616]">
              <div className="text-center text-gray-400">
                <File className="w-16 h-16 mx-auto mb-4" />
                <p>Document preview not available</p>
                <p className="text-sm mt-2">Click download to view the file</p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-800 flex gap-3">
              <button
                onClick={() => handleDownload(viewingDocument)}
                className="flex-1 py-2 bg-[#3F74FF] text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={() => handlePrint(viewingDocument)}
                className="flex-1 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Document Modal */}
      <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-800">
          <h3 className="text-white text-lg sm:text-xl font-medium">
            Document Management
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-800">
          <div className="flex flex-col sm:items-start gap-3">
            <p className="text-gray-300">
              Manage documents for <span className="font-medium text-white">{lead.firstName} {lead.surname}</span>
              <span className="text-gray-500 text-sm block sm:inline sm:ml-2">
                Lead #{lead.id}
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:flex-1 justify-between">
              <div className="flex flex-col sm:flex-row gap-2">
                {activeSection === "medicalHistory" && (
                  <button
                    onClick={handleCreateAssessment}
                    className="text-sm gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors w-full sm:w-auto flex items-center justify-center"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Fill Out Medical History
                  </button>
                )}
                <button
                  onClick={handleUploadClick}
                  disabled={isUploading}
                  className="text-sm gap-2 px-4 py-2 bg-[#3F74FF] text-white rounded-xl transition-colors w-full sm:w-auto flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? "Uploading..." : "Upload Document"}
                </button>
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
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.txt"
            />
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setActiveSection("general")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeSection === "general" 
                ? "text-white border-b-2 border-[#3F74FF]" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            General Documents
          </button>
          <button
            onClick={() => setActiveSection("medicalHistory")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeSection === "medicalHistory" 
                ? "text-white border-b-2 border-[#3F74FF]" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            Medical History
          </button>
        </div>

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
                    ? `No documents uploaded yet for ${lead.firstName} ${lead.surname}`
                    : "No assessments created yet"
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="bg-[#141414] p-4 rounded-xl hover:bg-[#1a1a1a] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-[#2a2a2a] rounded-md flex items-center justify-center">
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
                                className="bg-transparent border-none outline-none flex-1 w-full"
                                autoFocus
                              />
                              {doc.type !== "medicalHistory" && doc.section !== "medicalHistory" && (
                                <span className="text-gray-500">.{getFileExtension(doc.name)}</span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => saveDocName(doc.id)}
                                className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
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
                              <span className={`text-xs px-2 py-0.5 rounded ${getCategoryColor(doc.category)}`}>
                                {getCategoryLabel(doc.category)}
                              </span>
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
                      
                      {doc.section === "medicalHistory" && (
                        <button
                          onClick={() => handleEditAssessment(doc)}
                          className="p-2 bg-[#2a2a2a] text-orange-400 rounded-md hover:bg-[#333] transition-colors"
                          title="Edit Medical History"
                        >
                          <FileSignature className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          if (doc.section === "medicalHistory") {
                            handleViewAssessment(doc)
                          } else {
                            handleViewDocument(doc)
                          }
                        }}
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
