/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import { Mail, X, Send, Paperclip, Trash2, FileText, ChevronDown, AlertTriangle } from "lucide-react";
import { WysiwygEditor } from "../../shared/WysiwygEditor";
import DraftModal from "../../shared/communication/DraftModal";

// Import email signature from configuration (Single Source of Truth)
import { DEFAULT_COMMUNICATION_SETTINGS } from "../../../utils/admin-panel-states/configuration-states";

// Import email templates and variables from email-states (Single Source of Truth)
import { emailTemplatesData, EMAIL_INSERT_VARIABLES } from "../../../utils/admin-panel-states/email-states";

// ==========================================
// EMAIL TAG COMPONENT
// ==========================================
const EmailTag = ({ recipient, onRemove }) => {
  const isManual = !recipient.id;
  const displayName = recipient.name || `${recipient.firstName || ""} ${recipient.lastName || ""}`.trim();
  const isStaff = recipient.type === "staff";
  const avatarBgColor = isStaff ? "bg-blue-500" : "bg-orange-500";

  const getInitials = () => {
    const firstInitial = recipient.firstName?.charAt(0)?.toUpperCase() || recipient.name?.charAt(0)?.toUpperCase() || "";
    const lastInitial = recipient.lastName?.charAt(0)?.toUpperCase() || recipient.name?.split(" ")[1]?.charAt(0)?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}` || "?";
  };

  return (
    <div className="flex items-center gap-1.5 bg-[#2a2a2a] border border-gray-700 rounded-lg px-2 py-1 text-sm">
      {isManual ? (
        <Mail className="w-3.5 h-3.5 text-gray-400" />
      ) : recipient.image ? (
        <img src={recipient.image} alt="" className="w-5 h-5 rounded object-cover" />
      ) : (
        <div
          className={`w-5 h-5 rounded ${avatarBgColor} flex items-center justify-center text-white font-semibold`}
          style={{ fontSize: "8px" }}
        >
          {getInitials()}
        </div>
      )}
      <span className="text-white text-xs">
        {isManual ? (
          recipient.email
        ) : (
          <>
            {displayName}
            {recipient.email && <span className="text-gray-400 ml-1">&lt;{recipient.email}&gt;</span>}
          </>
        )}
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

// ==========================================
// EMAIL TAG INPUT COMPONENT
// ==========================================
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
  onAddBcc,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (inputValue.length > 0 && searchMembers) {
      const results = searchMembers(inputValue);
      const filtered = results.filter(
        (member) => !recipients.some((r) => r.id === member.id || r.email === member.email)
      );
      setSearchResults(filtered);
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [inputValue, searchMembers, recipients]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const addManualEmail = () => {
    const email = inputValue.trim();
    if (email && isValidEmail(email)) {
      if (!recipients.some((r) => r.email === email)) {
        setRecipients([...recipients, { email, isManual: true }]);
      }
      setInputValue("");
      setShowDropdown(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchResults.length > 0) {
        selectMember(searchResults[0]);
      } else if (inputValue.trim()) {
        addManualEmail();
      }
    } else if (e.key === "Backspace" && !inputValue && recipients.length > 0) {
      setRecipients(recipients.slice(0, -1));
    } else if (e.key === "," || e.key === ";") {
      e.preventDefault();
      if (inputValue.trim()) {
        addManualEmail();
      }
    }
  };

  const selectMember = (member) => {
    setRecipients([
      ...recipients,
      {
        id: member.id,
        email: member.email,
        name: member.name || `${member.firstName} ${member.lastName}`,
        firstName: member.firstName,
        lastName: member.lastName,
        image: member.image,
        type: member.type,
      },
    ]);
    setInputValue("");
    setShowDropdown(false);
    inputRef.current?.focus();
  };

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
              <button onClick={onAddCc} className="text-xs text-orange-500 hover:text-orange-400 transition-colors">
                + CC
              </button>
            )}
            {showAddBcc && (
              <button onClick={onAddBcc} className="text-xs text-orange-500 hover:text-orange-400 transition-colors">
                + BCC
              </button>
            )}
            {showRemoveButton && (
              <button onClick={onRemoveField} className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
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
          <EmailTag key={recipient.id || recipient.email} recipient={recipient} onRemove={() => removeRecipient(index)} />
        ))}
        <div className="flex-1 min-w-[120px]">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue.length > 0 && setShowDropdown(true)}
            placeholder={recipients.length === 0 ? placeholder : ""}
            className="w-full bg-transparent text-white text-sm outline-none placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#1C1C1C] border border-gray-800 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto custom-scrollbar">
          {searchResults.length > 0 ? (
            searchResults.map((member) => (
              <button
                key={member.id}
                onClick={() => selectMember(member)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#2F2F2F] transition-colors text-left"
              >
                {member.image ? (
                  <img src={member.image} alt="" className="h-8 w-8 rounded-lg object-cover" />
                ) : (
                  <div
                    className={`w-8 h-8 rounded-lg ${member.type === "staff" ? "bg-blue-500" : "bg-orange-500"} flex items-center justify-center text-white font-semibold`}
                    style={{ fontSize: "13px" }}
                  >
                    {`${member.firstName?.charAt(0)?.toUpperCase() || ""}${member.lastName?.charAt(0)?.toUpperCase() || member.name?.split(" ")[1]?.charAt(0)?.toUpperCase() || ""}` || "?"}
                  </div>
                )}
                <div>
                  <div className="text-sm text-white">
                    {member.name || `${member.firstName} ${member.lastName}`}
                    {member.type === "staff" && <span className="ml-2 text-xs text-blue-400">(Staff)</span>}
                  </div>
                  <div className="text-xs text-gray-400">{member.email}</div>
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

// ==========================================
// FORMAT FILE SIZE HELPER
// ==========================================
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

// ==========================================
// MAIN COMPONENT - SendEmailReplyModal
// ==========================================
const SendEmailReplyModal = ({
  isOpen,
  onClose,
  originalEmail,
  initialRecipient,
  searchMembers,
  onSendReply,
  onSaveAsDraft,
}) => {
  // Refs
  const editorRef = useRef(null);
  const subjectRef = useRef(null);
  const attachmentInputRef = useRef(null);

  // State
  const [toRecipients, setToRecipients] = useState([]);
  const [ccRecipients, setCcRecipients] = useState([]);
  const [bccRecipients, setBccRecipients] = useState([]);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [replyData, setReplyData] = useState({ subject: "", body: "" });
  const [attachments, setAttachments] = useState([]);
  const [showDraftConfirmModal, setShowDraftConfirmModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const templateDropdownRef = useRef(null);

  const insertVariables = EMAIL_INSERT_VARIABLES;

  // Insert variable into subject field
  const insertVariableToSubject = (variable) => {
    if (subjectRef.current) {
      const input = subjectRef.current;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const text = replyData.subject || '';
      const newText = text.substring(0, start) + variable.value + text.substring(end);
      setReplyData({ ...replyData, subject: newText });
      setTimeout(() => {
        input.selectionStart = input.selectionEnd = start + variable.value.length;
        input.focus();
      }, 0);
    }
  };

  // Insert variable into body (WYSIWYG editor)
  const insertVariableToBody = (variable) => {
    if (editorRef.current) {
      editorRef.current.insertText(variable.value);
    }
  };

  // Initialize when modal opens
  useEffect(() => {
    if (isOpen && originalEmail) {
      // Set initial recipient
      if (initialRecipient) {
        setToRecipients([initialRecipient]);
      } else {
        // Fallback to manual entry from email sender
        const senderEmail = originalEmail.senderEmail || "";
        const senderName = originalEmail.sender || "";
        const nameParts = senderName.split(" ");
        setToRecipients([
          {
            id: null,
            email: senderEmail || senderName,
            name: senderName,
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            isManual: true,
          },
        ]);
      }

      // Set subject
      const subject = originalEmail.subject || "";
      setReplyData({
        subject: subject.startsWith("Re: ") ? subject : `Re: ${subject}`,
        body: "",
      });

      // Reset other fields
      setCcRecipients([]);
      setBccRecipients([]);
      setShowCc(false);
      setShowBcc(false);
      setAttachments([]);
    }
  }, [isOpen, originalEmail, initialRecipient]);

  // Check if reply has unsaved content
  const hasContent = () => {
    const originalSubject = originalEmail?.subject || "";
    const expectedSubject = originalSubject.startsWith("Re: ") ? originalSubject : `Re: ${originalSubject}`;
    return (
      replyData.body.trim() !== "" ||
      replyData.subject !== expectedSubject ||
      ccRecipients.length > 0 ||
      bccRecipients.length > 0 ||
      attachments.length > 0
    );
  };

  // Handle close with draft confirmation
  const handleClose = () => {
    if (hasContent()) {
      setShowDraftConfirmModal(true);
    } else {
      closeModal();
    }
  };

  // Actually close the modal
  const closeModal = () => {
    setShowDraftConfirmModal(false);
    setReplyData({ subject: "", body: "" });
    setToRecipients([]);
    setCcRecipients([]);
    setBccRecipients([]);
    setAttachments([]);
    setShowCc(false);
    setShowBcc(false);
    setSelectedTemplate(null);
    setShowTemplateDropdown(false);
    onClose();
  };

  // Check if text contains template variables like {Studio_Name}
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

  // Handle template selection
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setShowTemplateDropdown(false);
    setReplyData({
      ...replyData,
      subject: template.subject || "",
      body: template.body?.replace(/\n/g, "<br>") || "",
    });
  };

  // Handle clearing template
  const handleClearTemplate = () => {
    setSelectedTemplate(null);
    setReplyData({ ...replyData, subject: "", body: "" });
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

  // Insert signature - uses email signature from configuration-states (Single Source of Truth)
  const insertSignature = () => {
    const signatureHtml =
      DEFAULT_COMMUNICATION_SETTINGS?.emailSignature || "<p>--<br>Mit freundlichen GrÃ¼ÃŸen</p>";

    // Directly update the reply body with signature appended
    const currentBody = replyData.body || "";
    const newBody = currentBody + `<br><br>${signatureHtml}`;
    setReplyData({ ...replyData, body: newBody });
  };

  // Handle attachment upload
  const handleAttachmentUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
    if (attachmentInputRef.current) {
      attachmentInputRef.current.value = "";
    }
  };

  // Remove attachment
  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // Send reply
  const handleSend = () => {
    if (toRecipients.length === 0) return;

    // Build reply with original message appended
    const originalMessageHtml = originalEmail
      ? `<div style="margin-top:30px;padding-top:20px;border-top:1px solid #ddd;color:#666;font-size:12px;"><strong>--- Original Message ---</strong><br/><strong>From:</strong> ${originalEmail.sender}${originalEmail.senderEmail ? ` &lt;${originalEmail.senderEmail}&gt;` : ""}<br/><strong>Date:</strong> ${new Date(originalEmail.time).toLocaleString()}<br/><strong>Subject:</strong> ${originalEmail.subject}<br/><br/>${originalEmail.body}</div>`
      : "";

    const replyPayload = {
      id: Date.now(),
      sender: "FitLife Studio",
      senderEmail: "studio@fitlife.com",
      recipient: toRecipients.map((r) => r.name || r.email).join(", "),
      recipientEmail: toRecipients.map((r) => r.email).join(", "),
      cc: ccRecipients.map((r) => r.email).join(", "),
      bcc: bccRecipients.map((r) => r.email).join(", "),
      subject: replyData.subject,
      body: replyData.body + originalMessageHtml,
      time: new Date().toISOString(),
      isRead: true,
      isPinned: false,
      isArchived: false,
      status: "Sent",
      attachments: attachments.map((a) => ({ name: a.name, size: formatFileSize(a.size), type: a.type })),
    };

    onSendReply(replyPayload);
    closeModal();
  };

  // Save as draft
  const handleSaveAsDraft = () => {
    if (onSaveAsDraft) {
      const draftPayload = {
        id: Date.now(),
        sender: "FitLife Studio",
        senderEmail: "studio@fitlife.com",
        recipient: toRecipients.map((r) => r.name || r.email).join(", "),
        recipientEmail: toRecipients.map((r) => r.email).join(", "),
        cc: ccRecipients.map((r) => r.email).join(", "),
        bcc: bccRecipients.map((r) => r.email).join(", "),
        subject: replyData.subject,
        body: replyData.body,
        time: new Date().toISOString(),
        isRead: true,
        isPinned: false,
        isArchived: false,
        status: "Draft",
        attachments: attachments,
      };
      onSaveAsDraft(draftPayload);
    }
    closeModal();
  };

  if (!isOpen || !originalEmail) return null;

  const canSend = toRecipients.length > 0 && replyData.body.trim();

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[70] p-4">
      <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-[#333333] flex items-center justify-between flex-shrink-0">
            <h3 className="text-lg font-semibold text-white">Reply to {originalEmail.sender}</h3>
            <button onClick={handleClose} className="p-2 hover:bg-[#333333] rounded-lg transition-colors">
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Template Selector */}
            <div ref={templateDropdownRef} className="relative">
              <label className="block text-sm font-medium text-gray-400 mb-1">Template</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                  className="flex-1 flex items-center justify-between bg-[#222222] hover:bg-[#2a2a2a] text-sm rounded-xl px-4 py-2.5 transition-colors"
                >
                  <span className={selectedTemplate ? "text-white" : "text-gray-500"}>
                    {selectedTemplate ? selectedTemplate.name : "Select a template (optional)"}
                  </span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${showTemplateDropdown ? "rotate-180" : ""}`} />
                </button>
                {selectedTemplate && (
                  <button
                    onClick={handleClearTemplate}
                    className="p-2.5 bg-[#222222] hover:bg-[#2a2a2a] rounded-xl transition-colors"
                    title="Clear template"
                  >
                    <X size={16} className="text-gray-400 hover:text-white" />
                  </button>
                )}
              </div>
              
              {showTemplateDropdown && (
                <div className="absolute left-0 right-0 mt-1 bg-[#1C1C1C] border border-gray-800 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto custom-scrollbar">
                  {emailTemplatesData.length > 0 ? (
                    emailTemplatesData.map((template) => {
                      const hasVars = containsVariables(template.subject) || containsVariables(template.body);
                      return (
                        <button
                          key={template.id}
                          onClick={() => handleSelectTemplate(template)}
                          className={`w-full text-left p-3 hover:bg-[#2F2F2F] transition-colors border-b border-gray-800/50 last:border-b-0 ${selectedTemplate?.id === template.id ? "bg-[#2F2F2F]" : ""}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-white font-medium">{template.name}</span>
                            {hasVars && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full">Variables</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">{template.subject}</p>
                        </button>
                      );
                    })
                  ) : (
                    <p className="p-3 text-sm text-gray-500">No templates available</p>
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

            {/* To Field */}
            <EmailTagInput
              recipients={toRecipients}
              setRecipients={setToRecipients}
              searchMembers={searchMembers}
              placeholder="Search by name, or type email..."
              label="To"
              showAddCc={!showCc}
              onAddCc={() => setShowCc(true)}
              showAddBcc={!showBcc}
              onAddBcc={() => setShowBcc(true)}
            />

            {/* CC Field */}
            {showCc && (
              <EmailTagInput
                recipients={ccRecipients}
                setRecipients={setCcRecipients}
                searchMembers={searchMembers}
                placeholder="Search by name, or type email..."
                label="CC"
                showRemoveButton={true}
                onRemoveField={() => {
                  setShowCc(false);
                  setCcRecipients([]);
                }}
              />
            )}

            {/* BCC Field */}
            {showBcc && (
              <EmailTagInput
                recipients={bccRecipients}
                setRecipients={setBccRecipients}
                searchMembers={searchMembers}
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
              <label className="block text-sm font-medium text-gray-400 mb-1">Subject</label>
              {/* Variables Row for Subject */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs text-gray-500">Variables:</span>
                {insertVariables.map((variable) => (
                  <button
                    key={variable.id}
                    type="button"
                    onClick={() => insertVariableToSubject(variable)}
                    className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors"
                  >
                    {variable.label}
                  </button>
                ))}
              </div>
              <input
                ref={subjectRef}
                type="text"
                value={replyData.subject}
                onChange={(e) => setReplyData({ ...replyData, subject: e.target.value })}
                className="w-full bg-[#222222] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                placeholder="Email subject"
              />
            </div>

            {/* Message */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-400">Message</label>
                <button
                  onClick={insertSignature}
                  className="px-2 py-1.5 bg-orange-500 text-white text-xs rounded-lg hover:bg-orange-600 flex items-center gap-1 transition-colors whitespace-nowrap"
                >
                  <FileText className="w-3 h-3" />
                  Insert Signature
                </button>
              </div>
              {/* Variables Row for Body */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs text-gray-500">Variables:</span>
                {insertVariables.map((variable) => (
                  <button
                    key={variable.id}
                    type="button"
                    onClick={() => insertVariableToBody(variable)}
                    className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors"
                  >
                    {variable.label}
                  </button>
                ))}
              </div>
              <WysiwygEditor
                key={`reply-editor-${selectedTemplate?.id || 'custom'}`}
                ref={editorRef}
                value={replyData.body}
                onChange={(content) => setReplyData({ ...replyData, body: content })}
                placeholder="Write your reply..."
                minHeight={200}
                maxHeight={350}
                showImages={true}
              />
            </div>

            {/* Attachments */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-400">Attachments</label>
                <input
                  ref={attachmentInputRef}
                  type="file"
                  multiple
                  onChange={handleAttachmentUpload}
                  className="hidden"
                />
                <button
                  onClick={() => attachmentInputRef.current?.click()}
                  className="flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-400 transition-colors"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  Add Attachment
                </button>
              </div>

              {attachments.length > 0 ? (
                <div className="bg-[#222222] rounded-xl p-2 space-y-2">
                  {attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between bg-[#1a1a1a] rounded-lg px-3 py-2"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Paperclip size={14} className="text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-white truncate">{attachment.name}</span>
                        <span className="text-xs text-gray-500 flex-shrink-0">
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
              ) : (
                <div
                  onClick={() => attachmentInputRef.current?.click()}
                  className="border border-dashed border-gray-700 rounded-xl p-3 text-center cursor-pointer hover:border-gray-600 transition-colors"
                >
                  <Paperclip className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Click to add attachments</p>
                </div>
              )}
            </div>

            {/* Original Message Preview */}
            <div className="border-t border-[#333333] pt-4 mt-2">
              <div className="text-xs text-gray-500 mb-2 font-medium">Original Message</div>
              <div className="bg-[#1a1a1a] rounded-xl overflow-hidden max-h-[250px] overflow-y-auto">
                <div className="text-xs text-gray-400 space-y-1 p-4 border-b border-[#333333]">
                  <div>
                    <span className="text-gray-500">From:</span> {originalEmail.sender}
                    {originalEmail.senderEmail && ` <${originalEmail.senderEmail}>`}
                  </div>
                  <div>
                    <span className="text-gray-500">Date:</span> {new Date(originalEmail.time).toLocaleString()}
                  </div>
                  <div>
                    <span className="text-gray-500">Subject:</span> {originalEmail.subject}
                  </div>
                </div>
                <div
                  className="bg-white rounded-b-xl p-4 max-w-none"
                  style={{
                    color: "#1a1a1a",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    fontFamily: "Arial, sans-serif",
                  }}
                  dangerouslySetInnerHTML={{ __html: originalEmail.body }}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#333333] flex justify-end gap-3 flex-shrink-0">
            <button
              onClick={handleClose}
              className="px-5 py-3 bg-[#333333] hover:bg-[#444444] text-white rounded-xl text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!canSend}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Send size={18} />
              Send Reply
            </button>
          </div>
        </div>

      {/* Draft Confirmation Modal */}
      <DraftModal
        show={showDraftConfirmModal}
        onClose={() => setShowDraftConfirmModal(false)}
        onDiscard={closeModal}
        onSave={handleSaveAsDraft}
      />
    </div>
  );
};

export default SendEmailReplyModal;
