/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react"
import { Link } from "react-router-dom"
import { Cake, MessageCircle, Calendar } from "lucide-react"
import { birthdaysData } from "../../../utils/studio-states/myarea-states"
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

export const UpcomingBirthdaysWidget = ({ isSidebarEditing }) => {
  const [birthdays] = useState(birthdaysData)
  
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

  const today = new Date().toISOString().split("T")[0]

  // Check if birthday is today
  const isBirthdayToday = (date) => {
    return date === today
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

  // Calculate days until birthday
  const getDaysUntilBirthday = (dateStr) => {
    if (!dateStr) return Infinity
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Parse the date (assuming format like "2025-01-31" or similar)
    const birthdayThisYear = new Date(dateStr)
    birthdayThisYear.setFullYear(today.getFullYear())
    birthdayThisYear.setHours(0, 0, 0, 0)
    
    // If birthday already passed this year, use next year
    if (birthdayThisYear < today) {
      birthdayThisYear.setFullYear(today.getFullYear() + 1)
    }
    
    const diffTime = birthdayThisYear - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Get sorted birthdays (upcoming first)
  const getSortedBirthdays = () => {
    return [...birthdays]
      .sort((a, b) => getDaysUntilBirthday(a.date) - getDaysUntilBirthday(b.date))
      .slice(0, 10)
  }

  const sortedBirthdays = getSortedBirthdays()

  // Contact Handlers
  const handleContactClick = (person, e) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Convert birthday person to member format
    const nameParts = person.name?.split(' ') || ['']
    const memberData = {
      id: person.id,
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: person.email || "",
      phone: person.phone || "",
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

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })
  }

  return (
    <>
      <div className="p-3 rounded-xl bg-[#2F2F2F] md:h-[340px] h-auto flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 flex-shrink-0">
          <h2 className="text-base font-semibold text-white">Upcoming Birthdays</h2>
        </div>

        {/* Birthdays List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
          {sortedBirthdays.length > 0 ? (
            <div className="flex flex-col gap-2">
              {sortedBirthdays.map((birthday) => {
                const isToday = isBirthdayToday(birthday.date)
                const daysUntil = getDaysUntilBirthday(birthday.date)
                const nameParts = birthday.name?.split(' ') || ['']
                
                return (
                  <div
                    key={birthday.id}
                    className="p-3 bg-black rounded-xl hover:bg-zinc-900 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      {birthday.avatar ? (
                        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={birthday.avatar}
                            className="h-full w-full object-cover"
                            alt=""
                          />
                        </div>
                      ) : (
                        <InitialsAvatar 
                          firstName={nameParts[0]} 
                          lastName={nameParts[1]}
                          size="sm"
                        />
                      )}
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-white truncate flex items-center gap-1">
                          {birthday.name}
                          {birthday.dateOfBirth && (
                            <span className="text-gray-400 font-normal">
                              ({calculateAge(birthday.dateOfBirth)})
                            </span>
                          )}
                          {isToday && <span className="ml-1">🎂</span>}
                        </h3>
                        
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Calendar size={10} className="text-gray-400" />
                          <span className="text-xs text-gray-400">
                            {formatDate(birthday.date)}
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

                      {/* Contact Button - Orange */}
                      <button
                        onClick={(e) => handleContactClick(birthday, e)}
                        className="p-1.5 bg-orange-500 hover:bg-orange-600 rounded-lg text-white transition-colors flex-shrink-0"
                        title="Send Birthday Message"
                      >
                        <MessageCircle size={14} />
                      </button>
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
