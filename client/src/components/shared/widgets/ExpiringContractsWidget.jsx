/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react"
import { createPortal } from "react-dom"
import { Link } from "react-router-dom"
import { FileText, MessageCircle, Calendar } from "lucide-react"
import { membersData } from "../../../utils/studio-states/members-states"
import { communicationSettingsData } from "../../../utils/studio-states"
import toast from "react-hot-toast"

// Communication Modals
import MessageTypeSelectionModal from "../../shared/communication/MessageTypeSelectionModal"
import ChatPopup from "../../shared/communication/ChatPopup"
import SendEmailModal from "../../shared/communication/SendEmailModal"

// Initials Avatar Component
const InitialsAvatar = ({ firstName, lastName, size = "md", className = "" }) => {
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || ""
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || ""
    return `${firstInitial}${lastInitial}` || "?"
  }

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  }

  return (
    <div 
      className={`bg-orange-500 rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0 ${sizeClasses[size]} ${className}`}
    >
      {getInitials()}
    </div>
  )
}

export const ExpiringContractsWidget = ({ isSidebarEditing, showHeader = true, maxItems = null }) => {
  // Contact Modal States
  const [messageTypeModal, setMessageTypeModal] = useState({
    isOpen: false,
    member: null
  })
  const [chatPopup, setChatPopup] = useState({
    isOpen: false,
    member: null
  })
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [selectedMemberForEmail, setSelectedMemberForEmail] = useState(null)
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    body: "",
    recipientName: ""
  })

  // Calculate days remaining until expiry
  const calculateDaysRemaining = (contractEnd) => {
    if (!contractEnd) return Infinity
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expiry = new Date(contractEnd)
    expiry.setHours(0, 0, 0, 0)
    const diffTime = expiry - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  // Get members with expiring contracts (within 90 days), always sorted by expiry
  const getExpiringMembers = () => {
    return membersData
      .filter(member => {
        if (!member.contractEnd || member.isArchived) return false
        const daysRemaining = calculateDaysRemaining(member.contractEnd)
        // Only show contracts expiring within 90 days and not already expired
        return daysRemaining > 0 && daysRemaining <= 90
      })
      .sort((a, b) => calculateDaysRemaining(a.contractEnd) - calculateDaysRemaining(b.contractEnd))
  }

  const expiringMembers = getExpiringMembers()

  // Contact Handlers
  const handleContactClick = (member, e) => {
    e.preventDefault()
    e.stopPropagation()
    
    setMessageTypeModal({
      isOpen: true,
      member: member
    })
  }

  const handleOpenAppChat = () => {
    if (messageTypeModal.member) {
      setChatPopup({
        isOpen: true,
        member: messageTypeModal.member
      })
    }
  }

  const handleOpenEmailModal = () => {
    if (messageTypeModal.member) {
      setSelectedMemberForEmail(messageTypeModal.member)
      setEmailData({
        to: messageTypeModal.member.email || "",
        subject: "Contract Renewal",
        body: "",
        recipientName: `${messageTypeModal.member.firstName} ${messageTypeModal.member.lastName}`
      })
      setShowEmailModal(true)
    }
  }

  const handleCloseEmailModal = () => {
    setShowEmailModal(false)
    setSelectedMemberForEmail(null)
    setEmailData({ to: "", subject: "", body: "", recipientName: "" })
  }

  const handleSendEmail = () => {
    console.log("Sending email:", emailData)
    toast.success("Email sent successfully!")
    handleCloseEmailModal()
  }

  const handleSaveEmailAsDraft = (draftData) => {
    console.log("Saving draft:", draftData)
    toast.success("Draft saved!")
  }

  const handleSearchMemberForEmail = (query) => {
    if (!query) return []
    return []
  }

  const handleOpenFullMessenger = (member) => {
    setChatPopup({ isOpen: false, member: null })
  }

  return (
    <>
      <div className={`p-3 rounded-xl bg-[#2F2F2F] flex flex-col ${showHeader ? 'h-[320px] md:h-[340px]' : ''}`}>
        {/* Header */}
        {showHeader && (
          <div className="flex justify-between items-center mb-3 flex-shrink-0">
            <h2 className="text-base font-semibold text-white">Expiring Contracts</h2>
          </div>
        )}

        {/* Members List - scrollable */}
        <div className={`overflow-y-auto custom-scrollbar pr-1 ${showHeader ? 'flex-1' : ''}`}>
          {expiringMembers.length > 0 ? (
            <div className="flex flex-col gap-2">
              {(maxItems ? expiringMembers.slice(0, maxItems) : expiringMembers).map((member) => {
                const daysRemaining = calculateDaysRemaining(member.contractEnd)
                
                return (
                  <Link to="/dashboard/contract" key={member.id} state={{ filterMemberId: member.id, filterMemberName: `${member.firstName} ${member.lastName}` }} className="block">
                    <div className="p-3 bg-black rounded-xl hover:bg-zinc-900 transition-colors">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <InitialsAvatar 
                          firstName={member.firstName} 
                          lastName={member.lastName}
                          size="sm"
                        />
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-white truncate">
                            {member.firstName} {member.lastName}
                          </h3>
                          
                          <div className="flex items-center gap-1.5 mt-1">
                            <Calendar size={10} className="text-gray-400" />
                            <span className="text-xs text-gray-400">
                              {formatDate(member.contractEnd)}
                            </span>
                          </div>

                          <p className="text-[10px] text-orange-400 mt-0.5">
                            {daysRemaining} days left
                          </p>

                          {/* Member Type */}
                          {member.memberType && (
                            <p className="text-[10px] text-gray-500 mt-0.5 capitalize">
                              {member.memberType} Member
                            </p>
                          )}
                        </div>

                        {/* Status Badge - Centered */}
                        <span className="px-2 py-1 text-[10px] rounded-full font-medium whitespace-nowrap bg-orange-500/20 text-orange-400 flex-shrink-0">
                          Expiring Soon
                        </span>

                        {/* Contact Button - Orange */}
                        <button
                          onClick={(e) => handleContactClick(member, e)}
                          className="p-1.5 bg-orange-500 hover:bg-orange-600 rounded-lg text-white transition-colors flex-shrink-0"
                          title="Contact Member"
                        >
                          <MessageCircle size={14} />
                        </button>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3">
                <FileText size={20} className="text-gray-600" />
              </div>
              <p className="text-sm">No expiring contracts</p>
            </div>
          )}
        </div>

        {/* Footer Link */}
        <div className="flex justify-center pt-2 border-t border-gray-700 flex-shrink-0 mt-2">
          <Link to="/dashboard/contract" className="text-xs text-gray-400 hover:text-white transition-colors">
            View all contracts â†’
          </Link>
        </div>
      </div>

      {/* Modals - rendered via Portal to ensure centered positioning */}
      {createPortal(
        <>
          {/* Message Type Selection Modal */}
          <MessageTypeSelectionModal
            isOpen={messageTypeModal.isOpen}
            onClose={() => setMessageTypeModal({ isOpen: false, member: null })}
            member={messageTypeModal.member}
            onSelectAppChat={handleOpenAppChat}
            onSelectEmail={handleOpenEmailModal}
          />

          {/* Chat Popup */}
          {chatPopup.isOpen && chatPopup.member && (
            <ChatPopup
              member={chatPopup.member}
              isOpen={chatPopup.isOpen}
              onClose={() => setChatPopup({ isOpen: false, member: null })}
              onOpenFullMessenger={() => handleOpenFullMessenger(chatPopup.member)}
            />
          )}

          {/* Send Email Modal */}
          <SendEmailModal
            showEmailModal={showEmailModal}
            handleCloseEmailModal={handleCloseEmailModal}
            handleSendEmail={handleSendEmail}
            emailData={emailData}
            setEmailData={setEmailData}
            handleSearchMemberForEmail={handleSearchMemberForEmail}
            preselectedMember={selectedMemberForEmail}
            onSaveAsDraft={handleSaveEmailAsDraft}
            signature={communicationSettingsData?.emailSignature || ""}
          />
        </>,
        document.body
      )}
    </>
  )
}

export default ExpiringContractsWidget
