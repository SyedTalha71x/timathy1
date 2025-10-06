/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X, FileText, XCircle, Download, Printer } from "lucide-react"
import { useEffect, useState } from "react"

const CancelSaleConfirmationModal = ({ sale, onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
      <div className="bg-[#2F2F2F] rounded-xl w-full max-w-md">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-white font-semibold text-lg">Confirm Sale Cancellation</h3>
        </div>
        <div className="p-4">
          <p className="text-white mb-3">Are you sure you want to cancel this sale?</p>
          <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-3 mb-4">
            <p className="text-yellow-200 text-sm font-medium mb-2">⚠️ Important Notice:</p>
            <p className="text-yellow-100 text-sm">
              Credit card payments that have already been processed cannot be cancelled. Only the journal entry will be
              removed.
            </p>
          </div>
          <div className="bg-black rounded-lg p-3 mb-4">
            <p className="text-gray-400 text-sm">
              Member: <span className="text-white">{sale.member}</span>
            </p>
            <p className="text-gray-400 text-sm">
              Total: <span className="text-white">${sale.totalAmount.toFixed(2)}</span>
            </p>
            <p className="text-gray-400 text-sm">
              Payment: <span className="text-white">{sale.paymentMethod}</span>
            </p>
          </div>
        </div>
        <div className="p-4 border-t border-gray-700 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white text-sm">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm">
            Confirm Cancellation
          </button>
        </div>
      </div>
    </div>
  )
}

const InvoicePreviewModal = ({ sale, onClose }) => {
  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Create invoice content
    const invoiceContent = `
INVOICE
========================================

Invoice #: ${sale.id}
Date: ${sale.date}

CUSTOMER INFORMATION
----------------------------------------
Member: ${sale.member}
Member Type: ${sale.memberType}

ITEMS
----------------------------------------
${sale.items.map((item, idx) => `${idx + 1}. ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)} (${item.type})`).join("\n")}

PAYMENT DETAILS
----------------------------------------
Subtotal: $${sale.totalAmount.toFixed(2)}
Payment Method: ${sale.paymentMethod}

Total Amount: $${sale.totalAmount.toFixed(2)}

========================================
Thank you for your business!
    `.trim()

    const blob = new Blob([invoiceContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `invoice-${sale.id}.txt`
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-2 sm:p-4">
      <div className="bg-[#161616] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-gray-100 p-3 sm:p-4 flex justify-between items-center border-b">
          <h3 className="font-semibold text-gray-900 text-base sm:text-lg">E-Invoice Preview</h3>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
              title="Download Invoice"
            >
              <Download size={18} />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 bg-green-600 hover:bg-green-700 rounded-lg text-white"
              title="Print Invoice"
            >
              <Printer size={18} />
            </button>
            <button onClick={onClose} className="p-2 cursor-pointer text-black hover:bg-gray-800 rounded-lg hover:text-white">
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar  p-4 sm:p-6">
          {/* Invoice Document Preview */}
          <div className="bg-white border border-gray-300 rounded-lg p-6 sm:p-8 max-w-[210mm] mx-auto shadow-lg">
            {/* Invoice Header */}
            <div className="border-b-2 border-gray-800 pb-4 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-gray-600">
                    Invoice #: <span className="font-semibold text-gray-900">{sale.id}</span>
                  </p>
                  <p className="text-gray-600">
                    Date: <span className="font-semibold text-gray-900">{sale.date}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-2">
                Customer Information
              </h2>
              <div className="text-sm">
                <p className="text-gray-600 mb-1">
                  Member: <span className="font-semibold text-gray-900">{sale.member}</span>
                </p>
                <p className="text-gray-600">
                  Member Type: <span className="font-semibold text-gray-900">{sale.memberType}</span>
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-2">Items</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="text-left p-2 text-gray-700">#</th>
                    <th className="text-left p-2 text-gray-700">Item</th>
                    <th className="text-left p-2 text-gray-700">Type</th>
                    <th className="text-center p-2 text-gray-700">Qty</th>
                    <th className="text-right p-2 text-gray-700">Price</th>
                    <th className="text-right p-2 text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-200">
                      <td className="p-2 text-gray-600">{idx + 1}</td>
                      <td className="p-2 text-gray-900 font-medium">{item.name}</td>
                      <td className="p-2 text-gray-600">{item.type}</td>
                      <td className="p-2 text-center text-gray-600">{item.quantity}</td>
                      <td className="p-2 text-right text-gray-600">${(item.price || 0).toFixed(2)}</td>
                      <td className="p-2 text-right text-gray-900 font-semibold">
                        ${((item.price || 0) * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Payment Summary */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-2">
                Payment Details
              </h2>
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-900 font-semibold">${sale.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="text-gray-900 font-semibold">{sale.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t-2 border-gray-800 pt-2 mt-2">
                    <span className="text-gray-900">Total Amount:</span>
                    <span className="text-gray-900">${sale.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-300 pt-4 mt-8 text-center">
              <p className="text-gray-600 text-sm">Thank you for your business!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const SalesJournalModal = ({ salesHistory, onClose, cancelSale, downloadInvoice, salesFilter, setSalesFilter }) => {
  const [filteredSales, setFilteredSales] = useState(salesHistory)
  const [saleToCancel, setSaleToCancel] = useState(null)
  const [invoiceToView, setInvoiceToView] = useState(null)

  useEffect(() => {
    let filtered = salesHistory

    // Filter by type
    if (salesFilter.type !== "all") {
      filtered = filtered.filter((sale) =>
        sale.items.some((item) => item.type.toLowerCase() === salesFilter.type.toLowerCase()),
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
