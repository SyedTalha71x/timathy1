/* eslint-disable react/prop-types */
import { X } from "lucide-react"
import { useTranslation } from "react-i18next"

const ChangelogModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation()
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center sm:p-4 z-[9999]">
      <div className="bg-surface-hover rounded-t-2xl sm:rounded-2xl w-full sm:max-w-4xl sm:mx-auto h-[92vh] sm:h-auto sm:max-h-[90vh] overflow-hidden border-t sm:border border-border shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border-subtle flex-shrink-0 rounded-t-2xl">
          <h2 className="text-lg sm:text-xl font-bold text-content-primary">{t("studio.profile.changelog")}</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-button rounded-lg transition-colors">
            <X size={20} className="text-content-primary" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          <div className="text-content-secondary space-y-8">
            <div className="border-l-4 border-primary pl-6">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-lg font-semibold text-content-primary">Version 2.1.0</h3>
                <span className="bg-primary text-white text-xs px-2 py-1 rounded">Latest</span>
              </div>
              <p className="text-sm text-content-muted mb-3">Released on December 15, 2024</p>
              <div className="space-y-2">
                <div>
                  <h4 className="font-medium text-content-primary mb-2">New Features</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>Enhanced member analytics dashboard</li>
                    <li>Real-time class capacity tracking</li>
                    <li>Automated membership renewal notifications</li>
                    <li>Mobile app push notifications</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-content-primary mb-2">Improvements</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>Faster loading times for member profiles</li>
                    <li>Improved search functionality</li>
                    <li>Better mobile responsiveness</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-content-primary mb-2">Bug Fixes</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>Fixed calendar sync issues</li>
                    <li>Resolved payment processing errors</li>
                    <li>Fixed member check-in duplicates</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-border pl-6">
              <h3 className="text-lg font-semibold text-content-primary mb-3">Version 2.0.5</h3>
              <p className="text-sm text-content-muted mb-3">Released on November 28, 2024</p>
              <div className="space-y-2">
                <div>
                  <h4 className="font-medium text-content-primary mb-2">Improvements</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>Enhanced security measures</li>
                    <li>Improved data backup system</li>
                    <li>Updated user interface elements</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-border pl-6">
              <h3 className="text-lg font-semibold text-content-primary mb-3">Version 2.0.0</h3>
              <p className="text-sm text-content-muted mb-3">Released on October 15, 2024</p>
              <div className="space-y-2">
                <div>
                  <h4 className="font-medium text-content-primary mb-2">Major Release</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>Complete UI/UX redesign</li>
                    <li>New member management system</li>
                    <li>Advanced reporting and analytics</li>
                    <li>Integration with popular fitness apps</li>
                    <li>Multi-language support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangelogModal
