/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { X } from "lucide-react"; 

const HistoryModal = ({
  show,
  onClose,
  selectedMember,
  historyTab,
  setHistoryTab,
  memberHistory,
}) => {
  if (!show || !selectedMember) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#181818] rounded-xl text-white p-4 md:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            History - {selectedMember.firstName} {selectedMember.lastName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-[#141414] rounded-lg p-1">
          {[
            { id: "general", label: "General Changes" },
            { id: "checkins", label: "Check-ins & Check-outs" },
            { id: "appointments", label: "Past Appointments" },
            { id: "finance", label: "Finance Transactions" },
            { id: "contracts", label: "Contract Changes" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setHistoryTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                historyTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-[#141414] rounded-xl p-4">
          {historyTab === "general" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">General Changes</h3>
              <div className="space-y-3">
                {memberHistory[selectedMember.id]?.general?.map((change) => (
                  <div
                    key={change.id}
                    className="bg-[#1C1C1C] rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-white">{change.action}</p>
                        <p className="text-sm text-gray-400">
                          {change.date} by {change.user}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300">{change.details}</p>
                  </div>
                )) || (
                  <p className="text-gray-400">No general changes recorded</p>
                )}
              </div>
            </div>
          )}

          {historyTab === "checkins" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Check-ins & Check-outs
              </h3>
              <div className="space-y-3">
                {memberHistory[selectedMember.id]?.checkins?.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-[#1C1C1C] rounded-lg p-4"
                  >
                    <p className="font-medium text-white flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          activity.type === "Check-in"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                      {activity.type}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(activity.date).toLocaleDateString()} at{" "}
                      {new Date(activity.date).toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-gray-300">
                      Location: {activity.location}
                    </p>
                  </div>
                )) || (
                  <p className="text-gray-400">No check-in/check-out history</p>
                )}
              </div>
            </div>
          )}

          {historyTab === "appointments" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Past Appointments</h3>
              <div className="space-y-3">
                {memberHistory[selectedMember.id]?.appointments?.map(
                  (appointment) => (
                    <div
                      key={appointment.id}
                      className="bg-[#1C1C1C] rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-white">
                            {appointment.title}
                          </p>
                          <p className="text-sm text-gray-400">
                            {new Date(appointment.date).toLocaleDateString()} at{" "}
                            {new Date(appointment.date).toLocaleTimeString()}{" "}
                            with {appointment.trainer}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            appointment.status === "completed"
                              ? "bg-green-600 text-white"
                              : "bg-orange-600 text-white"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  )
                ) || <p className="text-gray-400">No past appointments</p>}
              </div>
            </div>
          )}

          {historyTab === "finance" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Finance Transactions
              </h3>
              <div className="space-y-3">
                {memberHistory[selectedMember.id]?.finance?.map(
                  (transaction) => (
                    <div
                      key={transaction.id}
                      className="bg-[#1C1C1C] rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-white">
                            {transaction.type} - {transaction.amount}
                          </p>
                          <p className="text-sm text-gray-400">
                            {transaction.date}
                          </p>
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
                      <p className="text-sm text-gray-300">
                        {transaction.description}
                      </p>
                    </div>
                  )
                ) || (
                  <p className="text-gray-400">No financial transactions</p>
                )}
              </div>
            </div>
          )}

          {historyTab === "contracts" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Contract Changes</h3>
              <div className="space-y-3">
                {memberHistory[selectedMember.id]?.contracts?.map(
                  (contract) => (
                    <div
                      key={contract.id}
                      className="bg-[#1C1C1C] rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-white">
                            {contract.action}
                          </p>
                          <p className="text-sm text-gray-400">
                            {contract.date} by {contract.user}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300">{contract.details}</p>
                    </div>
                  )
                ) || <p className="text-gray-400">No contract changes</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
