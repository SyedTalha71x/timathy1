/* eslint-disable react/prop-types */
import { X } from "lucide-react"

const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center sm:p-4 z-[9999]">
      <div className="bg-surface-hover rounded-t-2xl sm:rounded-2xl w-full sm:max-w-4xl sm:mx-auto h-[92vh] sm:h-auto sm:max-h-[90vh] overflow-hidden border-t sm:border border-border shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border-subtle flex-shrink-0 rounded-t-2xl">
          <h2 className="text-lg sm:text-xl font-bold text-content-primary">Privacy Policy</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-button rounded-lg transition-colors">
            <X size={20} className="text-content-primary" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          <div className="text-content-secondary space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-content-primary mb-3">Information We Collect</h3>
              <p className="leading-relaxed mb-3">We collect information you provide directly to us, such as when you create an account, update your profile, or contact us for support. This may include:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name, email address, and contact information</li>
                <li>Profile information and preferences</li>
                <li>Fitness goals and health information</li>
                <li>Payment and billing information</li>
                <li>Communications with our support team</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-content-primary mb-3">How We Use Your Information</h3>
              <p className="leading-relaxed mb-3">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Monitor and analyze trends and usage</li>
                <li>Personalize your experience</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-content-primary mb-3">Data Security</h3>
              <p className="leading-relaxed">We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-content-primary mb-3">Contact Us</h3>
              <p className="leading-relaxed">If you have any questions about this Privacy Policy, please contact us at privacy@studioone.com or through our support channels.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyModal
