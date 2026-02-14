/* eslint-disable react/prop-types */
import { useState } from "react"
import { Mail, Download, Printer, X } from "lucide-react"
import { jsPDF } from "jspdf"
import SendEmailModal from "../../shared/communication/SendEmailModal"
import { formatCurrency, getCurrencySymbol } from "../../../utils/studio-states/selling-states"

const InvoicePreviewModal = ({ sale, onClose }) => {
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    body: "",
  })
  const currencySymbol = getCurrencySymbol()

  // Prepare preselected member from sale data
  const preselectedMember = sale.member && sale.member !== "No Member" ? {
    id: sale.id,
    email: sale.email || "",
    firstName: sale.member.split(" ")[0] || "",
    lastName: sale.member.split(" ")[1] || "",
    name: sale.member,
  } : null

  // Open email modal with pre-filled data
  const openEmailModal = () => {
    setEmailData({
      to: sale.email || "",
      subject: `Invoice #${sale.invoiceNumber || sale.id}`,
      body: `<p>Dear ${sale.member},</p><p><br></p><p>Please find attached your invoice for the recent purchase.</p><p><br></p><p><strong>Invoice Details:</strong></p><ul><li>Invoice #: ${sale.invoiceNumber || sale.id}</li><li>Date: ${sale.date}</li><li>Total Amount: ${formatCurrency(sale.totalAmount)}</li></ul><p><br></p><p>Thank you for your business!</p><p><br></p><p>Best regards,<br>Your Business Team</p>`,
    })
    setShowEmailModal(true)
  }

  // Search handler (basic - returns sale member if matches)
  const handleSearchMemberForEmail = (query) => {
    if (!query || !preselectedMember) return []
    const q = query.toLowerCase()
    if (preselectedMember.name.toLowerCase().includes(q) || (preselectedMember.email && preselectedMember.email.toLowerCase().includes(q))) {
      return [preselectedMember]
    }
    return []
  }

  // Send handler
  const handleSendEmail = (data) => {
    console.log("Sending invoice email:", data)
    setShowEmailModal(false)
  }

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
      doc.text(`${item.quantity} x ${currencySymbol}${(item.price || 0).toFixed(2)}`, margin, y)
      doc.text(`${currencySymbol}${itemTotal.toFixed(2)}`, pageWidth - margin, y, { align: 'right' })
      y += 4
      
      // Net and VAT
      doc.setFontSize(6)
      doc.setTextColor(100)
      doc.text(`Net: ${currencySymbol}${netAmount.toFixed(2)} | VAT ${vatRate}%: ${currencySymbol}${vatAmount.toFixed(2)}`, margin, y)
      doc.setTextColor(0)
      y += 5
    })
    
    y += 2
    dashedLine(y)
    y += 6
    
    // Totals
    doc.setFontSize(8)
    doc.text('Net:', margin, y)
    doc.text(`${currencySymbol}${totalNet.toFixed(2)}`, pageWidth - margin, y, { align: 'right' })
    y += 4
    
    if (totalVat19 > 0) {
      doc.text('VAT 19%:', margin, y)
      doc.text(`${currencySymbol}${totalVat19.toFixed(2)}`, pageWidth - margin, y, { align: 'right' })
      y += 4
    }
    
    if (totalVat7 > 0) {
      doc.text('VAT 7%:', margin, y)
      doc.text(`${currencySymbol}${totalVat7.toFixed(2)}`, pageWidth - margin, y, { align: 'right' })
      y += 4
    }
    
    y += 2
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text('TOTAL:', margin, y)
    doc.text(`${currencySymbol}${totalGross.toFixed(2)}`, pageWidth - margin, y, { align: 'right' })
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
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100000000] p-2 sm:p-4">
        <div className="bg-surface-dark rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header - Fixed: Title and icons on same line */}
          <div className="sticky top-0 bg-surface-card p-3 sm:p-4 flex justify-between items-center border-b">
            <h3 className="font-semibold text-content-primary text-base sm:text-lg">E-Invoice Preview</h3>
            <div className="flex gap-2 items-center">
              <button
                onClick={openEmailModal}
                className="p-2 bg-surface-button hover:bg-surface-button-hover rounded-lg text-content-secondary transition-colors"
                title="Send Invoice via Email"
              >
                <Mail size={18} />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 bg-surface-button hover:bg-surface-button-hover rounded-lg text-content-secondary transition-colors"
                title="Download Invoice"
              >
                <Download size={18} />
              </button>
              <button
                onClick={handlePrint}
                className="p-2 bg-surface-button hover:bg-surface-button-hover rounded-lg text-content-secondary transition-colors"
                title="Print Invoice"
              >
                <Printer size={18} />
              </button>
              <button
                onClick={onClose}
                className="p-2 cursor-pointer text-content-primary hover:bg-surface-hover rounded-lg hover:text-content-primary transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-6">
            {/* Invoice Document Preview - Receipt Style */}
            <div className="bg-white border border-border rounded-lg p-4 sm:p-6 w-full max-w-[320px] sm:max-w-[400px] mx-auto shadow-lg font-mono text-xs sm:text-sm">

              {/* Logo & Header */}
              <div className="text-center border-b border-dashed border-border pb-3 mb-3">
                {/* Dummy Logo */}
                <div className="w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-3 bg-surface-dark rounded-lg flex items-center justify-center">
                  <span className="text-content-faint text-xs sm:text-sm">LOGO</span>
                </div>
                <h1 className="text-lg sm:text-2xl font-bold text-content-primary mb-1">Fitness Studio Pro</h1>
                <p className="text-content-faint text-[10px] sm:text-xs">123 Fitness Street, Health City 12345</p>
                <p className="text-content-faint text-[10px] sm:text-xs">VAT ID: DE123456789</p>
              </div>

              {/* Invoice Info */}
              <div className="border-b border-dashed border-border pb-3 mb-3">
                <div className="flex justify-between">
                  <span className="text-content-faint">Invoice:</span>
                  <span className="text-content-primary font-semibold">{sale.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-faint">Date:</span>
                  <span className="text-content-primary">{sale.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-faint">Terminal:</span>
                  <span className="text-content-primary">Fitness Studio Pro</span>
                </div>
                {sale.member && sale.member !== "No Member" && (
                  <div className="flex justify-between">
                    <span className="text-content-faint">Member:</span>
                    <span className="text-content-primary">{sale.member}</span>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="border-b border-dashed border-border pb-3 mb-3">
                {sale.items.map((item, idx) => {
                  const itemTotal = (item.price || 0) * item.quantity
                  const vatRate = item.vatRate || 19
                  const netAmount = itemTotal / (1 + vatRate / 100)
                  const vatAmount = itemTotal - netAmount
                  return (
                    <div key={idx} className="mb-2">
                      <div className="text-content-primary font-medium truncate">{item.name}</div>
                      <div className="flex justify-between text-content-faint">
                        <span>{item.quantity} x {formatCurrency(item.price || 0)}</span>
                        <span className="text-content-primary">{formatCurrency(itemTotal)}</span>
                      </div>
                      <div className="text-content-faint text-[10px] sm:text-xs">
                        Net: {formatCurrency(netAmount)} | VAT {vatRate}%: {formatCurrency(vatAmount)}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Totals */}
              <div className="border-b border-dashed border-border pb-3 mb-3">
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
                        <span className="text-content-faint">Net:</span>
                        <span className="text-content-primary">{formatCurrency(totalNet)}</span>
                      </div>
                      {totalVat19 > 0 && (
                        <div className="flex justify-between">
                          <span className="text-content-faint">VAT 19%:</span>
                          <span className="text-content-primary">{formatCurrency(totalVat19)}</span>
                        </div>
                      )}
                      {totalVat7 > 0 && (
                        <div className="flex justify-between">
                          <span className="text-content-faint">VAT 7%:</span>
                          <span className="text-content-primary">{formatCurrency(totalVat7)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-sm sm:text-base mt-1">
                        <span className="text-content-primary">TOTAL:</span>
                        <span className="text-content-primary">{formatCurrency(totalGross)}</span>
                      </div>
                    </>
                  )
                })()}
              </div>

              {/* Payment Method */}
              <div className="border-b border-dashed border-border pb-3 mb-3">
                <div className="flex justify-between">
                  <span className="text-content-faint">Payment Method:</span>
                  <span className="text-content-primary">{sale.paymentMethod}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-content-faint text-[10px] sm:text-xs">
                <p>Thank you for your purchase!</p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {showEmailModal && (
        <div className="fixed inset-0" style={{ zIndex: 200000000 }}>
          <SendEmailModal
            showEmailModal={showEmailModal}
            handleCloseEmailModal={() => setShowEmailModal(false)}
            handleSendEmail={handleSendEmail}
            emailData={emailData}
            setEmailData={setEmailData}
            handleSearchMemberForEmail={handleSearchMemberForEmail}
            preselectedMember={preselectedMember}
          />
        </div>
      )}
    </>
  )
}

export default InvoicePreviewModal
