/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { X, FileText, Paperclip, Image, File, Trash2 } from "lucide-react"
import { WysiwygEditor } from "../../../shared/WysiwygEditor"

// Import email signature from configuration (Single Source of Truth)
import { DEFAULT_COMMUNICATION_SETTINGS } from "../../../../utils/admin-panel-states/configuration-states"

// Import variables from email-states (Single Source of Truth)
import { EMAIL_INSERT_VARIABLES } from "../../../../utils/admin-panel-states/email-states"

// Get file icon based on type
const getFileIcon = (file) => {
  const type = file.type || ''
  if (type.startsWith('image/')) return <Image className="w-4 h-4 text-blue-400" />
  if (type.includes('pdf')) return <FileText className="w-4 h-4 text-red-400" />
  return <File className="w-4 h-4 text-gray-400" />
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
}) => {
  const [templateData, setTemplateData] = useState({
    name: "",
    title: "",
    subject: "",
    message: "",
    body: "",
    folderId: ""
  })
  const { t } = useTranslation()
  const [errors, setErrors] = useState({})
  const [attachments, setAttachments] = useState([])
  
  const editorRef = useRef(null)
  const textareaRef = useRef(null)
  const subjectInputRef = useRef(null)
  const subjectSelfUpdate = useRef(false)
  const titleInputRef = useRef(null)
  const attachmentInputRef = useRef(null)

  const insertVariables = EMAIL_INSERT_VARIABLES
  const getVarValue = (variable) => t("admin.email.variableValues." + variable.id, { defaultValue: variable.value })
  const getVarLabel = (variable) => t("admin.email.variables." + variable.id, { defaultValue: variable.label })
  // Insert variable into the active field as plain text
  const insertVariableToField = (variable, field) => {
    if (field === 'body' && isEmailTemplate && editorRef.current) {
      editorRef.current.insertText(getVarValue(variable))
    } else if (field === 'message' && !isEmailTemplate && textareaRef.current) {
      const textarea = textareaRef.current
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = templateData.message
      const newText = text.substring(0, start) + getVarValue(variable) + text.substring(end)
      setTemplateData(prev => ({ ...prev, message: newText }))
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + getVarValue(variable).length
        textarea.focus()
      }, 0)
    } else if (field === 'subject' && subjectInputRef.current) {
      subjectInputRef.current.focus()
      document.execCommand('insertText', false, getVarValue(variable))
      subjectSelfUpdate.current = true
      setTemplateData(prev => ({ ...prev, subject: subjectInputRef.current.innerHTML }))
      setErrors(prev => ({ ...prev, subject: "" }))
    } else if (field === 'title' && titleInputRef.current) {
      titleInputRef.current.focus()
      document.execCommand('insertText', false, getVarValue(variable))
      subjectSelfUpdate.current = true
      setTemplateData(prev => ({ ...prev, title: titleInputRef.current.innerHTML }))
      setErrors(prev => ({ ...prev, title: "" }))
    }
  }

  // Sync contentEditable with external state changes (template loading)
  useEffect(() => {
    const ref = isEmailTemplate ? subjectInputRef : titleInputRef
    const val = isEmailTemplate ? templateData.subject : templateData.title
    if (ref.current) {
      if (subjectSelfUpdate.current) { subjectSelfUpdate.current = false; return }
      ref.current.innerHTML = val || ''
    }
  }, [templateData.subject, templateData.title, isEmailTemplate])

  const insertSignature = () => {
    if (isEmailTemplate && editorRef.current) {
      // Get signature from configuration (Single Source of Truth)
      const signatureHtml = DEFAULT_COMMUNICATION_SETTINGS?.emailSignature || `<p>--<br>${t("admin.email.templateEditor.greeting")}</p>`;
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
      if (!templateData.subject.trim()) newErrors.subject = t("admin.email.templateEditor.validation.subject")
      if (!templateData.body.trim() || templateData.body === "<p><br></p>") newErrors.body = t("admin.email.templateEditor.validation.body")
    } else {
      if (!templateData.title.trim()) newErrors.title = t("admin.email.templateEditor.validation.title")
      if (!templateData.message.trim()) newErrors.message = t("admin.email.templateEditor.validation.message")
    }
    if (!templateData.folderId) newErrors.folderId = t("admin.email.templateEditor.validation.folder")
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    // Use template name or default to t("admin.email.templateEditor.untitled")
    const templateName = templateData.name.trim() || t("admin.email.templateEditor.untitled")
    
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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[10000]">
      <div className={`bg-[#0E0E0E] rounded-2xl w-full mx-4 overflow-hidden border border-gray-800/50 shadow-2xl flex flex-col ${
        isEmailTemplate ? "max-w-4xl max-h-[95vh]" : "max-w-2xl max-h-[90vh]"
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800/50 flex-shrink-0">
          <h2 className="text-lg font-semibold text-white">
            {template 
              ? t(isEmailTemplate ? "admin.email.templateEditor.editEmail" : "admin.email.templateEditor.editPush") 
              : t(isEmailTemplate ? "admin.email.templateEditor.createEmail" : "admin.email.templateEditor.createPush")
            }
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Template Name & Folder Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  {t("admin.email.templateEditor.templateName")}
                </label>
                <input
                  type="text"
                  value={templateData.name}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }}
                  className="w-full bg-[#1a1a1a] text-white rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder={t("admin.email.templateEditor.untitled")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t("admin.email.templateEditor.folder")}</label>
                <select
                  value={templateData.folderId}
                  onChange={(e) => {
                    setTemplateData(prev => ({ ...prev, folderId: e.target.value }))
                    setErrors(prev => ({ ...prev, folderId: "" }))
                  }}
                  className={`w-full bg-[#1a1a1a] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                    errors.folderId ? "ring-2 ring-red-500/50" : ""
                  }`}
                >
                  <option value="">{t("admin.email.templateEditor.selectFolder")}</option>
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
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {isEmailTemplate ? t("admin.email.templateEditor.subjectLine") : t("admin.email.templateEditor.notificationTitle")}
              </label>
              {/* Variables Row for Subject/Title */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-xs text-gray-500">{t("admin.email.compose.variables")}:</span>
                {insertVariables.map((variable) => (
                  <button
                    key={variable.id}
                    type="button"
                    onClick={() => insertVariableToField(variable, isEmailTemplate ? "subject" : "title")}
                    className="px-2.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors"
                  >
                    {getVarLabel(variable)}
                  </button>
                ))}
              </div>
              <div className="relative">
                <div
                  ref={isEmailTemplate ? subjectInputRef : titleInputRef}
                  contentEditable
                  suppressContentEditableWarning
                  className={`subject-editable w-full bg-[#1a1a1a] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all min-h-[44px] whitespace-nowrap overflow-x-auto ${
                    (isEmailTemplate ? errors.subject : errors.title) ? "ring-2 ring-red-500/50" : ""
                  }`}
                  data-placeholder={isEmailTemplate ? t("admin.email.templateEditor.subjectPlaceholder") : t("admin.email.templateEditor.titlePlaceholder")}
                  onInput={(e) => {
                    const html = e.currentTarget.innerHTML
                    subjectSelfUpdate.current = true
                    const field = isEmailTemplate ? "subject" : "title"
                    setTemplateData(prev => ({ ...prev, [field]: html }))
                    setErrors(prev => ({ ...prev, [field]: "" }))
                  }}
                  onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }}
                  onPaste={(e) => { e.preventDefault(); document.execCommand('insertText', false, e.clipboardData.getData('text/plain')) }}
                />
                <style>{`.subject-editable:empty::before { content: attr(data-placeholder); color: #6b7280; pointer-events: none; }`}</style>
              </div>
              {(isEmailTemplate ? errors.subject : errors.title) && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                  {isEmailTemplate ? errors.subject : errors.title}
                </p>
              )}
            </div>

            {/* Content Area */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {isEmailTemplate ? t("admin.email.templateEditor.emailBody") : t("admin.email.templateEditor.messageContent")}
              </label>

              {/* Variables Row for Content */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-xs text-gray-500">{t("admin.email.compose.variables")}:</span>
                {insertVariables.map((variable) => (
                  <button
                    key={variable.id}
                    type="button"
                    onClick={() => insertVariableToField(variable, isEmailTemplate ? "body" : "message")}
                    className="px-2.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors"
                  >
                    {getVarLabel(variable)}
                  </button>
                ))}
                {isEmailTemplate && (
                  <>
                    <span className="text-xs text-gray-500 mx-1">|</span>
                    <span className="text-xs text-gray-500">{t("admin.email.templateEditor.insert")}:</span>
                    <button
                      type="button"
                      onClick={insertSignature}
                      className="px-2.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <FileText className="w-3 h-3" />
                      {t("admin.email.templateEditor.signature")}
                    </button>
                  </>
                )}
              </div>

              {isEmailTemplate ? (
                <div className={`bg-[#1a1a1a] rounded-xl overflow-hidden ${errors.body ? "ring-2 ring-red-500/50" : ""}`}>
                  <WysiwygEditor
                    ref={editorRef}
                    value={templateData.body}
                    onChange={(value) => {
                      setTemplateData(prev => ({ ...prev, body: value }))
                      setErrors(prev => ({ ...prev, body: "" }))
                    }}
                    placeholder={t("admin.email.templateEditor.composePlaceholder")}
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
                  className={`w-full bg-[#1a1a1a] text-white rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none ${
                    errors.message ? "ring-2 ring-red-500/50" : ""
                  }`}
                  placeholder={t("admin.email.templateEditor.pushPlaceholder")}
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
                  <label className="text-sm font-medium text-gray-400">{t("admin.email.compose.attachments")}</label>
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
                    className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    {t("admin.email.templateEditor.addAttachment")}
                  </button>
                </div>
                
                {attachments.length > 0 ? (
                  <div className="bg-[#1a1a1a] rounded-xl p-2 space-y-2">
                    {attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between bg-[#0E0E0E] rounded-lg px-3 py-2"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {getFileIcon(attachment)}
                          <span className="text-sm text-white truncate">{attachment.name}</span>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            ({formatFileSize(attachment.size)})
                          </span>
                        </div>
                        <button
                          type="button"
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
                    className="border border-dashed border-gray-700 rounded-xl p-4 text-center cursor-pointer hover:border-gray-600 transition-colors"
                  >
                    <Paperclip className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">{t("admin.email.templateEditor.clickToAddAttachments")}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-800/50 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-[#1a1a1a] hover:bg-[#252525] text-white text-sm font-medium rounded-xl transition-colors"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-medium rounded-xl transition-all"
            >
              {template ? t("admin.email.templateEditor.updateTemplate") : t("admin.email.templateEditor.createTemplate")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TemplateEditorModal
