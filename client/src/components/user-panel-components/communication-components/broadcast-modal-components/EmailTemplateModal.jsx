/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import { X, FileText, Paperclip, Image, File, Trash2 } from "lucide-react"
import { WysiwygEditor } from "../../shared/WysiwygEditor"

// Get variables based on audience type
const getInsertVariables = (audienceType) => {
  if (audienceType === "staff") {
    return [
      { id: 'first_name', label: 'Staff First Name', value: '{Staff_First_Name}' },
      { id: 'last_name', label: 'Staff Last Name', value: '{Staff_Last_Name}' },
      { id: 'studio_name', label: 'Studio Name', value: '{Studio_Name}' },
    ]
  }
  return [
    { id: 'first_name', label: 'Member First Name', value: '{Member_First_Name}' },
    { id: 'last_name', label: 'Member Last Name', value: '{Member_Last_Name}' },
    { id: 'studio_name', label: 'Studio Name', value: '{Studio_Name}' },
  ]
}

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

const EmailTemplateModal = ({
  isOpen,
  onClose,
  template = null,
  onSave,
  folders = [],
  title = "Create Email Template",
  audienceType = "member",
  signature = ""
}) => {
  const [templateData, setTemplateData] = useState({
    subject: "",
    body: "",
    folderId: ""
  })
  const [errors, setErrors] = useState({})
  const [attachments, setAttachments] = useState([])
  const editorRef = useRef(null)
  const attachmentInputRef = useRef(null)

  const insertVariables = getInsertVariables(audienceType)

  const insertVariable = (variable) => {
    if (editorRef.current) {
      editorRef.current.insertText(variable.value)
    }
  }

  const insertSignature = () => {
    if (editorRef.current) {
      const signatureContent = signature || "{Signature}"
      editorRef.current.insertText(`<br/><br/>${signatureContent}`)
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
          subject: template.subject || "",
          body: template.body || "",
          folderId: template.folderId || folders[0]?.id || ""
        })
        setAttachments(template.attachments || [])
      } else {
        setTemplateData({
          subject: "",
          body: "",
          folderId: folders[0]?.id || ""
        })
        setAttachments([])
      }
      setErrors({})
    }
  }, [template, isOpen, folders])

  const validate = () => {
    const newErrors = {}

    if (!templateData.subject.trim()) {
      newErrors.subject = "Please enter a subject line"
    }

    if (!templateData.body.trim() || templateData.body === "<p><br></p>") {
      newErrors.body = "Please enter email content"
    }

    if (!templateData.folderId) {
      newErrors.folderId = "Please select a folder"
    }

    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    onSave({
      id: template?.id || Date.now(),
      ...templateData,
      attachments
    })

    setTemplateData({ subject: "", body: "", folderId: folders[0]?.id || "" })
    setAttachments([])
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[10000]">
      <div className="bg-[#0E0E0E] rounded-2xl w-full max-w-4xl mx-4 max-h-[95vh] overflow-hidden border border-gray-800/50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800/50 flex-shrink-0">
          <h2 className="text-lg font-semibold text-white">
            {template ? "Edit Email Template" : "Create Email Template"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4">
            {/* Subject & Folder Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={templateData.subject}
                  onChange={(e) => {
                    setTemplateData(prev => ({ ...prev, subject: e.target.value }))
                    setErrors(prev => ({ ...prev, subject: "" }))
                  }}
                  className={`w-full bg-[#1a1a1a] text-white rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                    errors.subject ? "ring-2 ring-red-500/50" : ""
                  }`}
                  placeholder="Enter a compelling subject line..."
                  autoFocus
                />
                {errors.subject && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.subject}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Folder
                </label>
                <select
                  value={templateData.folderId}
                  onChange={(e) => {
                    setTemplateData(prev => ({ ...prev, folderId: Number(e.target.value) }))
                    setErrors(prev => ({ ...prev, folderId: "" }))
                  }}
                  className={`w-full bg-[#1a1a1a] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                    errors.folderId ? "ring-2 ring-red-500/50" : ""
                  }`}
                >
                  <option value="">Select...</option>
                  {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
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

            {/* Email Body Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email Body
              </label>

              {/* Variables Row */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-xs text-gray-500">Variables:</span>
                {insertVariables.map((variable) => (
                  <button
                    key={variable.id}
                    type="button"
                    onClick={() => insertVariable(variable)}
                    className="px-2.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors"
                  >
                    {variable.label}
                  </button>
                ))}
                <span className="text-xs text-gray-500 mx-1">|</span>
                <span className="text-xs text-gray-500">Insert:</span>
                <button
                  type="button"
                  onClick={insertSignature}
                  className="px-2.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded-lg flex items-center gap-1 transition-colors"
                >
                  <FileText className="w-3 h-3" />
                  Signature
                </button>
              </div>

              <div className={`bg-[#1a1a1a] rounded-xl overflow-hidden ${
                errors.body ? "ring-2 ring-red-500/50" : ""
              }`}>
                <WysiwygEditor
                  ref={editorRef}
                  value={templateData.body}
                  onChange={(value) => {
                    setTemplateData(prev => ({ ...prev, body: value }))
                    setErrors(prev => ({ ...prev, body: "" }))
                  }}
                  placeholder="Compose your email content..."
                  minHeight={400}
                  maxHeight={550}
                />
              </div>
              {errors.body && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.body}
                </p>
              )}
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
                  type="button"
                  onClick={() => attachmentInputRef.current?.click()}
                  className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 transition-colors"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  Add Attachment
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
                  <p className="text-xs text-gray-500">Click to add attachments</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-800/50 flex-shrink-0 bg-[#0a0a0a]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-[#1a1a1a] hover:bg-[#252525] text-white text-sm font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium rounded-xl transition-all"
            >
              {template ? "Update Template" : "Save Template"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EmailTemplateModal
