/* eslint-disable react/prop-types */
import { ImageIcon } from "lucide-react"
import { useRef, useState } from "react"
import { List, X } from "react-feather"

const NewTicketModal = ({ isOpen, onClose, onSubmit }) => {
    const [subject, setSubject] = useState("")
    const [reason, setReason] = useState("")
    const [additionalDescription, setAdditionalDescription] = useState("")
    const [uploadedImages, setUploadedImages] = useState([])
    const [isBold, setIsBold] = useState(false)
    const [isItalic, setIsItalic] = useState(false)
    const textareaRef = useRef(null)
    const fileInputRef = useRef(null)
  
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
  
    const toggleBold = () => {
      setIsBold(!isBold)
    }
  
    const toggleItalic = () => {
      setIsItalic(!isItalic)
    }
  
    const addBulletPoint = () => {
      const textarea = textareaRef.current
      if (!textarea) return
  
      const start = textarea.selectionStart
      const text = textarea.value
      const lines = text.split("\n")
      const currentLineIndex = text.substring(0, start).split("\n").length - 1
  
      if (!lines[currentLineIndex].startsWith("• ")) {
        lines[currentLineIndex] = "• " + lines[currentLineIndex]
        setAdditionalDescription(lines.join("\n"))
      }
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
  
    const handleSubmit = () => {
      if (subject && reason) {
        onSubmit(subject, reason, additionalDescription, uploadedImages, isBold, isItalic)
        setSubject("")
        setReason("")
        setAdditionalDescription("")
        setUploadedImages([])
        setIsBold(false)
        setIsItalic(false)
      } else {
        alert("Please select both a subject and a reason.")
      }
    }
  
    if (!isOpen) return null
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-[#1C1C1C] rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-md mx-2 sm:mx-0 relative max-h-[95vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-400 hover:text-gray-200"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 text-center pr-6">Create New Ticket</h2>
  
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Subject</label>
              <select
                value={subject}
                onChange={handleSubjectChange}
                className="w-full bg-[#101010] text-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-white outline-none"
              >
                {subjects.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
  
            <div>
              <label className="block text-sm font-medium text-white mb-2">Reason</label>
              <select
                value={reason}
                onChange={handleReasonChange}
                disabled={!subject}
                className="w-full bg-[#101010] text-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
  
            <div>
              <label className="block text-sm font-medium text-white mb-2">Additional description</label>
              <div className="border border-gray-600 rounded-lg sm:rounded-xl overflow-hidden bg-[#101010]">
                <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-[#2A2A2A] border-b border-gray-600">
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
                    className="p-1 hover:bg-gray-700 rounded text-gray-300"
                    title="Add image"
                  >
                    <ImageIcon size={14} className="sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={toggleBold}
                    className={`px-1.5 py-1 hover:bg-gray-700 rounded font-bold text-xs sm:text-sm ${
                      isBold ? "bg-gray-700 text-white" : "text-gray-300"
                    }`}
                    title="Bold"
                  >
                    B
                  </button>
                  <button
                    onClick={toggleItalic}
                    className={`px-1.5 py-1 hover:bg-gray-700 rounded italic text-xs sm:text-sm ${
                      isItalic ? "bg-gray-700 text-white" : "text-gray-300"
                    }`}
                    title="Italic"
                  >
                    I
                  </button>
                  <button
                    onClick={addBulletPoint}
                    className="p-1 hover:bg-gray-700 rounded text-gray-300"
                    title="Add list"
                  >
                    <List size={14} className="sm:w-4 sm:h-4" />
                  </button>
                </div>
  
                {uploadedImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2 bg-[#101010]">
                    {uploadedImages.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img src={img || "/placeholder.svg"} alt="Preview" className="w-20 h-20 object-cover rounded" />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
  
                <textarea
                  ref={textareaRef}
                  value={additionalDescription}
                  onChange={(e) => setAdditionalDescription(e.target.value)}
                  placeholder="Provide additional details about your issue..."
                  style={{
                    fontWeight: isBold ? "bold" : "normal",
                    fontStyle: isItalic ? "italic" : "normal",
                  }}
                  className="w-full bg-[#101010] text-sm px-3 sm:px-4 py-2 sm:py-2.5 text-white placeholder-gray-500 outline-none min-h-[60px] sm:min-h-[80px] resize-none"
                />
              </div>
            </div>
  
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 text-sm border border-gray-600 rounded-md sm:rounded-lg font-medium text-gray-300 bg-[#2A2A2A] hover:bg-[#3A3A3A] order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="w-full sm:w-auto px-4 py-2 text-sm rounded-md sm:rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
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