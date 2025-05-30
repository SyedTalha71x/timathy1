/* eslint-disable no-unused-vars */

/* eslint-disable react/prop-types */
import { X, FileText } from "lucide-react"
import { useState } from "react"
import { DocumentManagementModal } from "../../document-management-modal"

const ContractsModal = ({ isOpen, onClose, selectedStudio, studioContracts, handleFileUpload, handleDownloadFile }) => {
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false)
  const [selectedContract, setSelectedContract] = useState(null)

  if (!isOpen || !selectedStudio) return null

  const contracts = studioContracts[selectedStudio.id] || []

  const handleManageDocuments = (contract) => {
    setSelectedContract(contract)
    setIsDocumentModalOpen(true)
  }

  return (
    <>
      <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-50 overflow-y-auto">
        <div className="bg-[#1C1C1C] rounded-xl w-full max-w-5xl my-8 relative">
          <div className="lg:p-6 p-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white open_sans_font_700 text-lg font-semibold">
                {selectedStudio.name} - Contracts ({contracts.length})
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X size={20} className="cursor-pointer" />
              </button>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
              {contracts.map((contract) => (
                <div
                  key={contract.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#161616] p-4 rounded-xl hover:bg-[#1a1a1a] transition-colors gap-4"
                >
                  <div className="flex flex-col items-start justify-start">
                    {/* Status Tag */}
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-lg mb-1 ${
                        contract.status === "active"
                          ? "bg-green-600 text-white"
                          : contract.status === "paused"
                            ? "bg-yellow-600 text-white"
                            : "bg-red-600 text-white"
                      }`}
                    >
                      {contract.status}
                      {contract.pauseReason && ` (${contract.pauseReason})`}
                      {contract.cancelReason && ` (${contract.cancelReason})`}
                    </span>

                    <span className="text-white font-medium">{contract.memberName}</span>
                    <span className="text-sm text-gray-400">{contract.contractType || "Premium"}</span>
                    <span className="text-sm text-gray-400">
                      {contract.startDate} - {contract.endDate}
                    </span>
                    <span className="text-sm text-gray-400">{contract.isDigital ? "Digital" : "Analog"}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleManageDocuments(contract)}
                      className="p-1.5 bg-black text-sm cursor-pointer text-white border border-gray-800 rounded-xl hover:bg-gray-900 transition-colors"
                      title="Manage Documents"
                    >
                      <FileText className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}

              {contracts.length === 0 && (
                <div className="bg-[#161616] p-6 rounded-xl text-center">
                  <p className="text-gray-400">No contracts found for this studio.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Document Management Modal */}
      {isDocumentModalOpen && selectedContract && (
        <DocumentManagementModal
          contract={selectedContract}
          onClose={() => {
            setIsDocumentModalOpen(false)
            setSelectedContract(null)
          }}
        />
      )}
    </>
  )
}

export default ContractsModal
