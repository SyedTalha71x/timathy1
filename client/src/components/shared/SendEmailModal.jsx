/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect } from "react";
import { Mail, X, Search, Send, ChevronDown, Paperclip, Image, FileText, File, Trash2 } from "lucide-react";
import { WysiwygEditor } from "./WysiwygEditor";

// Initials Avatar Component
const InitialsAvatar = ({ firstName, lastName, size = 32, className = "" }) => {
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || "";
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}` || "?";
  };

  return (
    <div
      className={`bg-orange-500 rounded-lg flex items-center justify-center text-white font-semibold ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {getInitials()}
    </div>
  );
};

// Email Tag Component
const EmailTag = ({ recipient, onRemove }) => {
  const isManual = !recipient.id;
  
  return (
    <div className="flex items-center gap-1.5 bg-[#2a2a2a] border border-gray-700 rounded-lg px-2 py-1 text-sm">
      {!isManual && recipient.image ? (
        <img 
          src={recipient.image} 
          alt="" 
          className="w-5 h-5 rounded object-cover"
        />
      ) : !isManual ? (
        <InitialsAvatar 
          firstName={recipient.firstName || recipient.name?.split(" ")[0]} 
          lastName={recipient.lastName || recipient.name?.split(" ")[1]} 
          size={20} 
        />
      ) : (
        <Mail className="w-3.5 h-3.5 text-gray-400" />
      )}
      <span className="text-white text-xs">
        {isManual ? recipient.email : (recipient.name || `${recipient.firstName} ${recipient.lastName}`)}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="p-0.5 hover:bg-gray-600 rounded transition-colors ml-0.5"
      >
        <X className="w-3 h-3 text-gray-400 hover:text-white" />
      </button>
    </div>
  );
};

// Email Input Field with Tags
const EmailTagInput = ({ 
  recipients, 
  setRecipients, 
  searchMembers, 
  placeholder,
  label,
  showRemoveButton = false,
  onRemoveField,
  showAddCc = false,
  onAddCc,
  showAddBcc = false,
  onAddBcc
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Search members when input changes
  useEffect(() => {
    if (inputValue.length > 0 && searchMembers) {
      const results = searchMembers(inputValue);
      // Filter out already selected recipients
      const filtered = results.filter(
        member => !recipients.some(r => r.id === member.id || r.email === member.email)
      );
      setSearchResults(filtered);
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [inputValue, searchMembers, recipients]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Validate email format
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Add a manual email as tag
  const addManualEmail = () => {
    const email = inputValue.trim();
    if (email && isValidEmail(email)) {
      if (!recipients.some(r => r.email === email)) {
        setRecipients([...recipients, { email, isManual: true }]);
      }
      setInputValue("");
      setShowDropdown(false);
    }
  };

  // Handle key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults.length > 0) {
        selectMember(searchResults[0]);
      } else if (inputValue.trim()) {
        addManualEmail();
      }
    } else if (e.key === 'Backspace' && !inputValue && recipients.length > 0) {
      setRecipients(recipients.slice(0, -1));
    } else if (e.key === ',' || e.key === ';') {
      e.preventDefault();
      if (inputValue.trim()) {
        addManualEmail();
      }
    }
  };

  // Select member from dropdown
  const selectMember = (member) => {
    setRecipients([...recipients, {
      id: member.id,
      email: member.email,
      name: member.name || `${member.firstName} ${member.lastName}`,
      firstName: member.firstName,
      lastName: member.lastName,
      image: member.image
    }]);
    setInputValue("");
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  // Remove recipient
  const removeRecipient = (index) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-gray-400">{label}</label>
          <div className="flex items-center gap-2">
            {showAddCc && (
              <button
                onClick={onAddCc}
                className="text-xs text-[#FF843E] hover:text-[#e0733a] transition-colors"
              >
                + CC
              </button>
            )}
            {showAddBcc && (
              <button
                onClick={onAddBcc}
                className="text-xs text-[#FF843E] hover:text-[#e0733a] transition-colors"
              >
                + BCC
              </button>
            )}
            {showRemoveButton && (
              <button
                onClick={onRemoveField}
                className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      )}
      <div 
        className="bg-[#222222] rounded-xl px-3 py-2 min-h-[42px] flex flex-wrap items-center gap-1.5 cursor-text focus-within:bg-[#2a2a2a] transition-colors"
        onClick={() => inputRef.current?.focus()}
      >
        {recipients.map((recipient, index) => (
          <EmailTag 
            key={recipient.id || recipient.email} 
            recipient={recipient}
            onRemove={() => removeRecipient(index)}
          />
        ))}
        <div className="flex-1 min-w-[120px]">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue.length > 0 && setShowDropdown(true)}
            className="w-full bg-transparent text-white text-sm outline-none placeholder-gray-500"
            placeholder={recipients.length === 0 ? placeholder : "Add more..."}
          />
        </div>
        <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
      </div>
      
      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute left-0 right-0 mt-1 bg-[#1C1C1C] border border-gray-800 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto custom-scrollbar">
          {searchResults.length > 0 ? (
            searchResults.map((member) => (
              <button
                key={member.id}
                onClick={() => selectMember(member)}
                className="w-full text-left p-2.5 hover:bg-[#2F2F2F] flex items-center gap-3 transition-colors"
              >
                {member.image ? (
                  <img
                    src={member.image}
                    alt=""
                    className="h-8 w-8 rounded-lg object-cover"
                  />
                ) : (
                  <InitialsAvatar
                    firstName={member.firstName || member.name?.split(" ")[0]}
                    lastName={member.lastName || member.name?.split(" ")[1]}
                    size={32}
                  />
                )}
                <div>
                  <span className="text-sm text-white block">
                    {member.name || `${member.firstName} ${member.lastName}`}
                  </span>
                  <span className="text-xs text-gray-400">{member.email}</span>
                </div>
              </button>
            ))
          ) : inputValue && isValidEmail(inputValue) ? (
            <button
              onClick={addManualEmail}
              className="w-full text-left p-3 hover:bg-[#2F2F2F] flex items-center gap-3 transition-colors"
            >
              <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <span className="text-sm text-white block">Add "{inputValue}"</span>
                <span className="text-xs text-gray-400">Press Enter to add email</span>
              </div>
            </button>
          ) : inputValue ? (
            <p className="p-3 text-sm text-gray-400">
              Type a valid email address or search for members
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
};

// Get file icon based on type
const getFileIcon = (file) => {
  const type = file.type || '';
  if (type.startsWith('image/')) return <Image className="w-4 h-4 text-blue-400" />;
  if (type.includes('pdf')) return <FileText className="w-4 h-4 text-red-400" />;
  return <File className="w-4 h-4 text-gray-400" />;
};

// Format file size
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

// Insert variables helper - returns context-appropriate variables
const getInsertVariables = (context) => {
  if (context === "staff") {
    return [
      { id: 'first_name', label: 'Staff First Name', value: '{Staff_First_Name}' },
      { id: 'last_name', label: 'Staff Last Name', value: '{Staff_Last_Name}' },
      { id: 'studio_name', label: 'Studio Name', value: '{Studio_Name}' },
    ];
  }
  // Default to member
  return [
    { id: 'first_name', label: 'Member First Name', value: '{Member_First_Name}' },
    { id: 'last_name', label: 'Member Last Name', value: '{Member_Last_Name}' },
    { id: 'studio_name', label: 'Studio Name', value: '{Studio_Name}' },
  ];
};

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
  handleSearchMemberForEmail,
  preselectedMember = null,
  signature = "",
  context = "member", // "member" | "staff"
}) => {
  const attachmentInputRef = useRef(null);
  const editorRef = useRef(null);
  const subjectInputRef = useRef(null);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  
  // Get context-appropriate insert variables
  const insertVariables = getInsertVariables(context);
  const [attachments, setAttachments] = useState([]);
  const [toRecipients, setToRecipients] = useState([]);
  const [ccRecipients, setCcRecipients] = useState([]);
  const [bccRecipients, setBccRecipients] = useState([]);

  // Set preselected member when modal opens
  useEffect(() => {
    if (showEmailModal && preselectedMember) {
      setToRecipients([{
        id: preselectedMember.id,
        email: preselectedMember.email,
        name: preselectedMember.name || `${preselectedMember.firstName || ''} ${preselectedMember.lastName || ''}`.trim(),
        firstName: preselectedMember.firstName,
        lastName: preselectedMember.lastName,
        image: preselectedMember.image || preselectedMember.logo || preselectedMember.avatar
      }]);
    }
  }, [showEmailModal, preselectedMember]);

  // Handle attachment upload
  const handleAttachmentUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
    if (attachmentInputRef.current) attachmentInputRef.current.value = '';
  };

  // Remove attachment
  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  // Insert variable into body - using editor ref for direct insertion
  const insertVariable = (variable) => {
    if (editorRef.current?.insertText) {
      editorRef.current.insertText(variable.value);
    }
  };

  // Insert variable into subject field
  const insertVariableToSubject = (variable) => {
    if (subjectInputRef.current) {
      const input = subjectInputRef.current;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const text = emailData.subject || '';
      const newText = text.substring(0, start) + variable.value + text.substring(end);
      setEmailData({ ...emailData, subject: newText });
      setTimeout(() => {
        input.selectionStart = input.selectionEnd = start + variable.value.length;
        input.focus();
      }, 0);
    }
  };

  // Insert signature - using editor ref for direct insertion
  const insertSignature = () => {
    const signatureHtml = signature || '\n\n--\nMit freundlichen GrÃ¼ÃŸen\n{Member_First_Name} {Member_Last_Name}';
    if (editorRef.current?.insertText) {
      editorRef.current.insertText(signatureHtml);
    }
  };

  // Handle send with all data
  const onSendEmail = () => {
    const emailPayload = {
      ...emailData,
      to: toRecipients.map(r => r.email),
      toRecipients: toRecipients,
      cc: ccRecipients.map(r => r.email),
      ccRecipients: ccRecipients,
      bcc: bccRecipients.map(r => r.email),
      bccRecipients: bccRecipients,
      attachments
    };
    handleSendEmail(emailPayload);
    resetModal();
  };

  // Reset modal state
  const resetModal = () => {
    setAttachments([]);
    setShowCc(false);
    setShowBcc(false);
    setToRecipients([]);
    setCcRecipients([]);
    setBccRecipients([]);
  };

  // Close and reset
  const onClose = () => {
    handleCloseEmailModal();
    resetModal();
  };

  if (!showEmailModal) return null;

  const canSend = toRecipients.length > 0 && emailData.subject;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-end md:items-center justify-center z-50">
      <div className="bg-[#181818] w-full h-[95vh] md:h-auto md:rounded-xl md:max-w-4xl md:mx-4 md:max-h-[90vh] flex flex-col">
        <div className="p-4 md:p-5 flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h2 className="text-base md:text-lg font-medium flex items-center gap-2 text-white">
              <Mail className="w-5 h-5" />
              Send Email
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-700 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-1">
            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Email Template
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                  className="w-full bg-[#222222] hover:bg-[#2a2a2a] text-white rounded-xl px-4 py-2.5 text-sm text-left flex items-center justify-between transition-colors"
                >
                  <span className={selectedEmailTemplate ? "text-white" : "text-gray-500"}>
                    {selectedEmailTemplate
                      ? selectedEmailTemplate.name
                      : "Select a template (optional)"}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showTemplateDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showTemplateDropdown && (
                  <div className="absolute left-0 right-0 mt-1 bg-[#1C1C1C] border border-gray-800 rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto">
                    <button
                      onClick={() => {
                        setSelectedEmailTemplate(null);
                        setEmailData({ ...emailData, subject: "", body: "" });
                        setShowTemplateDropdown(false);
                      }}
                      className="w-full text-left p-3 hover:bg-[#2F2F2F] text-sm text-gray-400 border-b border-gray-700 transition-colors"
                    >
                      No template (blank email)
                    </button>
                    {emailTemplates?.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className="w-full text-left p-3 hover:bg-[#2F2F2F] transition-colors"
                      >
                        <div className="font-medium text-sm text-white">{template.name}</div>
                        <div className="text-xs text-gray-400 truncate">
                          {template.subject}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* To Field with Tags */}
            <EmailTagInput
              recipients={toRecipients}
              setRecipients={setToRecipients}
              searchMembers={handleSearchMemberForEmail}
              placeholder="Search members or type email..."
              label="To"
              showAddCc={!showCc}
              onAddCc={() => setShowCc(true)}
              showAddBcc={!showBcc}
              onAddBcc={() => setShowBcc(true)}
            />

            {/* CC Field with Tags */}
            {showCc && (
              <EmailTagInput
                recipients={ccRecipients}
                setRecipients={setCcRecipients}
                searchMembers={handleSearchMemberForEmail}
                placeholder="Search members or type email..."
                label="CC"
                showRemoveButton={true}
                onRemoveField={() => {
                  setShowCc(false);
                  setCcRecipients([]);
                }}
              />
            )}

            {/* BCC Field with Tags */}
            {showBcc && (
              <EmailTagInput
                recipients={bccRecipients}
                setRecipients={setBccRecipients}
                searchMembers={handleSearchMemberForEmail}
                placeholder="Search members or type email..."
                label="BCC"
                showRemoveButton={true}
                onRemoveField={() => {
                  setShowBcc(false);
                  setBccRecipients([]);
                }}
              />
            )}

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Subject
              </label>
              {/* Variables for Subject */}
              <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-2">
                <div className="flex items-center gap-2 min-w-max">
                  <span className="text-xs text-gray-500 mr-1">Variables:</span>
                  {insertVariables.map((variable) => (
                    <button
                      key={`subject-${variable.id}`}
                      onClick={() => insertVariableToSubject(variable)}
                      className="px-2 py-1.5 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
                    >
                      {variable.label}
                    </button>
                  ))}
                </div>
              </div>
              <input
                ref={subjectInputRef}
                type="text"
                value={emailData.subject}
                onChange={(e) =>
                  setEmailData({ ...emailData, subject: e.target.value })
                }
                className="w-full bg-[#222222] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                placeholder="Email subject"
              />
            </div>

            {/* Message with WYSIWYG Editor */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-400">Message</label>
              </div>
              {/* Variables and Insert row - horizontal scrollable on mobile */}
              <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-2">
                <div className="flex items-center gap-2 min-w-max">
                  <span className="text-xs text-gray-500 mr-1">Variables:</span>
                  {insertVariables.map((variable) => (
                    <button
                      key={variable.id}
                      onClick={() => insertVariable(variable)}
                      className="px-2 py-1.5 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
                    >
                      {variable.label}
                    </button>
                  ))}
                  <span className="text-xs text-gray-500 mx-1">|</span>
                  <span className="text-xs text-gray-500 mr-1">Insert:</span>
                  <button
                    onClick={insertSignature}
                    className="px-2 py-1.5 bg-orange-500 text-white text-xs rounded-lg hover:bg-orange-600 flex items-center gap-1 transition-colors whitespace-nowrap"
                  >
                    <FileText className="w-3 h-3" />
                    Signature
                  </button>
                </div>
              </div>
              <WysiwygEditor
                ref={editorRef}
                value={emailData.body}
                onChange={(content) => setEmailData({ ...emailData, body: content })}
                placeholder="Type your email message here..."
                minHeight={140}
                maxHeight={250}
                showImages={true}
              />
            </div>

            {/* Attachments */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-400">
                  Attachments
                </label>
                <input
                  ref={attachmentInputRef}
                  type="file"
                  multiple
                  onChange={handleAttachmentUpload}
                  className="hidden"
                />
                <button
                  onClick={() => attachmentInputRef.current?.click()}
                  className="flex items-center gap-1.5 text-xs text-[#FF843E] hover:text-[#e0733a] transition-colors"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  Add Attachment
                </button>
              </div>
              
              {attachments.length > 0 && (
                <div className="bg-[#222222] rounded-xl p-2 md:p-3 space-y-2">
                  {attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between bg-[#1a1a1a] rounded-lg px-3 py-2"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {getFileIcon(attachment)}
                        <span className="text-sm text-white truncate">{attachment.name}</span>
                        <span className="text-xs text-gray-500 flex-shrink-0 hidden sm:inline">
                          ({formatFileSize(attachment.size)})
                        </span>
                      </div>
                      <button
                        onClick={() => removeAttachment(attachment.id)}
                        className="p-1.5 text-gray-500 hover:text-red-400 transition-colors ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {attachments.length === 0 && (
                <div 
                  onClick={() => attachmentInputRef.current?.click()}
                  className="border border-dashed border-gray-700 rounded-xl p-3 md:p-4 text-center cursor-pointer hover:border-gray-600 transition-colors"
                >
                  <Paperclip className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">
                    Tap to add attachments
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 flex-shrink-0">
              <button
                onClick={onClose}
                className="flex-1 md:flex-none px-4 py-3 md:py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSendEmail}
                disabled={!canSend}
                className="flex-1 md:flex-none px-4 py-3 md:py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl text-sm flex items-center justify-center gap-2 transition-colors disabled:cursor-not-allowed"
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
