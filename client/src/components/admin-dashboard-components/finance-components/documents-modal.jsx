/* eslint-disable react/prop-types */
import { Download, Eye, FileText, Trash2, X, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

const DocumentsModal = ({ isOpen, onClose, documents, onDeleteDocument, onViewDocument }) => {
  const { t } = useTranslation()
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
    <div className="bg-[#141414] p-3 md:p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="flex items-center gap-2 md:gap-3 flex-1">
        <div className="p-1.5 md:p-2 rounded-lg bg-gray-700/30">
          <FileText className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-medium text-sm md:text-base">{doc.filename}</h3>
            {isLatest && (
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">{t("admin.finances.documents.latest")}</span>
            )}
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-xs md:text-sm text-gray-400 mt-1">
            <span>{t("admin.finances.documents.generated")}: {formatDate(doc.createdAt)}</span>
            <span>{t("admin.finances.documents.size")}: {formatFileSize(doc.size)}</span>
            <span>{t("admin.finances.documents.transactions")}: {doc.transactionCount}</span>
            <span>{t("admin.finances.documents.total")}: ${doc.totalAmount?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 self-end md:self-auto">
        <button
          onClick={() => onViewDocument(doc)}
          className="p-1.5 md:p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          title={t("admin.finances.documents.viewDocument")}
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
          className="p-1.5 md:p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
          title={t("admin.finances.documents.download")}
        >
          <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
        <button
          onClick={() => handleDeleteClick(doc)}
          className="p-1.5 md:p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
          title={t("admin.finances.documents.delete")}
        >
          <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
      </div>
    </div>
  )

  return (
    <>
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <div className="p-3 md:p-4 border-b border-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-2 md:gap-3">
              <FileText className="w-4 h-4 md:w-5 md:h-5 text-white" />
              <h2 className="text-white text-base md:text-lg font-medium">{t("admin.finances.documents.title")}</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => setActiveTab("latest")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "latest" 
                  ? "text-orange-400 border-b-2 border-orange-400" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t("admin.finances.documents.latestFile")}
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "past" 
                  ? "text-orange-400 border-b-2 border-orange-400" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t("admin.finances.documents.pastFiles")} {pastDocuments.length > 0 && `(${pastDocuments.length})`}
            </button>
          </div>

          <div className="p-3 md:p-4 overflow-y-auto flex-grow">
            {documents.length === 0 ? (
              <div className="text-center py-6 md:py-8">
                <FileText className="w-10 h-10 md:w-12 md:h-12 text-gray-600 mx-auto mb-3 md:mb-4" />
                <p className="text-gray-400 text-sm md:text-base">{t("admin.finances.documents.noDocuments")}</p>
                <p className="text-gray-500 text-xs md:text-sm mt-2">{t("admin.finances.documents.noDocumentsHint")}</p>
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
                        <FileText className="w-10 h-10 md:w-12 md:h-12 text-gray-600 mx-auto mb-3 md:mb-4" />
                        <p className="text-gray-400 text-sm md:text-base">{t("admin.finances.documents.noPastFiles")}</p>
                        <p className="text-gray-500 text-xs md:text-sm mt-2">
                          {t("admin.finances.documents.noPastFilesHint")}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Show empty state if no latest document but in latest tab */}
                {activeTab === "latest" && !latestDocument && (
                  <div className="text-center py-8">
                    <FileText className="w-10 h-10 md:w-12 md:h-12 text-gray-600 mx-auto mb-3 md:mb-4" />
                    <p className="text-gray-400 text-sm md:text-base">{t("admin.finances.documents.noLatestFile")}</p>
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
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md">
            <div className="p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-900/30 p-2 rounded-lg">
                  <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-red-400" />
                </div>
                <h3 className="text-white text-lg font-medium">{t("admin.finances.documents.deleteTitle")}</h3>
              </div>
              
              <p className="text-gray-300 mb-2">
                {t("admin.finances.documents.deleteConfirm")}
              </p>
              {documentToDelete && (
                <p className="text-gray-400 text-sm mb-4">
                  <strong>{documentToDelete.filename}</strong>
                  <br />
                  {t("admin.finances.documents.generated")}: {formatDate(documentToDelete.createdAt)}
                  <br />
                  {t("admin.finances.documents.transactions")}: {documentToDelete.transactionCount}
                </p>
              )}
              <p className="text-yellow-400 text-sm mb-6">
                {t("admin.finances.documents.deleteWarning")}
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#3F3F3F] transition-colors"
                >
                  {t("common.cancel")}
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {t("admin.finances.documents.deleteFile")}
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
