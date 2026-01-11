/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { X } from "lucide-react";

export default function StaffHistoryModalMain({
    isOpen,
    selectedStaff,
    staffHistory,
    historyTabMain,
    setHistoryTabMain,
    onClose
}) {
  if (!isOpen || !selectedStaff) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-[1000000] flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#181818] rounded-xl text-white p-3 sm:p-4 md:p-6 w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] md:max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold">
            History - {selectedStaff.firstName} {selectedStaff.lastName}
          </h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:space-x-1 space-y-1 sm:space-y-0 bg-[#141414] rounded-lg p-1">
            {["general", "checkins", "appointments", "finance", "contracts"].map((tab) => (
              <button
                key={tab}
                onClick={() => setHistoryTabMain(tab)}
                className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm transition-colors ${
                  historyTabMain === tab ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
                }`}
              >
                {tab === "general" && "General Changes"}
                {tab === "checkins" && "Check-ins & Check-outs"}
                {tab === "appointments" && "Past Appointments"}
                {tab === "finance" && "Finance Transactions"}
                {tab === "contracts" && "Contract Changes"}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#141414] rounded-xl p-3 sm:p-4">
          {historyTabMain === "general" && (
            <Section
              title="General Changes"
              data={staffHistory[selectedStaff.id]?.general}
              render={(change) => (
                <>
                  <p className="font-medium text-white text-sm sm:text-base">{change.action}</p>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {change.date} by {change.user}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-300">{change.details}</p>
                </>
              )}
            />
          )}

          {historyTabMain === "checkins" && (
            <Section
              title="Check-ins & Check-outs"
              data={staffHistory[selectedStaff.id]?.checkins}
              render={(activity) => (
                <>
                  <p className="font-medium text-white flex items-center gap-2 text-sm sm:text-base">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "Check-in" ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    {activity.type}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {new Date(activity.date).toLocaleDateString()} at{" "}
                    {new Date(activity.date).toLocaleTimeString()}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-300">Location: {activity.location}</p>
                </>
              )}
            />
          )}

          {historyTabMain === "appointments" && (
            <Section
              title="Past Appointments"
              data={staffHistory[selectedStaff.id]?.appointments}
              render={(appointment) => (
                <>
                  <p className="font-medium text-white text-sm sm:text-base">{appointment.title}</p>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {new Date(appointment.date).toLocaleDateString()} at{" "}
                    {new Date(appointment.date).toLocaleTimeString()} with {appointment.trainer}
                  </p>
                  <span
                    className={`px-2 py-1 rounded text-xs self-start sm:self-auto ${
                      appointment.status === "completed"
                        ? "bg-green-600 text-white"
                        : "bg-orange-600 text-white"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </>
              )}
            />
          )}

          {historyTabMain === "finance" && (
            <Section
              title="Finance Transactions"
              data={staffHistory[selectedStaff.id]?.finance}
              render={(transaction) => (
                <>
                  <p className="font-medium text-white text-sm sm:text-base">
                    {transaction.type} - {transaction.amount}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400">{transaction.date}</p>
                  <p className="text-xs sm:text-sm text-gray-300">{transaction.description}</p>
                  <span
                    className={`px-2 py-1 rounded text-xs self-start sm:self-auto ${
                      transaction.status === "completed"
                        ? "bg-green-600 text-white"
                        : "bg-orange-600 text-white"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </>
              )}
            />
          )}

          {historyTabMain === "contracts" && (
            <Section
              title="Contract Changes"
              data={staffHistory[selectedStaff.id]?.contracts}
              render={(contract) => (
                <>
                  <p className="font-medium text-white text-sm sm:text-base">{contract.action}</p>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {contract.date} by {contract.user}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-300">{contract.details}</p>
                </>
              )}
            />
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-4 sm:mt-6 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm w-full sm:w-auto"
        >
          Close
        </button>
      </div>
    </div>
  );
}

/** Reusable Section Component */
function Section({ title, data, render }) {
  return (
    <div>
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{title}</h3>
      <div className="space-y-3">
        {data?.length > 0 ? (
          data.map((item) => (
            <div key={item.id} className="bg-[#1C1C1C] rounded-lg p-3 sm:p-4">
              {render(item)}
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No {title.toLowerCase()}</p>
        )}
      </div>
    </div>
  );
}
