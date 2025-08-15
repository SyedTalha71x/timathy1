/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Settings, 
  X, 
  Inbox, 
  FileText, 
  MoreVertical, 
  Archive, 
  Eye, 
  EyeOff, 
  Pin, 
  PinOff 
} from 'lucide-react';

const EmailManagement = ({ 
  isOpen, 
  onClose, 
  onOpenSendEmail, 
  onOpenSettings,
  initialEmailList = {
    inbox: [],
    sent: [],
    draft: [],
    outbox: [],
    archive: [],
    error: []
  }
}) => {
  const [emailTab, setEmailTab] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [emailList, setEmailList] = useState(initialEmailList);

  const updateEmailStatus = (emailId, updates) => {
    setEmailList(prev => {
      const newEmailList = { ...prev };
      Object.keys(newEmailList).forEach(folder => {
        newEmailList[folder] = newEmailList[folder].map(email => 
          email.id === emailId ? { ...email, ...updates } : email
        );
      });
      return newEmailList;
    });
  };

  const toggleDropdown = (emailId, e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === emailId ? null : emailId);
  };

  const handleMenuAction = (action, email, e) => {
    e.stopPropagation();
    
    switch (action) {
      case 'toggleRead':
        updateEmailStatus(email.id, { 
          isRead: !email.isRead, 
          status: email.isRead ? 'Delivered' : 'Read' 
        });
        break;
      case 'togglePin':
        updateEmailStatus(email.id, { isPinned: !email.isPinned });
        break;
      case 'toggleArchive':
        updateEmailStatus(email.id, { isArchived: !email.isArchived });
        break;
      default:
        break;
    }
    setActiveDropdown(null);
  };

  const handleEmailTabClick = (tab) => {
    setEmailTab(tab);
    setSelectedEmail(null);
    setActiveDropdown(null);
  };

  const handleEmailItemClick = (email) => {
    if (!email.isRead) {
      updateEmailStatus(email.id, { isRead: true, status: 'Read' });
    }
    setSelectedEmail(email);
    setActiveDropdown(null);
  };

  const getFilteredEmails = () => {
    let emails = emailList[emailTab] || [];
  
    if (emailTab === "archive") {
      // Sirf archived dikhaye
      return Object.values(emailList)
        .flat()
        .filter(email => email.isArchived)
        .sort((a, b) => new Date(b.time) - new Date(a.time));
    }
  
    if (emailTab === "error") {
      // Sirf error list
      return emails.sort((a, b) => new Date(b.time) - new Date(a.time));
    }
  
    // Baaki folders archived ko skip kare
    return emails
      .filter(email => !email.isArchived)
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.time) - new Date(a.time);
      });
  };
  

  if (!isOpen) return null;

  return (
    <>
      {/* Email Frontend Modal (Full Screen) */}
      <div className="fixed inset-0 bg-black/80 flex flex-col z-50">
        <div className="bg-[#181818] flex-1 flex flex-col rounded-xl m-4">
          <div className="p-4 flex-shrink-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Management
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenSendEmail}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Email
                </button>
                <button 
                  onClick={onOpenSettings} 
                  className="p-2 hover:bg-zinc-700 rounded-lg"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button 
                  onClick={onClose} 
                  className="p-2 hover:bg-zinc-700 rounded-lg"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            {/* Email Tabs */}
          {/* Email Tabs */}
<div className="flex gap-2 mb-4 border-b border-gray-700">
  <button
    onClick={() => handleEmailTabClick("inbox")}
    className={`px-4 py-2 text-sm rounded-t-lg flex items-center gap-2 ${
      emailTab === "inbox" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
    }`}
  >
    <Inbox size={16} />
    Inbox
    {emailList.inbox.filter((e) => !e.isRead && !e.isArchived).length > 0 && (
      <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {emailList.inbox.filter((e) => !e.isRead && !e.isArchived).length}
      </span>
    )}
  </button>
  <button
    onClick={() => handleEmailTabClick("sent")}
    className={`px-4 py-2 text-sm rounded-t-lg flex items-center gap-2 ${
      emailTab === "sent" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
    }`}
  >
    <Send size={16} />
    Sent
  </button>
  <button
    onClick={() => handleEmailTabClick("draft")}
    className={`px-4 py-2 text-sm rounded-t-lg flex items-center gap-2 ${
      emailTab === "draft" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
    }`}
  >
    <FileText size={16} />
    Draft
  </button>
  <button
    onClick={() => handleEmailTabClick("archive")}
    className={`px-4 py-2 text-sm rounded-t-lg flex items-center gap-2 ${
      emailTab === "archive" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
    }`}
  >
    <Archive size={16} />
    Archive
  </button>
  <button
    onClick={() => handleEmailTabClick("error")}
    className={`px-4 py-2 text-sm rounded-t-lg flex items-center gap-2 ${
      emailTab === "error" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
    }`}
  >
     Error
    {emailList.error.length > 0 && (
      <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {emailList.error.length}
      </span>
    )}
  </button>
</div>

          </div>
          
          {/* Email List / Email View */}
          <div className="flex-1 overflow-y-auto p-4">
            {selectedEmail ? (
              // Full Email Content View
              <div className="bg-[#222222] rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-medium">{selectedEmail.subject}</h3>
                  <button 
                    onClick={() => setSelectedEmail(null)} 
                    className="p-2 hover:bg-zinc-700 rounded-lg"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="text-sm text-gray-400 mb-4">
                  <p>
                    From: {selectedEmail.sender || "You"}
                    {selectedEmail.recipient && ` To: ${selectedEmail.recipient}`}
                  </p>
                  <p>Date: {new Date(selectedEmail.time).toLocaleString()}</p>
                </div>
                <div className="prose prose-invert text-white text-sm leading-relaxed">
                  <p>{selectedEmail.body}</p>
                </div>
              </div>
            ) : (
              // Email List
              <div className="space-y-2">
                {getFilteredEmails().length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No emails in this folder.</div>
                ) : (
                  getFilteredEmails().map((email) => (
                    <div
                      key={email.id}
                      className={`relative flex items-center justify-between p-3 bg-[#222222] rounded-xl hover:bg-[#2F2F2F] cursor-pointer ${
                        !email.isRead ? "border-l-4 border-blue-500" : ""
                      } ${email.isPinned ? "ring-1 ring-yellow-500" : ""}`}
                      onClick={() => handleEmailItemClick(email)}
                    >
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-600 bg-transparent"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex items-center gap-2">
                          {email.isPinned && <Pin className="w-3 h-3 text-yellow-500" />}
                          <div>
                            <p className="font-medium text-sm">
                              {email.sender || email.recipient}
                              {!email.isRead && <span className="ml-2 text-blue-400"> (Unread)</span>}
                            </p>
                            <p className="text-xs text-gray-400">{email.subject}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            email.status === "Read"
                              ? "bg-blue-600"
                              : email.status === "Delivered"
                                ? "bg-green-600"
                                : "bg-gray-600"
                          }`}
                        >
                          {email.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(email.time).toLocaleDateString()}
                        </span>
                        <div className="relative">
                          <button 
                            className="p-1 hover:bg-gray-600 rounded"
                            onClick={(e) => toggleDropdown(email.id, e)}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {/* Dropdown Menu */}
                          {activeDropdown === email.id && (
                            <div className="absolute right-0 top-8 bg-[#2F2F2F] border border-gray-600 rounded-lg shadow-lg z-10 min-w-[160px]">
                              <button
                                onClick={(e) => handleMenuAction('toggleRead', email, e)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-600 first:rounded-t-lg"
                              >
                                {email.isRead ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                Mark as {email.isRead ? 'Unread' : 'Read'}
                              </button>
                              <button
                                onClick={(e) => handleMenuAction('togglePin', email, e)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-600"
                              >
                                {email.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                                {email.isPinned ? 'Unpin' : 'Pin'}
                              </button>
                              <button
                                onClick={(e) => handleMenuAction('toggleArchive', email, e)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-600 last:rounded-b-lg"
                              >
                                <Archive className="w-4 h-4" />
                                {email.isArchived ? 'Unarchive' : 'Archive'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Click outside to close dropdown */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </>
  );
};

export default EmailManagement;