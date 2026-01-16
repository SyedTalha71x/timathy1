/* eslint-disable react/prop-types */
import { useState } from "react"
import { Mail, Download, Printer, X } from "lucide-react"
import { jsPDF } from "jspdf"
import SendEmailModal from "./send-email-modal"

const InvoicePreviewModal = ({ sale, onClose }) => {
  const [showEmailModal, setShowEmailModal] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const hasCustomer = sale.member && sale.member !== "No Member"
    
    // Calculate totals
    let totalNet = 0
    let totalVat19 = 0
    let totalVat7 = 0
    let totalGross = 0
    
    sale.items.forEach(item => {
      const itemTotal = (item.price || 0) * item.quantity
      const vatRate = item.vatRate || 19
      const netAmount = itemTotal / (1 + vatRate / 100)
      const vatAmount = itemTotal - netAmount
      
      totalNet += netAmount
      totalGross += itemTotal
      if (vatRate === 7) {
        totalVat7 += vatAmount
      } else {
        totalVat19 += vatAmount
      }
    })
    
    // Create PDF with receipt width (80mm = ~226 points)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 200] // Receipt width, height will auto-extend
    })
    
    const pageWidth = 80
    const margin = 5
    const contentWidth = pageWidth - (margin * 2)
    let y = 10
    
    // Helper function for centered text
    const centerText = (text, yPos, fontSize = 8) => {
      doc.setFontSize(fontSize)
      const textWidth = doc.getTextWidth(text)
      doc.text(text, (pageWidth - textWidth) / 2, yPos)
    }
    
    // Helper function for dashed line
    const dashedLine = (yPos) => {
      doc.setLineDashPattern([1, 1], 0)
      doc.setDrawColor(150)
      doc.line(margin, yPos, pageWidth - margin, yPos)
    }
    
    // Header - Logo placeholder
    doc.setFillColor(230, 230, 230)
    doc.rect((pageWidth - 20) / 2, y, 20, 20, 'F')
    doc.setFontSize(6)
    doc.setTextColor(128)
    centerText('LOGO', y + 11)
    y += 25
    
    // Studio name
    doc.setTextColor(0)
    doc.setFont('helvetica', 'bold')
    centerText('Fitness Studio Pro', y, 14)
    y += 6
    
    // Address
    doc.setFont('helvetica', 'normal')
    centerText('123 Fitness Street, Health City 12345', y, 7)
    y += 4
    centerText('VAT ID: DE123456789', y, 7)
    y += 6
    
    dashedLine(y)
    y += 6
    
    // Receipt info
    doc.setFontSize(8)
    doc.text('Invoice:', margin, y)
    doc.text(String(sale.id), pageWidth - margin, y, { align: 'right' })
    y += 4
    
    doc.text('Date:', margin, y)
    doc.text(sale.date, pageWidth - margin, y, { align: 'right' })
    y += 4
    
    doc.text('Terminal:', margin, y)
    doc.text('Fitness Studio Pro', pageWidth - margin, y, { align: 'right' })
    y += 4
    
    if (hasCustomer) {
      doc.text('Member:', margin, y)
      doc.text(sale.member, pageWidth - margin, y, { align: 'right' })
      y += 4
    }
    
    y += 2
    dashedLine(y)
    y += 6
    
    // Items
    sale.items.forEach(item => {
      const itemTotal = (item.price || 0) * item.quantity
      const vatRate = item.vatRate || 19
      const netAmount = itemTotal / (1 + vatRate / 100)
      const vatAmount = itemTotal - netAmount
      
      // Item name
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      const itemName = item.name.length > 30 ? item.name.substring(0, 30) + '...' : item.name
      doc.text(itemName, margin, y)
      y += 4
      
      // Quantity x Price = Total
      doc.setFont('helvetica', 'normal')
      doc.text(`${item.quantity} x $${(item.price || 0).toFixed(2)}`, margin, y)
      doc.text(`$${itemTotal.toFixed(2)}`, pageWidth - margin, y, { align: 'right' })
      y += 4
      
      // Net and VAT
      doc.setFontSize(6)
      doc.setTextColor(100)
      doc.text(`Net: $${netAmount.toFixed(2)} | VAT ${vatRate}%: $${vatAmount.toFixed(2)}`, margin, y)
      doc.setTextColor(0)
      y += 5
    })
    
    y += 2
    dashedLine(y)
    y += 6
    
    // Totals
    doc.setFontSize(8)
    doc.text('Net:', margin, y)
    doc.text(`$${totalNet.toFixed(2)}`, pageWidth - margin, y, { align: 'right' })
    y += 4
    
    if (totalVat19 > 0) {
      doc.text('VAT 19%:', margin, y)
      doc.text(`$${totalVat19.toFixed(2)}`, pageWidth - margin, y, { align: 'right' })
      y += 4
    }
    
    if (totalVat7 > 0) {
      doc.text('VAT 7%:', margin, y)
      doc.text(`$${totalVat7.toFixed(2)}`, pageWidth - margin, y, { align: 'right' })
      y += 4
    }
    
    y += 2
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text('TOTAL:', margin, y)
    doc.text(`$${totalGross.toFixed(2)}`, pageWidth - margin, y, { align: 'right' })
    y += 6
    
    dashedLine(y)
    y += 6
    
    // Payment method
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.text('Payment Method:', margin, y)
    doc.text(sale.paymentMethod, pageWidth - margin, y, { align: 'right' })
    y += 6
    
    dashedLine(y)
    y += 6
    
    // Footer
    doc.setTextColor(100)
    centerText('Thank you for your purchase!', y, 8)
    
    // Save PDF
    doc.save(`receipt-${sale.id}.pdf`)
  }

  return (
    <>
      {showEmailModal && (
        <SendEmailModal
          sale={sale}
          onClose={() => setShowEmailModal(false)}
        />
      )}

      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100000000] p-2 sm:p-4">
        <div className="bg-[#161616] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header - Responsive */}
          <div className="sticky top-0 bg-gray-100 p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 border-b">
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">E-Invoice Preview</h3>
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setShowEmailModal(true)}
                className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
                title="Send Invoice via Email"
              >
                <Mail size={18} />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
                title="Download Invoice"
              >
                <Download size={18} />
              </button>
              <button
                onClick={handlePrint}
                className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
                title="Print Invoice"
              >
                <Printer size={18} />
              </button>
              <button
                onClick={onClose}
                className="p-2 cursor-pointer text-black hover:bg-gray-800 rounded-lg hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-6">
            {/* Invoice Document Preview - Receipt Style */}
            <div className="bg-white border border-gray-300 rounded-lg p-4 sm:p-6 w-full max-w-[320px] sm:max-w-[400px] mx-auto shadow-lg font-mono text-xs sm:text-sm">

              {/* Logo & Header */}
              <div className="text-center border-b border-dashed border-gray-400 pb-3 mb-3">
                {/* Dummy Logo */}
                <div className="w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-3 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-xs sm:text-sm">LOGO</span>
                </div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">Fitness Studio Pro</h1>
                <p className="text-gray-600 text-[10px] sm:text-xs">123 Fitness Street, Health City 12345</p>
                <p className="text-gray-600 text-[10px] sm:text-xs">VAT ID: DE123456789</p>
              </div>

              {/* Invoice Info */}
              <div className="border-b border-dashed border-gray-400 pb-3 mb-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Invoice:</span>
                  <span className="text-gray-900 font-semibold">{sale.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="text-gray-900">{sale.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Terminal:</span>
                  <span className="text-gray-900">Fitness Studio Pro</span>
                </div>
                {sale.member && sale.member !== "No Member" && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member:</span>
                    <span className="text-gray-900">{sale.member}</span>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="border-b border-dashed border-gray-400 pb-3 mb-3">
                {sale.items.map((item, idx) => {
                  const itemTotal = (item.price || 0) * item.quantity
                  const vatRate = item.vatRate || 19
                  const netAmount = itemTotal / (1 + vatRate / 100)
                  const vatAmount = itemTotal - netAmount
                  return (
                    <div key={idx} className="mb-2">
                      <div className="text-gray-900 font-medium truncate">{item.name}</div>
                      <div className="flex justify-between text-gray-600">
                        <span>{item.quantity} x ${(item.price || 0).toFixed(2)}</span>
                        <span className="text-gray-900">${itemTotal.toFixed(2)}</span>
                      </div>
                      <div className="text-gray-500 text-[10px] sm:text-xs">
                        Net: ${netAmount.toFixed(2)} | VAT {vatRate}%: ${vatAmount.toFixed(2)}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Totals */}
              <div className="border-b border-dashed border-gray-400 pb-3 mb-3">
                {(() => {
                  let totalNet = 0
                  let totalVat19 = 0
                  let totalVat7 = 0
                  let totalGross = 0
                  
                  sale.items.forEach(item => {
                    const itemTotal = (item.price || 0) * item.quantity
                    const vatRate = item.vatRate || 19
                    const netAmount = itemTotal / (1 + vatRate / 100)
                    const vatAmount = itemTotal - netAmount
                    
                    totalNet += netAmount
                    totalGross += itemTotal
                    if (vatRate === 7) {
                      totalVat7 += vatAmount
                    } else {
                      totalVat19 += vatAmount
                    }
                  })
                  
                  return (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Net:</span>
                        <span className="text-gray-900">${totalNet.toFixed(2)}</span>
                      </div>
                      {totalVat19 > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">VAT 19%:</span>
                          <span className="text-gray-900">${totalVat19.toFixed(2)}</span>
                        </div>
                      )}
                      {totalVat7 > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">VAT 7%:</span>
                          <span className="text-gray-900">${totalVat7.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-sm sm:text-base mt-1">
                        <span className="text-gray-900">TOTAL:</span>
                        <span className="text-gray-900">${totalGross.toFixed(2)}</span>
                      </div>
                    </>
                  )
                })()}
              </div>

              {/* Payment Method */}
              <div className="border-b border-dashed border-gray-400 pb-3 mb-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="text-gray-900">{sale.paymentMethod}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-gray-500 text-[10px] sm:text-xs">
                <p>Thank you for your purchase!</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default InvoicePreviewModal
