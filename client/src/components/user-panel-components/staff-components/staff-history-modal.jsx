/* eslint-disable react/prop-types */
import { X } from "lucide-react"
import { useState } from "react"

function StaffHistoryModal({ staff, onClose }) {
  const [activeTab, setActiveTab] = useState("profile")

  const profileChanges = [
    {
      id: 1,
      date: "2024-01-15",
      time: "14:30",
      field: "Role",
      oldValue: "Employee",
      newValue: "Senior Employee",
      changedBy: "Admin",
    },
    {
      id: 2,
      date: "2024-01-10",
      time: "09:15",
      field: "Vacation Entitlement",
      oldValue: "25 days",
      newValue: "30 days",
      changedBy: "HR Manager",
    },
    {
      id: 3,
      date: "2024-01-05",
      time: "16:45",
      field: "Phone",
      oldValue: "+1234567890",
      newValue: "+1234567891",
      changedBy: "Self",
    },
  ]

  const actions = [
    {
      id: 1,
      date: "2024-01-18",
      time: "10:30",
      action: "Moved Appointment",
      details: "Moved meeting with client from 14:00 to 15:30",
      target: "Meeting with ABC Corp",
      performedBy: "System",
    },
    {
      id: 2,
      date: "2024-01-17",
      time: "16:20",
      action: "Changed Member Data",
      details: "Updated contact information",
      target: "Member: John Smith",
      performedBy: "Self",
    },
    {
      id: 3,
      date: "2024-01-16",
      time: "11:15",
      action: "Created To-Do List",
      details: "Created new project task list",
      target: "Project Alpha Tasks",
      performedBy: "Self",
    },
    {
      id: 4,
      date: "2024-01-15",
      time: "09:45",
      action: "Deleted To-Do List",
      details: "Removed completed task list",
      target: "Old Project Tasks",
      performedBy: "Self",
    },
    {
      id: 5,
      date: "2024-01-14",
      time: "13:20",
      action: "Assigned Task",
      details: "Assigned new client follow-up",
      target: "Task: Client Follow-up",
      performedBy: "Manager",
    },
  ]

  const loginActivity = [
    {
      id: 1,
      date: "2024-01-20",
      time: "08:30",
      action: "Login",
      ipAddress: "192.168.1.100",
      device: "Chrome on Windows",
    },
    {
      id: 2,
      date: "2024-01-19",
      time: "17:45",
      action: "Logout",
      ipAddress: "192.168.1.100",
      device: "Chrome on Windows",
    },
    {
      id: 3,
      date: "2024-01-19",
      time: "08:15",
      action: "Login",
      ipAddress: "192.168.1.100",
      device: "Chrome on Windows",
    },
    {
      id: 4,
      date: "2024-01-18",
      time: "18:00",
      action: "Logout",
      ipAddress: "192.168.1.105",
      device: "Safari on iPhone",
    },
  ]

  const vacationHistory = [
    {
      id: 1,
      startDate: "2023-12-20",
      endDate: "2023-12-29",
      days: 8,
      status: "Approved",
      requestDate: "2023-11-15",
      approvedBy: "Manager",
    },
    {
      id: 2,
      startDate: "2023-08-15",
      endDate: "2023-08-25",
      days: 9,
      status: "Approved",
      requestDate: "2023-07-10",
      approvedBy: "Manager",
    },
    {
      id: 3,
      startDate: "2023-05-01",
      endDate: "2023-05-05",
      days: 5,
      status: "Approved",
      requestDate: "2023-04-01",
      approvedBy: "HR Manager",
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#181818] rounded-xl text-white p-4 md:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            History - {staff.firstName} {staff.lastName}
          </h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div className="flex space-x-1 mb-6 bg-[#141414] rounded-lg p-1">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              activeTab === "profile" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
            }`}
          >
            Profile Data Change
          </button>
          <button
            onClick={() => setActiveTab("actions")}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              activeTab === "actions" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
            }`}
          >
            Actions
          </button>
          <button
            onClick={() => setActiveTab("login")}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              activeTab === "login" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
            }`}
          >
            Login Activity
          </button>
          <button
            onClick={() => setActiveTab("vacation")}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              activeTab === "vacation" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
            }`}
          >
            Vacation History
          </button>
        </div>
        <div className="bg-[#141414] rounded-xl p-4">
          {activeTab === "profile" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Profile Data Changes</h3>
              <div className="space-y-3">
                {profileChanges.map((change) => (
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
          {activeTab === "actions" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              <div className="space-y-3">
                {actions.map((action) => (
                  <div key={action.id} className="bg-[#1C1C1C] rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-white">{action.action}</p>
                        <p className="text-sm text-gray-400">
                          {action.date} at {action.time} by {action.performedBy}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-300 mb-1">
                        {action.details}
                      </p>
                      <p className="text-gray-400">
                        Target: {action.target}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "login" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Login Activity</h3>
              <div className="space-y-3">
                {loginActivity.map((activity) => (
                  <div key={activity.id} className="bg-[#1C1C1C] rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-white flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              activity.action === "Login" ? "bg-green-500" : "bg-red-500"
                            }`}
                          ></span>
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-400">
                          {activity.date} at {activity.time}
                        </p>
                        <p className="text-sm text-gray-300">
                          IP: {activity.ipAddress} • {activity.device}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "vacation" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Past Vacation Bookings</h3>
              <div className="space-y-3">
                {vacationHistory.map((vacation) => (
                  <div key={vacation.id} className="bg-[#1C1C1C] rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-white">
                          {new Date(vacation.startDate).toLocaleDateString()} -{" "}
                          {new Date(vacation.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-400">
                          {vacation.days} days • Requested on {new Date(vacation.requestDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          vacation.status === "Approved" ? "bg-green-600 text-white" : "bg-orange-600 text-white"
                        }`}
                      >
                        {vacation.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">Approved by: {vacation.approvedBy}</p>
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

export default StaffHistoryModal