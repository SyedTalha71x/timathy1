/* eslint-disable react/prop-types */
import { ImageIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { X } from "react-feather"
import ReactQuill from "react-quill"

const WysiwygEditor = ({ value, onChange, placeholder }) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'link'
  ]

  // Consistent styling with TicketView
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .ql-editor.ql-blank::before {
        color: #ffffff !important;
        opacity: 0.7 !important;
      }
      .ql-editor {
        color: #ffffff !important;
        min-height: 120px;
        max-height: 200px;
        overflow-y: auto;
      }
      .ql-toolbar {
        border-color: #303030 !important;
        background-color: #151515 !important;
        position: relative;
        z-index: 10;
      }
      .ql-container {
        border-color: #303030 !important;
        background-color: #101010 !important;
      }
      .ql-snow .ql-stroke {
        stroke: #ffffff !important;
      }
      .ql-snow .ql-fill {
        fill: #ffffff !important;
      }
      .ql-snow .ql-picker-label {
        color: #ffffff !important;
      }
      .ql-snow .ql-picker-options {
        background-color: #151515 !important;
        border-color: #303030 !important;
      }
      .ql-snow .ql-picker-item {
        color: #ffffff !important;
      }
      .ql-snow .ql-tooltip {
        background-color: #151515 !important;
        border-color: #303030 !important;
        color: #ffffff !important;
        z-index: 20;
      }
      .ql-snow .ql-tooltip input[type="text"] {
        color: #000000 !important;
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

const NewTicketModal = ({ isOpen, onClose, onSubmit }) => {
    const [subject, setSubject] = useState("")
    const [reason, setReason] = useState("")
    const [additionalDescription, setAdditionalDescription] = useState("")
    const [uploadedImages, setUploadedImages] = useState([])
    const [includeRequesterName, setIncludeRequesterName] = useState(false)
    
    // Auto-filled fields
    const [studioName] = useState("My Studio")
    const [requesterName] = useState("John Doe")
    const [studioEmail] = useState("studio@example.com")

    const fileInputRef = useRef(null)

    // Reset form function
    const resetForm = () => {
      setSubject("")
      setReason("")
      setAdditionalDescription("")
      setUploadedImages([])
      setIncludeRequesterName(false)
    }

    // Handle close with form reset
    const handleClose = () => {
      resetForm()
      onClose()
    }

    const subjects = [
      { value: "", label: "Select a Subject" },
      { value: "appointments", label: "Appointments" },
      { value: "widgets", label: "Widgets" },
      { value: "activity_monitor", label: "Activity Monitor" },
      { value: "finances", label: "Finances" },
      { value: "communication", label: "Communication" },
      { value: "members", label: "Members" },
      { value: "staff", label: "Staff" },
      { value: "training", label: "Training" },
      { value: "leads", label: "Leads" },
      { value: "selling", label: "Selling" },
      { value: "analytics", label: "Analytics" },
      { value: "configuration", label: "Configuration" },
    ]

    const reasons = {
      appointments: [
        { value: "", label: "Select a Reason" },
        { value: "booking_issue", label: "Booking Issue" },
        { value: "cancellation_problem", label: "Cancellation Problem" },
        { value: "rescheduling_request", label: "Rescheduling Request" },
        { value: "calendar_sync", label: "Calendar Sync Issue" },
      ],
      widgets: [
        { value: "", label: "Select a Reason" },
        { value: "widget_not_loading", label: "Widget Not Loading" },
        { value: "customization_help", label: "Customization Help" },
        { value: "widget_placement", label: "Widget Placement Issue" },
        { value: "widget_functionality", label: "Widget Functionality Problem" },
      ],
      activity_monitor: [
        { value: "", label: "Select a Reason" },
        { value: "tracking_not_working", label: "Tracking Not Working" },
        { value: "data_accuracy", label: "Data Accuracy Issue" },
        { value: "report_generation", label: "Report Generation Problem" },
        { value: "activity_alerts", label: "Activity Alerts Issue" },
      ],
      finances: [
        { value: "", label: "Select a Reason" },
        { value: "billing_discrepancy", label: "Billing Discrepancy" },
        { value: "payment_processing", label: "Payment Processing Issue" },
        { value: "invoice_problem", label: "Invoice Problem" },
        { value: "refund_request", label: "Refund Request" },
      ],
      communication: [
        { value: "", label: "Select a Reason" },
        { value: "email_delivery", label: "Email Delivery Issue" },
        { value: "notification_problem", label: "Notification Problem" },
        { value: "messaging_error", label: "Messaging Error" },
        { value: "communication_setup", label: "Communication Setup Help" },
      ],
      members: [
        { value: "", label: "Select a Reason" },
        { value: "member_registration", label: "Member Registration Issue" },
        { value: "profile_management", label: "Profile Management Problem" },
        { value: "membership_status", label: "Membership Status Question" },
        { value: "member_permissions", label: "Member Permissions Issue" },
      ],
      staff: [
        { value: "", label: "Select a Reason" },
        { value: "staff_access", label: "Staff Access Problem" },
        { value: "role_assignment", label: "Role Assignment Issue" },
        { value: "staff_scheduling", label: "Staff Scheduling Problem" },
        { value: "staff_permissions", label: "Staff Permissions Question" },
      ],
      training: [
        { value: "", label: "Select a Reason" },
        { value: "course_access", label: "Course Access Issue" },
        { value: "training_materials", label: "Training Materials Problem" },
        { value: "progress_tracking", label: "Progress Tracking Issue" },
        { value: "certification_problem", label: "Certification Problem" },
      ],
      leads: [
        { value: "", label: "Select a Reason" },
        { value: "lead_capture", label: "Lead Capture Issue" },
        { value: "lead_assignment", label: "Lead Assignment Problem" },
        { value: "lead_tracking", label: "Lead Tracking Issue" },
        { value: "lead_conversion", label: "Lead Conversion Problem" },
      ],
      selling: [
        { value: "", label: "Select a Reason" },
        { value: "sales_process", label: "Sales Process Issue" },
        { value: "product_catalog", label: "Product Catalog Problem" },
        { value: "pricing_issue", label: "Pricing Issue" },
        { value: "sales_reporting", label: "Sales Reporting Problem" },
      ],
      analytics: [
        { value: "", label: "Select a Reason" },
        { value: "data_visualization", label: "Data Visualization Issue" },
        { value: "report_accuracy", label: "Report Accuracy Problem" },
        { value: "dashboard_problem", label: "Dashboard Problem" },
        { value: "analytics_setup", label: "Analytics Setup Help" },
      ],
      configuration: [
        { value: "", label: "Select a Reason" },
        { value: "system_settings", label: "System Settings Issue" },
        { value: "integration_problem", label: "Integration Problem" },
        { value: "configuration_error", label: "Configuration Error" },
        { value: "setup_assistance", label: "Setup Assistance" },
      ],
    }

    const handleSubjectChange = (e) => {
      setSubject(e.target.value)
      setReason("")
    }

    const handleReasonChange = (e) => {
      setReason(e.target.value)
    }

    const handleImageUpload = (e) => {
      const files = Array.from(e.target.files)
      files.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          setUploadedImages((prev) => [...prev, event.target.result])
        }
        reader.readAsDataURL(file)
      })
    }

    const removeImage = (index) => {
      setUploadedImages((prev) => prev.filter((_, i) => i !== index))
    }

    const formatTicketName = (subjectValue, reasonValue) => {
      if (!subjectValue || !reasonValue) return ""
      
      const subjectObj = subjects.find(s => s.value === subjectValue)
      const reasonObj = reasons[subjectValue]?.find(r => r.value === reasonValue)
      
      if (!subjectObj || !reasonObj) return ""
      
      return `${subjectObj.label} – ${reasonObj.label}`
    }

    const handleSubmit = () => {
      if (subject && reason) {
        const ticketName = formatTicketName(subject, reason)
        
        const ticketData = {
          ticketName,
          additionalDescription,
          uploadedImages,
          studioName,
          studioEmail,
          requesterName: includeRequesterName ? requesterName : null
        }
        
        onSubmit(ticketData)
        resetForm()
      } else {
        alert("Please fill in all required fields: Subject and Reason.")
      }
    }

    if (!isOpen) return null

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-[#1C1C1C] rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-md mx-2 sm:mx-0 relative max-h-[95vh] overflow-y-auto">
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-400 hover:text-gray-200"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 text-center pr-6">Create New Ticket</h2>

          <div className="space-y-4 sm:space-y-5 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
            {/* Studio Info Card */}
            <div className="bg-[#101010] rounded-xl p-4 border border-[#333333]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{studioName.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{studioName}</p>
                  <p className="text-gray-400 text-xs truncate">{studioEmail}</p>
                </div>
              </div>
              
              {/* Privacy Toggle - Blue color, shows name when active */}
              <div className="mt-4 pt-3 border-t border-[#333333]">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-3">
                    <p className="text-sm text-white">Share my name with support</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={includeRequesterName}
                      onChange={(e) => setIncludeRequesterName(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                {/* Show name when toggle is active */}
                {includeRequesterName && (
                  <div className="mt-3 p-3 bg-blue-600/10 border border-blue-600/30 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Name shared with support:</p>
                    <p className="text-sm text-white font-medium">{requesterName}</p>
                  </div>
                )}
                
                {!includeRequesterName && (
                  <p className="text-xs text-gray-500 mt-2">Only studio info will be shared</p>
                )}
              </div>
            </div>

            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Subject *</label>
              <select
                value={subject}
                onChange={handleSubjectChange}
                className="w-full bg-[#101010] text-sm rounded-xl px-3 sm:px-4 py-2.5 text-white outline-none border border-[#333333] focus:border-[#3F74FF]"
              >
                {subjects.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reason Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Reason *</label>
              <select
                value={reason}
                onChange={handleReasonChange}
                disabled={!subject}
                className="w-full bg-[#101010] text-sm rounded-xl px-3 sm:px-4 py-2.5 text-white outline-none border border-[#333333] focus:border-[#3F74FF] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {subject ? (
                  reasons[subject].map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))
                ) : (
                  <option value="">Select a Subject first</option>
                )}
              </select>
            </div>

            {/* Additional Description */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Description</label>
              
              {/* Image Upload */}
              <div className="mb-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <ImageIcon size={16} />
                  Attach Images
                </button>
                
                {uploadedImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {uploadedImages.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img src={img || "/placeholder.svg"} alt="Preview" className="w-20 h-20 object-cover rounded border border-gray-600" />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* WYSIWYG Editor - Consistent with TicketView */}
              <div className="border border-gray-600 rounded-lg overflow-hidden bg-[#101010] h-64 flex flex-col">
                <WysiwygEditor
                  value={additionalDescription}
                  onChange={setAdditionalDescription}
                  placeholder="Provide additional details about your issue..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-4 py-2.5 text-sm border border-gray-600 rounded-xl font-medium text-gray-300 bg-[#2A2A2A] hover:bg-[#3A3A3A] order-2 sm:order-1 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="w-full sm:w-auto px-4 py-2.5 text-sm rounded-xl font-medium text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2 transition-colors"
                disabled={!subject || !reason}
              >
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    )
}

export default NewTicketModal
