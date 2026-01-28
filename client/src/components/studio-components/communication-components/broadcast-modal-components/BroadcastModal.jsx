/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react"
import { 
  X, FolderPlus, Search, Send, Plus, Edit, Trash2, Bell, Mail, 
  Folder, FileText, User, Building2, Check, ChevronLeft, ChevronRight,
  Users, Settings, MoreVertical
} from "lucide-react"
import DeleteConfirmationModal from "./DeleteConfirmationModal"
import TemplateEditorModal from "./TemplateEditorModal"
import SharedFolderModal from "../../../shared/SharedFolderModal"
import { membersData, staffData } from "../../../../utils/studio-states/app-states"

// Initials Avatar Component
const InitialsAvatar = ({ firstName, lastName, size = "md", isStaff = false, className = "" }) => {
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || ""
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || ""
    return `${firstInitial}${lastInitial}` || "?"
  }
  const sizeClasses = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" }
  const bgColor = isStaff ? "bg-blue-600" : "bg-orange-500"
  return (
    <div className={`${bgColor} rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0 ${sizeClasses[size]} ${className}`}>
      {getInitials()}
    </div>
  )
}

export default function BroadcastModal({
  onClose, broadcastFolders = [], preConfiguredMessages = [], settings = {},
  onBroadcast, onCreateMessage, onUpdateMessage, onDeleteMessage,
  onCreateFolder, onUpdateFolder, onDeleteFolder, onUpdateEmailTemplate, onDeleteEmailTemplate,
}) {
  const [activeChannel, setActiveChannel] = useState("push")
  const [activeSection, setActiveSection] = useState("compose")
  const [audienceTab, setAudienceTab] = useState("member")
  const [selectedRecipients, setSelectedRecipients] = useState([])
  const [searchMember, setSearchMember] = useState("")
  const [selectAll, setSelectAll] = useState(false)

  // Mobile-specific states
  const [mobileStep, setMobileStep] = useState("recipients") // "recipients", "template", "review"
  const [showMobileChannelSelect, setShowMobileChannelSelect] = useState(false)

  // Push folders - initialized from props but managed internally for color support
  const [pushFolders, setPushFolders] = useState(() => 
    broadcastFolders.map(f => ({ ...f, color: f.color || '#FF843E' }))
  )
  const [selectedPushFolder, setSelectedPushFolder] = useState(null)
  const [selectedPushMessage, setSelectedPushMessage] = useState(null)

  const [emailFolders, setEmailFolders] = useState([
    { id: 1001, name: "General", color: "#3B82F6" },
    { id: 1002, name: "Marketing", color: "#10B981" },
    { id: 1003, name: "Announcements", color: "#F59E0B" },
  ])
  const [selectedEmailFolder, setSelectedEmailFolder] = useState(null)
  const [emailTemplates, setEmailTemplates] = useState([
    { id: 5001, name: "Welcome Email", folderId: 1001, subject: "Welcome to Our Community", body: "<p>Hello,</p><p>We're excited to have you with us.</p>" },
    { id: 5002, name: "Special Offer", folderId: 1002, subject: "Special Offer Just for You", body: "<p>Hi,</p><p>Enjoy an exclusive offer available for a limited time.</p>" },
  ])
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState(null)

  const [showFolderModal, setShowFolderModal] = useState(false)
  const [editingFolder, setEditingFolder] = useState(null)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [deleteType, setDeleteType] = useState("")
  const [showSendConfirmModal, setShowSendConfirmModal] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [lastSentInfo, setLastSentInfo] = useState(null)

  const [folderDropdownOpen, setFolderDropdownOpen] = useState(null)
  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })

  const modalRef = useRef(null)

  const membersList = membersData.map(m => ({
    id: `member-${m.id}`, name: `${m.firstName} ${m.lastName}`,
    firstName: m.firstName, lastName: m.lastName, email: m.email, logo: m.image, role: "member"
  }))

  const staffList = staffData.map(s => ({
    id: `staff-${s.id}`, name: `${s.firstName} ${s.lastName}`,
    firstName: s.firstName, lastName: s.lastName, email: s.email, logo: s.img, role: "staff"
  }))

  const filteredChatsByAudience = audienceTab === "staff" ? staffList : membersList
  const visibleRecipientList = filteredChatsByAudience.filter(
    (chat) => searchMember === "" || chat?.name?.toLowerCase().includes(searchMember.toLowerCase())
  )

  // Initialize folders only once on mount
  const [pushFolderInitialized, setPushFolderInitialized] = useState(false)
  const [emailFolderInitialized, setEmailFolderInitialized] = useState(false)

  useEffect(() => {
    if (!pushFolderInitialized && pushFolders.length && selectedPushFolder === null) {
      // Don't auto-select - let user choose "All" or a specific folder
      setPushFolderInitialized(true)
    }
  }, [pushFolders, selectedPushFolder, pushFolderInitialized])

  useEffect(() => {
    if (!emailFolderInitialized && emailFolders.length && selectedEmailFolder === null) {
      // Don't auto-select - let user choose "All" or a specific folder
      setEmailFolderInitialized(true)
    }
  }, [emailFolders, selectedEmailFolder, emailFolderInitialized])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (folderDropdownOpen && !event.target.closest('[data-folder-dropdown]')) setFolderDropdownOpen(null)
      if (templateDropdownOpen && !event.target.closest('[data-template-dropdown]')) setTemplateDropdownOpen(null)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [folderDropdownOpen, templateDropdownOpen])

  const handleDropdownClick = (e, id, type) => {
    e.stopPropagation()
    const setter = type === 'template' ? setTemplateDropdownOpen : setFolderDropdownOpen
    const current = type === 'template' ? templateDropdownOpen : folderDropdownOpen
    if (current === id) { setter(null); return }
    const rect = e.currentTarget.getBoundingClientRect()
    const modalRect = modalRef.current?.getBoundingClientRect() || { top: 0, left: 0 }
    setDropdownPosition({ top: rect.bottom - modalRect.top + 4, left: rect.right - modalRect.left - 120 })
    setter(id)
  }

  const handleMemberSelect = (chat) => {
    setSelectedRecipients((prev) => prev.find(c => c.id === chat.id) ? prev.filter((c) => c.id !== chat.id) : [...prev, chat])
  }

  const handleSelectAll = () => {
    if (selectAll) setSelectedRecipients([])
    else setSelectedRecipients(visibleRecipientList)
    setSelectAll(!selectAll)
  }

  const removeRecipient = (chat) => setSelectedRecipients(prev => prev.filter(c => c.id !== chat.id))

  const handleOpenFolderModal = (folder = null) => {
    setEditingFolder(folder)
    setShowFolderModal(true)
    setFolderDropdownOpen(null)
  }

  const handleSaveFolder = (folderData) => {
    if (activeChannel === "push") {
      if (editingFolder) {
        setPushFolders(prev => prev.map(f => f.id === editingFolder.id ? { ...f, name: folderData.name, color: folderData.color } : f))
        onUpdateFolder?.(editingFolder.id, folderData.name, folderData.color)
      } else {
        const newId = Math.max(0, ...pushFolders.map((f) => f.id)) + 1
        const newFolder = { id: newId, name: folderData.name, color: folderData.color, messages: [] }
        setPushFolders(prev => [...prev, newFolder])
        setSelectedPushFolder(newFolder)
        onCreateFolder?.(folderData.name, folderData.color)
      }
    } else {
      if (editingFolder) {
        setEmailFolders(prev => prev.map(f => f.id === editingFolder.id ? { ...f, name: folderData.name, color: folderData.color } : f))
      } else {
        const newId = Math.max(0, ...emailFolders.map((f) => f.id)) + 1
        const newFolder = { id: newId, name: folderData.name, color: folderData.color }
        setEmailFolders((prev) => [...prev, newFolder])
        setSelectedEmailFolder(newFolder)
      }
    }
    setShowFolderModal(false)
    setEditingFolder(null)
  }

  const handleDeleteFolder = (folder) => {
    setItemToDelete(folder)
    setDeleteType(activeChannel === "push" ? "pushFolder" : "emailFolder")
    setShowDeleteModal(true)
    setFolderDropdownOpen(null)
  }

  const handleOpenTemplateModal = (template = null) => {
    setEditingTemplate(template)
    setShowTemplateModal(true)
    setTemplateDropdownOpen(null)
  }

  const handleSaveTemplate = (templateData) => {
    if (activeChannel === "push") {
      if (editingTemplate) onUpdateMessage?.(templateData)
      else onCreateMessage?.(templateData)
    } else {
      if (editingTemplate) {
        setEmailTemplates(prev => prev.map(t => t.id === editingTemplate.id ? { ...t, ...templateData } : t))
        if (selectedEmailTemplate?.id === editingTemplate.id) setSelectedEmailTemplate({ ...selectedEmailTemplate, ...templateData })
        onUpdateEmailTemplate?.(templateData)
      } else {
        const newId = Math.max(0, ...emailTemplates.map((t) => t.id)) + 1
        const newTemplate = { ...templateData, id: newId, folderId: templateData.folderId || selectedEmailFolder?.id || emailFolders[0]?.id }
        setEmailTemplates([newTemplate, ...emailTemplates])
        setSelectedEmailTemplate(newTemplate)
      }
    }
    setShowTemplateModal(false)
    setEditingTemplate(null)
  }

  const handleDeleteTemplate = (template) => {
    setItemToDelete(template)
    setDeleteType(activeChannel === "push" ? "pushMessage" : "emailTemplate")
    setShowDeleteModal(true)
    setTemplateDropdownOpen(null)
  }

  const handleConfirmDelete = () => {
    if (!itemToDelete) return
    switch (deleteType) {
      case "pushFolder":
        setPushFolders(prev => prev.filter(f => f.id !== itemToDelete.id))
        if (selectedPushFolder?.id === itemToDelete.id && pushFolders.length > 1) {
          setSelectedPushFolder(pushFolders.find(f => f.id !== itemToDelete.id))
        }
        onDeleteFolder?.(itemToDelete.id)
        break
      case "emailFolder":
        setEmailFolders(prev => prev.filter(f => f.id !== itemToDelete.id))
        setEmailTemplates(prev => prev.filter(t => t.folderId !== itemToDelete.id))
        if (selectedEmailFolder?.id === itemToDelete.id && emailFolders.length > 1) setSelectedEmailFolder(emailFolders.find(f => f.id !== itemToDelete.id))
        break
      case "pushMessage":
        onDeleteMessage?.(itemToDelete.id)
        if (selectedPushMessage?.id === itemToDelete.id) setSelectedPushMessage(null)
        break
      case "emailTemplate":
        setEmailTemplates(prev => prev.filter(t => t.id !== itemToDelete.id))
        if (selectedEmailTemplate?.id === itemToDelete.id) setSelectedEmailTemplate(null)
        break
    }
    setShowDeleteModal(false)
    setItemToDelete(null)
    setDeleteType("")
  }

  const handleBroadcastClick = () => {
    if (!selectedRecipients.length) { alert("Please select at least one recipient"); return }
    if (activeChannel === "push" && !selectedPushMessage) { alert("Please select a push message template"); return }
    if (activeChannel === "email" && !selectedEmailTemplate) { alert("Please select an email template"); return }
    setShowSendConfirmModal(true)
  }

  const handleConfirmBroadcast = () => {
    const sendSettings = { ...settings, broadcastEmail: activeChannel === "email", broadcastChat: activeChannel === "push" }
    const recipientCount = selectedRecipients.length
    const sentMemberCount = selectedRecipients.filter(r => r.role === "member").length
    const sentStaffCount = selectedRecipients.filter(r => r.role === "staff").length
    
    if (activeChannel === "push") {
      onBroadcast({ message: selectedPushMessage, recipients: selectedRecipients, settings: sendSettings })
    } else {
      const emailMessageObj = { id: Date.now(), title: selectedEmailTemplate.subject, message: selectedEmailTemplate.body, folderId: selectedEmailFolder?.id, channel: "email" }
      onBroadcast({ message: emailMessageObj, recipients: selectedRecipients, settings: sendSettings })
    }
    
    setLastSentInfo({ channel: activeChannel, recipientCount, memberCount: sentMemberCount, staffCount: sentStaffCount })
    setShowSendConfirmModal(false)
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 4000)
    setSelectedRecipients([])
    setSelectAll(false)
    if (activeChannel === "push") setSelectedPushMessage(null)
    else setSelectedEmailTemplate(null)
    // Reset mobile step
    setMobileStep("recipients")
  }

  const currentFolders = activeChannel === "push" ? pushFolders : emailFolders
  const currentTemplates = activeChannel === "push" 
    ? preConfiguredMessages?.filter(msg => !selectedPushFolder || msg.folderId === selectedPushFolder.id)
    : emailTemplates.filter(t => !selectedEmailFolder || t.folderId === selectedEmailFolder.id)
  const selectedFolder = activeChannel === "push" ? selectedPushFolder : selectedEmailFolder
  const selectedTemplate = activeChannel === "push" ? selectedPushMessage : selectedEmailTemplate
  const canSend = selectedRecipients.length > 0 && selectedTemplate

  const memberCount = selectedRecipients.filter(r => r.role === "member").length
  const staffCount = selectedRecipients.filter(r => r.role === "staff").length

  const getSendButtonText = () => {
    const parts = []
    if (memberCount > 0) parts.push(`${memberCount} member${memberCount > 1 ? 's' : ''}`)
    if (staffCount > 0) parts.push(`${staffCount} staff`)
    if (parts.length === 0) return ""
    return ` to ${parts.join(' & ')}`
  }

  // Mobile step navigation
  const canProceedToTemplate = selectedRecipients.length > 0
  const canProceedToReview = selectedTemplate !== null

  const handleMobileNext = () => {
    if (mobileStep === "recipients" && canProceedToTemplate) {
      setMobileStep("template")
    } else if (mobileStep === "template" && canProceedToReview) {
      setMobileStep("review")
    }
  }

  const handleMobileBack = () => {
    if (mobileStep === "template") {
      setMobileStep("recipients")
    } else if (mobileStep === "review") {
      setMobileStep("template")
    }
  }

  // ==========================================
  // MOBILE LAYOUT
  // ==========================================
  const MobileLayout = () => (
    <div className="md:hidden fixed inset-0 bg-[#0E0E0E] z-50 flex flex-col">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          {mobileStep !== "recipients" && activeSection === "compose" ? (
            <button onClick={handleMobileBack} className="p-2 -ml-2 hover:bg-white/5 rounded-xl transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
          ) : (
            <button onClick={onClose} className="p-2 -ml-2 hover:bg-white/5 rounded-xl transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
          <h2 className="text-lg font-semibold text-white">Broadcast</h2>
        </div>
        
        {/* Channel Toggle */}
        <button 
          onClick={() => setShowMobileChannelSelect(!showMobileChannelSelect)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all bg-blue-500/20 text-blue-400`}
        >
          {activeChannel === "push" ? <Bell className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
          {activeChannel === "push" ? "Push" : "Email"}
        </button>
      </div>

      {/* Channel Selection Dropdown */}
      {showMobileChannelSelect && (
        <div className="absolute top-16 right-4 bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
          <button 
            onClick={() => { setActiveChannel("push"); setShowMobileChannelSelect(false) }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm ${activeChannel === "push" ? "bg-blue-500/20 text-blue-400" : "text-gray-300 hover:bg-white/5"}`}
          >
            <Bell className="w-4 h-4" />
            Push Notification
          </button>
          <button 
            onClick={() => { setActiveChannel("email"); setShowMobileChannelSelect(false) }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm ${activeChannel === "email" ? "bg-blue-500/20 text-blue-400" : "text-gray-300 hover:bg-white/5"}`}
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
        </div>
      )}

      {/* Success Message Toast - Mobile */}
      {showSuccessMessage && lastSentInfo && (
        <div className="absolute top-20 left-4 right-4 z-50">
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">Broadcast sent!</p>
              <p className="text-xs text-gray-400 truncate">
                Sent to {lastSentInfo.recipientCount} recipient{lastSentInfo.recipientCount > 1 ? 's' : ''}
              </p>
            </div>
            <button onClick={() => setShowSuccessMessage(false)} className="p-1 hover:bg-white/10 rounded-lg">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Section Tabs */}
      <div className="flex bg-[#0a0a0a] border-b border-gray-800/50 flex-shrink-0 px-2">
        <button 
          onClick={() => { setActiveSection("compose"); setMobileStep("recipients") }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all border-b-2 ${
            activeSection === "compose" ? "border-orange-500 text-orange-400" : "border-transparent text-gray-400"
          }`}
        >
          <Send className="w-4 h-4" />
          Compose
        </button>
        <button 
          onClick={() => setActiveSection("templates")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all border-b-2 ${
            activeSection === "templates" ? "border-orange-500 text-orange-400" : "border-transparent text-gray-400"
          }`}
        >
          <FileText className="w-4 h-4" />
          Templates
        </button>
        <button 
          onClick={() => setActiveSection("folders")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all border-b-2 ${
            activeSection === "folders" ? "border-orange-500 text-orange-400" : "border-transparent text-gray-400"
          }`}
        >
          <Folder className="w-4 h-4" />
          Folders
        </button>
      </div>

      {/* Mobile Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* ===== COMPOSE SECTION ===== */}
        {activeSection === "compose" && (
          <>
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2 py-3 bg-[#0a0a0a] border-b border-gray-800/50">
              <div className={`flex items-center gap-1.5 ${mobileStep === "recipients" ? "text-orange-400" : "text-gray-500"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  mobileStep === "recipients" ? "bg-orange-500 text-white" : selectedRecipients.length > 0 ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-400"
                }`}>
                  {selectedRecipients.length > 0 && mobileStep !== "recipients" ? <Check className="w-3.5 h-3.5" /> : "1"}
                </div>
                <span className="text-xs">Recipients</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <div className={`flex items-center gap-1.5 ${mobileStep === "template" ? "text-orange-400" : "text-gray-500"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  mobileStep === "template" ? "bg-orange-500 text-white" : selectedTemplate ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-400"
                }`}>
                  {selectedTemplate && mobileStep !== "template" ? <Check className="w-3.5 h-3.5" /> : "2"}
                </div>
                <span className="text-xs">Template</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <div className={`flex items-center gap-1.5 ${mobileStep === "review" ? "text-orange-400" : "text-gray-500"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  mobileStep === "review" ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-400"
                }`}>
                  3
                </div>
                <span className="text-xs">Review</span>
              </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 overflow-y-auto">
              {/* STEP 1: Recipients */}
              {mobileStep === "recipients" && (
                <div className="flex flex-col h-full">
                  {/* Audience Toggle */}
                  <div className="p-4 border-b border-gray-800/50">
                    <div className="flex bg-[#1a1a1a] rounded-xl p-1">
                      <button 
                        onClick={() => setAudienceTab("member")} 
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          audienceTab === "member" ? "bg-white/10 text-white" : "text-gray-400"
                        }`}
                      >
                        <User className="w-4 h-4" />
                        Members
                      </button>
                      <button 
                        onClick={() => setAudienceTab("staff")} 
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          audienceTab === "staff" ? "bg-white/10 text-white" : "text-gray-400"
                        }`}
                      >
                        <Building2 className="w-4 h-4" />
                        Staff
                      </button>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="px-4 py-3 border-b border-gray-800/50">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="text" 
                        value={searchMember} 
                        onChange={(e) => setSearchMember(e.target.value)} 
                        placeholder={`Search ${audienceTab}s...`} 
                        className="w-full bg-[#1a1a1a] text-white text-sm rounded-xl pl-10 pr-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50" 
                      />
                    </div>
                  </div>

                  {/* Select All */}
                  <div className="px-4 py-2 flex items-center justify-between bg-[#0a0a0a]">
                    <span className="text-xs text-gray-400">{visibleRecipientList.length} available</span>
                    <button onClick={handleSelectAll} className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1">
                      {selectAll ? <><X className="w-3 h-3" />Deselect All</> : <><Check className="w-3 h-3" />Select All</>}
                    </button>
                  </div>

                  {/* Recipients List */}
                  <div className="flex-1 overflow-y-auto">
                    {visibleRecipientList.map((chat) => {
                      const isSelected = selectedRecipients.find(c => c.id === chat.id)
                      return (
                        <div 
                          key={chat.id} 
                          onClick={() => handleMemberSelect(chat)} 
                          className={`flex items-center gap-3 px-4 py-3 border-b border-gray-800/30 active:bg-white/5 ${
                            isSelected ? "bg-orange-500/10" : ""
                          }`}
                        >
                          {chat.logo ? (
                            <img src={chat.logo} alt={chat.name} className="w-11 h-11 rounded-xl object-cover" />
                          ) : (
                            <InitialsAvatar firstName={chat.firstName} lastName={chat.lastName} size="md" isStaff={audienceTab === "staff"} />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white font-medium truncate">{chat.name}</p>
                            {activeChannel === "email" && chat.email && (
                              <p className="text-xs text-gray-500 truncate">{chat.email}</p>
                            )}
                          </div>
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                            isSelected ? "bg-orange-500 text-white" : "border-2 border-gray-600"
                          }`}>
                            {isSelected && <Check className="w-4 h-4" />}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Selected Count & Next Button */}
                  <div className="p-4 bg-[#0a0a0a] border-t border-gray-800/50">
                    {selectedRecipients.length > 0 && (
                      <p className="text-xs text-gray-400 mb-3 text-center">
                        {memberCount > 0 && `${memberCount} member${memberCount > 1 ? 's' : ''}`}
                        {memberCount > 0 && staffCount > 0 && ' & '}
                        {staffCount > 0 && `${staffCount} staff`}
                        {' selected'}
                      </p>
                    )}
                    <button 
                      onClick={handleMobileNext}
                      disabled={!canProceedToTemplate}
                      className={`w-full py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                        canProceedToTemplate 
                          ? "bg-orange-500 text-white active:bg-orange-600" 
                          : "bg-gray-700 text-gray-500"
                      }`}
                    >
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Template Selection */}
              {mobileStep === "template" && (
                <div className="flex flex-col h-full">
                  {/* Folder Filter */}
                  <div className="p-4 border-b border-gray-800/50">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                      <button
                        onClick={() => { 
                          if (activeChannel === "push") setSelectedPushFolder(null)
                          else setSelectedEmailFolder(null)
                        }}
                        className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          !selectedFolder ? "bg-orange-500 text-white" : "bg-[#1a1a1a] text-gray-400"
                        }`}
                      >
                        All
                      </button>
                      {currentFolders.map((folder) => (
                        <button
                          key={folder.id}
                          onClick={() => {
                            if (activeChannel === "push") setSelectedPushFolder(folder)
                            else setSelectedEmailFolder(folder)
                          }}
                          className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                            selectedFolder?.id === folder.id ? "bg-orange-500 text-white" : "bg-[#1a1a1a] text-gray-400"
                          }`}
                        >
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: folder.color || '#3B82F6' }} />
                          {folder.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* New Template Button */}
                  <div className="px-4 py-3">
                    <button 
                      onClick={() => handleOpenTemplateModal()}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-[#1a1a1a] hover:bg-[#222] text-orange-400 rounded-xl text-sm font-medium transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Create New Template
                    </button>
                  </div>

                  {/* Templates List */}
                  <div className="flex-1 overflow-y-auto px-4 pb-4">
                    {currentTemplates.length > 0 ? (
                      <div className="space-y-2">
                        {currentTemplates.map((template) => {
                          const isSelected = selectedTemplate?.id === template.id
                          const templateName = template.name || "Untitled template"
                          const subtitle = activeChannel === "push" ? template.title : template.subject
                          const preview = activeChannel === "push" ? template.message : template.body
                          return (
                            <div 
                              key={template.id} 
                              onClick={() => { 
                                if (activeChannel === "push") setSelectedPushMessage(template)
                                else setSelectedEmailTemplate(template)
                              }}
                              className={`p-4 rounded-xl transition-all ${
                                isSelected 
                                  ? "bg-orange-500/20 border-2 border-orange-500" 
                                  : "bg-[#1a1a1a] border-2 border-transparent active:bg-[#222]"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <p className="text-sm font-medium text-white">{templateName}</p>
                                {isSelected && (
                                  <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-3 h-3 text-white" />
                                  </div>
                                )}
                              </div>
                              {subtitle && <p className="text-xs text-gray-400 mb-1">{subtitle}</p>}
                              <p className="text-xs text-gray-500 line-clamp-2" dangerouslySetInnerHTML={{ __html: preview }} />
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                        <p className="text-gray-500 mb-2">No templates found</p>
                        <button 
                          onClick={() => handleOpenTemplateModal()} 
                          className="text-sm text-orange-400"
                        >
                          Create your first template
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Next Button */}
                  <div className="p-4 bg-[#0a0a0a] border-t border-gray-800/50">
                    <button 
                      onClick={handleMobileNext}
                      disabled={!canProceedToReview}
                      className={`w-full py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                        canProceedToReview 
                          ? "bg-orange-500 text-white active:bg-orange-600" 
                          : "bg-gray-700 text-gray-500"
                      }`}
                    >
                      Review & Send
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Review & Send */}
              {mobileStep === "review" && (
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Channel Info */}
                    <div className="bg-[#1a1a1a] rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-500/20">
                          {activeChannel === "push" ? <Bell className="w-5 h-5 text-orange-400" /> : <Mail className="w-5 h-5 text-orange-400" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {activeChannel === "push" ? "Push Notification" : "Email"}
                          </p>
                          <p className="text-xs text-gray-500">Channel</p>
                        </div>
                      </div>
                    </div>

                    {/* Recipients Summary */}
                    <div className="bg-[#1a1a1a] rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-white">Recipients</p>
                        <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-lg">
                          {selectedRecipients.length}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedRecipients.slice(0, 6).map((recipient) => (
                          <div key={recipient.id} className="flex items-center gap-1.5 bg-[#0E0E0E] rounded-lg px-2 py-1.5">
                            {recipient.logo ? (
                              <img src={recipient.logo} alt="" className="w-5 h-5 rounded object-cover" />
                            ) : (
                              <InitialsAvatar firstName={recipient.firstName} lastName={recipient.lastName} size="sm" isStaff={recipient.role === "staff"} className="!w-5 !h-5 !text-[10px]" />
                            )}
                            <span className="text-xs text-gray-300">{recipient.name.split(' ')[0]}</span>
                          </div>
                        ))}
                        {selectedRecipients.length > 6 && (
                          <div className="flex items-center px-2 py-1.5 bg-[#0E0E0E] rounded-lg">
                            <span className="text-xs text-gray-400">+{selectedRecipients.length - 6} more</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Template Preview */}
                    <div className="bg-[#1a1a1a] rounded-xl p-4">
                      <p className="text-sm font-medium text-white mb-3">Template</p>
                      <div className="bg-[#0E0E0E] rounded-xl p-3">
                        <p className="text-sm font-medium text-white mb-1">
                          {selectedTemplate?.name || "Untitled template"}
                        </p>
                        <p className="text-xs text-gray-400 mb-2">
                          {activeChannel === "push" ? selectedTemplate?.title : selectedTemplate?.subject}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-3" dangerouslySetInnerHTML={{ 
                          __html: activeChannel === "push" ? selectedTemplate?.message : selectedTemplate?.body 
                        }} />
                      </div>
                    </div>
                  </div>

                  {/* Send Button */}
                  <div className="p-4 bg-[#0a0a0a] border-t border-gray-800/50">
                    <button 
                      onClick={handleBroadcastClick}
                      className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 active:from-orange-600 active:to-orange-700"
                    >
                      <Send className="w-5 h-5" />
                      Send {activeChannel === "push" ? "Notification" : "Email"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ===== TEMPLATES SECTION ===== */}
        {activeSection === "templates" && (
          <div className="flex-1 flex flex-col">
            {/* Folder Filter */}
            <div className="p-4 border-b border-gray-800/50">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                <button
                  onClick={() => { 
                    if (activeChannel === "push") setSelectedPushFolder(null)
                    else setSelectedEmailFolder(null)
                  }}
                  className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    !selectedFolder ? "bg-orange-500 text-white" : "bg-[#1a1a1a] text-gray-400"
                  }`}
                >
                  All
                </button>
                {currentFolders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => {
                      if (activeChannel === "push") setSelectedPushFolder(folder)
                      else setSelectedEmailFolder(folder)
                    }}
                    className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                      selectedFolder?.id === folder.id ? "bg-orange-500 text-white" : "bg-[#1a1a1a] text-gray-400"
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: folder.color || '#3B82F6' }} />
                    {folder.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Templates List */}
            <div className="flex-1 overflow-y-auto p-4">
              {currentTemplates.length > 0 ? (
                <div className="space-y-3">
                  {currentTemplates.map((template) => {
                    const templateName = template.name || "Untitled template"
                    const subtitle = activeChannel === "push" ? template.title : template.subject
                    const preview = activeChannel === "push" ? template.message : template.body
                    const folder = currentFolders.find(f => f.id === template.folderId)
                    return (
                      <div key={template.id} className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800/50">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-white truncate">{templateName}</h4>
                            {subtitle && <p className="text-xs text-gray-400 truncate">{subtitle}</p>}
                          </div>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => handleOpenTemplateModal(template)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4 text-gray-400" />
                            </button>
                            <button 
                              onClick={() => handleDeleteTemplate(template)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-2" dangerouslySetInnerHTML={{ __html: preview }} />
                        {folder && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Folder className="w-3 h-3" style={{ color: folder.color || '#3B82F6' }} />
                            {folder.name}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 mb-2">No templates yet</p>
                </div>
              )}
            </div>

            {/* New Template Button */}
            <div className="p-4 bg-[#0a0a0a] border-t border-gray-800/50">
              <button 
                onClick={() => handleOpenTemplateModal()}
                className="w-full py-3 bg-orange-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 active:bg-orange-600"
              >
                <Plus className="w-4 h-4" />
                New Template
              </button>
            </div>
          </div>
        )}

        {/* ===== FOLDERS SECTION ===== */}
        {activeSection === "folders" && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              {currentFolders.length > 0 ? (
                <div className="space-y-3">
                  {currentFolders.map((folder) => {
                    const templateCount = activeChannel === "push" 
                      ? preConfiguredMessages?.filter(m => m.folderId === folder.id).length || 0 
                      : emailTemplates.filter(t => t.folderId === folder.id).length
                    return (
                      <div key={folder.id} className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center" 
                              style={{ backgroundColor: `${folder.color || '#3B82F6'}20` }}
                            >
                              <Folder className="w-6 h-6" style={{ color: folder.color || '#3B82F6' }} />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-white">{folder.name}</h4>
                              <p className="text-xs text-gray-500">{templateCount} template{templateCount !== 1 ? "s" : ""}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => handleOpenFolderModal(folder)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4 text-gray-400" />
                            </button>
                            <button 
                              onClick={() => handleDeleteFolder(folder)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Folder className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 mb-2">No folders yet</p>
                </div>
              )}
            </div>

            {/* New Folder Button */}
            <div className="p-4 bg-[#0a0a0a] border-t border-gray-800/50">
              <button 
                onClick={() => handleOpenFolderModal()}
                className="w-full py-3 bg-orange-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 active:bg-orange-600"
              >
                <FolderPlus className="w-4 h-4" />
                New Folder
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // ==========================================
  // DESKTOP LAYOUT
  // ==========================================
  const DesktopLayout = () => (
    <div className="hidden md:flex fixed inset-0 bg-black/80 items-center justify-center z-50">
      <div ref={modalRef} className="bg-[#0E0E0E] rounded-2xl w-full max-w-5xl mx-4 max-h-[90vh] overflow-hidden border border-gray-800/50 shadow-2xl relative">
        {/* Success Message Toast */}
        {showSuccessMessage && lastSentInfo && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl px-5 py-3 flex items-center gap-3 shadow-xl">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Broadcast sent successfully!</p>
                <p className="text-xs text-gray-400">
                  {lastSentInfo.channel === "push" ? "Push notification" : "Email"} sent to{" "}
                  {lastSentInfo.memberCount > 0 && `${lastSentInfo.memberCount} member${lastSentInfo.memberCount > 1 ? 's' : ''}`}
                  {lastSentInfo.memberCount > 0 && lastSentInfo.staffCount > 0 && ' & '}
                  {lastSentInfo.staffCount > 0 && `${lastSentInfo.staffCount} staff`}
                </p>
              </div>
              <button 
                onClick={() => setShowSuccessMessage(false)}
                className="ml-2 p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
          <h2 className="text-lg font-semibold text-white">Broadcast</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Left Sidebar */}
          <div className="w-56 border-r border-gray-800/50 p-3 flex flex-col">
            <div className="mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-2">Channel</p>
              <div className="space-y-1">
                <button onClick={() => setActiveChannel("push")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeChannel === "push" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                  <Bell className="w-4 h-4" />Push Notification
                </button>
                <button onClick={() => setActiveChannel("email")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeChannel === "email" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                  <Mail className="w-4 h-4" />Email
                </button>
              </div>
            </div>

            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-2">Sections</p>
              <div className="space-y-1">
                <button onClick={() => setActiveSection("compose")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${activeSection === "compose" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                  <Send className="w-4 h-4" />Compose
                </button>
                <button onClick={() => setActiveSection("templates")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${activeSection === "templates" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                  <FileText className="w-4 h-4" />Templates<span className="ml-auto text-xs bg-white/10 px-2 py-0.5 rounded-lg">{currentTemplates.length}</span>
                </button>
                <button onClick={() => setActiveSection("folders")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${activeSection === "folders" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                  <Folder className="w-4 h-4" />Folders<span className="ml-auto text-xs bg-white/10 px-2 py-0.5 rounded-lg">{currentFolders.length}</span>
                </button>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-800/50">
              <div className="bg-[#1a1a1a] rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between text-xs"><span className="text-gray-500">Recipients</span><span className="text-white font-medium">{selectedRecipients.length}</span></div>
                <div className="flex items-center justify-between text-xs"><span className="text-gray-500">Template</span><span className={selectedTemplate ? "text-white" : "text-gray-500"}>{selectedTemplate ? "Selected" : "None"}</span></div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeSection === "compose" && (
              <div className="flex-1 flex overflow-hidden">
                {/* Recipients Panel */}
                <div className="w-80 border-r border-gray-800/50 flex flex-col">
                  <div className="p-4 border-b border-gray-800/50">
                    <h3 className="text-sm font-medium text-white mb-3">Select Recipients</h3>
                    <div className="flex bg-[#1a1a1a] rounded-xl p-1 mb-3">
                      <button onClick={() => setAudienceTab("member")} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${audienceTab === "member" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}>
                        <User className="w-3.5 h-3.5" />Members
                      </button>
                      <button onClick={() => setAudienceTab("staff")} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${audienceTab === "staff" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}>
                        <Building2 className="w-3.5 h-3.5" />Staff
                      </button>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input type="text" value={searchMember} onChange={(e) => setSearchMember(e.target.value)} placeholder={`Search ${audienceTab}s...`} className="w-full bg-[#1a1a1a] text-white text-sm rounded-xl pl-10 pr-4 py-2.5 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50" />
                    </div>
                  </div>
                  <div className="px-4 py-2 border-b border-gray-800/50 flex items-center justify-between">
                    <span className="text-xs text-gray-400">{visibleRecipientList.length} available</span>
                    <button onClick={handleSelectAll} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                      {selectAll ? <><X className="w-3 h-3" />Deselect All</> : <><Check className="w-3 h-3" />Select All</>}
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2">
                    {visibleRecipientList.map((chat) => {
                      const isSelected = selectedRecipients.find(c => c.id === chat.id)
                      return (
                        <div key={chat.id} onClick={() => handleMemberSelect(chat)} className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${isSelected ? "bg-blue-600/20 border border-blue-500/30" : "hover:bg-white/5"}`}>
                          {chat.logo ? <img src={chat.logo} alt={chat.name} className="w-9 h-9 rounded-xl object-cover" /> : <InitialsAvatar firstName={chat.firstName} lastName={chat.lastName} size="sm" isStaff={audienceTab === "staff"} />}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{chat.name}</p>
                            {activeChannel === "email" && chat.email && <p className="text-xs text-gray-500 truncate">{chat.email}</p>}
                          </div>
                          <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${isSelected ? "bg-blue-500 text-white" : "border border-gray-600"}`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Template & Send Panel */}
                <div className="flex-1 flex flex-col p-4 overflow-y-auto">
                  {selectedRecipients.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">{selectedRecipients.length} recipient{selectedRecipients.length > 1 ? "s" : ""} selected</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedRecipients.slice(0, 8).map((recipient) => (
                          <div key={recipient.id} className="flex items-center gap-2 bg-[#1a1a1a] rounded-lg px-2.5 py-1.5">
                            {recipient.logo ? <img src={recipient.logo} alt={recipient.name} className="w-5 h-5 rounded object-cover" /> : <InitialsAvatar firstName={recipient.firstName} lastName={recipient.lastName} size="sm" isStaff={recipient.role === "staff"} className="!w-5 !h-5 !text-[10px]" />}
                            <span className="text-xs text-white">{recipient.name}</span>
                            <button onClick={() => removeRecipient(recipient)} className="p-0.5 hover:bg-white/10 rounded transition-colors"><X className="w-3 h-3 text-gray-400" /></button>
                          </div>
                        ))}
                        {selectedRecipients.length > 8 && <div className="flex items-center px-2.5 py-1.5 bg-[#1a1a1a] rounded-lg"><span className="text-xs text-gray-400">+{selectedRecipients.length - 8} more</span></div>}
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="text-xs text-gray-500 mb-2 block">Select Folder</label>
                    <select value={selectedFolder?.id || ""} onChange={(e) => { 
                      const value = e.target.value;
                      if (value === "") {
                        // All Folders selected
                        if (activeChannel === "push") { setSelectedPushFolder(null); setSelectedPushMessage(null) } 
                        else { setSelectedEmailFolder(null); setSelectedEmailTemplate(null) }
                      } else {
                        const folder = currentFolders.find(f => f.id === Number(value)); 
                        if (activeChannel === "push") { setSelectedPushFolder(folder || null); setSelectedPushMessage(null) } 
                        else { setSelectedEmailFolder(folder || null); setSelectedEmailTemplate(null) }
                      }
                    }} className="w-full bg-[#1a1a1a] text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-orange-500/50">
                      <option value="">All Folders</option>
                      {currentFolders.map((folder) => <option key={folder.id} value={folder.id}>{folder.name}</option>)}
                    </select>
                  </div>

                  <div className="flex-1 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-gray-500">Select Template</label>
                      <button onClick={() => handleOpenTemplateModal()} className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1"><Plus className="w-3 h-3" />New Template</button>
                    </div>
                    <div className="bg-[#1a1a1a] rounded-xl max-h-64 overflow-y-auto">
                      {currentTemplates.length > 0 ? currentTemplates.map((template) => {
                        const isSelected = selectedTemplate?.id === template.id
                        const templateName = template.name || "Untitled template"
                        const subtitle = activeChannel === "push" ? template.title : template.subject
                        const preview = activeChannel === "push" ? template.message : template.body
                        return (
                          <div key={template.id} onClick={() => { if (activeChannel === "push") setSelectedPushMessage(template); else setSelectedEmailTemplate(template) }} className={`p-3 cursor-pointer transition-all ${isSelected ? "bg-blue-600/20 border-l-4 border-blue-500" : "hover:bg-white/5 border-l-4 border-transparent"}`}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{templateName}</p>
                                {subtitle && <p className="text-xs text-gray-400 truncate">{subtitle}</p>}
                                <p className="text-xs text-gray-500 truncate mt-0.5" dangerouslySetInnerHTML={{ __html: preview }} />
                              </div>
                              <div data-template-dropdown>
                                <button onClick={(e) => handleDropdownClick(e, template.id, 'template')} className="text-gray-400 hover:text-orange-400 p-1.5 rounded-lg hover:bg-gray-800 transition-colors">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" /></svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      }) : (
                        <div className="p-8 text-center">
                          <FileText className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">No templates found</p>
                          <button onClick={() => handleOpenTemplateModal()} className="mt-2 text-xs text-orange-400 hover:text-orange-300">Create your first template</button>
                        </div>
                      )}
                    </div>
                  </div>

                  <button onClick={handleBroadcastClick} disabled={!canSend} className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${canSend ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700" : "bg-gray-700 text-gray-500 cursor-not-allowed"}`}>
                    <Send className="w-4 h-4" />Send {activeChannel === "push" ? "Push Notification" : "Email"}{getSendButtonText()}
                  </button>
                </div>
              </div>
            )}

            {activeSection === "templates" && (
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">{activeChannel === "push" ? "Push Templates" : "Email Templates"}</h3>
                  <button onClick={() => handleOpenTemplateModal()} className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-colors"><Plus className="w-4 h-4" />New Template</button>
                </div>
                <div className="mb-4">
                  <select value={selectedFolder?.id || ""} onChange={(e) => { 
                    const value = e.target.value;
                    if (value === "") {
                      if (activeChannel === "push") setSelectedPushFolder(null); 
                      else setSelectedEmailFolder(null);
                    } else {
                      const folder = currentFolders.find(f => f.id === Number(value)); 
                      if (activeChannel === "push") setSelectedPushFolder(folder || null); 
                      else setSelectedEmailFolder(folder || null);
                    }
                  }} className="bg-[#1a1a1a] text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-orange-500/50">
                    <option value="">All Folders</option>
                    {currentFolders.map((folder) => <option key={folder.id} value={folder.id}>{folder.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentTemplates.map((template) => {
                    const templateName = template.name || "Untitled template"
                    const subtitle = activeChannel === "push" ? template.title : template.subject
                    const preview = activeChannel === "push" ? template.message : template.body
                    const folder = currentFolders.find(f => f.id === template.folderId)
                    return (
                      <div key={template.id} className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800/50 hover:border-gray-700/50 transition-colors">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-white truncate">{templateName}</h4>
                            {subtitle && <p className="text-xs text-gray-400 truncate">{subtitle}</p>}
                          </div>
                          <div data-template-dropdown>
                            <button onClick={(e) => handleDropdownClick(e, `grid-${template.id}`, 'template')} className="text-gray-400 hover:text-orange-400 p-1.5 rounded-lg hover:bg-gray-800 transition-colors">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" /></svg>
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-3" dangerouslySetInnerHTML={{ __html: preview }} />
                        {folder && <div className="flex items-center gap-1.5 text-xs text-gray-600"><Folder className="w-3 h-3" style={{ color: folder.color || '#3B82F6' }} />{folder.name}</div>}
                      </div>
                    )
                  })}
                </div>
                {currentTemplates.length === 0 && <div className="text-center py-12"><FileText className="w-12 h-12 text-gray-700 mx-auto mb-3" /><p className="text-gray-500 mb-2">No templates yet</p><button onClick={() => handleOpenTemplateModal()} className="text-sm text-orange-400 hover:text-orange-300">Create your first template</button></div>}
              </div>
            )}

            {activeSection === "folders" && (
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">{activeChannel === "push" ? "Push Folders" : "Email Folders"}</h3>
                  <button onClick={() => handleOpenFolderModal()} className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-colors"><FolderPlus className="w-4 h-4" />New Folder</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {currentFolders.map((folder) => {
                    const templateCount = activeChannel === "push" ? preConfiguredMessages?.filter(m => m.folderId === folder.id).length || 0 : emailTemplates.filter(t => t.folderId === folder.id).length
                    return (
                      <div key={folder.id} className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800/50 hover:border-gray-700/50 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${folder.color || '#3B82F6'}20` }}>
                              <Folder className="w-5 h-5" style={{ color: folder.color || '#3B82F6' }} />
                            </div>
                            <div><h4 className="text-sm font-medium text-white">{folder.name}</h4><p className="text-xs text-gray-500">{templateCount} template{templateCount !== 1 ? "s" : ""}</p></div>
                          </div>
                          <div data-folder-dropdown>
                            <button onClick={(e) => handleDropdownClick(e, folder.id, 'folder')} className="text-gray-400 hover:text-orange-400 p-1.5 rounded-lg hover:bg-gray-800 transition-colors">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" /></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {currentFolders.length === 0 && <div className="text-center py-12"><Folder className="w-12 h-12 text-gray-700 mx-auto mb-3" /><p className="text-gray-500 mb-2">No folders yet</p><button onClick={() => handleOpenFolderModal()} className="text-sm text-orange-400 hover:text-orange-300">Create your first folder</button></div>}
              </div>
            )}
          </div>
        </div>

        {/* Portal Dropdowns */}
        {templateDropdownOpen && (
          <div className="absolute bg-[#1C1C1C] border border-gray-700 rounded-lg shadow-xl py-1 z-[200] min-w-[120px]" style={{ top: dropdownPosition.top, left: dropdownPosition.left }} data-template-dropdown>
            <button onClick={(e) => { e.stopPropagation(); const templateId = typeof templateDropdownOpen === 'string' && templateDropdownOpen.startsWith('grid-') ? Number(templateDropdownOpen.replace('grid-', '')) : templateDropdownOpen; const template = currentTemplates.find(t => t.id === templateId); if (template) handleOpenTemplateModal(template) }} className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2 transition-colors"><Edit size={14} /> Edit</button>
            <button onClick={(e) => { e.stopPropagation(); const templateId = typeof templateDropdownOpen === 'string' && templateDropdownOpen.startsWith('grid-') ? Number(templateDropdownOpen.replace('grid-', '')) : templateDropdownOpen; const template = currentTemplates.find(t => t.id === templateId); if (template) handleDeleteTemplate(template) }} className="w-full text-left px-3 py-2 hover:bg-gray-800 text-red-500 text-sm flex items-center gap-2 transition-colors"><Trash2 size={14} /> Delete</button>
          </div>
        )}

        {folderDropdownOpen && (
          <div className="absolute bg-[#1C1C1C] border border-gray-700 rounded-lg shadow-xl py-1 z-[200] min-w-[120px]" style={{ top: dropdownPosition.top, left: dropdownPosition.left }} data-folder-dropdown>
            <button onClick={(e) => { e.stopPropagation(); const folder = currentFolders.find(f => f.id === folderDropdownOpen); if (folder) handleOpenFolderModal(folder) }} className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2 transition-colors"><Edit size={14} /> Edit</button>
            <button onClick={(e) => { e.stopPropagation(); const folder = currentFolders.find(f => f.id === folderDropdownOpen); if (folder) handleDeleteFolder(folder) }} className="w-full text-left px-3 py-2 hover:bg-gray-800 text-red-500 text-sm flex items-center gap-2 transition-colors"><Trash2 size={14} /> Delete</button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      <MobileLayout />
      <DesktopLayout />

      <SharedFolderModal 
        isOpen={showFolderModal} 
        onClose={() => { setShowFolderModal(false); setEditingFolder(null) }} 
        folder={editingFolder} 
        onSave={handleSaveFolder}
        showColorPicker={true}
        defaultColor="#FF843E"
      />
      <TemplateEditorModal isOpen={showTemplateModal} onClose={() => { setShowTemplateModal(false); setEditingTemplate(null) }} template={editingTemplate} onSave={handleSaveTemplate} folders={currentFolders} selectedFolder={selectedFolder} isEmailTemplate={activeChannel === "email"} audienceType={audienceTab} signature={settings?.emailSignature || ""} />
      <DeleteConfirmationModal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setItemToDelete(null); setDeleteType("") }} onConfirm={handleConfirmDelete} itemName={itemToDelete?.name || itemToDelete?.title || itemToDelete?.subject || ""} itemType={deleteType === "pushFolder" || deleteType === "emailFolder" ? "folder" : deleteType === "pushMessage" ? "message" : "template"} />
      
      {/* Send Confirmation Modal */}
      {showSendConfirmModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[10000] p-4">
          <div className="bg-[#0E0E0E] rounded-2xl w-full max-w-lg border border-gray-800/50 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
              <h2 className="text-lg font-semibold text-white">Confirm Broadcast</h2>
              <button onClick={() => setShowSendConfirmModal(false)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <p className="text-gray-300">Are you sure you want to send this broadcast?</p>
              
              <div className="bg-[#1a1a1a] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Channel</span>
                  <span className="text-sm text-white font-medium flex items-center gap-2">
                    {activeChannel === "push" ? <Bell className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                    {activeChannel === "push" ? "Push Notification" : "Email"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Recipients</span>
                  <span className="text-sm text-white font-medium">
                    {memberCount > 0 && `${memberCount} member${memberCount > 1 ? 's' : ''}`}
                    {memberCount > 0 && staffCount > 0 && ' & '}
                    {staffCount > 0 && `${staffCount} staff`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Template</span>
                  <span className="text-sm text-white font-medium truncate max-w-[200px]">
                    {selectedTemplate?.name || selectedTemplate?.title || selectedTemplate?.subject || "Untitled"}
                  </span>
                </div>
              </div>
              
              <p className="text-xs text-gray-500">
                This will send {activeChannel === "push" ? "a push notification" : "an email"} to {selectedRecipients.length} recipient{selectedRecipients.length > 1 ? 's' : ''}.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-800/50 bg-[#0a0a0a]">
              <button onClick={() => setShowSendConfirmModal(false)} className="px-5 py-2.5 bg-[#1a1a1a] hover:bg-[#252525] text-white text-sm font-medium rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={handleConfirmBroadcast} className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-medium rounded-xl transition-all flex items-center gap-2">
                <Send className="w-4 h-4" />
                Send Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
