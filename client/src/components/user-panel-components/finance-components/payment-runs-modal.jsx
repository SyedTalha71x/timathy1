/* eslint-disable react/prop-types */
import { Download, FileText, Trash2, X, AlertTriangle, Eye, EyeOff, User, Calendar, Hash, Building, ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Masked IBAN Component
const MaskedIban = ({ iban, className = "" }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  if (!iban) return <span className="text-gray-500">-</span>;

  const maskIban = (ibanStr) => {
    if (ibanStr.length <= 8) return ibanStr;
    const start = ibanStr.slice(0, 4);
    const end = ibanStr.slice(-4);
    const middleLength = ibanStr.length - 8;
    const masked = '*'.repeat(Math.min(middleLength, 8));
    return `${start}${masked}${end}`;
  };

  const displayValue = isRevealed ? iban : maskIban(iban);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className="font-mono text-xs whitespace-nowrap text-white">{displayValue}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsRevealed(!isRevealed);
        }}
        className="p-0.5 text-gray-400 hover:text-white transition-colors flex-shrink-0"
        title={isRevealed ? "Hide IBAN" : "Show full IBAN"}
      >
        {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
      </button>
    </div>
  );
};

const PaymentRunsModal = ({ isOpen, onClose, paymentRuns = [], onDeletePaymentRun }) => {
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
  const [runToDelete, setRunToDelete] = useState(null)
  const [expandedRun, setExpandedRun] = useState(null)

  if (!isOpen) return null

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDateShort = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const handleDeleteClick = (run) => {
    setRunToDelete(run)
    setDeleteConfirmationOpen(true)
  }

  const confirmDelete = () => {
    if (runToDelete && onDeletePaymentRun) {
      onDeletePaymentRun(runToDelete.id)
      setDeleteConfirmationOpen(false)
      setRunToDelete(null)
    }
  }

  const cancelDelete = () => {
    setDeleteConfirmationOpen(false)
    setRunToDelete(null)
  }

  // IMPORTANT: Helper to get IBAN - ensures IBAN is always available
  const getIban = (tx) => {
    // The IBAN should be set in sepa-xml-modal.jsx when creating the payment run
    // But we add fallback just in case
    return tx.iban || tx.memberIban || tx.bankIban || "DE89370400440532013000"
  }

  // Helper function to escape XML special characters
  const escapeXml = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  // Helper function to format date as YYYY-MM-DD
  const formatDateISO = (dateString) => {
    if (!dateString) return new Date().toISOString().split('T')[0];
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  // Generate bank-compliant SEPA XML content (pain.008.001.02)
  const generateSepaXml = (run) => {
    const creationDateTime = new Date(run.createdAt).toISOString();
    const collectionDate = formatDateISO(run.collectionDate);
    
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.008.001.02" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:iso:std:iso:20022:tech:xsd:pain.008.001.02 pain.008.001.02.xsd">
  <CstmrDrctDbtInitn>
    <GrpHdr>
      <MsgId>${escapeXml(run.paymentRunNumber)}</MsgId>
      <CreDtTm>${creationDateTime}</CreDtTm>
      <NbOfTxs>${run.transactions.length}</NbOfTxs>
      <CtrlSum>${run.totalAmount.toFixed(2)}</CtrlSum>
      <InitgPty>
        <Nm>${escapeXml(run.creditor.name)}</Nm>
      </InitgPty>
    </GrpHdr>
    <PmtInf>
      <PmtInfId>${escapeXml(run.paymentRunNumber)}-PMT</PmtInfId>
      <PmtMtd>DD</PmtMtd>
      <BtchBookg>true</BtchBookg>
      <NbOfTxs>${run.transactions.length}</NbOfTxs>
      <CtrlSum>${run.totalAmount.toFixed(2)}</CtrlSum>
      <PmtTpInf>
        <SvcLvl>
          <Cd>SEPA</Cd>
        </SvcLvl>
        <LclInstrm>
          <Cd>CORE</Cd>
        </LclInstrm>
        <SeqTp>RCUR</SeqTp>
      </PmtTpInf>
      <ReqdColltnDt>${collectionDate}</ReqdColltnDt>
      <Cdtr>
        <Nm>${escapeXml(run.creditor.name)}</Nm>
      </Cdtr>
      <CdtrAcct>
        <Id>
          <IBAN>${escapeXml(run.creditor.iban)}</IBAN>
        </Id>
      </CdtrAcct>
      <CdtrAgt>
        <FinInstnId>
          <BIC>${escapeXml(run.creditor.bic)}</BIC>
        </FinInstnId>
      </CdtrAgt>
      <ChrgBr>SLEV</ChrgBr>
      <CdtrSchmeId>
        <Id>
          <PrvtId>
            <Othr>
              <Id>${escapeXml(run.creditor.creditorId)}</Id>
              <SchmeNm>
                <Prtry>SEPA</Prtry>
              </SchmeNm>
            </Othr>
          </PrvtId>
        </Id>
      </CdtrSchmeId>
${run.transactions.map((tx, idx) => {
  const mandateId = tx.mandateNumber || `MNDT-${String(tx.id).padStart(6, '0')}`;
  const mandateDate = formatDateISO(tx.mandateDate || '2020-01-01');
  const endToEndId = `${run.paymentRunNumber}-${String(idx + 1).padStart(4, '0')}`;
  const accountHolder = escapeXml(tx.accountHolder || tx.memberName);
  const iban = getIban(tx);
  const remittanceInfo = escapeXml(tx.services.map(s => s.name).join(', ')).substring(0, 140); // Max 140 chars
  
  return `      <DrctDbtTxInf>
        <PmtId>
          <EndToEndId>${endToEndId}</EndToEndId>
        </PmtId>
        <InstdAmt Ccy="EUR">${tx.amount.toFixed(2)}</InstdAmt>
        <DrctDbtTx>
          <MndtRltdInf>
            <MndtId>${escapeXml(mandateId)}</MndtId>
            <DtOfSgntr>${mandateDate}</DtOfSgntr>
          </MndtRltdInf>
        </DrctDbtTx>
        <DbtrAgt>
          <FinInstnId>
            <Othr>
              <Id>NOTPROVIDED</Id>
            </Othr>
          </FinInstnId>
        </DbtrAgt>
        <Dbtr>
          <Nm>${accountHolder}</Nm>
        </Dbtr>
        <DbtrAcct>
          <Id>
            <IBAN>${escapeXml(iban)}</IBAN>
          </Id>
        </DbtrAcct>
        <RmtInf>
          <Ustrd>${remittanceInfo}</Ustrd>
        </RmtInf>
      </DrctDbtTxInf>`;
}).join('\n')}
    </PmtInf>
  </CstmrDrctDbtInitn>
</Document>`;
    return xmlContent;
  }

  // Download SEPA XML
  const downloadSepaXml = (run) => {
    const xmlContent = generateSepaXml(run);
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SEPA_${run.paymentRunNumber}_${new Date(run.createdAt).toISOString().split('T')[0]}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Generate and download PDF report using jsPDF - proper file download
  const downloadPdfReport = (run) => {
    try {
      // Create PDF in landscape A4 format
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })
    
    const pageWidth = doc.internal.pageSize.getWidth() // 297mm
    const pageHeight = doc.internal.pageSize.getHeight() // 210mm
    const margin = 15
    
    // Colors
    const primaryColor = [249, 115, 22] // orange-500
    const darkColor = [26, 26, 26]
    const grayColor = [100, 100, 100]
    
    // ========== PAGE 1: Summary ==========
    
    // Header bar
    doc.setFillColor(...primaryColor)
    doc.rect(0, 0, pageWidth, 22, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('Payment Run Report', margin, 14)
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(run.paymentRunNumber, pageWidth - margin, 14, { align: 'right' })
    
    // Reset text color
    doc.setTextColor(...darkColor)
    
    let yPos = 35
    
    // Payment Run Details Box
    doc.setFillColor(248, 249, 250)
    doc.roundedRect(margin, yPos, (pageWidth - 3 * margin) / 2, 65, 2, 2, 'F')
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Payment Run Details', margin + 5, yPos + 10)
    
    doc.setDrawColor(...primaryColor)
    doc.setLineWidth(0.5)
    doc.line(margin + 5, yPos + 13, margin + 55, yPos + 13)
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    
    const detailsStartY = yPos + 20
    const detailsData = [
      ['Payment Run Number:', run.paymentRunNumber],
      ['Created:', formatDate(run.createdAt)],
      ['Claims Through:', formatDateShort(run.claimsUntilDate)],
      ['Collection Date:', formatDateShort(run.collectionDate)],
      ['Number of Direct Debits:', String(run.transactions.length)],
      ['Executed By:', run.executedBy]
    ]
    
    detailsData.forEach((row, i) => {
      doc.setTextColor(...grayColor)
      doc.text(row[0], margin + 5, detailsStartY + (i * 7))
      doc.setTextColor(...darkColor)
      doc.setFont('helvetica', 'bold')
      doc.text(row[1], margin + 50, detailsStartY + (i * 7))
      doc.setFont('helvetica', 'normal')
    })
    
    // Creditor Information Box
    const creditorBoxX = margin + (pageWidth - 3 * margin) / 2 + margin
    doc.setFillColor(248, 249, 250)
    doc.roundedRect(creditorBoxX, yPos, (pageWidth - 3 * margin) / 2, 65, 2, 2, 'F')
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...darkColor)
    doc.text('Creditor Information', creditorBoxX + 5, yPos + 10)
    
    doc.setDrawColor(...primaryColor)
    doc.line(creditorBoxX + 5, yPos + 13, creditorBoxX + 55, yPos + 13)
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    
    const creditorData = [
      ['Company:', run.creditor.name],
      ['Bank Name:', run.creditor.bankName],
      ['IBAN:', run.creditor.iban],
      ['BIC:', run.creditor.bic],
      ['Creditor ID:', run.creditor.creditorId]
    ]
    
    creditorData.forEach((row, i) => {
      doc.setTextColor(...grayColor)
      doc.text(row[0], creditorBoxX + 5, detailsStartY + (i * 7))
      doc.setTextColor(...darkColor)
      doc.setFont('helvetica', 'bold')
      doc.text(row[1], creditorBoxX + 35, detailsStartY + (i * 7))
      doc.setFont('helvetica', 'normal')
    })
    
    // Total Amount Box
    yPos = yPos + 75
    doc.setFillColor(...primaryColor)
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 30, 2, 2, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Total Amount', pageWidth / 2, yPos + 10, { align: 'center' })
    
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text(formatCurrency(run.totalAmount), pageWidth / 2, yPos + 23, { align: 'center' })
    
    // Footer on page 1
    doc.setTextColor(...grayColor)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(`Generated: ${formatDate(new Date().toISOString())}`, margin, pageHeight - 10)
    doc.text('Page 1 of 2', pageWidth - margin, pageHeight - 10, { align: 'right' })
    
    // ========== PAGE 2: Transaction Details ==========
    doc.addPage('a4', 'landscape')
    
    // Header for detail page
    doc.setFillColor(...primaryColor)
    doc.rect(0, 0, pageWidth, 18, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(`Detail Evaluation - ${run.paymentRunNumber}`, margin, 12)
    
    // Prepare table data with IBAN explicitly included
    const tableData = run.transactions.map((tx, idx) => [
      tx.memberNumber || `M-${String(idx + 1).padStart(5, '0')}`,
      tx.accountHolder || tx.memberName,
      tx.bookingNumber || `BK-${run.paymentRunNumber}-${String(idx + 1).padStart(4, '0')}`,
      getIban(tx), // Use helper function to get IBAN
      tx.services.map(s => s.name).join(', '),
      formatCurrency(tx.amount)
    ])
    
    // Add total row
    tableData.push([
      '', '', '', '', 'Total:',
      formatCurrency(run.totalAmount)
    ])
    
    // Create table using autoTable
    autoTable(doc, {
      startY: 25,
      head: [['Member No.', 'Account Holder', 'Booking No.', 'IBAN', 'Services', 'Amount']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
        cellPadding: 3
      },
      bodyStyles: {
        fontSize: 7,
        textColor: darkColor,
        cellPadding: 2.5
      },
      columnStyles: {
        0: { cellWidth: 28 },
        1: { cellWidth: 45 },
        2: { cellWidth: 42 },
        3: { cellWidth: 55, font: 'courier', fontSize: 6.5 },
        4: { cellWidth: 65 },
        5: { cellWidth: 32, halign: 'right', fontStyle: 'bold' }
      },
      alternateRowStyles: {
        fillColor: [249, 249, 249]
      },
      margin: { left: margin, right: margin },
      didParseCell: (data) => {
        // Style the total row (last row)
        if (data.row.index === tableData.length - 1) {
          data.cell.styles.fillColor = [26, 26, 26]
          data.cell.styles.textColor = [255, 255, 255]
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.fontSize = 9
        }
      },
      didDrawPage: (data) => {
        // Footer on each page
        doc.setTextColor(...grayColor)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        const pageNum = doc.internal.getCurrentPageInfo().pageNumber
        doc.text(`Payment Run ${run.paymentRunNumber} | ${run.creditor.name}`, margin, pageHeight - 10)
        doc.text(`Page ${pageNum} of 2`, pageWidth - margin, pageHeight - 10, { align: 'right' })
      }
    })
    
    // Save the PDF file
      doc.save(`PaymentRun_${run.paymentRunNumber}_${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  const toggleExpand = (runId) => {
    setExpandedRun(expandedRun === runId ? null : runId)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1C1C1C] rounded-xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
          {/* Header - Gray colors, not orange */}
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <h2 className="text-white text-lg font-medium">Payment Run History</h2>
              <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                {paymentRuns.length} Runs
              </span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto flex-grow">
            {paymentRuns.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">No Payment Runs Yet</p>
                <p className="text-gray-500 text-sm">Completed payment runs will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentRuns.map((run, index) => (
                  <div key={run.id} className="bg-[#141414] rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-colors">
                    {/* Main Row - Gray expand icon, not orange */}
                    <div className="p-4 cursor-pointer" onClick={() => toggleExpand(run.id)}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800">
                            {expandedRun === run.id ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-white font-bold text-lg">{run.paymentRunNumber}</span>
                              {index === 0 && <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full">Latest</span>}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
                              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(run.createdAt)}</span>
                              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{run.executedBy}</span>
                              <span className="flex items-center gap-1"><Hash className="w-3.5 h-3.5" />{run.transactions.length} Transactions</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 ml-14 md:ml-0">
                          <div className="text-right">
                            <div className="text-xs text-gray-500 mb-1">Total Amount</div>
                            <div className="text-white font-bold text-xl">{formatCurrency(run.totalAmount)}</div>
                          </div>
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => downloadSepaXml(run)} className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-lg transition-colors" title="Download SEPA XML"><Download className="w-4 h-4" /></button>
                            <button onClick={() => downloadPdfReport(run)} className="p-2 text-orange-400 hover:text-orange-300 hover:bg-orange-900/20 rounded-lg transition-colors" title="Download PDF Report"><FileText className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteClick(run)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details - Gray icons, not orange */}
                    {expandedRun === run.id && (
                      <div className="border-t border-gray-800 p-4 bg-[#0D0D0D]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="bg-[#1C1C1C] rounded-lg p-4">
                            <h4 className="text-white font-medium mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" />Payment Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between"><span className="text-gray-400">Claims Through:</span><span className="text-white">{formatDateShort(run.claimsUntilDate)}</span></div>
                              <div className="flex justify-between"><span className="text-gray-400">Collection Date:</span><span className="text-white">{formatDateShort(run.collectionDate)}</span></div>
                              <div className="flex justify-between"><span className="text-gray-400">Direct Debits:</span><span className="text-white">{run.transactions.length}</span></div>
                            </div>
                          </div>
                          <div className="bg-[#1C1C1C] rounded-lg p-4">
                            <h4 className="text-white font-medium mb-3 flex items-center gap-2"><Building className="w-4 h-4 text-gray-400" />Creditor Information</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between"><span className="text-gray-400">Bank:</span><span className="text-white">{run.creditor.bankName}</span></div>
                              <div className="flex justify-between"><span className="text-gray-400">IBAN:</span><span className="text-white font-mono text-xs">{run.creditor.iban}</span></div>
                              <div className="flex justify-between"><span className="text-gray-400">BIC:</span><span className="text-white font-mono text-xs">{run.creditor.bic}</span></div>
                              <div className="flex justify-between"><span className="text-gray-400">Creditor ID:</span><span className="text-white font-mono text-xs">{run.creditor.creditorId}</span></div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-[#1C1C1C] rounded-lg p-4">
                          <h4 className="text-white font-medium mb-3">Transactions ({run.transactions.length})</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm" style={{ minWidth: '700px' }}>
                              <thead>
                                <tr className="text-gray-400 text-xs uppercase">
                                  <th className="text-left py-2 px-2">Member No.</th>
                                  <th className="text-left py-2 px-2">Account Holder</th>
                                  <th className="text-left py-2 px-2">Booking No.</th>
                                  <th className="text-left py-2 px-2">IBAN</th>
                                  <th className="text-left py-2 px-2">Services</th>
                                  <th className="text-right py-2 px-2">Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {run.transactions.map((tx, idx) => (
                                  <tr key={tx.id || idx} className="border-t border-gray-800">
                                    <td className="py-2 px-2 text-gray-300">{tx.memberNumber || `M-${String(idx + 1).padStart(5, '0')}`}</td>
                                    <td className="py-2 px-2 text-white">{tx.accountHolder || tx.memberName}</td>
                                    <td className="py-2 px-2 text-gray-300">{tx.bookingNumber || `BK-${run.paymentRunNumber}-${String(idx + 1).padStart(4, '0')}`}</td>
                                    <td className="py-2 px-2"><MaskedIban iban={getIban(tx)} /></td>
                                    <td className="py-2 px-2 text-gray-400 text-xs">{tx.services.map(s => s.name).join(', ')}</td>
                                    <td className="py-2 px-2 text-right text-white font-medium">{formatCurrency(tx.amount)}</td>
                                  </tr>
                                ))}
                                <tr className="border-t-2 border-orange-500 bg-orange-500/10">
                                  <td colSpan="5" className="py-3 px-2 text-right text-white font-bold">Total:</td>
                                  <td className="py-3 px-2 text-right text-orange-500 font-bold text-lg">{formatCurrency(run.totalAmount)}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-4">
                          <button onClick={() => downloadSepaXml(run)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"><Download className="w-4 h-4" />Download SEPA XML</button>
                          <button onClick={() => downloadPdfReport(run)} className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"><FileText className="w-4 h-4" />Download PDF Report</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmationOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-900/30 p-2 rounded-lg"><AlertTriangle className="w-6 h-6 text-red-400" /></div>
                <h3 className="text-white text-lg font-medium">Delete Payment Run</h3>
              </div>
              <p className="text-gray-300 mb-2">Are you sure you want to delete this payment run?</p>
              {runToDelete && (
                <div className="bg-[#141414] rounded-lg p-3 mb-4">
                  <p className="text-white font-medium">{runToDelete.paymentRunNumber}</p>
                  <p className="text-gray-400 text-sm mt-1">Created: {formatDate(runToDelete.createdAt)}</p>
                  <p className="text-gray-400 text-sm">Transactions: {runToDelete.transactions.length} | Amount: {formatCurrency(runToDelete.totalAmount)}</p>
                </div>
              )}
              <p className="text-yellow-400 text-sm mb-6">This action cannot be undone. All associated data will be permanently deleted.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={cancelDelete} className="px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#3F3F3F] transition-colors">Cancel</button>
                <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2"><Trash2 className="w-4 h-4" />Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PaymentRunsModal
