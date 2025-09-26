/* eslint-disable react/prop-types */
import { Download, Eye, FileText, Trash2, X } from "lucide-react"

const DocumentsModal = ({ isOpen, onClose, documents, onDeleteDocument, onViewDocument }) => {
    if (!isOpen) return null
  
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
  
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-400" />
              <h2 className="text-white text-lg font-medium">SEPA XML Documents</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
  
          <div className="p-4 overflow-y-auto flex-grow">
            {documents.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No SEPA XML documents generated yet</p>
                <p className="text-gray-500 text-sm mt-2">Generated XML files will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="bg-[#141414] p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-900/30 p-2 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{doc.filename}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                          <span>Generated: {formatDate(doc.createdAt)}</span>
                          <span>Size: {formatFileSize(doc.size)}</span>
                          <span>Transactions: {doc.transactionCount}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewDocument(doc)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        title="View Document"
                      >
                        <Eye className="w-4 h-4" />
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
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteDocument(doc.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

  export default DocumentsModal