/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { X, Type, Hash, User } from "lucide-react"
import { WysiwygEditor } from "../../user-panel-components/configuration-components/WysiwygEditor"

const MessageModal = ({ 
  isOpen, 
  onClose, 
  message = null, 
  onSave,
  folders = [],
  title = "Create Template",
  isEmailTemplate = false,
  emailSignature = ""
}) => {
  const [templateTitle, setTemplateTitle] = useState("")
  const [selectedFolderId, setSelectedFolderId] = useState("")
  const [templateContent, setTemplateContent] = useState("")
  const [subject, setSubject] = useState("")
  const [error, setError] = useState("")

  // Initialize form with message data if editing
  useEffect(() => {
    if (message) {
      setTemplateTitle(message.title || message.subject || "")
      setTemplateContent(message.message || message.body || "")
      setSelectedFolderId(message.folderId || (folders.length > 0 ? folders[0].id : ""))
      
      // For email templates, extract subject
      if (isEmailTemplate && message.subject) {
        setSubject(message.subject)
      } else if (message.title && isEmailTemplate) {
        setSubject(message.title)
      }
    } else {
      setTemplateTitle("")
      setTemplateContent("")
      setSelectedFolderId(folders.length > 0 ? folders[0].id : "")
      setSubject("")
    }
    setError("")
  }, [message, folders, isEmailTemplate])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!templateTitle.trim()) {
      setError("Please enter a title")
      return
    }
    
    if (!templateContent.trim()) {
      setError("Please enter content")
      return
    }
    
    if (isEmailTemplate && !subject.trim()) {
      setError("Please enter email subject")
      return
    }
    
    if (!selectedFolderId) {
      setError("Please select a folder")
      return
    }

    const templateData = {
      title: templateTitle.trim(),
      message: templateContent,
      folderId: Number.parseInt(selectedFolderId, 10)
    }

    // For email templates, include subject
    if (isEmailTemplate) {
      templateData.subject = subject.trim()
    }

    onSave(templateData)
  }

  // Insert signature into editor
  const handleInsertSignature = () => {
    if (emailSignature) {
      const signatureHtml = `<p><br/>${emailSignature}</p>`
      setTemplateContent(prev => prev + signatureHtml)
    }
  }

  // Insert studio name
  const handleInsertStudioName = () => {
    setTemplateContent(prev => prev + "<span class='studio-name'>[Studio Name]</span>")
  }

  // Insert franchise name
  const handleInsertFranchiseName = () => {
    setTemplateContent(prev => prev + "<span class='franchise-name'>[Franchise Name]</span>")
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[10000] overflow-y-auto">
      <div className="bg-[#181818] rounded-xl w-full max-w-4xl mx-4 my-8 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-white">
              {title}
            </h2>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-zinc-700 rounded-lg text-white"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Title/Subject Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={isEmailTemplate ? "md:col-span-2" : "md:col-span-3"}>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    {isEmailTemplate ? "Email Subject" : "Template Title"}
                  </label>
                  <input
                    type="text"
                    value={isEmailTemplate ? subject : templateTitle}
                    onChange={(e) => isEmailTemplate ? setSubject(e.target.value) : setTemplateTitle(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm"
                    placeholder={isEmailTemplate ? "Enter email subject..." : "Enter template title..."}
                    autoFocus
                  />
                </div>
                
                {/* Folder selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Folder
                  </label>
                  <select
                    value={selectedFolderId}
                    onChange={(e) => setSelectedFolderId(e.target.value)}
                    className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm"
                  >
                    <option value="">Select folder...</option>
                    {folders.map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Email Template Title (only for email) */}
              {isEmailTemplate && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Template Title (for internal reference)
                  </label>
                  <input
                    type="text"
                    value={templateTitle}
                    onChange={(e) => setTemplateTitle(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm"
                    placeholder="Enter template title for internal reference..."
                  />
                </div>
              )}

              {/* Insert Buttons for Email Templates */}
              {isEmailTemplate && (
                <div className="bg-[#0E0E0E] border border-gray-800 rounded-xl p-3">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Insert Placeholders
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleInsertSignature}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
                      disabled={!emailSignature}
                    >
                      <Type size={14} />
                      Insert Signature
                    </button>
                    <button
                      type="button"
                      onClick={handleInsertStudioName}
                      className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg"
                    >
                      <Hash size={14} />
                      Insert Studio Name
                    </button>
                    <button
                      type="button"
                      onClick={handleInsertFranchiseName}
                      className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg"
                    >
                      <User size={14} />
                      Insert Franchise Name
                    </button>
                  </div>
                  {!emailSignature && (
                    <p className="text-xs text-gray-500 mt-2">
                      Signature is not configured. Add it in settings first.
                    </p>
                  )}
                </div>
              )}

              {/* Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  {isEmailTemplate ? "Email Body" : "Message Content"}
                </label>
                <div className="border border-gray-800 rounded-xl overflow-hidden">
                  <WysiwygEditor
                    value={templateContent}
                    onChange={setTemplateContent}
                    placeholder={isEmailTemplate ? 
                      "Compose your email message here. Use the insert buttons above for placeholders..." : 
                      "Enter your message content here..."
                    }
                  />
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="p-3 bg-red-900/20 border border-red-800 rounded-xl">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}


              {/* Action buttons */}
              <div className="flex gap-2 justify-end pt-4 border-t border-gray-800">
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
                  {message ? "Update" : "Create"} Template
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default MessageModal