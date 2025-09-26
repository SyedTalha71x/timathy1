/* eslint-disable react/prop-types */
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";

const CheckFundsModal = ({
  isOpen,
  onClose,
  transactions,
  onUpdateStatuses,
}) => {
  const [selectedTransactions, setSelectedTransactions] = useState({});
  const [newStatus, setNewStatus] = useState("Successful");

  useEffect(() => {
    // Initialize with all transactions that have "Check incoming funds" status
    const initialSelected = {};
    transactions.forEach((tx) => {
      if (tx.status === "Check incoming funds") {
        initialSelected[tx.id] = true;
      }
    });
    setSelectedTransactions(initialSelected);
  }, [transactions]);

  const handleToggleTransaction = (id) => {
    setSelectedTransactions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleUpdateStatuses = () => {
    const txToUpdate = Object.keys(selectedTransactions)
      .filter((id) => selectedTransactions[id])
      .map((id) => transactions.find((tx) => tx.id === id))
      .map((tx) => ({
        ...tx,
        status: newStatus,
      }));

    onUpdateStatuses(txToUpdate);
    onClose();
  };

  const handleSelectAll = (selected) => {
    const newSelected = {};
    transactions
      .filter((tx) => tx.status === "Check incoming funds")
      .forEach((tx) => {
        newSelected[tx.id] = selected;
      });
    setSelectedTransactions(newSelected);
  };

  // Helper function to get status display with appropriate styling
  const getStatusDisplay = (transaction) => {
    const isSelected = selectedTransactions[transaction.id];
    const currentStatus = transaction.status === "Check incoming funds" ? "Pending" : transaction.status;
    
    if (isSelected && transaction.status === "Check incoming funds") {
      // Show the new status for selected transactions
      const statusClass = newStatus === "Successful" 
        ? "text-green-400 bg-green-900/20 px-2 py-1 rounded-lg text-xs"
        : "text-red-400 bg-red-900/20 px-2 py-1 rounded-lg text-xs";
      
      return (
        <span className={statusClass}>
          {newStatus}
        </span>
      );
    }
    
    // Show current status
    const statusClass = currentStatus === "Pending"
      ? "text-yellow-400 bg-yellow-900/20 px-2 py-1 rounded-lg text-xs"
      : currentStatus === "Successful"
      ? "text-green-400 bg-green-900/20 px-2 py-1 rounded-lg text-xs"
      : currentStatus === "Failed"
      ? "text-red-400 bg-red-900/20 px-2 py-1 rounded-lg text-xs"
      : "text-gray-400 bg-gray-800/20 px-2 py-1 rounded-lg text-xs";
    
    return (
      <span className={statusClass}>
        {currentStatus}
      </span>
    );
  };

  if (!isOpen) return null;

  const checkingTransactions = transactions.filter(
    (tx) => tx.status === "Check incoming funds"
  );

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-white text-lg font-medium">
            Check Incoming Funds
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-grow">
          {checkingTransactions.length > 0 ? (
            <>
              <div className="flex justify-between mb-4">
                <p className="text-gray-300">
                  Update the status of pending transactions:
                </p>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 text-sm rounded-lg bg-[#141414] text-gray-300 hover:bg-black"
                    onClick={() => handleSelectAll(true)}
                  >
                    Select All
                  </button>
                  <button
                    className="px-3 py-1 text-sm rounded-lg bg-[#141414] text-gray-300 hover:bg-black"
                    onClick={() => handleSelectAll(false)}
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              <div className="mb-4 flex items-center gap-4">
                <span className="text-gray-300">Set selected to:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewStatus("Successful")}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      newStatus === "Successful"
                        ? "bg-green-900/50 text-green-400"
                        : "bg-[#141414] text-gray-300"
                    }`}
                  >
                    Successful
                  </button>
                  <button
                    onClick={() => setNewStatus("Failed")}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      newStatus === "Failed"
                        ? "bg-red-900/50 text-red-400"
                        : "bg-[#141414] text-gray-300"
                    }`}
                  >
                    Failed
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-gray-300 min-w-[500px]">
                  <thead className="text-xs text-gray-400 uppercase bg-[#141414]">
                    <tr>
                      <th className="px-3 py-2 w-12 rounded-tl-lg">
                        <input
                          type="checkbox"
                          className="rounded bg-black border-gray-700"
                          checked={
                            Object.values(selectedTransactions).every((v) => v) &&
                            Object.keys(selectedTransactions).length > 0
                          }
                          onChange={() => {
                            const allSelected =
                              Object.values(selectedTransactions).every(
                                (v) => v
                              ) && Object.keys(selectedTransactions).length > 0;
                            handleSelectAll(!allSelected);
                          }}
                        />
                      </th>
                      <th className="px-3 py-2 text-left">Member</th>
                      <th className="px-3 py-2 text-left">Date</th>
                      <th className="px-3 py-2 text-left">Status</th>
                      <th className="px-3 py-2 text-right rounded-tr-lg">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkingTransactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-gray-800">
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            className="rounded bg-black border-gray-700"
                            checked={selectedTransactions[tx.id] || false}
                            onChange={() => handleToggleTransaction(tx.id)}
                          />
                        </td>
                        <td className="px-3 py-2">{tx.memberName}</td>
                        <td className="px-3 py-2">
                          {new Date(tx.date).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-2">
                          {getStatusDisplay(tx)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(tx.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="bg-[#141414] p-6 rounded-xl text-center">
              <p className="text-gray-400">
                No transactions are pending fund verification.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm border border-gray-700 text-gray-300 hover:bg-[#141414]"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateStatuses}
            className="px-4 py-2 rounded-xl text-sm bg-[#3F74FF] text-white hover:bg-[#3F74FF]/90 flex items-center gap-2"
            disabled={!Object.values(selectedTransactions).some((v) => v)}
          >
            <Check className="w-4 h-4" />
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckFundsModal;