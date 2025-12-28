/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import { Mail, Search, Send, X, Paperclip, Type, User, Building, Check, AtSign, Calendar, Hash, Eye, Signature, UserCircle, IdCard, Mail as MailIcon, CalendarDays, Building as BuildingIcon } from "lucide-react";
import { WysiwygEditor } from "../configuration-components/WysiwygEditor";

const EmailModal = ({
  show,
  onClose,
  emailData,
  setEmailData,
  handleSendEmail,
  emailTemplates,
  selectedEmailTemplate,
  handleTemplateSelect,
  showTemplateDropdown,
  setShowTemplateDropdown,
  showRecipientDropdown,
  setShowRecipientDropdown,
  handleSearchMemberForEmail,
  handleSelectEmailRecipient,
}) => {
  const [recipients, setRecipients] = useState([]);
  const [ccRecipients, setCcRecipients] = useState([]);
  const [bccRecipients, setBccRecipients] = useState([]);
  const [recipientInput, setRecipientInput] = useState("");
  const [ccInput, setCcInput] = useState("");
  const [bccInput, setBccInput] = useState("");
  const [activeRecipientField, setActiveRecipientField] = useState('to'); // 'to', 'cc', or 'bcc'
  const [attachments, setAttachments] = useState([]);
  const [showInsertDropdown, setShowInsertDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const fileInputRef = useRef(null);
  const insertDropdownRef = useRef(null);
  const recipientDropdownRef = useRef(null);

  // Studio details
  const studioName = "Your Studio Name";
  const signature = `<p>Best regards,<br/>
<strong>[Your Name]</strong><br/>
[Your Position]<br/>
${studioName}<br/>
[Contact Info]</p>`;

  // Initialize with existing recipients
  useEffect(() => {
    if (emailData.to) {
      const initialRecipients = emailData.to.split(',').map(r => r.trim()).filter(r => r);
      setRecipients(initialRecipients);
    } else {
      setRecipients([]);
    }

    // Initialize CC recipients if provided
    if (emailData.cc) {
      const initialCc = emailData.cc.split(',').map(r => r.trim()).filter(r => r);
      setCcRecipients(initialCc);
    } else {
      setCcRecipients([]);
    }

    // Initialize BCC recipients if provided
    if (emailData.bcc) {
      const initialBcc = emailData.bcc.split(',').map(r => r.trim()).filter(r => r);
      setBccRecipients(initialBcc);
    } else {
      setBccRecipients([]);
    }
  }, [emailData.to, emailData.cc, emailData.bcc]);

  // Update emailData when recipients change
  useEffect(() => {
    setEmailData(prev => ({
      ...prev,
      to: recipients.join(', '),
      cc: ccRecipients.join(', '),
      bcc: bccRecipients.join(', ')
    }));
  }, [recipients, ccRecipients, bccRecipients, setEmailData]);

  // Handle search for members based on active field
  useEffect(() => {
    if ((activeRecipientField === 'to' && recipientInput.length > 0) ||
        (activeRecipientField === 'cc' && ccInput.length > 0) ||
        (activeRecipientField === 'bcc' && bccInput.length > 0)) {
      const searchTerm = activeRecipientField === 'to' ? recipientInput : 
                        activeRecipientField === 'cc' ? ccInput : bccInput;
      const results = handleSearchMemberForEmail(searchTerm);
      setSearchResults(results);
      setShowRecipientDropdown(true);
    } else {
      setSearchResults([]);
    }
  }, [recipientInput, ccInput, bccInput, activeRecipientField, handleSearchMemberForEmail]);

  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (insertDropdownRef.current && !insertDropdownRef.current.contains(event.target)) {
        setShowInsertDropdown(false);
      }
      if (recipientDropdownRef.current && !recipientDropdownRef.current.contains(event.target)) {
        setShowRecipientDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!show) return null;

  // Helper function to add recipient to specific field
  const addRecipientToField = (member, field) => {
    const email = member.email || member.name;
    const currentRecipients = field === 'to' ? recipients : 
                             field === 'cc' ? ccRecipients : bccRecipients;
    const setter = field === 'to' ? setRecipients : 
                   field === 'cc' ? setCcRecipients : setBccRecipients;

    if (!currentRecipients.some(r => r.toLowerCase() === email.toLowerCase())) {
      setter(prev => [...prev, email]);
    }
    
    // Clear the appropriate input
    if (field === 'to') {
      setRecipientInput("");
    } else if (field === 'cc') {
      setCcInput("");
    } else {
      setBccInput("");
    }
    
    setShowRecipientDropdown(false);
  };

  // Handle adding recipients from dropdown
  const handleAddRecipient = (member) => {
    addRecipientToField(member, activeRecipientField);
  };

  // Handle input for different recipient fields
  const handleInputRecipient = (e, field) => {
    const value = e.target.value;
    if (field === 'to') {
      setRecipientInput(value);
    } else if (field === 'cc') {
      setCcInput(value);
    } else {
      setBccInput(value);
    }
    setActiveRecipientField(field);
  };

  const handleKeyDown = (e, field) => {
    const input = field === 'to' ? recipientInput : 
                 field === 'cc' ? ccInput : bccInput;
    const currentRecipients = field === 'to' ? recipients : 
                             field === 'cc' ? ccRecipients : bccRecipients;
    const setter = field === 'to' ? setRecipients : 
                   field === 'cc' ? setCcRecipients : setBccRecipients;

    if (e.key === 'Enter' && input.trim()) {
      const email = input.trim();
      if (!currentRecipients.some(r => r.toLowerCase() === email.toLowerCase())) {
        setter(prev => [...prev, email]);
      }
      
      if (field === 'to') {
        setRecipientInput("");
      } else if (field === 'cc') {
        setCcInput("");
      } else {
        setBccInput("");
      }
      e.preventDefault();
    } else if (e.key === 'Backspace' && input === '' && currentRecipients.length > 0) {
      setter(prev => prev.slice(0, -1));
    }
  };

  const handleRemoveRecipient = (index, field) => {
    if (field === 'to') {
      setRecipients(prev => prev.filter((_, i) => i !== index));
    } else if (field === 'cc') {
      setCcRecipients(prev => prev.filter((_, i) => i !== index));
    } else {
      setBccRecipients(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Helper function to render recipient chips
  const renderRecipientChips = (recipientList, field) => {
    return recipientList.map((recipient, index) => (
      <div
        key={`${field}-${index}`}
        className="flex items-center gap-2 bg-blue-600/20 text-blue-400 px-3 py-1.5 rounded-full text-sm"
      >
        <User className="w-3 h-3" />
        <span className="font-medium">{recipient}</span>
        <button
          onClick={() => handleRemoveRecipient(index, field)}
          className="hover:text-blue-300 transition-colors ml-1"
        >
          <X size={14} />
        </button>
      </div>
    ));
  };

  // Attachment handling
  const handleAddAttachment = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  const handleRemoveAttachment = (id) => {
    setAttachments(attachments.filter(att => att.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Insert functions
  const handleInsertSignature = () => {
    setEmailData({
      ...emailData,
      body: emailData.body + (emailData.body ? '<br><br>' : '') + signature
    });
    setShowInsertDropdown(false);
  };

  const handleInsertFirstName = () => {
    setEmailData({
      ...emailData,
      body: emailData.body + (emailData.body ? ' ' : '') + '<strong>[Member First Name]</strong>'
    });
    setShowInsertDropdown(false);
  };

  const handleInsertLastName = () => {
    setEmailData({
      ...emailData,
      body: emailData.body + (emailData.body ? ' ' : '') + '<strong>[Member Last Name]</strong>'
    });
    setShowInsertDropdown(false);
  };

  const handleInsertStudioName = () => {
    setEmailData({
      ...emailData,
      body: emailData.body + (emailData.body ? ' ' : '') + `<strong>[${studioName}]</strong>`
    });
    setShowInsertDropdown(false);
  };

  const handleInsertEmail = () => {
    setEmailData({
      ...emailData,
      body: emailData.body + (emailData.body ? ' ' : '') + '[Member Email]'
    });
    setShowInsertDropdown(false);
  };

  const handleInsertDate = () => {
    const today = new Date().toLocaleDateString();
    setEmailData({
      ...emailData,
      body: emailData.body + (emailData.body ? ' ' : '') + today
    });
    setShowInsertDropdown(false);
  };

  const handleInsertMemberId = () => {
    setEmailData({
      ...emailData,
      body: emailData.body + (emailData.body ? ' ' : '') + '[Member ID]'
    });
    setShowInsertDropdown(false);
  };

  // Handle email body changes with WysiwygEditor
  const handleBodyChange = (content) => {
    setEmailData(prev => ({ ...prev, body: content }));
  };

  // Handle email sending with attachments
  const handleSendEmailWithAttachments = () => {
    if (!recipients.length || !emailData.subject || !emailData.body) {
      alert("Please fill in all required fields: To, Subject, and Message");
      return;
    }

    // Prepare email with attachments
    const emailWithAttachments = {
      ...emailData,
      to: recipients.join(', '),
      cc: ccRecipients.join(', '),
      bcc: bccRecipients.join(', '),
      attachments: attachments.map(att => ({
        name: att.name,
        size: att.size,
        url: URL.createObjectURL(att.file)
      }))
    };
    
    handleSendEmail(emailWithAttachments);
    setRecipients([]);
    setCcRecipients([]);
    setBccRecipients([]);
    setRecipientInput("");
    setCcInput("");
    setBccInput("");
    setAttachments([]);
  };

  // Get placeholder based on active field
  const getPlaceholderText = (field) => {
    const count = field === 'to' ? recipients.length : 
                  field === 'cc' ? ccRecipients.length : bccRecipients.length;
    if (count === 0) {
      return "Type email or search members...";
    }
    return "Add more...";
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-5xl custom-scrollbar mx-4 max-h-[90vh] overflow-y-auto border border-gray-800">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Mail className="w-8 h-8 text-blue-500" />
              <div>
                <h2 className="text-xl font-semibold text-white">Send Email</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Template</label>
              <div className="relative">
                <button
                  onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                  className="w-full bg-[#222222] border border-gray-700 text-white rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between hover:border-gray-600 transition-colors"
                >
                  <span className={selectedEmailTemplate ? "text-white" : "text-gray-400"}>
                    {selectedEmailTemplate
                      ? selectedEmailTemplate.name
                      : "Select a template (optional)"}
                  </span>
                  <Search className="h-4 w-4 text-gray-400" />
                </button>
                {showTemplateDropdown && (
                  <div className="absolute left-0 right-0 mt-2 bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-xl z-20 max-h-64 overflow-y-auto">
                    <button
                      onClick={() => {
                        setEmailData({ ...emailData, subject: "", body: "" });
                        handleTemplateSelect(null);
                        setShowTemplateDropdown(false);
                      }}
                      className="w-full text-left p-3 hover:bg-[#2F2F2F] text-sm text-gray-400 border-b border-gray-700"
                    >
                      No template (blank email)
                    </button>
                    {emailTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => {
                          handleTemplateSelect(template);
                          setShowTemplateDropdown(false);
                        }}
                        className="w-full text-left p-3 hover:bg-[#2F2F2F] border-b border-gray-700 last:border-b-0"
                      >
                        <div className="font-medium text-sm text-white">{template.name}</div>
                        <div className="text-xs text-gray-400 truncate mt-1">
                          {template.subject}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* To Field with Multiple Recipients */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                To <span className="text-red-400">*</span>
              </label>
              <div className="relative" ref={recipientDropdownRef}>
                <div className="flex flex-wrap items-center gap-2 p-2 bg-[#222222] border border-gray-700 rounded-xl min-h-[44px]">
                  {renderRecipientChips(recipients, 'to')}
                  <input
                    type="text"
                    value={recipientInput}
                    onChange={(e) => handleInputRecipient(e, 'to')}
                    onKeyDown={(e) => handleKeyDown(e, 'to')}
                    onFocus={() => {
                      setActiveRecipientField('to');
                      if (recipientInput.length > 0) setShowRecipientDropdown(true);
                    }}
                    className="flex-1 bg-transparent text-white text-sm outline-none min-w-[120px] placeholder-gray-500"
                    placeholder={getPlaceholderText('to')}
                  />
                </div>
              </div>
            </div>

            {/* CC Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                CC
              </label>
              <div className="relative">
                <div className="flex flex-wrap items-center gap-2 p-2 bg-[#222222] border border-gray-700 rounded-xl min-h-[44px]">
                  {renderRecipientChips(ccRecipients, 'cc')}
                  <input
                    type="text"
                    value={ccInput}
                    onChange={(e) => handleInputRecipient(e, 'cc')}
                    onKeyDown={(e) => handleKeyDown(e, 'cc')}
                    onFocus={() => {
                      setActiveRecipientField('cc');
                      if (ccInput.length > 0) setShowRecipientDropdown(true);
                    }}
                    className="flex-1 bg-transparent text-white text-sm outline-none min-w-[120px] placeholder-gray-500"
                    placeholder={getPlaceholderText('cc')}
                  />
                </div>
              </div>
            </div>

            {/* BCC Field - NEW FIELD ADDED */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                BCC
              </label>
              <div className="relative">
                <div className="flex flex-wrap items-center gap-2 p-2 bg-[#222222] border border-gray-700 rounded-xl min-h-[44px]">
                  {renderRecipientChips(bccRecipients, 'bcc')}
                  <input
                    type="text"
                    value={bccInput}
                    onChange={(e) => handleInputRecipient(e, 'bcc')}
                    onKeyDown={(e) => handleKeyDown(e, 'bcc')}
                    onFocus={() => {
                      setActiveRecipientField('bcc');
                      if (bccInput.length > 0) setShowRecipientDropdown(true);
                    }}
                    className="flex-1 bg-transparent text-white text-sm outline-none min-w-[120px] placeholder-gray-500"
                    placeholder={getPlaceholderText('bcc')}
                  />
                </div>
                
                {showRecipientDropdown && searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-xl z-20 max-h-64 overflow-y-auto custom-scrollbar">
                    {searchResults.map((member) => {
                      const currentRecipients = activeRecipientField === 'to' ? recipients : 
                                               activeRecipientField === 'cc' ? ccRecipients : bccRecipients;
                      const email = member.email || member.name;
                      const isSelected = currentRecipients.some(r => r.toLowerCase() === email.toLowerCase());
                      
                      return (
                        <button
                          key={member.id}
                          onClick={() => handleAddRecipient(member)}
                          className="w-full text-left p-3 hover:bg-[#2F2F2F] flex items-center gap-3 border-b border-gray-700 last:border-b-0"
                        >
                          <img
                            src={member.logo || "/placeholder.svg"}
                            alt={member.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-white">{member.name}</span>
                              {isSelected && (
                                <Check className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            {member.email && (
                              <div className="text-xs text-gray-400 mt-1">{member.email}</div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subject <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={emailData.subject}
                onChange={(e) =>
                  setEmailData({ ...emailData, subject: e.target.value })
                }
                className="w-full bg-[#222222] border border-gray-700 text-white rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Email subject"
              />
            </div>

            {/* Message with Wysiwyg Editor and Insert Button */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Message <span className="text-red-400">*</span>
                </label>
                <div className="relative" ref={insertDropdownRef}>
                  <button
                    onClick={() => setShowInsertDropdown(!showInsertDropdown)}
                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm flex items-center gap-2 transition-colors"
                  >
                    <Type className="w-4 h-4" />
                    Insert
                  </button>
                  {showInsertDropdown && (
                    <div className="absolute right-0 mt-2 bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-xl z-20 w-60 overflow-hidden">
                      {/* Signature button with icon */}
                      <button
                        onClick={handleInsertSignature}
                        className="w-full text-left p-3 hover:bg-[#2F2F2F] text-sm text-gray-300 flex items-center gap-2"
                      >
                        <Signature className="w-4 h-4 text-gray-400" />
                        Signature
                      </button>
                      
                      {/* Member Information Section */}
                      <div className="border-t border-gray-700">
                        <button
                          onClick={handleInsertFirstName}
                          className="w-full text-left p-3 hover:bg-[#2F2F2F] text-sm text-gray-300 flex items-center gap-2"
                        >
                          <UserCircle className="w-4 h-4 text-gray-400" />
                          First Name
                        </button>
                        <button
                          onClick={handleInsertLastName}
                          className="w-full text-left p-3 hover:bg-[#2F2F2F] text-sm text-gray-300 flex items-center gap-2"
                        >
                          <UserCircle className="w-4 h-4 text-gray-400" />
                          Last Name
                        </button>
                        <button
                          onClick={handleInsertMemberId}
                          className="w-full text-left p-3 hover:bg-[#2F2F2F] text-sm text-gray-300 flex items-center gap-2"
                        >
                          <IdCard className="w-4 h-4 text-gray-400" />
                          Member ID
                        </button>
                      </div>
                      
                      {/* Other Information Section */}
                      <div className="border-t border-gray-700">
                        <button
                          onClick={handleInsertEmail}
                          className="w-full text-left p-3 hover:bg-[#2F2F2F] text-sm text-gray-300 flex items-center gap-2"
                        >
                          <MailIcon className="w-4 h-4 text-gray-400" />
                          Email
                        </button>
                        <button
                          onClick={handleInsertDate}
                          className="w-full text-left p-3 hover:bg-[#2F2F2F] text-sm text-gray-300 flex items-center gap-2"
                        >
                          <CalendarDays className="w-4 h-4 text-gray-400" />
                          Today's Date
                        </button>
                        <button
                          onClick={handleInsertStudioName}
                          className="w-full text-left p-3 hover:bg-[#2F2F2F] text-sm text-gray-300 flex items-center gap-2"
                        >
                          <BuildingIcon className="w-4 h-4 text-gray-400" />
                          Studio Name
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border border-gray-700 rounded-xl overflow-hidden">
                <WysiwygEditor
                  value={emailData.body}
                  onChange={handleBodyChange}
                  placeholder="Type your email message here..."
                />
              </div>
            </div>

            {/* Attachments Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Attachments
                </label>
                <button
                  onClick={handleAddAttachment}
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm flex items-center gap-2 transition-colors"
                >
                  <Paperclip className="w-4 h-4" />
                  Add Attachment
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  multiple
                  className="hidden"
                />
              </div>
              
              {attachments.length > 0 && (
                <div className="bg-[#222222] border border-gray-700 rounded-xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between bg-gray-800/50 px-3 py-2.5 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-700 rounded-lg">
                            <Paperclip className="w-4 h-4 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white truncate">
                              {attachment.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {formatFileSize(attachment.size)}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveAttachment(attachment.id)}
                          className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-400 hover:text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-800">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmailWithAttachments}
                disabled={!recipients.length || !emailData.subject || !emailData.body}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
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

export default EmailModal;