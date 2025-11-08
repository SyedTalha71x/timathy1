
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X, FileText, Download, Printer, Mail, Send, Search } from "lucide-react"
import { useEffect, useState } from "react"
import CancelSaleConfirmationModal from "./cancel-sale-confirmation-modal"
import InvoicePreviewModal from "./invoice-preview-modal"




const SalesJournalModal = ({ salesHistory, onClose, cancelSale, downloadInvoice, salesFilter, setSalesFilter }) => {
  const [filteredSales, setFilteredSales] = useState(salesHistory)
  const [saleToCancel, setSaleToCancel] = useState(null)
  const [invoiceToView, setInvoiceToView] = useState(null)

  useEffect(() => {
    let filtered = salesHistory

    // Filter by type
    if (salesFilter.type !== "all") {
      filtered = filtered.filter((sale) =>
        sale.items.some((item) => (item.type || "").toLowerCase() === salesFilter.type.toLowerCase()),
      )
    }

    // Filter by member
    if (salesFilter.member) {
      filtered = filtered.filter((sale) => sale.member.toLowerCase().includes(salesFilter.member.toLowerCase()))
    }

    // Filter by date range
    if (salesFilter.dateFrom) {
      filtered = filtered.filter((sale) => new Date(sale.date) >= new Date(salesFilter.dateFrom))
    }

    if (salesFilter.dateTo) {
      filtered = filtered.filter((sale) => new Date(sale.date) <= new Date(salesFilter.dateTo))
    }

    setFilteredSales(filtered)
  }, [salesHistory, salesFilter])

  const handleExportToExcel = () => {
    // Create CSV content (Excel can open CSV files)
    const headers = ["Member", "Member Type", "Date", "Items", "Type", "Total", "Payment Method"]
    const csvContent = [
      headers.join(","),
      ...filteredSales.map((sale) =>
        [
          `"${sale.member}"`,
          `"${sale.memberType}"`,
          sale.date,
          `"${sale.items.map((item) => `${item.name} x${item.quantity}`).join("; ")}"`,
          `"${sale.items.map((item) => item.type).join("; ")}"`,
          sale.totalAmount.toFixed(2),
          sale.paymentMethod,
        ].join(","),
      ),
    ].join("\n")

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `sales-journal-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleCancelSaleClick = (sale) => {
    setSaleToCancel(sale)
  }

  const handleConfirmCancel = () => {
    if (saleToCancel) {
      cancelSale(saleToCancel.id)
      setSaleToCancel(null)
    }
  }

  const handleViewInvoice = (sale) => {
    setInvoiceToView(sale)
  }

  return (
    <>
      {saleToCancel && (
        <CancelSaleConfirmationModal
          sale={saleToCancel}
          onConfirm={handleConfirmCancel}
          onClose={() => setSaleToCancel(null)}
        />
      )}

      {invoiceToView && <InvoicePreviewModal sale={invoiceToView} onClose={() => setInvoiceToView(null)} />}

      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-[#181818] rounded-xl w-full max-w-[95vw] sm:max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
          <div className="p-3 sm:p-6 border-b border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-2xl font-bold text-white">Sales Journal</h2>
              <div className="flex gap-2 items-center">
                <button
                  onClick={handleExportToExcel}
                  className="px-3 sm:px-4 py-2 bg-gray-600 rounded-lg text-white text-xs sm:text-sm flex items-center gap-2"
                  title="Export to Excel"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Export Excel</span>
                </button>
                <button onClick={onClose} className="p-2 hover:bg-zinc-700 rounded-lg text-white">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm text-zinc-400 mb-1">Type</label>
                <select
                  value={salesFilter.type}
                  onChange={(e) => setSalesFilter({ ...salesFilter, type: e.target.value })}
                  className="w-full p-2 bg-black rounded-lg text-white text-xs sm:text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="service">Service</option>
                  <option value="product">Product</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm text-zinc-400 mb-1">Member</label>
                <input
                  type="text"
                  value={salesFilter.member}
                  onChange={(e) => setSalesFilter({ ...salesFilter, member: e.target.value })}
                  placeholder="Search member..."
                  className="w-full p-2 bg-black rounded-lg text-white text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm text-zinc-400 mb-1">From Date</label>
                <input
                  type="date"
                  value={salesFilter.dateFrom}
                  onChange={(e) => setSalesFilter({ ...salesFilter, dateFrom: e.target.value })}
                  className="w-full p-2 bg-black rounded-lg text-white text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm text-zinc-400 mb-1">To Date</label>
                <input
                  type="date"
                  value={salesFilter.dateTo}
                  onChange={(e) => setSalesFilter({ ...salesFilter, dateTo: e.target.value })}
                  className="w-full p-2 bg-black rounded-lg text-white text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[50vh] sm:max-h-[60vh]">
            <table className="w-full min-w-[800px]">
              <thead className="bg-black sticky top-0">
                <tr>
                  <th className="text-left p-2 sm:p-4 text-zinc-400 text-xs sm:text-sm">Member</th>
                  <th className="text-left p-2 sm:p-4 text-zinc-400 text-xs sm:text-sm">Date</th>
                  <th className="text-left p-2 sm:p-4 text-zinc-400 text-xs sm:text-sm">Items</th>
                  <th className="text-left p-2 sm:p-4 text-zinc-400 text-xs sm:text-sm">Type</th>
                  <th className="text-left p-2 sm:p-4 text-zinc-400 text-xs sm:text-sm">Total</th>
                  <th className="text-left p-2 sm:p-4 text-zinc-400 text-xs sm:text-sm">Payment</th>
                  <th className="text-left p-2 sm:p-4 text-zinc-400 text-xs sm:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="border-b border-gray-700 hover:bg-zinc-800/50">
                    <td className="p-2 sm:p-4">
                      <div className="text-white text-xs sm:text-sm">{sale.member}</div>
                      <div className="text-zinc-400 text-xs">{sale.memberType}</div>
                    </td>
                    <td className="p-2 sm:p-4 text-zinc-300 text-xs sm:text-sm">{sale.date}</td>
                    <td className="p-2 sm:p-4">
                      <div className="space-y-1">
                        {sale.items.map((item, idx) => (
                          <div key={idx} className="text-xs sm:text-sm">
                            <span className="text-white">{item.name}</span>
                            <span className="text-zinc-400 ml-2">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-2 sm:p-4">
                      <div className="space-y-1">
                        {sale.items.map((item, idx) => (
                          <div key={idx} className="text-xs mt-3">
                            <span className="px-1 sm:px-2 py-1  rounded text-xs bg-gray-600 text-white">
                              {item.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-2 sm:p-4 text-white font-semibold text-xs sm:text-sm">
                      ${sale.totalAmount.toFixed(2)}
                    </td>
                    <td className="p-2 sm:p-4 text-zinc-300 text-xs sm:text-sm">{sale.paymentMethod}</td>
                    <td className="p-2 sm:p-4">
                      <div className="flex gap-1 sm:gap-2">
                        <button
                          onClick={() => handleViewInvoice(sale)}
                          className="p-1 sm:p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-xs flex items-center justify-center"
                          title="View E-Invoice"
                        >
                          <FileText size={16} />
                        </button>
                        {sale.canCancel && (
                          <button
                            onClick={() => handleCancelSaleClick(sale)}
                            className="p-1 sm:p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-xs flex items-center justify-center"
                            title="Cancel Sale (24h limit)"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredSales.length === 0 && (
              <div className="text-center py-8 text-zinc-400 text-sm">No sales found matching the current filters.</div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default SalesJournalModal
