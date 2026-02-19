/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import { X, FileText, Paperclip, Image, File, Trash2 } from "lucide-react"
import { WysiwygEditor } from "../../../shared/WysiwygEditor"

// Import email signature from configuration (Single Source of Truth)
import { DEFAULT_COMMUNICATION_SETTINGS } from "../../../../utils/studio-states/configuration-states"

// Insert variables - always show all (Member + Staff + Studio)
const insertVariables = [
  { id: 'member_first_name', label: 'Member First Name', value: '{Member_First_Name}' },
  { id: 'member_last_name', label: 'Member Last Name', value: '{Member_Last_Name}' },
  { id: 'staff_first_name', label: 'Staff First Name', value: '{Staff_First_Name}' },
  { id: 'staff_last_name', label: 'Staff Last Name', value: '{Staff_Last_Name}' },
  { id: 'studio_name', label: 'Studio Name', value: '{Studio_Name}' },
]

// Get file icon based on type
const getFileIcon = (file) => {
  const type = file.type || ''
  if (type.startsWith('image/')) return <Image className="w-4 h-4 text-primary" />
  if (type.includes('pdf')) return <FileText className="w-4 h-4 text-red-400" />
  return <File className="w-4 h-4 text-content-muted" />
}

// Format file size
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const TemplateEditorModal = ({
  isOpen,
  onClose,
  template = null,
  onSave,
  folders = [],
  selectedFolder = null,
  isEmailTemplate = false,
  audienceType = "member"
}) => {
  const [templateData, setTemplateData] = useState({
    name: "",
    title: "",
    subject: "",
    message: "",
    body: "",
    folderId: ""
  })
  const [errors, setErrors] = useState({})
  const [attachments, setAttachments] = useState([])
  
  const editorRef = useRef(null)
  const textareaRef = useRef(null)
  const subjectInputRef = useRef(null)
  const titleInputRef = useRef(null)
  const attachmentInputRef = useRef(null)


  // Insert variable into the active field
  const insertVariableToField = (variable, field) => {
    if (field === 'body' && isEmailTemplate && editorRef.current) {
      editorRef.current.insertText(variable.value)
    } else if (field === 'message' && !isEmailTemplate && textareaRef.current) {
      const textarea = textareaRef.current
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = templateData.message
      const newText = text.substring(0, start) + variable.value + text.substring(end)
      setTemplateData(prev => ({ ...prev, message: newText }))
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + variable.value.length
        textarea.focus()
      }, 0)
    } else if (field === 'subject' && subjectInputRef.current) {
      const input = subjectInputRef.current
      const start = input.selectionStart
      const end = input.selectionEnd
      const text = templateData.subject
      const newText = text.substring(0, start) + variable.value + text.substring(end)
      setTemplateData(prev => ({ ...prev, subject: newText }))
      setTimeout(() => {
        input.selectionStart = input.selectionEnd = start + variable.value.length
        input.focus()
      }, 0)
    } else if (field === 'title' && titleInputRef.current) {
      const input = titleInputRef.current
      const start = input.selectionStart
      const end = input.selectionEnd
      const text = templateData.title
      const newText = text.substring(0, start) + variable.value + text.substring(end)
      setTemplateData(prev => ({ ...prev, title: newText }))
      setTimeout(() => {
        input.selectionStart = input.selectionEnd = start + variable.value.length
        input.focus()
      }, 0)
    }
  }

  const insertSignature = () => {
    if (isEmailTemplate && editorRef.current) {
      // Get signature from configuration (Single Source of Truth)
      const signatureHtml = DEFAULT_COMMUNICATION_SETTINGS?.emailSignature || "<p>--<br>Mit freundlichen GrÃ¼ÃŸen</p>";
      const currentBody = templateData.body || "";
      const newBody = currentBody + `<br><br>${signatureHtml}`;
      setTemplateData(prev => ({ ...prev, body: newBody }));
    }
  }

  const handleAttachmentUpload = (e) => {
    const files = Array.from(e.target.files || [])
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type
    }))
    setAttachments(prev => [...prev, ...newAttachments])
    if (attachmentInputRef.current) attachmentInputRef.current.value = ''
  }

  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(a => a.id !== id))
  }

  useEffect(() => {
    if (isOpen) {
      if (template) {
        setTemplateData({
          name: template.name || "",
          title: template.title || "",
          subject: template.subject || "",
          message: template.message || "",
          body: template.body || "",
          folderId: template.folderId || selectedFolder?.id || folders[0]?.id || ""
        })
        setAttachments(template.attachments || [])
      } else {
        setTemplateData({
          name: "",
          title: "",
          subject: "",
          message: "",
          body: "",
          folderId: selectedFolder?.id || folders[0]?.id || ""
        })
        setAttachments([])
      }
      setErrors({})
    }
  }, [template, isOpen, folders, selectedFolder])

  const validate = () => {
    const newErrors = {}
    if (isEmailTemplate) {
      if (!templateData.subject.trim()) newErrors.subject = "Please enter a subject"
      if (!templateData.body.trim() || templateData.body === "<p><br></p>") newErrors.body = "Please enter email content"
    } else {
      if (!templateData.title.trim()) newErrors.title = "Please enter a title"
      if (!templateData.message.trim()) newErrors.message = "Please enter a message"
    }
    if (!templateData.folderId) newErrors.folderId = "Please select a folder"
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    // Use template name or default to "Untitled template"
    const templateName = templateData.name.trim() || "Untitled template"
    
    const saveData = {
      id: template?.id || Date.now(),
      name: templateName,
      folderId: Number(templateData.folderId),
      ...(isEmailTemplate
        ? { subject: templateData.subject, body: templateData.body, attachments }
        : { title: templateData.title, message: templateData.message }
      )
    }
    onSave(saveData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
      <div className={`bg-surface-card rounded-xl w-full mx-4 overflow-hidden border border-border shadow-2xl flex flex-col ${
        isEmailTemplate ? "max-w-4xl max-h-[95vh]" : "max-w-2xl max-h-[90vh]"
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <h2 className="text-lg font-semibold text-content-primary">
            {template 
              ? `Edit ${isEmailTemplate ? "Email" : "Push"} Template` 
              : `Create ${isEmailTemplate ? "Email" : "Push"} Template`
            }
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-hover rounded-xl transition-colors">
            <X className="w-5 h-5 text-content-muted" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Template Name & Folder Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-content-muted mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  value={templateData.name}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }}
                  className="w-full bg-surface-dark text-content-primary rounded-xl px-4 py-3 text-sm placeholder-content-faint focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Untitled template"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-content-muted mb-2">Folder</label>
                <select
                  value={templateData.folderId}
                  onChange={(e) => {
                    setTemplateData(prev => ({ ...prev, folderId: e.target.value }))
                    setErrors(prev => ({ ...prev, folderId: "" }))
                  }}
                  className={`w-full bg-surface-dark text-content-primary rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                    errors.folderId ? "ring-2 ring-red-500/50" : ""
                  }`}
                >
                  <option value="">Select folder...</option>
                  {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>{folder.name}</option>
                  ))}
                </select>
                {errors.folderId && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.folderId}
                  </p>
                )}
              </div>
            </div>

            {/* Subject Line (Email) or Title (Push) */}
            <div>
              <label className="block text-sm font-medium text-content-muted mb-2">
                {isEmailTemplate ? "Subject Line" : "Notification Title"}
              </label>
              {/* Variables Row for Subject/Title */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-xs text-content-faint">Variables:</span>
                {insertVariables.map((variable) => (
                  <button
                    key={variable.id}
                    type="button"
                    onClick={() => insertVariableToField(variable, isEmailTemplate ? "subject" : "title")}
                    className="px-2 py-1 bg-secondary text-white text-xs rounded-lg hover:opacity-80 transition-opacity"
                  >
                    {variable.label}
                  </button>
                ))}
              </div>
              <input
                ref={isEmailTemplate ? subjectInputRef : titleInputRef}
                type="text"
                value={isEmailTemplate ? templateData.subject : templateData.title}
                onChange={(e) => {
                  const field = isEmailTemplate ? "subject" : "title"
                  setTemplateData(prev => ({ ...prev, [field]: e.target.value }))
                  setErrors(prev => ({ ...prev, [field]: "" }))
                }}
                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }}
                className={`w-full bg-surface-dark text-content-primary rounded-xl px-4 py-3 text-sm placeholder-content-faint focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                  (isEmailTemplate ? errors.subject : errors.title) ? "ring-2 ring-red-500/50" : ""
                }`}
                placeholder={isEmailTemplate ? "Enter email subject..." : "Enter notification title..."}
              />
              {(isEmailTemplate ? errors.subject : errors.title) && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                  {isEmailTemplate ? errors.subject : errors.title}
                </p>
              )}
            </div>

            {/* Content Area */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-content-muted mb-2">
                {isEmailTemplate ? "Email Body" : "Message Content"}
              </label>

              {/* Variables Row for Content */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-xs text-content-faint">Variables:</span>
                {insertVariables.map((variable) => (
                  <button
                    key={variable.id}
                    type="button"
                    onClick={() => insertVariableToField(variable, isEmailTemplate ? "body" : "message")}
                    className="px-2 py-1 bg-secondary text-white text-xs rounded-lg hover:opacity-80 transition-opacity"
                  >
                    {variable.label}
                  </button>
                ))}
                {isEmailTemplate && (
                  <>
                    <span className="text-xs text-content-faint mx-1">|</span>
                    <span className="text-xs text-content-faint">Insert:</span>
                    <button
                      type="button"
                      onClick={insertSignature}
                      className="px-2 py-1 bg-primary text-white text-xs rounded-lg flex items-center gap-1 hover:bg-primary-hover transition-colors"
                    >
                      <FileText className="w-3 h-3" />
                      Signature
                    </button>
                  </>
                )}
              </div>

              {isEmailTemplate ? (
                <div className={`bg-surface-dark rounded-xl overflow-hidden ${errors.body ? "ring-2 ring-red-500/50" : ""}`}>
                  <WysiwygEditor
                    ref={editorRef}
                    value={templateData.body}
                    onChange={(value) => {
                      setTemplateData(prev => ({ ...prev, body: value }))
                      setErrors(prev => ({ ...prev, body: "" }))
                    }}
                    placeholder="Compose your email content..."
                    minHeight={280}
                    maxHeight={400}
                  />
                </div>
              ) : (
                <textarea
                  ref={textareaRef}
                  value={templateData.message}
                  onChange={(e) => {
                    setTemplateData(prev => ({ ...prev, message: e.target.value }))
                    setErrors(prev => ({ ...prev, message: "" }))
                  }}
                  className={`w-full bg-surface-dark text-content-primary rounded-xl px-4 py-3 text-sm placeholder-content-faint focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none ${
                    errors.message ? "ring-2 ring-red-500/50" : ""
                  }`}
                  placeholder="Enter your push notification message..."
                  rows={10}
                />
              )}

              {(isEmailTemplate ? errors.body : errors.message) && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                  {isEmailTemplate ? errors.body : errors.message}
                </p>
              )}
            </div>

            {/* Attachments (Email only) */}
            {isEmailTemplate && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-content-muted">Attachments</label>
                  <input
                    ref={attachmentInputRef}
                    type="file"
                    multiple
                    onChange={handleAttachmentUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => attachmentInputRef.current?.click()}
                    className="flex items-center gap-1.5 text-xs text-primary hover:text-primary-hover transition-colors"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    Add Attachment
                  </button>
                </div>
                
                {attachments.length > 0 ? (
                  <div className="bg-surface-dark rounded-xl p-2 space-y-2">
                    {attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between bg-surface-card rounded-lg px-3 py-2"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {getFileIcon(attachment)}
                          <span className="text-sm text-content-primary truncate">{attachment.name}</span>
                          <span className="text-xs text-content-faint flex-shrink-0">
                            ({formatFileSize(attachment.size)})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(attachment.id)}
                          className="p-1.5 text-content-faint hover:text-red-400 transition-colors ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div 
                    onClick={() => attachmentInputRef.current?.click()}
                    className="border border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-border transition-colors"
                  >
                    <Paperclip className="w-5 h-5 text-content-faint mx-auto mb-1" />
                    <p className="text-xs text-content-faint">Click to add attachments</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-4 border-t border-border flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-surface-dark hover:bg-surface-button-hover text-content-secondary text-sm font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-xl transition-all"
            >
              {template ? "Update Template" : "Create Template"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TemplateEditorModal
