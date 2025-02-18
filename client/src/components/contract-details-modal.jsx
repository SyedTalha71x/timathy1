/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X, Printer, FileText } from "lucide-react"

export function ContractDetailsModal({ contract, onClose, onPause, onCancel }) {
  return (
    <div className="fixed inset-0 w-screen h-screen open_sans_font bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000]">
      <div className="bg-[#1C1C1C] rounded-xl lg:p-8 md:p-6 sm:p-4 p-4 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={20} />
        </button>

        <div className="space-y-4 custom-scrollbar overflow-y-auto max-h-[70vh]">
          <div>
            <h3 className="text-white text-xl font-bold">Contract Details</h3>
            <p className="text-gray-400 mt-1">{contract.id}</p>
            <p className="text-gray-400 mt-1">
              {contract.startDate} - {contract.endDate}
            </p>
          </div>

          <div className="flex gap-2">
            <button className="py-1.5 px-5 bg-[#3F74FF] text-white text-sm rounded-xl flex items-center gap-2">
              <FileText size={16} />
              View PDF
            </button>
            <button className="py-1.5 px-5 bg-black text-white text-sm rounded-xl border border-gray-800 flex items-center gap-2">
              <Printer size={16} />
              Print PDF
            </button>
          </div>

          <div className="bg-slate-500 h-[1px] w-full" />

          <div className="space-y-4">
            <h3 className="text-white text-xl font-bold">Member</h3>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-400">Contract Type</p>
                <p className="text-white">{contract.contractType}</p>
              </div>

              <div>
                <p className="text-gray-400">Name</p>
                <p className="text-white">{contract.memberName}</p>
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

          {/* <div className="flex gap-2 pt-4">
            <button
              onClick={onPause}
              className="py-2 px-5 bg-black text-white text-sm rounded-xl border border-gray-800"
            >
              Pause contract
            </button>

            <button
              onClick={onCancel}
              className="py-2 px-5 bg-black text-red-500 cursor-pointer text-sm rounded-xl border border-gray-800"
            >
              Cancel contract
            </button>
          </div> */}
        </div>
      </div>
    </div>
  )
}

