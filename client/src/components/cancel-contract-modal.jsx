/* eslint-disable react/prop-types */
import { X } from "lucide-react"
import { useState } from "react"

export function CancelContractModal({ onClose, onSubmit }) {
  const [reason, setReason] = useState("")
  const [cancelDate, setCancelDate] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ reason, cancelDate })
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/50 flex items-center justify-center z-[1001]">
      <div className="bg-[#1C1C1C] rounded-xl p-6 w-full max-w-sm relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={20} />
        </button>
        <h3 className="text-white text-lg font-semibold mb-4">Cancel Contract</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm text-gray-400">
              Reason
            </label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-[#141414] text-white text-sm rounded-xl px-3 py-2.5 outline-none border border-gray-800 appearance-none"
            >
              <option value="">Select a reason</option>
              <option value="Financial Reasons">Financial Reasons</option>
              <option value="Dissatisfied with Service">Dissatisfied with Service</option>
              <option value="Moving Away">Moving Away</option>
              <option value="Health Issues">Health Issues</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="cancelDate" className="text-sm text-gray-400">
              Cancellation Date
            </label>
            <input
              type="date"
              id="cancelDate"
              value={cancelDate}
              onChange={(e) => setCancelDate(e.target.value)}
              className="w-full bg-[#141414] text-white text-sm rounded-xl px-3 py-2.5 outline-none border border-gray-800"
            />
          </div>
          <p className="text-sm text-gray-400">
            Note: The cancellation will be effective one month from the selected date.
          </p>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#3F74FF] text-white text-sm rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
          >
            Cancel Contract
          </button>
        </form>
      </div>
    </div>
  )
}

