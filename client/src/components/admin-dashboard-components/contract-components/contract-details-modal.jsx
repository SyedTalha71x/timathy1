/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X, Printer, Download, User } from "lucide-react"
import { useState } from "react"
import Contract1 from "../../../../public/contract1.png"

export function ContractDetailsModal({ contract, onClose, onPause, onCancel }) {
  const [showContractImage, setShowContractImage] = useState(false)

  const handlePrintContract = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    // In a real implementation, this would generate and download a PDF
    alert("Downloading contract as PDF...")
  }

  const redirectToStudio = () => {
    window.location.href = "/admin-dashboard/studios"
  }

  return (
    <div className="fixed inset-0 w-screen h-screen open_sans_font bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000]">
      <div className="bg-[#1C1C1C] rounded-xl lg:p-8 md:p-6 sm:p-4 p-4 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={20} />
        </button>

        {showContractImage ? (
          <div className="space-y-4 custom-scrollbar overflow-y-auto max-h-[70vh]">
            <div className="flex justify-between items-center">
              <h3 className="text-white text-xl font-bold">Contract Document</h3>
              <button onClick={() => setShowContractImage(false)} className="text-gray-400 hover:text-white text-sm">
                Back to Details
              </button>
            </div>

            <div className="bg-white rounded-lg overflow-hidden">
              {/* Display your contract image here */}
              <img src={Contract1 || "/placeholder.svg"} alt="Contract Document" className="w-full h-auto" />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={handlePrintContract}
                className="py-1.5 px-5 bg-black text-white text-sm rounded-xl border border-gray-800 flex items-center gap-2"
              >
                <Printer size={16} />
                Print
              </button>
              <button
                onClick={handleDownloadPDF}
                className="py-1.5 px-5 bg-[#3F74FF] text-white text-sm rounded-xl flex items-center gap-2"
              >
                <Download size={16} />
                Download PDF
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 custom-scrollbar overflow-y-auto max-h-[70vh]">
            <div>
              <h3 className="text-white text-xl font-bold">Contract Details</h3>
              <p className="text-gray-400 mt-1">{contract.id}</p>
              <p className="text-gray-400 mt-1">
                {contract.startDate} - {contract.endDate}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={redirectToStudio}
                className="py-1.5 px-5 bg-[#3F74FF] text-white text-sm rounded-xl flex items-center gap-2"
              >
                <User size={16} />
                Go to Studio
              </button>
            </div>

            <div className="bg-slate-500 h-[1px] w-full" />

            <div className="space-y-4">
              <h3 className="text-white text-xl font-bold">Studio Details</h3>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-400">Contract Type</p>
                  <p className="text-white">{contract.contractType}</p>
                </div>

                <div>
                  <p className="text-gray-400">Studio Name</p>
                  <p className="text-white">{contract.studioName}</p>
                </div>

                <div>
                  <p className="text-gray-400">Studio Owner</p>
                  <p className="text-white">{contract.studioOwnerName}</p>
                </div>

                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="text-white">{contract.email || "-"}</p>
                </div>

                <div>
                  <p className="text-gray-400">Phone</p>
                  <p className="text-white">{contract.phone || "-"}</p>
                </div>

                <div>
                  <p className="text-gray-400">IBAN</p>
                  <p className="text-white">{contract.iban || "-"}</p>
                </div>

                <div>
                  <p className="text-gray-400">SEPA Mandate Number</p>
                  <p className="text-white">{contract.sepaMandate || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
