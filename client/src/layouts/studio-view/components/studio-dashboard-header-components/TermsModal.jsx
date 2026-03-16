/* eslint-disable react/prop-types */
import { X } from "lucide-react"

const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center sm:p-4 z-[9999]">
      <div className="bg-surface-hover rounded-t-2xl sm:rounded-2xl w-full sm:max-w-4xl sm:mx-auto h-[92vh] sm:h-auto sm:max-h-[90vh] overflow-hidden border-t sm:border border-border shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border-subtle flex-shrink-0 rounded-t-2xl">
          <h2 className="text-lg sm:text-xl font-bold text-content-primary">Terms & Conditions</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-button rounded-lg transition-colors">
            <X size={20} className="text-content-primary" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          <div className="text-content-secondary space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-content-primary mb-3">Acceptance of Terms</h3>
              <p className="leading-relaxed">By accessing and using StudioOne's fitness management platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-content-primary mb-3">Service Description</h3>
              <p className="leading-relaxed mb-3">StudioOne provides a comprehensive fitness studio management platform that includes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Member management and tracking</li>
                <li>Appointment and class scheduling</li>
                <li>Contract and payment management</li>
                <li>Communication tools</li>
                <li>Analytics and reporting</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-content-primary mb-3">User Responsibilities</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Provide accurate and up-to-date information</li>
                <li>Use the service in compliance with applicable laws</li>
                <li>Report any unauthorized access to your account</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-content-primary mb-3">Limitation of Liability</h3>
              <p className="leading-relaxed">StudioOne shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsModal
