"use client"

/* eslint-disable react/prop-types */
import { Calendar, Download, X, Edit } from "lucide-react"
import { useEffect, useState } from "react"

// eslint-disable-next-line no-unused-vars
const SepaXmlModal = ({ isOpen, onClose, selectedPeriod, transactions, onGenerateXml, onUpdateStatus }) => {
  const [selectedTransactions, setSelectedTransactions] = useState({})
  const [editedAmounts, setEditedAmounts] = useState({})
  const [customPeriod, setCustomPeriod] = useState({
    startDate: "",
    endDate: "",
  })
  const [isCustomPeriod, setIsCustomPeriod] = useState(false)
  const [editingAmount, setEditingAmount] = useState(null)

  useEffect(() => {
    // Initialize selected transactions (only Pending and Failed)
    const initialSelected = {}
    const initialAmounts = {}

    transactions.forEach((tx) => {
      if (tx.status === "Pending" || tx.status === "Failed") {
        initialSelected[tx.id] = true
        initialAmounts[tx.id] = tx.amount
      }
    })

    setSelectedTransactions(initialSelected)
    setEditedAmounts(initialAmounts)
    setEditingAmount(null) // Reset editing state

    // Reset custom period when modal opens
    setIsCustomPeriod(false)
  }, [transactions])

  const handleToggleTransaction = (id) => {
    setSelectedTransactions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleAmountChange = (id, amount) => {
    setEditedAmounts((prev) => ({
      ...prev,
      [id]: Number.parseFloat(amount) || 0,
    }))
  }

  const handleGenerateXml = () => {
    const selectedTxs = transactions
      .filter((tx) => selectedTransactions[tx.id])
      .map((tx) => ({
        ...tx,
        amount: editedAmounts[tx.id],
      }))

    const period = isCustomPeriod ? `${customPeriod.startDate} - ${customPeriod.endDate}` : selectedPeriod

    onGenerateXml(selectedTxs, period)
    onClose()
  }

  const toggleCustomPeriod = () => {
    if (!isCustomPeriod) {
      // Initialize with today's date if empty
      const today = new Date().toISOString().split("T")[0]
      setCustomPeriod((prev) => ({
        startDate: prev.startDate || today,
        endDate: prev.endDate || today,
      }))
    }
    setIsCustomPeriod(!isCustomPeriod)
  }

  if (!isOpen) return null

  const filteredTransactions = transactions.filter((tx) => tx.status === "Pending" || tx.status === "Failed")

  return (
    <div className="fixed inset-0 bg-black/70 flex p-2 items-center justify-center z-50">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-white text-lg font-medium">Generate SEPA XML</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-gray-300">Period:</span>
              {isCustomPeriod ? (
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={customPeriod.startDate}
                    onChange={(e) => setCustomPeriod((prev) => ({ ...prev, startDate: e.target.value }))}
                    className="bg-black text-white px-2 py-1 rounded border border-gray-700 w-36"
                  />
                  <span className="text-gray-400">—</span>
                  <input
                    type="date"
                    value={customPeriod.endDate}
                    onChange={(e) => setCustomPeriod((prev) => ({ ...prev, endDate: e.target.value }))}
                    className="bg-black text-white px-2 py-1 rounded border border-gray-700 w-36"
                  />
                </div>
              ) : (
                <span className="text-white font-medium">{selectedPeriod}</span>
              )}
            </div>
            <button
              onClick={toggleCustomPeriod}
              className="flex items-center gap-1 text-sm text-gray-300 hover:text-white"
            >
              <Calendar className="w-4 h-4" />
              {isCustomPeriod ? "Use Default Period" : "Custom Period"}
            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto flex-grow">
          {filteredTransactions.length > 0 ? (
            <>
              <p className="text-gray-300 mb-4">Review and select transactions to include in the SEPA XML file:</p>
              <table className="w-full text-sm text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-[#141414]">
                  <tr>
                    <th className="px-3 py-2 w-12 rounded-tl-lg">
                      <input
                        type="checkbox"
                        className="rounded bg-black border-gray-700"
                        checked={Object.values(selectedTransactions).every((v) => v)}
                        onChange={() => {
                          const allSelected = Object.values(selectedTransactions).every((v) => v)
                          const newState = {}
                          filteredTransactions.forEach((tx) => {
                            newState[tx.id] = !allSelected
                          })
                          setSelectedTransactions(newState)
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
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-800">
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          className="rounded bg-black border-gray-700"
                          checked={selectedTransactions[tx.id] || false}
                          onChange={() => handleToggleTransaction(tx.id)}
                        />
                      </td>
                      <td className="px-3 py-2">{tx.studioName}</td>
                      <td className="px-3 py-2">{tx.studioOwner}</td>
                      <td className="px-3 py-2">{new Date(tx.date).toLocaleDateString()}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            tx.status === "Pending" ? "bg-yellow-900/30 text-yellow-500" : "bg-red-900/30 text-red-500"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {editingAmount === tx.id ? (
                            <input
                              type="number"
                              value={editedAmounts[tx.id] || tx.amount}
                              onChange={(e) => handleAmountChange(tx.id, e.target.value)}
                              onBlur={() => setEditingAmount(null)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") setEditingAmount(null)
                                if (e.key === "Escape") setEditingAmount(null)
                              }}
                              className="bg-black text-white w-20 px-2 py-1 rounded border border-gray-700 text-right"
                              disabled={!selectedTransactions[tx.id]}
                              autoFocus
                            />
                          ) : (
                            <span className={`${!selectedTransactions[tx.id] ? "text-gray-500" : "text-white"}`}>
                              ${(editedAmounts[tx.id] || tx.amount).toFixed(2)}
                            </span>
                          )}
                          <button
                            onClick={() => setEditingAmount(tx.id)}
                            disabled={!selectedTransactions[tx.id]}
                            className={`p-1 rounded hover:bg-gray-700 ${
                              !selectedTransactions[tx.id]
                                ? "text-gray-600 cursor-not-allowed"
                                : "text-gray-400 hover:text-white"
                            }`}
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <div className="bg-[#141414] p-6 rounded-xl text-center">
              <p className="text-gray-400">No pending or failed transactions for this period.</p>
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
            onClick={handleGenerateXml}
            className="px-4 py-2 rounded-xl text-sm bg-[#3F74FF] text-white hover:bg-[#3F74FF]/90 flex items-center gap-2"
            disabled={!Object.values(selectedTransactions).some((v) => v)}
          >
            <Download className="w-4 h-4" />
            Generate SEPA XML
          </button>
        </div>
      </div>
    </div>
  )
}

export default SepaXmlModal
