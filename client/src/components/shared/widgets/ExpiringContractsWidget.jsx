/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react"
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
import { useTranslation } from "react-i18next"

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
      className={`bg-primary rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0 ${sizeClasses[size]} ${className}`}
    >
      {getInitials()}
    </div>
  )
}

export const ExpiringContractsWidget = ({
 isSidebarEditing, showHeader = true, maxItems = null }) => {
  const { t, i18n } = useTranslation()

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
  const formatDate = (dateStr, locale) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleDateString(locale, { day: "2-digit", month: "2-digit", year: "numeric" })
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
  // Measure actual item heights for maxItems constraint
  const listRef = useRef(null)
  const [computedMaxHeight, setComputedMaxHeight] = useState(null)

  useEffect(() => {
    if (!maxItems || !listRef.current) {
      setComputedMaxHeight(null)
      return
    }
    const frame = requestAnimationFrame(() => {
      const el = listRef.current
      if (!el) return
      const children = el.children
      if (children.length === 0) { setComputedMaxHeight(null); return }
      const count = Math.min(maxItems, children.length)
      const firstRect = children[0].getBoundingClientRect()
      const lastRect = children[count - 1].getBoundingClientRect()
      setComputedMaxHeight(lastRect.bottom - firstRect.top + 4)
    })
    return () => cancelAnimationFrame(frame)
  }, [maxItems, expiringMembers.length])


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
        subject: t("myArea.expiringContractsWidget.contractRenewal"),
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
    toast.success(t("myArea.expiringContractsWidget.toast.emailSent"))
    handleCloseEmailModal()
  }

  const handleSaveEmailAsDraft = (draftData) => {
    console.log("Saving draft:", draftData)
    toast.success(t("myArea.expiringContractsWidget.toast.draftSaved"))
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
      <div className={`p-3 rounded-xl bg-surface-button flex flex-col ${showHeader ? 'h-[320px] md:h-[340px]' : ''}`}>
        {/* Header */}
        {showHeader && (
          <div className="flex justify-between items-center mb-3 flex-shrink-0">
            <h2 className="text-base font-semibold text-content-primary">{t("myArea.expiringContractsWidget.title")}</h2>
          </div>
        )}

        {/* Members List - scrollable */}
        <div
          ref={listRef}
          className={`overflow-y-auto custom-scrollbar pr-1 ${showHeader ? 'flex-1' : ''}`}
          style={computedMaxHeight ? { maxHeight: `${computedMaxHeight}px` } : undefined}
        >
          {expiringMembers.length > 0 ? (
            <div className="flex flex-col gap-2">
              {expiringMembers.map((member) => {
                const daysRemaining = calculateDaysRemaining(member.contractEnd)
                
                return (
                  <Link to="/dashboard/contract" key={member.id} state={{ filterMemberId: member.id, filterMemberName: `${member.firstName} ${member.lastName}` }} className="block">
                    <div className="p-3 bg-surface-card rounded-xl hover:bg-surface-hover transition-colors">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <InitialsAvatar 
                          firstName={member.firstName} 
                          lastName={member.lastName}
                          size="sm"
                        />
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-content-primary truncate">
                            {member.firstName} {member.lastName}
                          </h3>
                          
                          <div className="flex items-center gap-1.5 mt-1">
                            <Calendar size={10} className="text-content-muted" />
                            <span className="text-xs text-content-muted">
                              {formatDate(member.contractEnd, i18n.language)}
                            </span>
                          </div>

                          <p className="text-[10px] text-primary mt-0.5">
                            {t("myArea.expiringContractsWidget.daysLeft", { count: daysRemaining })}
                          </p>

                          {/* Member Type */}
                          {member.memberType && (
                            <p className="text-[10px] text-content-faint mt-0.5 capitalize">
                              {t("myArea.expiringContractsWidget.memberType", { type: member.memberType })}
                            </p>
                          )}
                        </div>

                        {/* Status Badge - Centered */}
                        <span className="px-2 py-1 text-[10px] rounded-full font-medium whitespace-nowrap bg-primary/20 text-primary flex-shrink-0">
                          {t("myArea.expiringContractsWidget.expiringSoon")}
                        </span>

                        {/* Contact Button - Orange */}
                        <button
                          onClick={(e) => handleContactClick(member, e)}
                          className="p-1.5 bg-primary hover:bg-primary-hover rounded-lg text-white transition-colors flex-shrink-0"
                          title={t("myArea.expiringContractsWidget.contactMember")}
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
            <div className="flex flex-col items-center justify-center py-8 text-content-faint">
              <div className="w-12 h-12 rounded-full bg-surface-dark flex items-center justify-center mb-3">
                <FileText size={20} className="text-content-faint" />
              </div>
              <p className="text-sm">{t("myArea.expiringContractsWidget.noExpiring")}</p>
            </div>
          )}
        </div>

        {/* Footer Link */}
        <div className="flex justify-center pt-2 border-t border-border flex-shrink-0 mt-2">
          <Link to="/dashboard/contract" className="text-xs text-content-muted hover:text-content-primary transition-colors">
            {t("myArea.expiringContractsWidget.viewAll")}
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
