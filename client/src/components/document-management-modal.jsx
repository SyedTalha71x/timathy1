/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useState, useRef } from "react"
import { X, Upload, Trash, Edit2, File, FileText, FilePlus, Eye } from "lucide-react"
import { toast } from "react-hot-toast"
import { FaPrint } from "react-icons/fa";


export function DocumentManagementModal({ contract, onClose }) {
  const [documents, setDocuments] = useState(contract.files || [])
  const [isUploading, setIsUploading] = useState(false)
  const [editingDocId, setEditingDocId] = useState(null)
  const [newDocName, setNewDocName] = useState("")
  const [viewingDocument, setViewingDocument] = useState(null)
  const fileInputRef = useRef(null)
  const signedFileInputRef = useRef(null)

  // Sample document data structure if none exists
  const sampleDocuments = [
    { id: "doc-1", name: "Contract Agreement.pdf", type: "pdf", size: "1.2 MB", uploadDate: "2023-05-15" },
    { id: "doc-2", name: "Payment Schedule.xlsx", type: "xlsx", size: "0.8 MB", uploadDate: "2023-05-16" },
  ]

  const displayDocuments = documents.length > 0 ? documents : sampleDocuments

  const handleUploadClick = () => {
    fileInputRef.current.click()
  }

  const handleSignedUploadClick = () => {
    signedFileInputRef.current.click()
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
        type: file.name.split(".").pop(),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split("T")[0],
        file: file, // Store the actual file object
      }))

      setDocuments([...displayDocuments, ...newDocs])
      setIsUploading(false)
      toast.dismiss()
      toast.success(`${files.length} document(s) uploaded successfully`)
    }, 1500)
  }

  const handleSignedFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const fileType = file.type
    const validTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"]

    if (!validTypes.includes(fileType)) {
      toast.error("Please upload a PDF or image file")
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size should be less than 10MB")
      return
    }

    setIsUploading(true)
    toast.loading("Uploading signed contract...")

    // Simulate upload delay
    setTimeout(() => {
      const newDoc = {
        id: `doc-${Math.random().toString(36).substr(2, 9)}`,
        name: `Signed Contract - ${file.name}`,
        type: file.name.split(".").pop(),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split("T")[0],
        file: file,
        isSigned: true,
      }

      setDocuments([...displayDocuments, newDoc])
      setIsUploading(false)
      toast.dismiss()
      toast.success("Signed contract uploaded successfully")

      // Update contract status
      // In a real app, you would call an API to update the contract status
      toast.success("Contract status updated to 'Digital signed'")
    }, 1500)
  }

  const handleDownload = (doc) => {
    // In a real app, you would generate a download URL or use the stored file
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

  const handleViewDocument = (doc) => {
    setViewingDocument(doc)
    toast.success(`Viewing ${doc.name}...`)
    // In a real app, you would open the document in a viewer
  }

  const handleDelete = (docId) => {
    if (confirm("Are you sure you want to delete this document?")) {
      setDocuments(displayDocuments.filter((doc) => doc.id !== docId))
      toast.success("Document deleted successfully")
    }
  }

  const startEditing = (doc) => {
    setEditingDocId(doc.id)
    setNewDocName(doc.name)
  }

  const saveDocName = (docId) => {
    if (newDocName.trim() === "") {
      toast.error("Document name cannot be empty")
      return
    }

    // Get the original file extension
    const originalDoc = displayDocuments.find((doc) => doc.id === docId)
    const originalExtension = originalDoc.name.split(".").pop()

    // Make sure the new name has the same extension
    let finalName = newDocName
    if (!finalName.endsWith(`.${originalExtension}`)) {
      // If user removed extension, add it back
      finalName = finalName.split(".")[0] + `.${originalExtension}`
    }

    setDocuments(displayDocuments.map((doc) => (doc.id === docId ? { ...doc, name: finalName } : doc)))
    setEditingDocId(null)
    toast.success("Document renamed successfully")
  }

  const getDocumentIcon = (type) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />
      case "xlsx":
      case "xls":
        return <FileText className="w-5 h-5 text-green-500" />
      case "docx":
      case "doc":
        return <FileText className="w-5 h-5 text-blue-500" />
      default:
        return <File className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4">
      {viewingDocument && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-[60]">
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
                  {viewingDocument.type.toUpperCase()} document • {viewingDocument.size}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-800">
          <h3 className="text-white text-lg sm:text-xl font-medium">Document Management</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-gray-300">
              <span className="font-medium text-white">{contract.memberName}</span>'s Contract Documents
            </p>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={handleSignedUploadClick}
                className="text-sm  gap-2 px-4 py-2 bg-[#3F74FF] text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors w-full sm:w-auto"
              >
                Upload Signed Contract
              </button>
              <button
                onClick={handleUploadClick}
                className=" text-sm  gap-2 px-4 py-2 bg-[#F27A30] text-white rounded-xl hover:bg-[#e06b21] transition-colors w-full sm:w-auto"
              >
                Upload Document
              </button>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
            <input
              type="file"
              ref={signedFileInputRef}
              onChange={handleSignedFileChange}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
        </div>

        {displayDocuments.length === 0 && (
          <div className="bg-[#141414] p-4 rounded-xl mb-4">
            <h4 className="text-white font-medium mb-2">How to sign and upload your contract:</h4>
            <ol className="text-gray-400 text-sm space-y-2 list-decimal pl-5">
              <li>Generate the contract with or without digital signature</li>
              <li>If using paper signature, print the document</li>
              <li>Have all parties sign the printed document</li>
              <li>Scan or take a clear photo of all signed pages</li>
              <li>Click "Upload Signed Contract" to upload the signed contract</li>
            </ol>
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
              <p className="text-gray-400">No documents available for this contract.</p>
              <button
                onClick={handleUploadClick}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#F27A30] text-white rounded-xl hover:bg-[#e06b21] transition-colors mx-auto"
              >
                <Upload className="w-4 h-4" />
                Upload Your First Document
              </button>
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
                            <input
                              type="text"
                              value={newDocName}
                              onChange={(e) => setNewDocName(e.target.value)}
                              className="bg-black text-white px-2 py-1 rounded border border-gray-700 flex-1 w-full"
                              autoFocus
                            />
                            <div className="flex gap-2 mt-2 sm:mt-0">
                              <button
                                onClick={() => saveDocName(doc.id)}
                                className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex-1 sm:flex-none"
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
                              {doc.isSigned && (
                                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                                  Signed
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-400">
                              {doc.size} • Uploaded on {doc.uploadDate}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    {editingDocId !== doc.id && (
                      <div className="flex gap-2 mt-3 sm:mt-0 justify-end">
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
                          <FaPrint className="w-4 h-4" />
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

        <div className="p-4 border-t border-gray-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-sm text-white border border-gray-800 rounded-xl hover:bg-gray-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

