/* eslint-disable react/prop-types */
import { X } from "lucide-react"

export function ViewLeadDetailsModal({ isVisible, onClose, leadData }) {
  if (!isVisible || !leadData) return null

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-[#1C1C1C] rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Lead Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-400">Name</p>
            <p className="text-white">{`${leadData.firstName} ${leadData.surname}`}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Email</p>
            <p className="text-white">{leadData.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Phone Number</p>
            <p className="text-white">{leadData.phoneNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Trial Period</p>
            <p className="text-white">{leadData.trialPeriod}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Trial Training</p>
            <p className="text-white">{leadData.hasTrialTraining ? "Arranged" : "Not Arranged"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

