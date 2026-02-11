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
      <div className="bg-surface-card rounded-xl text-content-primary p-4 md:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            History - {member.firstName} {member.lastName}
          </h2>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="flex space-x-1 mb-6 bg-surface-dark rounded-lg p-1">
          <button
            onClick={() => handleTabChange("general")}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              activeTab === "general" ? "bg-primary text-white" : "text-content-muted hover:text-content-primary"
            }`}
          >
            General Changes
          </button>
          <button
            onClick={() => handleTabChange("appointments")}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              activeTab === "appointments" ? "bg-primary text-white" : "text-content-muted hover:text-content-primary"
            }`}
          >
            Appointments
          </button>
          {isFullMember && (
            <>
              <button
                onClick={() => handleTabChange("checkins")}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  activeTab === "checkins" ? "bg-primary text-white" : "text-content-muted hover:text-content-primary"
                }`}
              >
                Check-ins
              </button>
              <button
                onClick={() => handleTabChange("finance")}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  activeTab === "finance" ? "bg-primary text-white" : "text-content-muted hover:text-content-primary"
                }`}
              >
                Finance
              </button>
              <button
                onClick={() => handleTabChange("contracts")}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  activeTab === "contracts" ? "bg-primary text-white" : "text-content-muted hover:text-content-primary"
                }`}
              >
                Contracts
              </button>
            </>
          )}
        </div>
        <div className="bg-surface-dark rounded-xl p-4">
          {activeTab === "general" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">General Changes</h3>
              <div className="space-y-3">
                {generalChanges.map((change) => (
                  <div key={change.id} className="bg-surface-base rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-content-primary">{change.field} Changed</p>
                        <p className="text-sm text-content-muted">
                          {change.date} at {change.time} by {change.changedBy}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm">
                      <p className="text-content-secondary">
                        <span className="text-accent-red">From:</span> {change.oldValue}
                      </p>
                      <p className="text-content-secondary">
                        <span className="text-accent-green">To:</span> {change.newValue}
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
                  <div key={activity.id} className="bg-surface-base rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-content-primary flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              activity.status === "Completed"
                                ? "bg-accent-green"
                                : activity.status === "Scheduled"
                                  ? "bg-accent-blue"
                                  : "bg-accent-red"
                            }`}
                          ></span>
                          {activity.action}
                        </p>
                        <p className="text-sm text-content-muted">
                          {activity.date} at {activity.time} by {activity.bookedBy}
                        </p>
                        <p className="text-sm text-content-secondary">
                          Type: {activity.appointmentType} • Date: {activity.appointmentDate} at {activity.appointmentTime}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs text-white ${
                          activity.status === "Completed"
                            ? "bg-accent-green"
                            : activity.status === "Scheduled"
                              ? "bg-accent-blue"
                              : "bg-accent-red"
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
                    <div key={activity.id} className="bg-surface-base rounded-lg p-4">
                      <p className="font-medium text-content-primary flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            activity.type === "Check-in" ? "bg-accent-green" : "bg-accent-red"
                          }`}
                        ></span>
                        {activity.type}
                      </p>
                      <p className="text-sm text-content-muted">
                        {new Date(activity.date).toLocaleDateString()} at{" "}
                        {new Date(activity.date).toLocaleTimeString()}
                      </p>
                      <p className="text-sm text-content-secondary">Location: {activity.location}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-content-muted text-sm">No check-in history</p>
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
                    <div key={transaction.id} className="bg-surface-base rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-content-primary">
                            {transaction.type} - {transaction.amount}
                          </p>
                          <p className="text-sm text-content-muted">{transaction.date}</p>
                          <p className="text-sm text-content-secondary">{transaction.description}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs text-white ${
                            transaction.status === "completed"
                              ? "bg-accent-green"
                              : "bg-accent-yellow"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-content-muted text-sm">No finance transactions</p>
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
                    <div key={contract.id} className="bg-surface-base rounded-lg p-4">
                      <p className="font-medium text-content-primary">{contract.action}</p>
                      <p className="text-sm text-content-muted">
                        {contract.date} by {contract.user}
                      </p>
                      <p className="text-sm text-content-secondary">{contract.details}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-content-muted text-sm">No contract changes</p>
                )}
              </div>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-6 bg-surface-button hover:bg-surface-button-hover text-content-primary px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
