/* eslint-disable react/prop-types */
import { Check, X } from "lucide-react"
import { useEffect, useState } from "react"

const CheckFundsModal = ({ isOpen, onClose, transactions, onUpdateStatuses }) => {
  const [transactionStatuses, setTransactionStatuses] = useState({})

  useEffect(() => {
    // Initialize with all transactions that have "Check incoming funds" status
    const initialStatuses = {}
    transactions.forEach((tx) => {
      if (tx.status === "Check incoming funds") {
        initialStatuses[tx.id] = "Successful" // Default status for each transaction
      }
    })
    setTransactionStatuses(initialStatuses)
  }, [transactions])

  const handleStatusChange = (id, status) => {
    setTransactionStatuses((prev) => ({
      ...prev,
      [id]: status,
    }))
  }

  const handleUpdateStatuses = () => {
    const txToUpdate = Object.keys(transactionStatuses)
      .map((id) => transactions.find((tx) => tx.id === id))
      .map((tx) => ({
        ...tx,
        status: transactionStatuses[tx.id],
      }))

    onUpdateStatuses(txToUpdate)
    onClose()
  }

  const handleSelectAll = (status) => {
    const newStatuses = {}
    transactions
      .filter((tx) => tx.status === "Check incoming funds")
      .forEach((tx) => {
        newStatuses[tx.id] = status
      })
    setTransactionStatuses(newStatuses)
  }

  const handleToggleTransaction = (id, selected) => {
    if (selected) {
      // Add transaction with default status
      setTransactionStatuses((prev) => ({
        ...prev,
        [id]: "Successful",
      }))
    } else {
      // Remove transaction
      setTransactionStatuses((prev) => {
        const newStatuses = { ...prev }
        delete newStatuses[id]
        return newStatuses
      })
    }
  }

  if (!isOpen) return null

  const checkingTransactions = transactions.filter((tx) => tx.status === "Check incoming funds")
  const selectedCount = Object.keys(transactionStatuses).length

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-white text-lg font-medium">Check Incoming Funds</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-grow">
          {checkingTransactions.length > 0 ? (
            <>
              <div className="flex justify-between mb-4">
                <p className="text-gray-300">Update the status of pending transactions:</p>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 text-sm rounded-lg bg-[#141414] text-gray-300 hover:bg-black"
                    onClick={() => handleSelectAll("Successful")}
                  >
                    Mark All Successful
                  </button>
                  <button
                    className="px-3 py-1 text-sm rounded-lg bg-[#141414] text-gray-300 hover:bg-black"
                    onClick={() => handleSelectAll("Failed")}
                  >
                    Mark All Failed
                  </button>
                </div>
              </div>

              <table className="w-full text-sm text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-[#141414]">
                  <tr>
                    <th className="px-3 py-2 w-12 rounded-tl-lg">
                      <input
                        type="checkbox"
                        className="rounded bg-black border-gray-700"
                        checked={selectedCount === checkingTransactions.length && selectedCount > 0}
                        onChange={() => {
                          const allSelected = selectedCount === checkingTransactions.length && selectedCount > 0
                          if (allSelected) {
                            // Deselect all
                            setTransactionStatuses({})
                          } else {
                            // Select all with default status
                            handleSelectAll("Successful")
                          }
                        }}
                      />
                    </th>
                    <th className="px-3 py-2 text-left">Studio</th>
                    <th className="px-3 py-2 text-left">Studio Owner</th>
                    <th className="px-3 py-2 text-left">Date</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-right rounded-tr-lg">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {checkingTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-800">
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          className="rounded bg-black border-gray-700"
                          checked={!!transactionStatuses[tx.id]}
                          onChange={(e) => handleToggleTransaction(tx.id, e.target.checked)}
                        />
                      </td>
                      <td className="px-3 py-2">{tx.studioName}</td>
                      <td className="px-3 py-2">{tx.studioOwner}</td>
                      <td className="px-3 py-2">{new Date(tx.date).toLocaleDateString()}</td>
                      <td className="px-3 py-2">
                        {transactionStatuses[tx.id] && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusChange(tx.id, "Successful")}
                              className={`px-2 py-1 rounded text-xs ${
                                transactionStatuses[tx.id] === "Successful" 
                                  ? "bg-green-900/50 text-green-400" 
                                  : "bg-[#141414] text-gray-300 hover:bg-black"
                              }`}
                            >
                              Successful
                            </button>
                            <button
                              onClick={() => handleStatusChange(tx.id, "Failed")}
                              className={`px-2 py-1 rounded text-xs ${
                                transactionStatuses[tx.id] === "Failed" 
                                  ? "bg-red-900/50 text-red-400" 
                                  : "bg-[#141414] text-gray-300 hover:bg-black"
                              }`}
                            >
                              Failed
                            </button>
                          </div>
                        )}
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
            </>
          ) : (
            <div className="bg-[#141414] p-6 rounded-xl text-center">
              <p className="text-gray-400">No transactions are pending fund verification.</p>
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
            disabled={selectedCount === 0}
          >
            <Check className="w-4 h-4" />
            Update Status ({selectedCount})
          </button>
        </div>
      </div>
    </div>
  )
}

export default CheckFundsModal