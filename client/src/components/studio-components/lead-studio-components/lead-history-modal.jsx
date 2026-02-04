
/* eslint-disable react/prop-types */
import { X } from "lucide-react"
import { useState } from "react"

function LeadHistoryModal({ lead, onClose }) {
  const [activeTab, setActiveTab] = useState("general")

  if (!lead) {
    return null
  }

  // Dummy history data for leads
  const generalChanges = [
    {
      id: 1,
      date: "2024-01-15",
      time: "14:30",
      field: "Status",
      oldValue: "Active prospect",
      newValue: "Passive prospect",
      changedBy: "Admin",
    },
    {
      id: 2,
      date: "2024-01-10",
      time: "09:15",
      field: "Phone Number",
      oldValue: "+1234567890",
      newValue: "+1234567891",
      changedBy: "Self",
    },
    {
      id: 3,
      date: "2024-01-05",
      time: "16:45",
      field: "Email",
      oldValue: "old@email.com",
      newValue: "new@email.com",
      changedBy: "Admin",
    },
  ]

  const trialTrainingHistory = [
    {
      id: 1,
      date: "2024-01-20",
      time: "10:00",
      action: "Trial Training Booked",
      trialType: "Cardio",
      trialDate: "2024-01-25",
      trialTime: "14:00",
      status: "Scheduled",
      bookedBy: "Admin",
    },
    {
      id: 2,
      date: "2024-01-18",
      time: "15:30",
      action: "Trial Training Completed",
      trialType: "Strength",
      trialDate: "2024-01-18",
      trialTime: "15:00",
      status: "Completed",
      bookedBy: "Admin",
    },
    {
      id: 3,
      date: "2024-01-15",
      time: "11:00",
      action: "Trial Training Cancelled",
      trialType: "Flexibility",
      trialDate: "2024-01-16",
      trialTime: "09:00",
      status: "Cancelled",
      bookedBy: "Admin",
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#181818] rounded-xl text-white p-4 md:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            History - {lead.firstName} {lead.surname}
          </h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div className="flex space-x-1 mb-6 bg-[#141414] rounded-lg p-1">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              activeTab === "general" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
            }`}
          >
            General Changes
          </button>
          <button
            onClick={() => setActiveTab("trial")}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              activeTab === "trial" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
            }`}
          >
            Trial Training
          </button>
        </div>
        <div className="bg-[#141414] rounded-xl p-4">
          {activeTab === "general" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">General Changes</h3>
              <div className="space-y-3">
                {generalChanges.map((change) => (
                  <div key={change.id} className="bg-[#1C1C1C] rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-white">{change.field} Changed</p>
                        <p className="text-sm text-gray-400">
                          {change.date} at {change.time} by {change.changedBy}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-300">
                        <span className="text-red-400">From:</span> {change.oldValue}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-green-400">To:</span> {change.newValue}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "trial" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Trial Training History</h3>
              <div className="space-y-3">
                {trialTrainingHistory.map((activity) => (
                  <div key={activity.id} className="bg-[#1C1C1C] rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-white flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              activity.status === "Completed"
                                ? "bg-green-500"
                                : activity.status === "Scheduled"
                                  ? "bg-blue-500"
                                  : "bg-red-500"
                            }`}
                          ></span>
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-400">
                          {activity.date} at {activity.time} by {activity.bookedBy}
                        </p>
                        <p className="text-sm text-gray-300">
                          Type: {activity.trialType} • Trial Date: {activity.trialDate} at {activity.trialTime}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          activity.status === "Completed"
                            ? "bg-green-600 text-white"
                            : activity.status === "Scheduled"
                              ? "bg-blue-600 text-white"
                              : "bg-red-600 text-white"
                        }`}
                      >
                        {activity.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-6 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default LeadHistoryModal
