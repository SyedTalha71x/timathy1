/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef } from "react"
import { X, Upload, Trash, Edit2, File, FileText, FilePlus, Eye, Download, Check } from "lucide-react"
import { toast } from "react-hot-toast"
import { Printer } from "lucide-react"

export function StaffDocumentModal({ staff, isOpen, onClose }) {
  const [documents, setDocuments] = useState(staff?.documents || [])
  const [isUploading, setIsUploading] = useState(false)
  const [editingDocId, setEditingDocId] = useState(null)
  const [newDocName, setNewDocName] = useState("")
  const [viewingDocument, setViewingDocument] = useState(null)
  const fileInputRef = useRef(null)

  const sampleDocuments = [
    {
      id: "doc-1",
      name: "Medical Clearance.pdf",
      type: "pdf",
      size: "0.9 MB",
      uploadDate: "2023-05-15",
      category: "medical",
    },
    {
      id: "doc-2",
      name: "Emergency Contact Form.pdf",
      type: "pdf",
      size: "0.5 MB",
      uploadDate: "2023-05-16",
      category: "emergency",
    },
    {
      id: "doc-3",
      name: "Fitness Assessment.xlsx",
      type: "xlsx",
      size: "1.1 MB",
      uploadDate: "2023-05-20",
      category: "fitness",
    },
  ]

  const displayDocuments = documents.length > 0 ? documents : sampleDocuments

  const documentCategories = [
    { id: "medical", label: "Medical", color: "text-red-500" },
    { id: "emergency", label: "Emergency", color: "text-orange-500" },
    { id: "fitness", label: "Fitness", color: "text-green-500" },
    { id: "personal", label: "Personal", color: "text-blue-500" },
    { id: "legal", label: "Legal", color: "text-purple-500" },
    { id: "other", label: "Other", color: "text-gray-500" },
  ]

  if (!isOpen || !staff) return null

  const handleUploadClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    // Validate file types and sizes
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

    const largeFiles = files.filter((file) => file.size > 10 * 1024 * 1024) // 10MB limit
    if (largeFiles.length > 0) {
      toast.error(`${largeFiles.length} file(s) exceed the 10MB size limit`)
      return
    }

    setIsUploading(true)
    toast.loading(`Uploading ${files.length} document(s)...`)

    // Simulate upload delay
    setTimeout(() => {
      const newDocs = files.map((file) => ({
        id: `doc-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: getFileExtension(file.name),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split("T")[0],
        file: file,
        category: "other", // Default category, can be changed later
      }))

      setDocuments([...displayDocuments, ...newDocs])
      setIsUploading(false)
      toast.dismiss()
      toast.success(`${files.length} document(s) uploaded successfully`)
    }, 1500)
  }

  const handleDownload = (doc) => {
    toast.success(`Downloading ${doc.name}...`)

    // If we have the actual file object
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

    // If we have the actual file object
    if (doc.file) {
      const url = URL.createObjectURL(doc.file)
      const printWindow = window.open(url)

      printWindow.onload = () => {
        printWindow.print()
        // Clean up after printing
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
    if (confirm("Are you sure you want to delete this document?")) {
      setDocuments(displayDocuments.filter((doc) => doc.id !== docId))
      toast.success("Document deleted successfully")
    }
  }

  const startEditing = (doc) => {
    // Extract just the name part without extension for editing
    const nameParts = doc.name.split(".")
    const extension = nameParts.pop() // Remove and store the extension
    const nameWithoutExtension = nameParts.join(".") // Rejoin in case there were multiple dots

    setEditingDocId(doc.id)
    setNewDocName(nameWithoutExtension) // Only set the name part without extension
  }

  const saveDocName = (docId) => {
    if (newDocName.trim() === "") {
      toast.error("Document name cannot be empty")
      return
    }

    // Get the original file extension
    const originalDoc = displayDocuments.find((doc) => doc.id === docId)
    const originalExtension = originalDoc.name.split(".").pop()

    // Combine the name part with the original extension
    const finalName = `${newDocName.trim()}.${originalExtension}`

    setDocuments(displayDocuments.map((doc) => (doc.id === docId ? { ...doc, name: finalName } : doc)))
    setEditingDocId(null)
    toast.success("Document renamed successfully")
  }

  const changeDocumentCategory = (docId, category) => {
    setDocuments(displayDocuments.map((doc) => (doc.id === docId ? { ...doc, category } : doc)))
    toast.success("Document category updated")
  }

  const getDocumentIcon = (type) => {
    // Add null/undefined check and fallback
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
    return categoryObj ? categoryObj.label : "Other"
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000000] p-2 sm:p-4">
      {viewingDocument && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-[70]">
          <div className="bg-white rounded-lg max-w-4xl max-h-[80vh] overflow-auto w-full">
            <div className="sticky top-0 bg-gray-100 p-3 flex justify-between items-center border-b">
              <h3 className="font-medium">{viewingDocument.name}</h3>
              <button onClick={() => setViewingDocument(null)} className="p-1 rounded-full hover:bg-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              {/* In a real app, you would render the document content here */}
              <div className="bg-gray-100 p-8 rounded text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Document preview would appear here.</p>
                <p className="text-gray-500 text-sm mt-2">
                  {viewingDocument.type?.toUpperCase()} document • {viewingDocument.size}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-800">
          <h3 className="text-white text-lg sm:text-xl font-medium">
            Document Management
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-gray-300">
              Manage documents for <span className="font-medium text-white">{staff.firstName} {staff.lastName}</span>
              <span className="text-gray-500 text-sm block sm:inline sm:ml-2">
                Staff #{staff.staffNumber}
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={handleUploadClick}
                disabled={isUploading}
                className="text-sm gap-2 px-4 py-2 bg-[#3F74FF] text-white rounded-xl transition-colors w-full sm:w-auto flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload Document"}
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

        {displayDocuments.length === 0 && (
          <div className="bg-[#141414] mx-4 mb-4 p-4 rounded-xl">
            <h4 className="text-white font-medium mb-2">Document Categories:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              {documentCategories.map((category) => (
                <div key={category.id} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-current ${category.color}`}></div>
                  <span className="text-gray-400">{category.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

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

          {displayDocuments.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-[#141414] p-6 rounded-xl">
                <File className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No documents uploaded yet for {staff.firstName} {staff.lastName}</p>
                <button
                  onClick={handleUploadClick}
                  className="flex items-center gap-2 px-4 py-2 bg-[#F27A30] text-white rounded-xl hover:bg-[#e06b21] transition-colors mx-auto"
                >
                  <Upload className="w-4 h-4" />
                  Upload First Document
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {displayDocuments.map((doc) => (
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
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <p className="text-white font-medium truncate">{doc.name}</p>
                              {/* <span className={`text-xs px-2 py-0.5 rounded-full bg-gray-800 ${getCategoryColor(doc.category)}`}>
                                {getCategoryLabel(doc.category)}
                              </span> */}
                            </div>
                            <p className="text-xs text-gray-400">
                              {doc.size} • Uploaded on {doc.uploadDate}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    {editingDocId !== doc.id && (
                      <div className="flex gap-2 mt-3 sm:mt-0 justify-end">
                        {/* Category selector */}
                        <div className="relative">
                          <select
                            value={doc.category}
                            onChange={(e) => changeDocumentCategory(doc.id, e.target.value)}
                            className="p-2 bg-[#2a2a2a] text-gray-300 rounded-md text-xs border border-gray-700 hover:bg-[#333] transition-colors"
                            title="Change Category"
                          >
                            {documentCategories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.label}
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

        <div className="p-4 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="text-xs text-gray-500">
              <p>Supported formats: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX, TXT</p>
              <p>Maximum file size: 10MB per document</p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#3F74FF] text-sm text-white border border-gray-800 rounded-xl hover:bg-gray-900 transition-colors w-full sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}