/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X } from "lucide-react";
import React, { useState } from "react";
import { MdOutlineHelpCenter } from "react-icons/md";


// NewTicketModal Component
const NewTicketModal = ({ isOpen, onClose, onSubmit }) => {
  const [subject, setSubject] = useState("");
  const [reason, setReason] = useState("");

  const subjects = [
    { value: '', label: 'Select a Subject' },
    { value: 'account_issue', label: 'Account Issue' },
    { value: 'billing_question', label: 'Billing Question' },
    { value: 'technical_support', label: 'Technical Support' },
    { value: 'feature_request', label: 'Feature Request' },
    { value: 'other', label: 'Other' },
  ];

  const reasons = {
    account_issue: [
      { value: '', label: 'Select a Reason' },
      { value: 'login_problem', label: 'Login Problem' },
      { value: 'profile_update', label: 'Profile Update' },
      { value: 'account_deletion', label: 'Account Deletion' },
    ],
    billing_question: [
      { value: '', label: 'Select a Reason' },
      { value: 'invoice_discrepancy', label: 'Invoice Discrepancy' },
      { value: 'payment_issue', label: 'Payment Issue' },
      { value: 'subscription_change', label: 'Subscription Change' },
    ],
    technical_support: [
      { value: '', label: 'Select a Reason' },
      { value: 'bug_report', label: 'Bug Report' },
      { value: 'performance_issue', label: 'Performance Issue' },
      { value: 'integration_help', label: 'Integration Help' },
    ],
    feature_request: [
      { value: '', label: 'Select a Reason' },
      { value: 'new_feature_idea', label: 'New Feature Idea' },
      { value: 'existing_feature_enhancement', label: 'Existing Feature Enhancement' },
    ],
    other: [
      { value: '', label: 'Select a Reason' },
      { value: 'general_inquiry', label: 'General Inquiry' },
      { value: 'feedback', label: 'Feedback' },
    ],
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
    setReason(""); // Reset reason when subject changes
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleSubmit = () => {
    if (subject && reason) {
      onSubmit(subject, reason);
      setSubject("");
      setReason("");
    } else {
      alert("Please select both a subject and a reason.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-[#1C1C1C] rounded-xl p-6 w-full max-w-md relative transform transition-all sm:my-8 sm:w-full">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-gray-600 text-2xl font-bold"
          aria-label="Close modal"
        >
          <X size={20}/>
        </button>
        <h2 className="text-xl font-bold text-white mb-6 text-center">Create New Ticket</h2>

        <div className="space-y-6">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              value={subject}
              onChange={handleSubjectChange}
              className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white placeholder-gray-500 outline-none"
            >
              {subjects.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-white mb-2">
              Reason
            </label>
            <select
              id="reason"
              name="reason"
              value={reason}
              onChange={handleReasonChange}
              disabled={!subject}
              className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white placeholder-gray-500 outline-none disabled:cursor-not-allowed"
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

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm cursor-pointer border border-gray-300 rounded-lg font-medium text-gray-700 bg-slate-200  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 text-sm cursor-pointer border border-transparent rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!subject || !reason}
            >
              Submit Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// HelpCenter Component (refactored to use the separate modal component)
const HelpCenter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNewTicketClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmitTicket = (subject, reason) => {
    console.log('New ticket submitted:', { subject, reason });
    // In a real application, you would send this data to your backend
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col justify-center items-center md:h-[700px] h-full rounded-3xl bg-[#1C1C1C] text-white relative">
      <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-12">
        Contact us for a fast Response
      </h1>

      <div className="flex justify-center mb-16">
        <div className="bg-white rounded-lg shadow-md p-6 text-center w-full max-w-xs border border-gray-200">
          <div className="flex justify-center items-center mb-4">
          <MdOutlineHelpCenter className="text-black" size={40}/>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Help Center</h2>
          <p className="text-gray-600 text-sm">View Help Articles</p>
        </div>
      </div>

      <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-grow w-full">
          <input
            type="text"
            placeholder="Search for a solution or account"
            className="w-full pl-10 pr-4 py-2 border text-sm border-gray-300 rounded-full"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-search"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
        <button
          onClick={handleNewTicketClick}
          className="w-full sm:w-46 px-6 py-2 bg-blue-600 text-white cursor-pointer text-sm rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          New ticket
        </button>
      </div>

      {/* New Ticket Modal */}
      <NewTicketModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTicket}
      />
    </div>
  );
};

export default HelpCenter;