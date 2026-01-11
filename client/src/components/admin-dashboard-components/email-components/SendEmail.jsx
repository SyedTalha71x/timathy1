/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Mail, Search, Send, X, Type, Building, Users, Plus } from "lucide-react"
import { WysiwygEditor } from "../../user-panel-components/configuration-components/WysiwygEditor"
import { useState, useRef, useEffect } from "react"

const SendEmailModal = ({
  show,
  onClose,
  emailData,
  setEmailData,
  selectedEmailTemplate,
  showTemplateDropdown,
  setShowTemplateDropdown,
  emailTemplates,
  handleTemplateSelect,
  showRecipientDropdown,
  setShowRecipientDropdown,
  handleSearchMemberForEmail,
  handleSelectEmailRecipient,
  handleSendEmail
}) => {
  const [selectedRecipients, setSelectedRecipients] = useState([])
  const [selectedGroups, setSelectedGroups] = useState({
    allStudios: false,
    allFranchises: false,
    allMembers: false
  })
  const [showInsertDropdown, setShowInsertDropdown] = useState(false)
  const insertDropdownRef = useRef(null)
  const recipientDropdownRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (insertDropdownRef.current && !insertDropdownRef.current.contains(event.target)) {
        setShowInsertDropdown(false)
      }
      if (recipientDropdownRef.current && !recipientDropdownRef.current.contains(event.target)) {
        setShowRecipientDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Initialize emailData with CC if not present
  useEffect(() => {
    if (show && !emailData.cc) {
      setEmailData(prev => ({ ...prev, cc: '' }))
    }
  }, [show])

  if (!show) return null

  // Handle recipient selection
  const handleRecipientSelect = (member) => {
    const isSelected = selectedRecipients.some(r => r.id === member.id)
    if (isSelected) {
      setSelectedRecipients(prev => prev.filter(r => r.id !== member.id))
      // Remove from emailData.to
      const currentRecipients = emailData.to.split(',').map(e => e.trim()).filter(e => e !== member.email)
      setEmailData(prev => ({ ...prev, to: currentRecipients.join(', ') }))
    } else {
      setSelectedRecipients(prev => [...prev, member])
      // Add to emailData.to
      const currentRecipients = emailData.to.split(',').map(e => e.trim()).filter(e => e)
      const newRecipients = [...currentRecipients, member.email].filter(Boolean)
      setEmailData(prev => ({ ...prev, to: newRecipients.join(', ') }))
    }
  }

  // Handle group selection
  const handleGroupSelect = (group) => {
    const newGroups = { ...selectedGroups, [group]: !selectedGroups[group] }
    setSelectedGroups(newGroups)

    // In a real app, you would fetch all studios/franchises/members here
    // For now, we'll just add a placeholder
    if (!selectedGroups[group]) {
      const placeholderEmail = group === 'allStudios' ? 'all-studios@example.com' :
                              group === 'allFranchises' ? 'all-franchises@example.com' :
                              'all-members@example.com'
      
      const currentRecipients = emailData.to.split(',').map(e => e.trim()).filter(e => e)
      if (!currentRecipients.includes(placeholderEmail)) {
        setEmailData(prev => ({ 
          ...prev, 
          to: [...currentRecipients, placeholderEmail].join(', ') 
        }))
      }
    } else {
      const placeholderEmail = group === 'allStudios' ? 'all-studios@example.com' :
                              group === 'allFranchises' ? 'all-franchises@example.com' :
                              'all-members@example.com'
      
      const currentRecipients = emailData.to.split(',').map(e => e.trim()).filter(e => e !== placeholderEmail)
      setEmailData(prev => ({ 
        ...prev, 
        to: currentRecipients.join(', ') 
      }))
    }
  }

  // Handle insert options
  const handleInsertSignature = () => {
    const signature = "<br><br>Best regards,<br>[Your Name]<br>[Your Position]"
    setEmailData(prev => ({ 
      ...prev, 
      body: prev.body + signature 
    }))
    setShowInsertDropdown(false)
  }

  const handleInsertStudioName = () => {
    const studioName = "{{Studio Name}}"
    setEmailData(prev => ({ 
      ...prev, 
      body: prev.body + studioName 
    }))
    setShowInsertDropdown(false)
  }

  const handleInsertFranchiseName = () => {
    const franchiseName = "{{Franchise Name}}"
    setEmailData(prev => ({ 
      ...prev, 
      body: prev.body + franchiseName 
    }))
    setShowInsertDropdown(false)
  }

  const handleInsertMemberName = () => {
    const memberName = "{{Member Name}}"
    setEmailData(prev => ({ 
      ...prev, 
      body: prev.body + memberName 
    }))
    setShowInsertDropdown(false)
  }

  // Get search results
  const searchResults = handleSearchMemberForEmail(emailData.to)

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#181818] rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-4">

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Send Email
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-zinc-700 rounded-lg">
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4">

            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email Template</label>
              <div className="relative">
                <button
                  onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                  className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm text-left flex items-center justify-between"
                >
                  <span>{selectedEmailTemplate ? selectedEmailTemplate.name : "Select a template (optional)"}</span>
                  <Search className="h-4 w-4 text-gray-400" />
                </button>

                {showTemplateDropdown && (
                  <div className="absolute left-0 right-0 mt-1 bg-[#1C1C1C] border border-gray-800 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto">
                    <button
                      onClick={() => {
                        setEmailData({ ...emailData, subject: "", body: "" })
                        handleTemplateSelect(null)
                        setShowTemplateDropdown(false)
                      }}
                      className="w-full text-left p-3 hover:bg-[#2F2F2F] text-sm text-gray-400 border-b border-gray-700"
                    >
                      No template (blank email)
                    </button>

                    {emailTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className="w-full text-left p-3 hover:bg-[#2F2F2F]"
                      >
                        <div className="font-medium text-sm">{template.name}</div>
                        <div className="text-xs text-gray-400 truncate">{template.subject}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* To Field with Search */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">To</label>
              <div className="relative" ref={recipientDropdownRef}>
                <input
                  type="text"
                  value={emailData.to}
                  onChange={(e) => {
                    setEmailData({ ...emailData, to: e.target.value })
                    setShowRecipientDropdown(e.target.value.length > 0)
                  }}
                  onFocus={() => setShowRecipientDropdown(true)}
                  className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm pr-10"
                  placeholder="Search studios, members or type email"
                />

                <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />

                {/* Recipients Dropdown */}
                {showRecipientDropdown && (
                  <div className="absolute left-0 right-0 mt-1 bg-[#1C1C1C] border border-gray-800 rounded-xl shadow-xl z-20 max-h-64 overflow-y-auto">
                    
                    {/* Group Selection Buttons */}
                    <div className="p-2 border-b border-gray-700">
                      <div className="text-xs text-gray-400 mb-2 font-medium">Select Groups:</div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleGroupSelect('allStudios')}
                          className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 ${selectedGroups.allStudios ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                        >
                          <Building className="w-3 h-3" />
                          All Studios
                        </button>
                        <button
                          onClick={() => handleGroupSelect('allFranchises')}
                          className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 ${selectedGroups.allFranchises ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                        >
                          <Building className="w-3 h-3" />
                          All Franchises
                        </button>
                        <button
                          onClick={() => handleGroupSelect('allMembers')}
                          className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 ${selectedGroups.allMembers ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                        >
                          <Users className="w-3 h-3" />
                          All Members
                        </button>
                        <button
                          onClick={() => {
                            setSelectedGroups({ allStudios: true, allFranchises: true, allMembers: true })
                            setEmailData(prev => ({ 
                              ...prev, 
                              to: 'all-studios@example.com, all-franchises@example.com, all-members@example.com' 
                            }))
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs bg-green-800 hover:bg-green-700 text-white flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Select All
                        </button>
                      </div>
                    </div>

                    {/* Individual Members/Studios/Franchises */}
                    <div className="max-h-48 overflow-y-auto">
                      {searchResults.length > 0 ? (
                        searchResults.map((item) => {
                          const isSelected = selectedRecipients.some(r => r.id === item.id)
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleRecipientSelect(item)}
                              className={`w-full text-left p-3 hover:bg-[#2F2F2F] flex items-center gap-3 ${isSelected ? 'bg-blue-900/30' : ''}`}
                            >
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${isSelected ? 'bg-blue-600' : 'bg-gray-600'}`}>
                                {item.name.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">{item.name}</div>
                                <div className="text-xs text-gray-400 truncate">{item.email}</div>
                              </div>
                              <div className="text-xs text-gray-500">
                                {item.type || 'Member'}
                              </div>
                            </button>
                          )
                        })
                      ) : emailData.to.length > 0 ? (
                        <p className="p-3 text-sm text-gray-400">No results found. Type full email to add.</p>
                      ) : (
                        <p className="p-3 text-sm text-gray-400">Start typing to search...</p>
                      )}
                    </div>

                    {/* Selected Recipients Summary */}
                    {selectedRecipients.length > 0 && (
                      <div className="p-2 border-t border-gray-700 bg-gray-900/50">
                        <div className="text-xs text-gray-400 mb-1">
                          Selected: {selectedRecipients.length} recipient(s)
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {selectedRecipients.slice(0, 3).map(recipient => (
                            <span key={recipient.id} className="px-2 py-1 bg-gray-800 rounded text-xs">
                              {recipient.name}
                            </span>
                          ))}
                          {selectedRecipients.length > 3 && (
                            <span className="px-2 py-1 bg-gray-800 rounded text-xs">
                              +{selectedRecipients.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* CC Field */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">CC (Carbon Copy)</label>
              <input
                type="text"
                value={emailData.cc || ''}
                onChange={(e) => setEmailData({ ...emailData, cc: e.target.value })}
                className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm"
                placeholder="Optional - separate multiple emails with commas"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Subject</label>
              <input
                type="text"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm"
                placeholder="Email subject"
              />
            </div>

            {/* Body Editor with Insert Options */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-400">
                  Message <span className="text-red-400">*</span>
                </label>
                <div className="relative" ref={insertDropdownRef}>
                  <button
                    onClick={() => setShowInsertDropdown(!showInsertDropdown)}
                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm flex items-center gap-2"
                  >
                    <Type className="w-4 h-4" />
                    Insert
                  </button>
                  
                  {showInsertDropdown && (
                    <div className="absolute right-0 mt-2 bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-xl z-20 w-48 overflow-hidden">
                      <div className="p-2 border-b border-gray-700">
                        <div className="text-xs text-gray-500 font-medium mb-1">Insert Placeholders:</div>
                      </div>
                      <button
                        onClick={handleInsertSignature}
                        className="w-full text-left p-3 hover:bg-[#2F2F2F] text-sm text-gray-300 flex items-center gap-2"
                      >
                        <Type className="w-4 h-4" />
                        Signature
                      </button>
                      <button
                        onClick={handleInsertStudioName}
                        className="w-full text-left p-3 hover:bg-[#2F2F2F] text-sm text-gray-300 flex items-center gap-2"
                      >
                        <Building className="w-4 h-4" />
                        Studio Name
                      </button>
                      <button
                        onClick={handleInsertFranchiseName}
                        className="w-full text-left p-3 hover:bg-[#2F2F2F] text-sm text-gray-300 flex items-center gap-2"
                      >
                        <Building className="w-4 h-4" />
                        Franchise Name
                      </button>
                      <button
                        onClick={handleInsertMemberName}
                        className="w-full text-left p-3 hover:bg-[#2F2F2F] text-sm text-gray-300 flex items-center gap-2"
                      >
                        <Users className="w-4 h-4" />
                        Member Name
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-[#222222] rounded-xl p-2 border border-gray-700">
                <WysiwygEditor
                  value={emailData.body}
                  onChange={(html) => setEmailData({ ...emailData, body: html })}
                  placeholder="Type your message..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end pt-4 border-t border-gray-700">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Email
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default SendEmailModal