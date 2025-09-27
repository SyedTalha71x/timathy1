/* eslint-disable react/prop-types */
import { Download, FileText, X } from "lucide-react"

const DocumentViewerModal = ({ isOpen, onClose, document }) => {
    if (!isOpen || !document) return null
  
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-400" />
              <h2 className="text-white text-lg font-medium">{document.filename}</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
  
          <div className="p-4 overflow-y-auto flex-grow">
            <pre className="bg-[#0D1117] p-4 rounded-lg text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
              {document.content}
            </pre>
          </div>
  
          <div className="p-4 border-t border-gray-800 flex justify-end">
            <button
              onClick={() => {
                const element = document.createElement("a")
                const file = new Blob([document.content], { type: "application/xml" })
                element.href = URL.createObjectURL(file)
                element.download = document.filename
                document.body.appendChild(element)
                element.click()
                document.body.removeChild(element)
              }}
              className="bg-[#3F74FF] text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-[#3F74FF]/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    )
  }

  export default DocumentViewerModal