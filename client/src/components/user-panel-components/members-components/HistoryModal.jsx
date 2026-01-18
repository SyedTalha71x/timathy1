/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { X } from "lucide-react";

export default function HistoryModalMain({
  show,
  member,
  memberHistoryMain,
  historyTabMain,
  setHistoryTabMain,
  onClose
}) {
  const [activeTab, setActiveTab] = useState(historyTabMain || "general");

  if (!show || !member) return null;

  // Check if member is a full member (not temporary)
  const isFullMember = member.memberType === "full";

  // Dummy history data for members (matching leads structure)
  const generalChanges = memberHistoryMain?.[member.id]?.general || [
    {
      id: 1,
      date: "2024-01-15",
      time: "14:30",
      field: "Status",
      oldValue: "Active",
      newValue: "Inactive",
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
  ];

  const appointmentHistory = memberHistoryMain?.[member.id]?.appointments || [
    {
      id: 1,
      date: "2024-01-20",
      time: "10:00",
      action: "Appointment Booked",
      appointmentType: "Personal Training",
      appointmentDate: "2024-01-25",
      appointmentTime: "14:00",
      status: "Scheduled",
      bookedBy: "Admin",
    },
    {
      id: 2,
      date: "2024-01-18",
      time: "15:30",
      action: "Appointment Completed",
      appointmentType: "Group Class",
      appointmentDate: "2024-01-18",
      appointmentTime: "15:00",
      status: "Completed",
      bookedBy: "Admin",
    },
    {
      id: 3,
      date: "2024-01-15",
      time: "11:00",
      action: "Appointment Cancelled",
      appointmentType: "Consultation",
      appointmentDate: "2024-01-16",
      appointmentTime: "09:00",
      status: "Cancelled",
      bookedBy: "Admin",
    },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (setHistoryTabMain) {
      setHistoryTabMain(tab);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#181818] rounded-xl text-white p-4 md:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            History - {member.firstName} {member.lastName}
          </h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div className="flex space-x-1 mb-6 bg-[#141414] rounded-lg p-1">
          <button
            onClick={() => handleTabChange("general")}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              activeTab === "general" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
            }`}
          >
            General Changes
          </button>
          <button
            onClick={() => handleTabChange("appointments")}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              activeTab === "appointments" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
            }`}
          >
            Appointments
          </button>
          {isFullMember && (
            <>
              <button
                onClick={() => handleTabChange("checkins")}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  activeTab === "checkins" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
                }`}
              >
                Check-ins
              </button>
              <button
                onClick={() => handleTabChange("finance")}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  activeTab === "finance" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
                }`}
              >
                Finance
              </button>
              <button
                onClick={() => handleTabChange("contracts")}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  activeTab === "contracts" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
                }`}
              >
                Contracts
              </button>
            </>
          )}
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
          {activeTab === "appointments" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Appointment History</h3>
              <div className="space-y-3">
                {appointmentHistory.map((activity) => (
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
                          Type: {activity.appointmentType} • Date: {activity.appointmentDate} at {activity.appointmentTime}
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
          {activeTab === "checkins" && isFullMember && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Check-ins & Check-outs</h3>
              <div className="space-y-3">
                {(memberHistoryMain?.[member.id]?.checkins || []).length > 0 ? (
                  memberHistoryMain[member.id].checkins.map((activity) => (
                    <div key={activity.id} className="bg-[#1C1C1C] rounded-lg p-4">
                      <p className="font-medium text-white flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            activity.type === "Check-in" ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></span>
                        {activity.type}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(activity.date).toLocaleDateString()} at{" "}
                        {new Date(activity.date).toLocaleTimeString()}
                      </p>
                      <p className="text-sm text-gray-300">Location: {activity.location}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No check-in history</p>
                )}
              </div>
            </div>
          )}
          {activeTab === "finance" && isFullMember && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Finance Transactions</h3>
              <div className="space-y-3">
                {(memberHistoryMain?.[member.id]?.finance || []).length > 0 ? (
                  memberHistoryMain[member.id].finance.map((transaction) => (
                    <div key={transaction.id} className="bg-[#1C1C1C] rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-white">
                            {transaction.type} - {transaction.amount}
                          </p>
                          <p className="text-sm text-gray-400">{transaction.date}</p>
                          <p className="text-sm text-gray-300">{transaction.description}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            transaction.status === "completed"
                              ? "bg-green-600 text-white"
                              : "bg-orange-600 text-white"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No finance transactions</p>
                )}
              </div>
            </div>
          )}
          {activeTab === "contracts" && isFullMember && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Contract Changes</h3>
              <div className="space-y-3">
                {(memberHistoryMain?.[member.id]?.contracts || []).length > 0 ? (
                  memberHistoryMain[member.id].contracts.map((contract) => (
                    <div key={contract.id} className="bg-[#1C1C1C] rounded-lg p-4">
                      <p className="font-medium text-white">{contract.action}</p>
                      <p className="text-sm text-gray-400">
                        {contract.date} by {contract.user}
                      </p>
                      <p className="text-sm text-gray-300">{contract.details}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No contract changes</p>
                )}
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
  );
}
