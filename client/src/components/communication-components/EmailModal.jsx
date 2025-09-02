/* eslint-disable react/prop-types */
import { Mail, X, Send, Paperclip, ImageIcon, Smile } from "lucide-react"

const EmailModal = ({
  showEmailModal,
  handleCloseEmailModal,
  emailData,
  setEmailData,
  selectedEmailTemplate,
  setSelectedEmailTemplate,
  emailTemplates,
  handleSendEmail,
}) => {
  if (!showEmailModal) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#181818] rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Send Email
            </h2>
            <button onClick={handleCloseEmailModal} className="p-2 hover:bg-zinc-700 rounded-lg">
              <X size={16} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email Template</label>
              <select
                value={selectedEmailTemplate || ""}
                onChange={(e) => {
                  const template = emailTemplates.find((t) => t.id === Number.parseInt(e.target.value))
                  setSelectedEmailTemplate(template)
                  if (template) {
                    setEmailData({
                      ...emailData,
                      subject: template.subject,
                      body: template.body,
                    })
                  }
                }}
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
              >
                <option value="">Select a template</option>
                {emailTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">To</label>
              <input
                type="email"
                value={emailData.to}
                onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                placeholder="recipient@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Subject</label>
              <input
                type="text"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                placeholder="Email subject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
              <textarea
                value={emailData.body}
                onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white h-32 resize-none"
                placeholder="Type your message here..."
              />
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-zinc-700 rounded-lg">
                <Paperclip size={16} />
              </button>
              <button className="p-2 hover:bg-zinc-700 rounded-lg">
                <ImageIcon size={16} />
              </button>
              <button className="p-2 hover:bg-zinc-700 rounded-lg">
                <Smile size={16} />
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button onClick={handleCloseEmailModal} className="px-4 py-2 text-gray-400 hover:text-white">
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2"
              >
                <Send size={16} />
                Send Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailModal
