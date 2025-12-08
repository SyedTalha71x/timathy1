/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react"
import { Mail, X, Send, Paperclip } from "lucide-react"
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const WysiwygEditor = ({ value, onChange, placeholder }) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'color', 'background',
    'link', 'image'
  ]

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .ql-editor.ql-blank::before {
        color: #9ca3af !important;
        opacity: 0.7 !important;
        font-style: normal !important;
      }
      .ql-editor {
        color: #ffffff !important;
        min-height: 200px;
      }
      .ql-toolbar {
        border-color: #374151 !important;
        border-top-left-radius: 0.75rem;
        border-top-right-radius: 0.75rem;
      }
      .ql-container {
        border-color: #374151 !important;
        border-bottom-left-radius: 0.75rem;
        border-bottom-right-radius: 0.75rem;
      }
      .ql-snow .ql-stroke {
        stroke: #d1d5db !important;
      }
      .ql-snow .ql-fill {
        fill: #d1d5db !important;
      }
      .ql-snow .ql-picker-label {
        color: #d1d5db !important;
      }
      .ql-snow .ql-picker-options {
        background-color: #1f2937 !important;
        border-color: #374151 !important;
      }
      .ql-snow.ql-toolbar button:hover,
      .ql-snow .ql-toolbar button:hover,
      .ql-snow.ql-toolbar button:focus,
      .ql-snow .ql-toolbar button:focus,
      .ql-snow.ql-toolbar button.ql-active,
      .ql-snow .ql-toolbar button.ql-active {
        background-color: #374151 !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      placeholder={placeholder}
      theme="snow"
    />
  )
}

const SendEmailModal = ({ sale, onClose }) => {
    const [emailData, setEmailData] = useState({
        to: sale.email || "",
        subject: `Invoice #${sale.invoiceNumber || sale.id}`,
        body: `<p>Dear ${sale.member},</p><p><br></p><p>Please find attached your invoice for the recent purchase.</p><p><br></p><p><strong>Invoice Details:</strong></p><ul><li>Invoice #: ${sale.invoiceNumber || sale.id}</li><li>Date: ${sale.date}</li><li>Total Amount: $${sale.totalAmount.toFixed(2)}</li></ul><p><br></p><p>Thank you for your business!</p><p><br></p><p>Best regards,<br>Your Business Team</p>`,
    })
    const [attachments, setAttachments] = useState([])

    // Automatically add invoice when modal opens
    useEffect(() => {
        const invoiceContent = generateInvoicePDF()
        const blob = new Blob([invoiceContent], { type: 'application/pdf' })
        const invoiceFile = new File([blob], `invoice-${sale.invoiceNumber || sale.id}.pdf`, { type: 'application/pdf' })
        
        // Set the invoice as the first attachment automatically
        setAttachments([invoiceFile])
    }, [sale])

    // Generate PDF invoice content
    const generateInvoicePDF = () => {
        const invoiceContent = `
INVOICE
========================================

Invoice #: ${sale.invoiceNumber || sale.id}
Date: ${sale.date}

CUSTOMER INFORMATION
----------------------------------------
Member: ${sale.member}
Member Type: ${sale.memberType}
${sale.email ? `Email: ${sale.email}` : ''}

ITEMS
----------------------------------------
${sale.items.map((item, idx) => 
    `${idx + 1}. ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)} (${item.type})`
).join("\n")}

PAYMENT DETAILS
----------------------------------------
Subtotal: $${sale.subtotal?.toFixed(2) || sale.totalAmount.toFixed(2)}
${sale.discountApplied ? `Discount: -$${sale.discountApplied.toFixed(2)}` : ''}
${sale.vatApplied ? `VAT: $${sale.vatApplied.toFixed(2)}` : ''}
Payment Method: ${sale.paymentMethod}

Total Amount: $${sale.totalAmount.toFixed(2)}

========================================
Thank you for your business!
        `.trim()

        return invoiceContent
    }

    const handleAddAttachment = () => {
        // Create a generic file input for adding any attachment
        const input = document.createElement('input')
        input.type = 'file'
        input.multiple = true
        input.onchange = (e) => {
            const files = Array.from(e.target.files)
            setAttachments(prev => [...prev, ...files])
        }
        input.click()
    }

    const handleRemoveAttachment = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index))
    }

    const handleSendEmail = async () => {
        if (!emailData.to) {
            alert("Please enter a recipient email address")
            return
        }

        try {
            // Create FormData for actual email sending
            const formData = new FormData()
            formData.append("to", emailData.to)
            formData.append("subject", emailData.subject)
            formData.append("body", emailData.body)
            formData.append("isHtml", "true")

            // Add all attachments (invoice is automatically included)
            attachments.forEach(file => {
                formData.append("attachments", file)
            })

            // Here you would typically send this to your backend API
            console.log("Sending email with data:", {
                to: emailData.to,
                subject: emailData.subject,
                body: emailData.body,
                attachments: attachments.map(f => f.name)
            })

            // Simulate API call
            // await fetch('/api/send-email', {
            //     method: 'POST',
            //     body: formData
            // })

            alert(`Email sent successfully to ${emailData.to}`)
            onClose()
        } catch (error) {
            console.error('Error sending email:', error)
            alert('Failed to send email. Please try again.')
        }
    }

    // Check if attachment is the auto-added invoice
    const isInvoiceAttachment = (fileName) => {
        return fileName.startsWith(`invoice-${sale.invoiceNumber || sale.id}`)
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000000000]">
            <div className="bg-[#181818] rounded-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold flex items-center gap-3 text-white">
                            <Mail className="w-6 h-6" />
                            Send Invoice via Email
                        </h2>
                        <button 
                            onClick={onClose} 
                            className="p-2 hover:bg-zinc-700 rounded-lg transition-colors text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* To Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Recipient Email *
                            </label>
                            <input
                                type="email"
                                value={emailData.to}
                                onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                                className="w-full bg-[#222222] border border-gray-600 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter email address"
                            />
                            {!sale.email && (
                                <p className="text-xs text-yellow-400 mt-2">
                                    No email found for this member. Please enter an email address.
                                </p>
                            )}
                        </div>

                        {/* Subject Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Subject *
                            </label>
                            <input
                                type="text"
                                value={emailData.subject}
                                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                                className="w-full bg-[#222222] border border-gray-600 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Email subject"
                            />
                        </div>

                        {/* Message Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Message *
                            </label>
                            <WysiwygEditor
                                value={emailData.body}
                                onChange={(content) => setEmailData({ ...emailData, body: content })}
                                placeholder="Type your email message here..."
                            />
                        </div>

                        {/* Attachments Section */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-medium text-gray-300">
                                    Attachments
                                </label>
                                <button
                                    onClick={handleAddAttachment}
                                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                                >
                                    <Paperclip size={16} />
                                    Add Attachment
                                </button>
                            </div>
                            
                            <div className="bg-[#222222] border border-gray-600 rounded-lg p-4">
                                {attachments.length === 0 ? (
                                    <p className="text-gray-400 text-sm">
                                        No attachments added.
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {attachments.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between bg-[#2a2a2a] rounded-lg px-3 py-2">
                                                <div className="flex items-center gap-3">
                                                    <Paperclip size={16} className="text-gray-400" />
                                                    <span className="text-white text-sm">{file.name}</span>
                                                    {isInvoiceAttachment(file.name) && (
                                                        <span className="text-green-400 text-xs bg-green-800 px-2 py-1 rounded">
                                                            Invoice
                                                        </span>
                                                    )}
                                                    <span className="text-gray-400 text-xs">
                                                        (${(file.size / 1024).toFixed(1)} KB)
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveAttachment(index)}
                                                    className="text-red-400 hover:text-red-300 transition-colors"
                                                    disabled={isInvoiceAttachment(file.name)}
                                                    title={isInvoiceAttachment(file.name) ? "Invoice cannot be removed" : "Remove attachment"}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <p className="text-xs text-green-400 mt-2">
                                    ✓ Invoice has been automatically attached
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                            <button
                                onClick={onClose}
                                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendEmail}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                            >
                                <Send className="w-4 h-4" />
                                Send Email
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SendEmailModal