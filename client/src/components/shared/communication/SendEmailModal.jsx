/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect } from "react";
import { Mail, X, Search, Send, ChevronDown, Paperclip, Image, FileText, File, Trash2, AlertTriangle } from "lucide-react";
import { WysiwygEditor } from "../WysiwygEditor";
import DraftModal from "./DraftModal";

// Import email signature from configuration (Single Source of Truth)
import { DEFAULT_COMMUNICATION_SETTINGS } from "../../../utils/studio-states/configuration-states";
import { emailTemplatesData } from "../../../utils/studio-states/communication-states";

// Initials Avatar Component
const InitialsAvatar = ({ firstName, lastName, size = 32, className = "", isStaff = false }) => {
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || "";
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}` || "?";
  };

  const bgColor = 'bg-primary';

  return (
    <div
      className={`${bgColor} rounded-lg flex items-center justify-center text-white font-semibold ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {getInitials()}
    </div>
  );
};

// Email Tag Component
const EmailTag = ({ recipient, onRemove }) => {
  const isManual = !recipient.id;
  const displayName = recipient.name || `${recipient.firstName || ''} ${recipient.lastName || ''}`.trim();
  const isStaff = recipient.type === 'staff';
  
  return (
    <div className="flex items-center gap-1.5 bg-surface-card border border-border rounded-lg px-2 py-1 text-sm">
      {isManual ? (
        <Mail className="w-3.5 h-3.5 text-content-muted" />
      ) : recipient.image ? (
        <img 
          src={recipient.image} 
          alt="" 
          className="w-5 h-5 rounded object-cover"
        />
      ) : (
        <InitialsAvatar 
          firstName={recipient.firstName || recipient.name?.split(" ")[0]} 
          lastName={recipient.lastName || recipient.name?.split(" ")[1]} 
          size={20}
          isStaff={isStaff}
        />
      )}
      <span className="text-content-primary text-xs">
        {isManual ? recipient.email : (
          <>
            {displayName}
            {recipient.email && <span className="text-content-muted ml-1">&lt;{recipient.email}&gt;</span>}
          </>
        )}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="p-0.5 hover:bg-surface-button-hover rounded transition-colors ml-0.5"
      >
        <X className="w-3 h-3 text-content-muted hover:text-content-primary" />
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
      image: member.image,
      type: member.type // Keep track of member/staff type
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
          <label className="text-sm font-medium text-content-muted">{label}</label>
          <div className="flex items-center gap-2">
            {showAddCc && (
              <button
                onClick={onAddCc}
                className="text-xs text-primary hover:text-primary-hover transition-colors"
              >
                + CC
              </button>
            )}
            {showAddBcc && (
              <button
                onClick={onAddBcc}
                className="text-xs text-primary hover:text-primary-hover transition-colors"
              >
                + BCC
              </button>
            )}
            {showRemoveButton && (
              <button
                onClick={onRemoveField}
                className="text-xs text-content-faint hover:text-content-muted transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      )}
      <div 
        className="bg-surface-dark rounded-xl px-3 py-2 min-h-[42px] flex flex-wrap items-center gap-1.5 cursor-text border border-transparent focus-within:border-primary transition-colors"
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
            className="w-full bg-transparent text-content-primary text-sm outline-none placeholder-content-faint"
            placeholder={recipients.length === 0 ? placeholder : "Add more..."}
          />
        </div>
        <Search className="h-4 w-4 text-content-muted flex-shrink-0" />
      </div>
      
      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute left-0 right-0 mt-1 bg-surface-base border border-border rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto custom-scrollbar">
          {searchResults.length > 0 ? (
            searchResults.map((member) => (
              <button
                key={member.id}
                onClick={() => selectMember(member)}
                className="w-full text-left p-2.5 hover:bg-surface-button flex items-center gap-3 transition-colors"
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
                    isStaff={member.type === 'staff'}
                  />
                )}
                <div>
                  <span className="text-sm text-content-primary block">
                    {member.name || `${member.firstName} ${member.lastName}`}
                    {member.type === 'staff' && <span className="ml-2 text-xs text-primary">(Staff)</span>}
                  </span>
                  <span className="text-xs text-content-muted">{member.email}</span>
                </div>
              </button>
            ))
          ) : inputValue && isValidEmail(inputValue) ? (
            <button
              onClick={addManualEmail}
              className="w-full text-left p-3 hover:bg-surface-button flex items-center gap-3 transition-colors"
            >
              <div className="w-8 h-8 bg-surface-button rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-content-muted" />
              </div>
              <div>
                <span className="text-sm text-content-primary block">Add "{inputValue}"</span>
                <span className="text-xs text-content-muted">Press Enter to add email</span>
              </div>
            </button>
          ) : inputValue ? (
            <p className="p-3 text-sm text-content-muted">
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
  if (type.startsWith('image/')) return <Image className="w-4 h-4 text-primary" />;
  if (type.includes('pdf')) return <FileText className="w-4 h-4 text-red-400" />;
  return <File className="w-4 h-4 text-content-muted" />;
};

// Format file size
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const SendEmailModal = ({
  showEmailModal,
  handleCloseEmailModal,
  handleSendEmail,
  emailData,
  setEmailData,
  handleSearchMemberForEmail,
  preselectedMember = null,
  editingDraft = null, // Draft being edited
  onSaveAsDraft = null, // Callback to save as draft
  // Note: signature is now imported from configuration-states (Single Source of Truth)
}) => {
  const attachmentInputRef = useRef(null);
  const editorRef = useRef(null);
  const subjectInputRef = useRef(null);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [showDraftConfirmModal, setShowDraftConfirmModal] = useState(false);
  
  const [attachments, setAttachments] = useState([]);
  const [toRecipients, setToRecipients] = useState([]);
  const [ccRecipients, setCcRecipients] = useState([]);
  const [bccRecipients, setBccRecipients] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const templateDropdownRef = useRef(null);

  // Set preselected member when modal opens
  useEffect(() => {
    if (showEmailModal && preselectedMember) {
      // Determine if this is a staff member (has 'img' field or comes from staff context)
      const isStaff = preselectedMember.img !== undefined || preselectedMember.role !== undefined;
      
      setToRecipients([{
        id: isStaff ? `staff-${preselectedMember.id}` : `member-${preselectedMember.id}`,
        email: preselectedMember.email,
        name: preselectedMember.name || `${preselectedMember.firstName || ''} ${preselectedMember.lastName || ''}`.trim(),
        firstName: preselectedMember.firstName,
        lastName: preselectedMember.lastName,
        image: preselectedMember.image || preselectedMember.img || preselectedMember.logo || preselectedMember.avatar,
        type: isStaff ? 'staff' : 'member'
      }]);
    }
  }, [showEmailModal, preselectedMember]);

  // Load draft data when editing a draft
  useEffect(() => {
    if (showEmailModal && editingDraft) {
      // Parse To recipients
      if (editingDraft.recipientEmail) {
        const emails = editingDraft.recipientEmail.split(",").map(e => e.trim()).filter(Boolean);
        const names = editingDraft.recipient ? editingDraft.recipient.split(",").map(n => n.trim()) : [];
        const toRecs = emails.map((email, idx) => ({
          email,
          name: names[idx] || email,
          isManual: true
        }));
        setToRecipients(toRecs);
      }
      // Parse CC recipients
      if (editingDraft.cc) {
        const ccEmails = editingDraft.cc.split(",").map(e => e.trim()).filter(Boolean);
        const ccRecs = ccEmails.map(email => ({ email, name: email, isManual: true }));
        setCcRecipients(ccRecs);
        if (ccRecs.length > 0) setShowCc(true);
      }
      // Parse BCC recipients
      if (editingDraft.bcc) {
        const bccEmails = editingDraft.bcc.split(",").map(e => e.trim()).filter(Boolean);
        const bccRecs = bccEmails.map(email => ({ email, name: email, isManual: true }));
        setBccRecipients(bccRecs);
        if (bccRecs.length > 0) setShowBcc(true);
      }
      // Parse attachments
      if (editingDraft.attachments && editingDraft.attachments.length > 0) {
        const draftAttachments = editingDraft.attachments.map((att, idx) => ({
          id: Date.now() + idx,
          name: att.name || att,
          size: att.size || 0,
          type: att.type || 'application/octet-stream'
        }));
        setAttachments(draftAttachments);
      }
    }
  }, [showEmailModal, editingDraft]);

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

  // Insert signature - directly append to email body
  // Uses email signature from configuration-states (Single Source of Truth)
  const insertSignature = () => {
    const signatureHtml = DEFAULT_COMMUNICATION_SETTINGS?.emailSignature 
      || '<p>--<br>Mit freundlichen Grüßen</p>';
    
    // Directly update the email body with signature appended
    const currentBody = emailData.body || '';
    const newBody = currentBody + `<br><br>${signatureHtml}`;
    setEmailData({ ...emailData, body: newBody });
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
    setShowDraftConfirmModal(false);
    setSelectedTemplate(null);
    setShowTemplateDropdown(false);
  };

  // Check if text contains template variables like {Member_Name}
  const containsVariables = (text) => {
    if (!text) return false;
    return /\{[A-Za-z_]+\}/.test(text);
  };

  // Get all variables from a template
  const extractVariables = (template) => {
    const vars = new Set();
    const regex = /\{[A-Za-z_]+\}/g;
    let match;
    if (template.subject) {
      while ((match = regex.exec(template.subject)) !== null) vars.add(match[0]);
    }
    if (template.body) {
      regex.lastIndex = 0;
      while ((match = regex.exec(template.body)) !== null) vars.add(match[0]);
    }
    return [...vars];
  };

  // Highlight variables in text for display
  const highlightVariables = (text) => {
    if (!text) return text;
    return text.replace(/\{([A-Za-z_]+)\}/g, '<span style="background-color: rgba(234, 179, 8, 0.2); color: #eab308; padding: 1px 4px; border-radius: 4px; font-size: 12px;">{$1}</span>');
  };

  // Handle template selection
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setShowTemplateDropdown(false);
    setEmailData({
      ...emailData,
      subject: template.subject || "",
      body: template.body?.replace(/\n/g, "<br>") || "",
    });
  };

  // Handle clearing template
  const handleClearTemplate = () => {
    setSelectedTemplate(null);
    setEmailData({ ...emailData, subject: "", body: "" });
  };

  // Check if selected template has variables and multiple recipients
  const totalRecipients = toRecipients.length + ccRecipients.length + bccRecipients.length;
  const templateHasVariables = selectedTemplate && (containsVariables(selectedTemplate.subject) || containsVariables(selectedTemplate.body));
  const showVariableWarning = templateHasVariables && totalRecipients > 1;

  // Close template dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (templateDropdownRef.current && !templateDropdownRef.current.contains(e.target)) {
        setShowTemplateDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Normalize HTML for comparison (remove whitespace and empty tags)
  const normalizeHtml = (html) => {
    if (!html) return '';
    return html
      .replace(/<p><br><\/p>/gi, '')
      .replace(/<br\s*\/?>/gi, '')
      .replace(/&nbsp;/gi, ' ')
      .replace(/<[^>]*>/g, '') // Strip all HTML tags
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Check if there are unsaved changes (compared to original draft if editing)
  const hasUnsavedChanges = () => {
    if (editingDraft) {
      // Compare current state with original draft
      const currentToEmails = toRecipients.map(r => r.email).sort().join(',');
      const originalToEmails = editingDraft.recipientEmail?.split(',').map(e => e.trim()).filter(Boolean).sort().join(',') || '';
      
      const currentCcEmails = ccRecipients.map(r => r.email).sort().join(',');
      const originalCcEmails = editingDraft.cc?.split(',').map(e => e.trim()).filter(Boolean).sort().join(',') || '';
      
      const currentBccEmails = bccRecipients.map(r => r.email).sort().join(',');
      const originalBccEmails = editingDraft.bcc?.split(',').map(e => e.trim()).filter(Boolean).sort().join(',') || '';
      
      const currentSubject = emailData.subject?.trim() || '';
      const originalSubject = editingDraft.subject?.trim() || '';
      
      const currentBody = normalizeHtml(emailData.body);
      const originalBody = normalizeHtml(editingDraft.body);
      
      // Check if anything changed
      return currentToEmails !== originalToEmails ||
             currentCcEmails !== originalCcEmails ||
             currentBccEmails !== originalBccEmails ||
             currentSubject !== originalSubject ||
             currentBody !== originalBody;
    }
    
    // Not editing a draft - check if there's any content
    return toRecipients.length > 0 || 
           ccRecipients.length > 0 || 
           bccRecipients.length > 0 ||
           (emailData.subject && emailData.subject.trim() !== "") ||
           (normalizeHtml(emailData.body) !== "") ||
           attachments.length > 0;
  };

  // Handle close with draft confirmation
  const handleClose = () => {
    if (hasUnsavedChanges() && onSaveAsDraft) {
      setShowDraftConfirmModal(true);
    } else {
      onClose();
    }
  };

  // Save as draft and close
  const saveAsDraft = () => {
    if (onSaveAsDraft) {
      const draftData = {
        id: editingDraft?.id, // Pass existing draft ID for updating
        toRecipients,
        ccRecipients,
        bccRecipients,
        subject: emailData.subject,
        body: emailData.body,
        attachments
      };
      onSaveAsDraft(draftData);
    }
    resetModal();
    handleCloseEmailModal();
  };

  // Close and reset without saving
  const onClose = () => {
    handleCloseEmailModal();
    resetModal();
  };

  if (!showEmailModal) return null;

  const canSend = toRecipients.length > 0 && emailData.subject;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-end md:items-center justify-center z-50">
      <div className="bg-surface-base w-full h-[95vh] md:h-auto md:rounded-xl md:max-w-4xl md:mx-4 md:max-h-[90vh] flex flex-col">
        <div className="p-4 md:p-5 flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h2 className="text-base md:text-lg font-medium flex items-center gap-2 text-content-primary">
              <Mail className="w-5 h-5" />
              Send Email
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-surface-hover rounded-lg text-content-muted hover:text-content-primary transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-1">
            {/* Template Selector */}
            <div ref={templateDropdownRef} className="relative">
              <label className="block text-sm font-medium text-content-muted mb-1">Template</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                  className="flex-1 flex items-center justify-between bg-surface-dark text-sm rounded-xl px-4 py-2.5 border border-transparent hover:border-border transition-colors"
                >
                  <span className={selectedTemplate ? "text-content-primary" : "text-content-faint"}>
                    {selectedTemplate ? selectedTemplate.name : "Select a template (optional)"}
                  </span>
                  <ChevronDown size={16} className={`text-content-muted transition-transform ${showTemplateDropdown ? "rotate-180" : ""}`} />
                </button>
                {selectedTemplate && (
                  <button
                    onClick={handleClearTemplate}
                    className="p-2.5 bg-surface-dark hover:bg-surface-hover rounded-xl transition-colors"
                    title="Clear template"
                  >
                    <X size={16} className="text-content-muted hover:text-content-primary" />
                  </button>
                )}
              </div>
              
              {showTemplateDropdown && (
                <div className="absolute left-0 right-0 mt-1 bg-surface-base border border-border rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto custom-scrollbar">
                  {emailTemplatesData.length > 0 ? (
                    emailTemplatesData.map((template) => {
                      const hasVars = containsVariables(template.subject) || containsVariables(template.body);
                      return (
                        <button
                          key={template.id}
                          onClick={() => handleSelectTemplate(template)}
                          className={`w-full text-left p-3 hover:bg-surface-button transition-colors border-b border-border/50 last:border-b-0 ${selectedTemplate?.id === template.id ? "bg-surface-button" : ""}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-content-primary font-medium">{template.name}</span>
                            {hasVars && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full">Variables</span>
                            )}
                          </div>
                          <p className="text-xs text-content-faint mt-0.5 truncate">{template.subject}</p>
                        </button>
                      );
                    })
                  ) : (
                    <p className="p-3 text-sm text-content-faint">No templates available</p>
                  )}
                </div>
              )}
            </div>

            {/* Variable Warning */}
            {showVariableWarning && (
              <div className="flex items-start gap-2.5 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-3.5 py-2.5">
                <AlertTriangle size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="text-yellow-400 font-medium">Template contains variables</p>
                  <p className="text-yellow-400/70 mt-0.5">
                    Variables like {extractVariables(selectedTemplate).map((v, i) => (
                      <span key={v}>
                        {i > 0 && ", "}
                        <span className="bg-yellow-500/20 px-1 py-0.5 rounded text-yellow-300">{v}</span>
                      </span>
                    ))} will only be replaced when sending to a single recipient. For multiple recipients, variables will be sent as-is.
                  </p>
                </div>
              </div>
            )}

            {/* To Field with Tags */}
            <EmailTagInput
              recipients={toRecipients}
              setRecipients={setToRecipients}
              searchMembers={handleSearchMemberForEmail}
              placeholder="Search by name, or type email..."
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
                placeholder="Search by name, or type email..."
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
                placeholder="Search by name, or type email..."
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
              <label className="block text-sm font-medium text-content-muted mb-1">
                Subject
              </label>
              <input
                ref={subjectInputRef}
                type="text"
                value={emailData.subject}
                onChange={(e) =>
                  setEmailData({ ...emailData, subject: e.target.value })
                }
                className="w-full bg-surface-dark text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border border-transparent focus:border-primary transition-colors"
                placeholder="Email subject"
              />
            </div>

            {/* Message with WYSIWYG Editor */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-content-muted">Message</label>
                <button
                  onClick={insertSignature}
                  className="px-2 py-1.5 bg-primary text-white text-xs rounded-lg hover:bg-primary-hover flex items-center gap-1 transition-colors whitespace-nowrap"
                >
                  <FileText className="w-3 h-3" />
                  Insert Signature
                </button>
              </div>
              <WysiwygEditor
                key={`editor-${selectedTemplate?.id || 'custom'}`}
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
                <label className="text-sm font-medium text-content-muted">
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
                  className="flex items-center gap-1.5 text-xs text-primary hover:text-primary-hover transition-colors"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  Add Attachment
                </button>
              </div>
              
              {attachments.length > 0 && (
                <div className="bg-surface-dark rounded-xl p-2 md:p-3 space-y-2">
                  {attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between bg-surface-base rounded-lg px-3 py-2"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {getFileIcon(attachment)}
                        <span className="text-sm text-content-primary truncate">{attachment.name}</span>
                        <span className="text-xs text-content-faint flex-shrink-0 hidden sm:inline">
                          ({formatFileSize(attachment.size)})
                        </span>
                      </div>
                      <button
                        onClick={() => removeAttachment(attachment.id)}
                        className="p-1.5 text-content-faint hover:text-red-400 transition-colors ml-2"
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
                  className="border border-dashed border-border rounded-xl p-3 md:p-4 text-center cursor-pointer hover:border-primary transition-colors"
                >
                  <Paperclip className="w-5 h-5 text-content-faint mx-auto mb-1" />
                  <p className="text-xs text-content-faint">
                    Tap to add attachments
                  </p>
                </div>
              )}
            </div>

            {/* Actions - moved to sticky footer below */}
          </div>

          {/* Sticky Footer */}
          <div className="flex gap-3 pb-1 flex-shrink-0 justify-between border-t border-border mt-4 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-3 md:py-2 bg-surface-button hover:bg-surface-button-hover text-content-secondary rounded-xl text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSendEmail}
              disabled={!canSend}
              className="px-4 py-3 md:py-2 bg-primary hover:bg-primary-hover disabled:bg-surface-dark disabled:text-content-faint text-white rounded-xl text-sm flex items-center justify-center gap-2 transition-colors disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Send Email
            </button>
          </div>
        </div>
      </div>

      {/* Draft Confirmation Modal */}
      <DraftModal
        show={showDraftConfirmModal}
        onClose={() => setShowDraftConfirmModal(false)}
        onDiscard={onClose}
        onSave={saveAsDraft}
      />
    </div>
  );
};

export default SendEmailModal;
