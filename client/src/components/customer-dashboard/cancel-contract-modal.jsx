/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
""

/* eslint-disable react/prop-types */
import { X } from "lucide-react"
import { useState } from "react"

export function CancelContractModal({ contract, onClose, onSubmit }) {
  const [cancelData, setCancelData] = useState({
    reason: "",
    cancelDate: "",
    extraordinaryCancellation: false,
    cancellationThroughStudio: false,
    notificationRule: true,
  })

  const cancellationReasons = [
    "Financial Reasons",
    "Dissatisfied with Service",
    "Moving Away",
    "Health Issues",
    "Pregnancy",
    "Parental Leave",
    "Personal Reasons",
    "No Fun in Fitness Training",
    "Studio Change",
    "Officially Ordered Studio Closure",
    "Replaced by Flat Rate",
    "Voucher Withdrawn",
    "House Ban",
    "Customer was Archived",
    "Mass Cancellation",
    "Open Claims",
    "Other",
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setCancelData({
      ...cancelData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(cancelData)
  }

  // Calculate cancellation information
  const calculateCancellationDates = () => {
    if (!contract?.endDate) return null

    const contractEndDate = new Date(contract.endDate)
    const today = new Date()
    const oneMonthBefore = new Date(contractEndDate)
    oneMonthBefore.setMonth(oneMonthBefore.getMonth() - 1)

    return {
      cancellationPeriod: "1 Month",
      latestCancellationDate: oneMonthBefore.toLocaleDateString("en-GB"),
      contractEndDate: contractEndDate.toLocaleDateString("en-GB"),
    }
  }

  const cancellationInfo = calculateCancellationDates()

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/50 flex items-center justify-center z-[1001]">
      <div className="bg-[#1C1C1C] rounded-xl p-6 w-full max-w-md relative max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={20} />
        </button>

        <h3 className="text-white text-lg font-semibold mb-4">Cancel Contract</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {cancellationInfo && (
            <div className="bg-[#141414] p-4 rounded-xl border border-gray-800">
              <h4 className="text-white text-sm font-medium mb-3">Cancellation Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Cancellation Period:</span>
                  <span className="text-white">{cancellationInfo.cancellationPeriod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Latest Possible Cancellation:</span>
                  <span className="text-white">{cancellationInfo.latestCancellationDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Contract End Date:</span>
                  <span className="text-white">{cancellationInfo.contractEndDate}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm text-gray-400">
              Cancellation Reason
            </label>
            <select
              id="reason"
              name="reason"
              value={cancelData.reason}
              onChange={handleInputChange}
              className="w-full bg-[#141414] text-white text-sm rounded-xl px-3 py-2.5 outline-none border border-gray-800 appearance-none"
              required
            >
              <option value="">Select cancellation reason...</option>
              {cancellationReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="cancelDate" className="text-sm text-gray-400">
              Cancellation Entry Date
            </label>
            <input
              type="date"
              id="cancelDate"
              name="cancelDate"
              value={cancelData.cancelDate}
              onChange={handleInputChange}
              className="w-full bg-[#141414] white-calendar-icon text-white text-sm rounded-xl px-3 py-2.5 outline-none border border-gray-800"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="extraordinaryCancellation"
                checked={cancelData.extraordinaryCancellation}
                onChange={handleInputChange}
                className="form-checkbox h-4 w-4 text-[#3F74FF] rounded border-gray-800 focus:ring-[#3F74FF]"
              />
              <span className="text-white text-sm">Extraordinary Cancellation</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="cancellationThroughStudio"
                checked={cancelData.cancellationThroughStudio}
                onChange={handleInputChange}
                className="form-checkbox h-4 w-4 text-[#3F74FF] rounded border-gray-800 focus:ring-[#3F74FF]"
              />
              <span className="text-white text-sm">Cancellation through Studio</span>
            </label>
          </div>

          <div className="space-y-2">
            <label htmlFor="cancelToDate" className="text-sm text-gray-400">
              Cancel to Date
            </label>
            <input
              type="date"
              id="cancelToDate"
              name="cancelToDate"
              value={cancelData.cancelToDate}
              onChange={handleInputChange}
              className="w-full bg-[#141414] text-white white-calendar-icon text-sm rounded-xl px-3 py-2.5 outline-none border border-gray-800"
            />
          </div>

          <div className="bg-[#141414] p-4 rounded-xl border border-gray-800">
            <h4 className="text-white text-sm font-medium mb-2">Notification Rule</h4>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="notificationRule"
                checked={cancelData.notificationRule}
                onChange={handleInputChange}
                className="form-checkbox h-4 w-4 text-[#3F74FF] rounded border-gray-800 focus:ring-[#3F74FF]"
              />
              <span className="text-gray-300 text-sm">
                Send "Regular Cancellation" notification via email immediately
              </span>
            </label>
          </div>

          <p className="text-sm text-gray-400">
            Note: The cancellation will be effective according to the contract terms and selected date.
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-[#2F2F2F] text-white text-sm rounded-xl hover:bg-[#3a3a3a] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-[#3F74FF] text-white text-sm rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
            >
              Confirm Cancellation
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
