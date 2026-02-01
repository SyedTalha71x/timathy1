/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react"
import { Link } from "react-router-dom"
import { Cake, MessageCircle, Calendar } from "lucide-react"
import { membersData } from "../../../utils/studio-states/members-states"
import { communicationSettingsData } from "../../../utils/studio-states"
import { DEFAULT_COMMUNICATION_SETTINGS } from "../../../utils/studio-states/configuration-states"
import toast from "react-hot-toast"

// Communication Modals
import MessageTypeSelectionModal from "../../shared/communication/MessageTypeSelectionModal"
import ChatPopup from "../../shared/communication/ChatPopup"
import SendEmailModal from "../../shared/communication/SendEmailModal"

// Birthday Badge Component
import BirthdayBadge from "../../shared/BirthdayBadge"

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

export const UpcomingBirthdaysWidget = ({ isSidebarEditing, showHeader = true, maxItems = null }) => {
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

  // Check if automated birthday notifications are enabled
  // If either push or email notifications are enabled, hide manual contact button
  const areBirthdayNotificationsEnabled = () => {
    const settings = DEFAULT_COMMUNICATION_SETTINGS
    return settings.birthdayNotificationEnabled && (settings.birthdaySendEmail || settings.birthdaySendApp)
  }

  const showContactButton = !areBirthdayNotificationsEnabled()

  // Check if birthday is today
  const isBirthdayToday = (dateOfBirth) => {
    if (!dateOfBirth) return false
    const today = new Date()
    const birthday = new Date(dateOfBirth)
    return today.getMonth() === birthday.getMonth() && today.getDate() === birthday.getDate()
  }

  // Calculate age from dateOfBirth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return ""
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  // Calculate days until birthday (this year or next)
  const getDaysUntilBirthday = (dateOfBirth) => {
    if (!dateOfBirth) return Infinity
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const birthday = new Date(dateOfBirth)
    const birthdayThisYear = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate())
    birthdayThisYear.setHours(0, 0, 0, 0)
    
    // If birthday already passed this year, use next year
    if (birthdayThisYear < today) {
      birthdayThisYear.setFullYear(today.getFullYear() + 1)
    }
    
    const diffTime = birthdayThisYear - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Get members with upcoming birthdays (within 90 days), sorted by days until birthday
  const getUpcomingBirthdays = () => {
    return membersData
      .filter(member => {
        if (!member.dateOfBirth || member.isArchived) return false
        const daysUntil = getDaysUntilBirthday(member.dateOfBirth)
        // Show birthdays within 90 days (including today = 0 days)
        return daysUntil >= 0 && daysUntil <= 90
      })
      .sort((a, b) => getDaysUntilBirthday(a.dateOfBirth) - getDaysUntilBirthday(b.dateOfBirth))
  }

  const upcomingBirthdays = getUpcomingBirthdays()

  // Contact Handlers
  const handleContactClick = (member, e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const memberData = {
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email || "",
      phone: member.phone || "",
    }
    
    setMessageTypeModal({
      isOpen: true,
      member: memberData
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
        subject: "Happy Birthday!",
        body: `Happy Birthday ${messageTypeModal.member.firstName}! 🎉 Wishing you a wonderful day filled with joy and celebration!`,
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
    toast.success("Birthday message sent successfully!")
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

  // Format date for display (show month and day from dateOfBirth)
  const formatBirthdayDate = (dateOfBirth) => {
    if (!dateOfBirth) return ""
    const date = new Date(dateOfBirth)
    return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })
  }

  return (
    <>
      <div className={`p-3 rounded-xl bg-[#2F2F2F] flex flex-col ${showHeader ? 'h-[320px] md:h-[340px]' : ''}`}>
        {/* Header */}
        {showHeader && (
          <div className="flex justify-between items-center mb-3 flex-shrink-0">
            <h2 className="text-base font-semibold text-white">Upcoming Birthdays</h2>
          </div>
        )}

        {/* Birthdays List - scrollable */}
        <div className={`overflow-y-auto custom-scrollbar pr-1 ${showHeader ? 'flex-1' : ''}`}>
          {upcomingBirthdays.length > 0 ? (
            <div className="flex flex-col gap-2">
              {(maxItems ? upcomingBirthdays.slice(0, maxItems) : upcomingBirthdays).map((member) => {
                const isToday = isBirthdayToday(member.dateOfBirth)
                const daysUntil = getDaysUntilBirthday(member.dateOfBirth)
                
                return (
                  <div
                    key={member.id}
                    className="p-3 bg-black rounded-xl hover:bg-zinc-900 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar with Birthday Badge */}
                      <div className="relative flex-shrink-0">
                        {member.image ? (
                          <div className="w-8 h-8 rounded-lg overflow-hidden">
                            <img
                              src={member.image}
                              className="h-full w-full object-cover"
                              alt=""
                            />
                          </div>
                        ) : (
                          <InitialsAvatar 
                            firstName={member.firstName} 
                            lastName={member.lastName}
                            size="sm"
                          />
                        )}
                        {/* Birthday Badge - shown when birthday is today */}
                        <BirthdayBadge 
                          show={isToday}
                          dateOfBirth={member.dateOfBirth}
                          size="ms"
                          withTooltip={true}
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-white truncate flex items-center gap-1">
                          {member.firstName} {member.lastName}
                          {member.dateOfBirth && (
                            <span className="text-gray-400 font-normal">
                              ({calculateAge(member.dateOfBirth)})
                            </span>
                          )}
                        </h3>
                        
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Calendar size={10} className="text-gray-400" />
                          <span className="text-xs text-gray-400">
                            {formatBirthdayDate(member.dateOfBirth)}
                          </span>
                          {!isToday && daysUntil > 0 && (
                            <span className="text-[10px] text-gray-500">
                              • in {daysUntil} days
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Today Badge - Only show if birthday is today */}
                      {isToday && (
                        <span className="px-2 py-1 text-[10px] rounded-full font-medium whitespace-nowrap bg-orange-500/20 text-orange-400 flex-shrink-0">
                          Today
                        </span>
                      )}

                      {/* Contact Button - Orange, only show if notifications are NOT enabled */}
                      {showContactButton && (
                        <button
                          onClick={(e) => handleContactClick(member, e)}
                          className="p-1.5 bg-orange-500 hover:bg-orange-600 rounded-lg text-white transition-colors flex-shrink-0"
                          title="Send Birthday Message"
                        >
                          <MessageCircle size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3">
                <Cake size={20} className="text-gray-600" />
              </div>
              <p className="text-sm">No upcoming birthdays</p>
            </div>
          )}
        </div>

        {/* Footer Link */}
        <div className="flex justify-center pt-2 border-t border-gray-700 flex-shrink-0 mt-2">
          <Link to="/dashboard/members" className="text-xs text-gray-400 hover:text-white transition-colors">
            View all members →
          </Link>
        </div>
      </div>

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
    </>
  )
}

export default UpcomingBirthdaysWidget
