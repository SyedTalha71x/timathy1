/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { X } from "lucide-react";

export default function StudioHistoryModalMain({
  show,
  studio,
  studioHistoryMain,
  historyTabMain,
  setHistoryTabMain,
  onClose,
}) {
  if (!show || !studio) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#181818] rounded-xl text-white p-3 sm:p-4 md:p-6 w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] md:max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold">
            Studio History - {studio.name}
          </h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:space-x-1 space-y-1 sm:space-y-0 bg-[#141414] rounded-lg p-1">
            {["general", "contract", "finance", "tickets"].map((tab) => (
              <button
                key={tab}
                onClick={() => setHistoryTabMain(tab)}
                className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm transition-colors ${
                  historyTabMain === tab
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {tab === "general" && "General Changes"}
                {tab === "contract" && "Contract Changes"}
                {tab === "finance" && "Finance Transactions"}
                {tab === "tickets" && "Ticket Changelog"}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-[#141414] rounded-xl p-3 sm:p-4">
          {historyTabMain === "general" && (
            <Section
              title="General Changes"
              data={studioHistoryMain[studio.id]?.general}
              render={(item) => (
                <>
                  <p className="font-medium text-white text-sm sm:text-base">
                    {item.action}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {item.date} by {item.user}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-300">
                    {item.details}
                  </p>
                </>
              )}
            />
          )}

          {historyTabMain === "contract" && (
            <Section
              title="Contract Changes"
              data={studioHistoryMain[studio.id]?.contract}
              render={(change) => (
                <>
                  <p className="font-medium text-white text-sm sm:text-base">
                    {change.action}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {change.date} by {change.user}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-300">
                    {change.details}
                  </p>
                </>
              )}
            />
          )}

          {historyTabMain === "finance" && (
            <Section
              title="Finance Transactions"
              data={studioHistoryMain[studio.id]?.finance}
              render={(transaction) => (
                <>
                  <p className="font-medium text-white text-sm sm:text-base">
                    {transaction.type} - {transaction.amount}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {transaction.date}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-300">
                    {transaction.description}
                  </p>
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

          {historyTabMain === "tickets" && (
            <Section
              title="Ticket Changelog"
              data={studioHistoryMain[studio.id]?.tickets}
              render={(ticket) => (
                <>
                  <p className="font-medium text-white text-sm sm:text-base">
                    {ticket.title}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {ticket.date} — {ticket.status}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-300">
                    {ticket.description}
                  </p>
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
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
        {title}
      </h3>
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
