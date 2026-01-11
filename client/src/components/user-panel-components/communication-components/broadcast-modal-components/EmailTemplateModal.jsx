/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { WysiwygEditor } from "../configuration-components/WysiwygEditor"

const EmailTemplateModal = ({
  isOpen,
  onClose,
  template = null,
  onSave,
  folders = [],
  title = "Create Email Template"
}) => {
  const [templateData, setTemplateData] = useState({
    subject: "",
    body: "",
    folderId: folders[0]?.id || ""
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (template) {
      setTemplateData({
        subject: template.subject || "",
        body: template.body || "",
        folderId: template.folderId || folders[0]?.id || ""
      })
    } else {
      setTemplateData({
        subject: "",
        body: "",
        folderId: folders[0]?.id || ""
      })
    }
    setErrors({})
  }, [template, isOpen, folders])

  const validate = () => {
    const newErrors = {}
    
    if (!templateData.subject.trim()) {
      newErrors.subject = "Please enter a subject"
    }
    
    if (!templateData.body.trim()) {
      newErrors.body = "Please enter email body"
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
      ...templateData
    })
    
    setTemplateData({ subject: "", body: "", folderId: folders[0]?.id || "" })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[10000]">
      <div className="bg-[#181818] rounded-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-white">
              {title}
            </h2>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-zinc-700 rounded-lg text-white"
            >
              <X size={16} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={templateData.subject}
                    onChange={(e) => {
                      setTemplateData(prev => ({ ...prev, subject: e.target.value }))
                      setErrors(prev => ({ ...prev, subject: "" }))
                    }}
                    className={`w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm ${
                      errors.subject ? "border border-red-500" : ""
                    }`}
                    placeholder="Email subject"
                    autoFocus
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Folder
                  </label>
                  <select
                    value={templateData.folderId}
                    onChange={(e) => {
                      setTemplateData(prev => ({ ...prev, folderId: Number(e.target.value) }))
                      setErrors(prev => ({ ...prev, folderId: "" }))
                    }}
                    className={`w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm ${
                      errors.folderId ? "border border-red-500" : ""
                    }`}
                  >
                    <option value="">Select folder...</option>
                    {folders.map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.name}
                      </option>
                    ))}
                  </select>
                  {errors.folderId && (
                    <p className="text-red-500 text-xs mt-1">{errors.folderId}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Body
                </label>
                <div className={`bg-[#0E0E0E] border border-gray-800 rounded-lg overflow-hidden ${
                  errors.body ? "border border-red-500" : ""
                }`}>
                  <WysiwygEditor
                    value={templateData.body}
                    onChange={(value) => {
                      setTemplateData(prev => ({ ...prev, body: value }))
                      setErrors(prev => ({ ...prev, body: "" }))
                    }}
                    placeholder="Compose your email..."
                  />
                </div>
                {errors.body && (
                  <p className="text-red-500 text-xs mt-1">{errors.body}</p>
                )}
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm"
                >
                  {template ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EmailTemplateModal