/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react"
import { Mail, X, Send, Paperclip, CheckCircle, AlertCircle } from "lucide-react"
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

// Custom Success Modal Component
const EmailSuccessModal = ({ isOpen, onClose, recipientEmail }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000000001] p-4">
            <div className="bg-[#181818] rounded-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
                <div className="p-6">
                    <div className="flex flex-col items-center mb-6">
                        <div className="bg-green-500/20 p-4 rounded-full mb-4">
                            <CheckCircle className="h-10 w-10 text-green-500" />
                        </div>
                        <h2 className="text-white text-xl font-semibold text-center mb-2">
                            Email Sent Successfully!
                        </h2>
                        <p className="text-gray-400 text-center text-sm">
                            Your invoice has been sent to
                        </p>
                        <p className="text-white font-medium text-center mt-1">
                            {recipientEmail}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    )
}

// Custom Error Modal Component
const EmailErrorModal = ({ isOpen, onClose, errorMessage }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000000001] p-4">
            <div className="bg-[#181818] rounded-xl w-full max-w-md">
                <div className="p-6">
                    <div className="flex flex-col items-center mb-6">
                        <div className="bg-red-500/20 p-4 rounded-full mb-4">
                            <AlertCircle className="h-10 w-10 text-red-500" />
                        </div>
                        <h2 className="text-white text-xl font-semibold text-center mb-2">
                            {errorMessage || "Failed to Send Email"}
                        </h2>
                        <p className="text-gray-400 text-center text-sm">
                            Please check your input and try again.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl text-sm font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

const SendEmailModal = ({ sale, onClose }) => {
    const [emailData, setEmailData] = useState({
        to: sale.email || "",
        subject: `Invoice #${sale.invoiceNumber || sale.id}`,
        body: `<p>Dear ${sale.member},</p><p><br></p><p>Please find attached your invoice for the recent purchase.</p><p><br></p><p><strong>Invoice Details:</strong></p><ul><li>Invoice #: ${sale.invoiceNumber || sale.id}</li><li>Date: ${sale.date}</li><li>Total Amount: $${sale.totalAmount.toFixed(2)}</li></ul><p><br></p><p>Thank you for your business!</p><p><br></p><p>Best regards,<br>Your Business Team</p>`,
    })
    const [attachments, setAttachments] = useState([])
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

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
        const hasCustomer = sale.member && sale.member !== "No Member"
        
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
        
        const invoiceContent = `
========================================
         Fitness Studio Pro
  123 Fitness Street, Health City 12345
        VAT ID: DE123456789
========================================

Receipt No: ${sale.invoiceNumber || sale.id}
Date: ${sale.date}
Terminal: Fitness Studio Pro
${hasCustomer ? `Member: ${sale.member}` : ''}
${sale.email ? `Email: ${sale.email}` : ''}

----------------------------------------
${sale.items.map((item) => {
            const itemTotal = (item.price || 0) * item.quantity
            const vatRate = item.vatRate || 19
            const netAmount = itemTotal / (1 + vatRate / 100)
            const vatAmount = itemTotal - netAmount
            return `${item.name}
${item.quantity} x $${(item.price || 0).toFixed(2)}          $${itemTotal.toFixed(2)}
  Net: $${netAmount.toFixed(2)} | VAT ${vatRate}%: $${vatAmount.toFixed(2)}`
        }).join("\n\n")}

----------------------------------------
Net:                        $${totalNet.toFixed(2)}
${totalVat19 > 0 ? `VAT 19%:                    $${totalVat19.toFixed(2)}` : ''}
${totalVat7 > 0 ? `VAT 7%:                     $${totalVat7.toFixed(2)}` : ''}
${sale.discountApplied ? `Discount:                  -$${sale.discountApplied.toFixed(2)}` : ''}
----------------------------------------
TOTAL:                      $${sale.totalAmount.toFixed(2)}
----------------------------------------

Payment: ${sale.paymentMethod}

========================================
     Thank you for your purchase!
========================================
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
            setErrorMessage("Please enter a recipient email address")
            setShowErrorModal(true)
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

            // Show success modal
            setShowSuccessModal(true)
        } catch (error) {
            console.error('Error sending email:', error)
            setErrorMessage("Failed to send email. Please try again.")
            setShowErrorModal(true)
        }
    }

    const handleSuccessClose = () => {
        setShowSuccessModal(false)
        onClose()
    }

    // Check if attachment is the auto-added invoice
    const isInvoiceAttachment = (fileName) => {
        return fileName.startsWith(`invoice-${sale.invoiceNumber || sale.id}`)
    }

    return (
        <>
            {/* Success Modal */}
            <EmailSuccessModal
                isOpen={showSuccessModal}
                onClose={handleSuccessClose}
                recipientEmail={emailData.to}
            />

            {/* Error Modal */}
            <EmailErrorModal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                errorMessage={errorMessage}
            />

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
                                        className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
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
        </>
    )
}

export default SendEmailModal
