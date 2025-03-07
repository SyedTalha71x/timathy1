/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Download, X } from "lucide-react"
import { useEffect, useState } from "react"

const SepaXmlModal = ({ isOpen, onClose, selectedPeriod, transactions, onGenerateXml, onUpdateStatus }) => {
    const [selectedTransactions, setSelectedTransactions] = useState({})
    const [editedAmounts, setEditedAmounts] = useState({})
    
    useEffect(() => {
      // Initialize selected transactions (only Pending and Failed)
      const initialSelected = {}
      const initialAmounts = {}
      
      transactions.forEach(tx => {
        if (tx.status === "Pending" || tx.status === "Failed") {
          initialSelected[tx.id] = true
          initialAmounts[tx.id] = tx.amount
        }
      })
      
      setSelectedTransactions(initialSelected)
      setEditedAmounts(initialAmounts)
    }, [transactions])
    
    const handleToggleTransaction = (id) => {
      setSelectedTransactions(prev => ({
        ...prev,
        [id]: !prev[id]
      }))
    }
    
    const handleAmountChange = (id, amount) => {
      setEditedAmounts(prev => ({
        ...prev,
        [id]: parseFloat(amount) || 0
      }))
    }
    
    const handleGenerateXml = () => {
      const selectedTxs = transactions.filter(tx => selectedTransactions[tx.id])
        .map(tx => ({
          ...tx,
          amount: editedAmounts[tx.id]
        }))
      
      onGenerateXml(selectedTxs)
      onClose()
    }
    
    if (!isOpen) return null
    
    const filteredTransactions = transactions.filter(tx => 
      tx.status === "Pending" || tx.status === "Failed"
    )
    
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-[#1C1C1C] rounded-xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-white text-lg font-medium">Generate SEPA XML - {selectedPeriod}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto flex-grow">
            {filteredTransactions.length > 0 ? (
              <>
                <p className="text-gray-300 mb-4">
                  Review and select transactions to include in the SEPA XML file:
                </p>
                <table className="w-full text-sm text-gray-300">
                  <thead className="text-xs text-gray-400 uppercase bg-[#141414]">
                    <tr>
                      <th className="px-3 py-2 w-12 rounded-tl-lg">
                        <input 
                          type="checkbox" 
                          className="rounded bg-black border-gray-700"
                          checked={Object.values(selectedTransactions).every(v => v)}
                          onChange={() => {
                            const allSelected = Object.values(selectedTransactions).every(v => v)
                            const newState = {}
                            filteredTransactions.forEach(tx => {
                              newState[tx.id] = !allSelected
                            })
                            setSelectedTransactions(newState)
                          }}
                        />
                      </th>
                      <th className="px-3 py-2 text-left">Member</th>
                      <th className="px-3 py-2 text-left">Date</th>
                      <th className="px-3 py-2 text-left">Status</th>
                      <th className="px-3 py-2 text-right rounded-tr-lg">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map(tx => (
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
                        <td className="px-3 py-2">{new Date(tx.date).toLocaleDateString()}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            tx.status === "Pending" ? "bg-yellow-900/30 text-yellow-500" : "bg-red-900/30 text-red-500"
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <input 
                            type="number" 
                            value={editedAmounts[tx.id] || tx.amount}
                            onChange={(e) => handleAmountChange(tx.id, e.target.value)}
                            className="bg-black text-white w-24 px-2 py-1 rounded border border-gray-700 text-right"
                            disabled={!selectedTransactions[tx.id]}
                          />
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
              disabled={!Object.values(selectedTransactions).some(v => v)}
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