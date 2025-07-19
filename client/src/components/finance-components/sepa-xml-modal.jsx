/* eslint-disable react/prop-types */
import { Calendar, Download, X, Edit, Info } from "lucide-react"
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
  const [tempAmount, setTempAmount] = useState("")
  const [servicesModalOpen, setServicesModalOpen] = useState(false)
  const [selectedServices, setSelectedServices] = useState([])
  const [selectedStudioName, setSelectedStudioName] = useState("")
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false)
  const [shouldDownload, setShouldDownload] = useState(true)

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

  const handleStartEdit = (id, currentAmount) => {
    setEditingAmount(id)
    setTempAmount(currentAmount.toString())
  }

  const handleSaveAmount = (id) => {
    const newAmount = Number.parseFloat(tempAmount) || 0
    setEditedAmounts((prev) => ({
      ...prev,
      [id]: newAmount,
    }))
    setEditingAmount(null)
    setTempAmount("")
  }

  const handleCancelEdit = () => {
    setEditingAmount(null)
    setTempAmount("")
  }

  const handleGenerateXmlClick = () => {
    setConfirmationModalOpen(true)
  }

  const handleConfirmGeneration = () => {
    const selectedTxs = transactions
      .filter((tx) => selectedTransactions[tx.id])
      .map((tx) => ({
        ...tx,
        amount: editedAmounts[tx.id],
      }))

    const period = isCustomPeriod ? `${customPeriod.startDate} - ${customPeriod.endDate}` : selectedPeriod

    onGenerateXml(selectedTxs, period, shouldDownload)
    setConfirmationModalOpen(false)
    onClose()
  }

  const handleCancelGeneration = () => {
    setConfirmationModalOpen(false)
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

  const handleShowServices = (services, studioName) => {
    setSelectedServices(services)
    setSelectedStudioName(studioName)
    setServicesModalOpen(true)
  }

  if (!isOpen) return null

  const filteredTransactions = transactions.filter((tx) => tx.status === "Pending" || tx.status === "Failed")
  const selectedCount = Object.values(selectedTransactions).filter(v => v).length
  const totalAmount = transactions
    .filter((tx) => selectedTransactions[tx.id])
    .reduce((sum, tx) => sum + (editedAmounts[tx.id] || tx.amount), 0)

  return (
    <div className="fixed inset-0 bg-black/70 flex p-2 items-center justify-center z-50">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-white text-lg font-medium">Run Payment</h2>
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
              <p className="text-gray-300 mb-4 text-sm">
                Review and select transactions to include in the SEPA XML file:
              </p>
              <div className="overflow-x-auto">
                <div className="min-w-[700px]">
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
                      <th className="px-3 py-2 text-left">Amount</th>
                      <th className="px-3 py-2 text-left ">Services</th>
                    </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-gray-800">
                          <td className="px-2 sm:px-3 py-2">
                            <input
                              type="checkbox"
                              className="rounded bg-black border-gray-700"
                              checked={selectedTransactions[tx.id] || false}
                              onChange={() => handleToggleTransaction(tx.id)}
                            />
                          </td>
                          <td className="px-2 sm:px-3 py-2 text-xs sm:text-sm">{tx.memberName}</td>
                          <td className="px-2 sm:px-3 py-2 text-xs sm:text-sm">
                            {new Date(tx.date).toLocaleDateString()}
                          </td>
                          <td className="px-2 sm:px-3 py-2">
                            <span
                              className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                tx.status === "Pending"
                                  ? "bg-yellow-900/30 text-yellow-500"
                                  : "bg-red-900/30 text-red-500"
                              }`}
                            >
                              {tx.status}
                            </span>
                          </td>
                          <td className="px-2 sm:px-3 py-2 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {editingAmount === tx.id ? (
                                <>
                                  <input
                                    type="number"
                                    value={tempAmount}
                                    onChange={(e) => setTempAmount(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") handleSaveAmount(tx.id)
                                      if (e.key === "Escape") handleCancelEdit()
                                    }}
                                    className="bg-black text-white w-16 sm:w-20 px-2 py-1 rounded border border-gray-700 text-right text-xs sm:text-sm"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => handleSaveAmount(tx.id)}
                                    className="p-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="p-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs px-2"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <span
                                    className={`text-xs sm:text-sm ${!selectedTransactions[tx.id] ? "text-gray-500" : "text-white"}`}
                                  >
                                    ${(editedAmounts[tx.id] || tx.amount).toFixed(2)}
                                  </span>
                                  <button
                                    onClick={() => handleStartEdit(tx.id, editedAmounts[tx.id] || tx.amount)}
                                    disabled={!selectedTransactions[tx.id]}
                                    className={`p-1 rounded hover:bg-gray-700 ${
                                      !selectedTransactions[tx.id]
                                        ? "text-gray-600 cursor-not-allowed"
                                        : "text-gray-400 hover:text-white"
                                    }`}
                                  >
                                    <Edit className="w-3 h-3" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-2 sm:px-3 py-2 text-center">
                            <button
                              onClick={() => handleShowServices(tx.services, tx.studioName)}
                              className="text-blue-400 hover:text-blue-300"
                              disabled={!selectedTransactions[tx.id]}
                            >
                              <Info className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-[#141414] p-6 rounded-xl text-center">
              <p className="text-gray-400 text-sm">No pending or failed transactions for this period.</p>
            </div>
          )}
        </div>

        {/* Services Modal */}
        {servicesModalOpen && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
            <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col mx-4">
              <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <h2 className="text-white text-lg font-medium">Services Breakdown</h2>
                <button onClick={() => setServicesModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto flex-grow">
                <div className="mb-4">
                  <h3 className="text-white font-medium mb-2">{selectedStudioName}</h3>
                  <p className="text-gray-400 text-sm">Cost breakdown for this studio</p>
                </div>

                <div className="space-y-3">
                  {selectedServices.map((service, index) => (
                    <div key={index} className="bg-[#141414] p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-white font-medium text-sm">{service.name}</span>
                        <span className="text-white font-semibold text-sm">${service.cost.toFixed(2)}</span>
                      </div>
                      <p className="text-gray-400 text-xs">{service.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold text-sm">Total Amount</span>
                    <span className="text-white font-bold text-lg">
                      ${selectedServices.reduce((sum, service) => sum + service.cost, 0).toFixed(2)} USD
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {confirmationModalOpen && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30">
            <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md mx-4">
              <div className="p-4 border-b border-gray-800">
                <h2 className="text-white text-lg font-medium">Generate SEPA XML</h2>
              </div>

              <div className="p-4">
                <p className="text-gray-300 text-sm mb-4">
                  Are you sure you want to generate the SEPA XML file?
                </p>
                
                <div className="bg-[#141414] p-3 rounded-lg mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Selected transactions:</span>
                    <span className="text-white font-medium">{selectedCount}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Total amount:</span>
                    <span className="text-white font-medium">${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Period:</span>
                    <span className="text-white font-medium">
                      {isCustomPeriod ? `${customPeriod.startDate} - ${customPeriod.endDate}` : selectedPeriod}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="shouldDownload"
                    checked={shouldDownload}
                    onChange={(e) => setShouldDownload(e.target.checked)}
                    className="rounded bg-black border-gray-700"
                  />
                  <label htmlFor="shouldDownload" className="text-sm text-gray-300">
                    Download SEPA XML file automatically
                  </label>
                </div>
              </div>

              <div className="p-4 border-t border-gray-800 flex justify-end gap-3">
                <button
                  onClick={handleCancelGeneration}
                  className="px-4 py-2 rounded-xl text-sm border border-gray-700 text-gray-300 hover:bg-[#141414]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmGeneration}
                  className="px-4 py-2 rounded-xl text-sm bg-[#3F74FF] text-white hover:bg-[#3F74FF]/90 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Generate XML
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm border border-gray-700 text-gray-300 hover:bg-[#141414]"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerateXmlClick}
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