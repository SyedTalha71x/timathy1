/* eslint-disable react/prop-types */
import { useState } from "react"
import { Mail, Download, Printer, X } from "lucide-react"
import SendEmailModal from "./send-email-modal"

const InvoicePreviewModal = ({ sale, onClose }) => {
  const [showEmailModal, setShowEmailModal] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
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
    <>
      {showEmailModal && (
        <SendEmailModal
          sale={sale}
          onClose={() => setShowEmailModal(false)}
        />
      )}

      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-2 sm:p-4">
        <div className="bg-[#161616] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="sticky top-0 bg-gray-100 p-3 sm:p-4 flex justify-between items-center border-b">
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">E-Invoice Preview</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEmailModal(true)}
                className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
                title="Send Invoice via Email"
              >
                <Mail size={18} />
              </button>
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
              <button
                onClick={onClose}
                className="p-2 cursor-pointer text-black hover:bg-gray-800 rounded-lg hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6">
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
    </>
  )
}

export default InvoicePreviewModal
