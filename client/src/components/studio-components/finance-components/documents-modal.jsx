/* eslint-disable react/prop-types */
import { Download, Eye, FileText, Trash2, X, AlertTriangle } from "lucide-react"
import { useState } from "react"

const DocumentsModal = ({ isOpen, onClose, documents, onDeleteDocument, onViewDocument }) => {
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState(null)
  const [activeTab, setActiveTab] = useState("latest") // "latest" or "past"

  if (!isOpen) return null

  // Separate documents into latest and past
  const latestDocument = documents.length > 0 ? documents[documents.length - 1] : null
  const pastDocuments = documents.length > 1 ? documents.slice(0, -1).reverse() : [] // Reverse to show newest first in past section

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleDeleteClick = (doc) => {
    setDocumentToDelete(doc)
    setDeleteConfirmationOpen(true)
  }

  const confirmDelete = () => {
    if (documentToDelete) {
      onDeleteDocument(documentToDelete.id)
      setDeleteConfirmationOpen(false)
      setDocumentToDelete(null)
    }
  }

  const cancelDelete = () => {
    setDeleteConfirmationOpen(false)
    setDocumentToDelete(null)
  }

  const DocumentItem = ({ doc, isLatest = false }) => (
    <div className="bg-surface-dark p-3 md:p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="flex items-center gap-2 md:gap-3 flex-1">
        <div className="p-1.5 md:p-2 rounded-lg bg-surface-button/30">
          <FileText className="w-4 h-4 md:w-5 md:h-5 text-content-muted" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-content-primary font-medium text-sm md:text-base">{doc.filename}</h3>
            {isLatest && (
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">Latest</span>
            )}
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-xs md:text-sm text-content-muted mt-1">
            <span>Generated: {formatDate(doc.createdAt)}</span>
            <span>Size: {formatFileSize(doc.size)}</span>
            <span>Transactions: {doc.transactionCount}</span>
            <span>Total: ${doc.totalAmount?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 self-end md:self-auto">
        <button
          onClick={() => onViewDocument(doc)}
          className="p-1.5 md:p-2 text-content-muted hover:text-content-primary hover:bg-surface-hover rounded-lg transition-colors"
          title="View Document"
        >
          <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
        <button
          onClick={() => {
            const element = document.createElement("a")
            const file = new Blob([doc.content], { type: "application/xml" })
            element.href = URL.createObjectURL(file)
            element.download = doc.filename
            document.body.appendChild(element)
            element.click()
            document.body.removeChild(element)
          }}
          className="p-1.5 md:p-2 text-content-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
          title="Download"
        >
          <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
        <button
          onClick={() => handleDeleteClick(doc)}
          className="p-1.5 md:p-2 text-content-muted hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
      </div>
    </div>
  )

  return (
    <>
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-surface-base rounded-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <div className="p-3 md:p-4 border-b border-border flex justify-between items-center">
            <div className="flex items-center gap-2 md:gap-3">
              <FileText className="w-4 h-4 md:w-5 md:h-5 text-content-primary" />
              <h2 className="text-content-primary text-base md:text-lg font-medium">SEPA XML Documents</h2>
            </div>
            <button onClick={onClose} className="text-content-muted hover:text-content-primary">
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab("latest")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "latest" 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-content-muted hover:text-content-primary"
              }`}
            >
              Latest File
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "past" 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-content-muted hover:text-content-primary"
              }`}
            >
              Past Files {pastDocuments.length > 0 && `(${pastDocuments.length})`}
            </button>
          </div>

          <div className="p-3 md:p-4 overflow-y-auto flex-grow">
            {documents.length === 0 ? (
              <div className="text-center py-6 md:py-8">
                <FileText className="w-10 h-10 md:w-12 md:h-12 text-content-faint mx-auto mb-3 md:mb-4" />
                <p className="text-content-muted text-sm md:text-base">No SEPA XML documents generated yet</p>
                <p className="text-content-faint text-xs md:text-sm mt-2">Generated XML files will appear here</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Latest Tab Content */}
                {activeTab === "latest" && latestDocument && (
                  <div>
                   
                    <DocumentItem doc={latestDocument} isLatest={true} />
                   
                  </div>
                )}

                {/* Past Tab Content */}
                {activeTab === "past" && (
                  <div>
                    {pastDocuments.length > 0 ? (
                      <>
                       
                        <div className="space-y-3">
                          {pastDocuments.map((doc) => (
                            <DocumentItem key={doc.id} doc={doc} isLatest={false} />
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-10 h-10 md:w-12 md:h-12 text-content-faint mx-auto mb-3 md:mb-4" />
                        <p className="text-content-muted text-sm md:text-base">No past files available</p>
                        <p className="text-content-faint text-xs md:text-sm mt-2">
                          Only the latest generated file is currently available
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Show empty state if no latest document but in latest tab */}
                {activeTab === "latest" && !latestDocument && (
                  <div className="text-center py-8">
                    <FileText className="w-10 h-10 md:w-12 md:h-12 text-content-faint mx-auto mb-3 md:mb-4" />
                    <p className="text-content-muted text-sm md:text-base">No latest file available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmationOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
          <div className="bg-surface-base rounded-xl w-full max-w-md">
            <div className="p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-900/30 p-2 rounded-lg">
                  <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-red-400" />
                </div>
                <h3 className="text-content-primary text-lg font-medium">Delete SEPA File</h3>
              </div>
              
              <p className="text-content-secondary mb-2">
                Are you sure you want to delete this SEPA XML file?
              </p>
              {documentToDelete && (
                <p className="text-content-muted text-sm mb-4">
                  <strong>{documentToDelete.filename}</strong>
                  <br />
                  Generated: {formatDate(documentToDelete.createdAt)}
                  <br />
                  Transactions: {documentToDelete.transactionCount}
                </p>
              )}
              <p className="text-content-secondary text-sm mb-6 font-bold">
                This action cannot be undone. The file will be permanently deleted.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-surface-button text-content-secondary rounded-xl hover:bg-surface-button-hover transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DocumentsModal
