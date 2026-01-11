/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Mail, X, Search, Send } from "lucide-react";

const SendEmailModal = ({
  showEmailModal,
  handleCloseEmailModal,
  handleSendEmail,
  setShowTemplateDropdown,
  showTemplateDropdown,
  selectedEmailTemplate,
  emailTemplates,
  handleTemplateSelect,
  setSelectedEmailTemplate,
  emailData,
  setEmailData,
  showRecipientDropdown,
  setShowRecipientDropdown,
  handleSearchMemberForEmail,
  handleSelectEmailRecipient,
}) => {
  if (!showEmailModal) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#181818] rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Send Emailss
            </h2>
            <button
              onClick={handleCloseEmailModal}
              className="p-2 hover:bg-zinc-700 rounded-lg"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Email Template
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                  className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm text-left flex items-center justify-between"
                >
                  <span>
                    {selectedEmailTemplate
                      ? selectedEmailTemplate.name
                      : "Select a template (optional)"}
                  </span>
                  <Search className="h-4 w-4 text-gray-400" />
                </button>
                {showTemplateDropdown && (
                  <div className="absolute left-0 right-0 mt-1 bg-[#1C1C1C] border border-gray-800 rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto">
                    <button
                      onClick={() => {
                        setSelectedEmailTemplate(null);
                        setEmailData({ ...emailData, subject: "", body: "" });
                        setShowTemplateDropdown(false);
                      }}
                      className="w-full text-left p-3 hover:bg-[#2F2F2F] text-sm text-gray-400 border-b border-gray-700"
                    >
                      No template (blank email)
                    </button>
                    {emailTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className="w-full text-left p-3 hover:bg-[#2F2F2F]"
                      >
                        <div className="font-medium text-sm">{template.name}</div>
                        <div className="text-xs text-gray-400 truncate">
                          {template.subject}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* To Field */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                To
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={emailData.to}
                  onChange={(e) => {
                    setEmailData({ ...emailData, to: e.target.value });
                    setShowRecipientDropdown(e.target.value.length > 0);
                  }}
                  onFocus={() =>
                    setShowRecipientDropdown(emailData.to.length > 0)
                  }
                  className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm pr-10"
                  placeholder="Search members or type email"
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                {showRecipientDropdown && emailData.to.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-[#1C1C1C] border border-gray-800 rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto custom-scrollbar">
                    {handleSearchMemberForEmail(emailData.to).map((member) => (
                      <button
                        key={member.id}
                        onClick={() => handleSelectEmailRecipient(member)}
                        className="w-full text-left p-2 hover:bg-[#2F2F2F] flex items-center gap-2"
                      >
                        <img
                          src={member.logo || "/placeholder.svg"}
                          alt={member.name}
                          className="h-8 w-8 rounded-full"
                        />
                        <span className="text-sm">
                          {member.name} ({member.email})
                        </span>
                      </button>
                    ))}
                    {handleSearchMemberForEmail(emailData.to).length === 0 && (
                      <p className="p-2 text-sm text-gray-400">
                        No members found. Type full email to send.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={emailData.subject}
                onChange={(e) =>
                  setEmailData({ ...emailData, subject: e.target.value })
                }
                className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm"
                placeholder="Email subject"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Message
              </label>
              <div className="bg-[#222222] rounded-xl">
                {/* Toolbar */}
                <div className="flex items-center gap-2 p-2 border-b border-gray-700">
                  <button className="p-1 hover:bg-gray-600 rounded text-sm font-bold">
                    B
                  </button>
                  <button className="p-1 hover:bg-gray-600 rounded text-sm italic">
                    I
                  </button>
                  <button className="p-1 hover:bg-gray-600 rounded text-sm underline">
                    U
                  </button>
                  <div className="w-px h-4 bg-gray-600 mx-1" />
                  <button className="p-1 hover:bg-gray-600 rounded text-sm">
                    📎
                  </button>
                  <button className="p-1 hover:bg-gray-600 rounded text-sm">
                    🔗
                  </button>
                  <button className="p-1 hover:bg-gray-600 rounded text-sm">
                    📊
                  </button>
                </div>
                <textarea
                  value={emailData.body}
                  onChange={(e) =>
                    setEmailData({ ...emailData, body: e.target.value })
                  }
                  className="w-full bg-transparent text-white px-4 py-2 text-sm h-48 resize-none focus:outline-none"
                  placeholder="Type your email message here..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleCloseEmailModal}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendEmailModal;
