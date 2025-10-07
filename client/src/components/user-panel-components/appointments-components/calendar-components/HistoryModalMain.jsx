/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { X } from "lucide-react";

const HistoryModalMain = ({
  showHistoryModal,
  setShowHistoryModal,
  selectedMember,
  historyTab,
  setHistoryTab,
  memberHistory,
}) => {
  if (!showHistoryModal || !selectedMember) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#181818] rounded-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex text-white justify-between items-center mb-6">
            <h2 className="text-lg font-medium">
              {selectedMember.title} - History & Changelog
            </h2>
            <button
              onClick={() => setShowHistoryModal(false)}
              className="p-2 hover:bg-zinc-700 rounded-lg"
            >
              <X size={16} />
            </button>
          </div>

          {/* History Tab Navigation */}
          <div className="flex border-b border-gray-700 mb-6 overflow-x-auto">
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
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  historyTab === tab.id
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* History Content */}
          <div className="space-y-4">
            {historyTab === "general" && (
              <Section
                title="General Changes"
                data={memberHistory[selectedMember.id]?.general}
                emptyMessage="No general changes recorded"
                renderItem={(item) => (
                  <div key={item.id} className="bg-[#222222] rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-medium">{item.action}</p>
                        <p className="text-gray-400 text-sm mt-1">{item.details}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">{item.date}</p>
                        <p className="text-gray-500 text-xs">by {item.user}</p>
                      </div>
                    </div>
                  </div>
                )}
              />
            )}

            {historyTab === "checkins" && (
              <Section
                title="Check-ins & Check-outs History"
                data={memberHistory[selectedMember.id]?.checkins}
                emptyMessage="No check-in/check-out history"
                renderItem={(item) => (
                  <div key={item.id} className="bg-[#222222] rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            item.type === "Check-in"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <div>
                          <p className="text-white font-medium">{item.type}</p>
                          <p className="text-gray-400 text-sm">{item.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">
                          {new Date(item.date).toLocaleDateString()} at{" "}
                          {new Date(item.date).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              />
            )}

            {historyTab === "appointments" && (
              <Section
                title="Past Appointments History"
                data={memberHistory[selectedMember.id]?.appointments}
                emptyMessage="No past appointments"
                renderItem={(item) => (
                  <div key={item.id} className="bg-[#222222] rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-medium">{item.title}</p>
                        <p className="text-gray-400 text-sm">with {item.trainer}</p>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                            item.status === "completed"
                              ? "bg-green-900 text-green-300"
                              : "bg-yellow-900 text-yellow-300"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">
                          {new Date(item.date).toLocaleDateString()} at{" "}
                          {new Date(item.date).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              />
            )}

            {historyTab === "finance" && (
              <Section
                title="Finance Transactions History"
                data={memberHistory[selectedMember.id]?.finance}
                emptyMessage="No financial transactions"
                renderItem={(item) => (
                  <div key={item.id} className="bg-[#222222] rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-medium">{item.type}</p>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                            item.status === "completed"
                              ? "bg-green-900 text-green-300"
                              : "bg-yellow-900 text-yellow-300"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-semibold">{item.amount}</p>
                        <p className="text-gray-400 text-sm">{item.date}</p>
                      </div>
                    </div>
                  </div>
                )}
              />
            )}

            {historyTab === "contracts" && (
              <Section
                title="Contract Changes History"
                data={memberHistory[selectedMember.id]?.contracts}
                emptyMessage="No contract changes"
                renderItem={(item) => (
                  <div key={item.id} className="bg-[#222222] rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-medium">{item.action}</p>
                        <p className="text-gray-400 text-sm mt-1">{item.details}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">{item.date}</p>
                        <p className="text-gray-500 text-xs">by {item.user}</p>
                      </div>
                    </div>
                  </div>
                )}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, data, emptyMessage, renderItem }) => (
  <div>
    <h3 className="text-md font-semibold text-white mb-4">{title}</h3>
    <div className="space-y-3">
      {data && data.length > 0 ? data.map(renderItem) : <p className="text-gray-400">{emptyMessage}</p>}
    </div>
  </div>
);

export default HistoryModalMain;
