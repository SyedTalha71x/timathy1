/* eslint-disable react/prop-types */
import { useState } from "react"
import { X, Mail, Phone, Calendar, MapPin, User, Users, Copy, Check, Smartphone } from "lucide-react"
import { MemberSpecialNoteIcon } from '../special-note/shared-special-note-icon'

// Initials Avatar Component
const InitialsAvatar = ({ firstName, lastName, size = "lg", isStaff = false }) => {
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || ""
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || ""
    return `${firstInitial}${lastInitial}` || "?"
  }

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
    xl: "w-20 h-20 text-2xl",
  }

  const bgColor = isStaff ? "bg-secondary" : "bg-primary"

  return (
    <div
      className={`${bgColor} rounded-2xl flex items-center justify-center text-white font-semibold ${sizeClasses[size]}`}
    >
      {getInitials()}
    </div>
  )
}

const ViewConfirmationModal = ({
  isOpen,
  onClose,
  member = null,
  onConfirm,
  onEditMember, // Callback to open EditMemberModal with specific tab
  relationsCount = 0, // Number of relations for this member
  title = "View Member Details"
}) => {
  // Copy states
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedMobile, setCopiedMobile] = useState(false)
  const [copiedTelephone, setCopiedTelephone] = useState(false)
  const [copiedBirthday, setCopiedBirthday] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState(false)

  if (!isOpen || !member) return null

  const firstName = member.firstName || member.name?.split(" ")[0] || ""
  const lastName = member.lastName || member.name?.split(" ")[1] || ""
  const fullName = member.name || `${firstName} ${lastName}`.trim()
  const isStaff = member.role === "staff"

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null
    const birthDate = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  // Format birthday with age
  const formatBirthdayWithAge = (dateOfBirth) => {
    if (!dateOfBirth) return null
    const birthDate = new Date(dateOfBirth)
    const age = calculateAge(dateOfBirth)
    const formatted = birthDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
    return `${formatted} (Age: ${age})`
  }

  // Copy handler
  const handleCopy = async (value, setCopied) => {
    try {
      await navigator.clipboard.writeText(value || "")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Handle clicking on special note icon
  const handleEditNote = (memberData, tab) => {
    if (onEditMember) {
      onEditMember(memberData, tab || "note")
    }
  }

  // Handle clicking on relations button
  const handleRelationsClick = () => {
    if (onEditMember) {
      onEditMember(member, "relations")
    }
  }

  // Get mobile number from various possible field names
  const mobileNumber = member.phone || member.phoneNumber || member.mobileNumber || member.mobile || null

  // Get telephone number from various possible field names
  const telephoneNumber = member.telephoneNumber || member.telephone || member.landline || member.tel || null

  // Check if we have any details to show
  const hasAnyDetails = member.email || mobileNumber || telephoneNumber || member.dateOfBirth || member.address

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[10000]">
      <div className="bg-surface-card rounded-2xl w-full max-w-md mx-4 border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-content-primary">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-button rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-content-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Profile Section - Horizontal Layout */}
          <div className="flex items-center gap-4 mb-6">
            {/* Special Note Icon - larger */}
            {onEditMember && (
              <MemberSpecialNoteIcon
                member={member}
                onEditMember={handleEditNote}
                size="lg"
                position="relative"
              />
            )}
            
            {/* Avatar */}
            {member.logo || member.image ? (
              <img
                src={member.logo || member.image}
                alt={fullName}
                className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
              />
            ) : (
              <InitialsAvatar
                firstName={firstName}
                lastName={lastName}
                size="lg"
                isStaff={isStaff}
              />
            )}
            
            {/* Name and Actions */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-content-primary truncate">{fullName}</h3>
              
              {isStaff && (
                <span className="text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">
                  Staff Member
                </span>
              )}

              {/* Relations Button - Primary */}
              {onEditMember && !isStaff && (
                <button
                  onClick={handleRelationsClick}
                  className="flex items-center gap-1.5 text-sm text-primary hover:brightness-110 bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-lg transition-colors mt-2"
                  title="View Relations"
                >
                  <Users size={14} />
                  <span>Relations</span>
                  <span className="bg-primary/20 px-1.5 py-0.5 rounded text-xs">{relationsCount}</span>
                </button>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-3">
            {/* Email */}
            {member.email && (
              <div className="flex items-center gap-3 bg-surface-dark rounded-xl p-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-content-faint">Email</p>
                  <p className="text-sm text-content-primary truncate">{member.email}</p>
                </div>
                <button
                  onClick={() => handleCopy(member.email, setCopiedEmail)}
                  className="p-1 hover:bg-surface-hover rounded transition-colors"
                  title="Copy email"
                >
                  {copiedEmail ? (
                    <Check size={14} className="text-primary" />
                  ) : (
                    <Copy size={14} className="text-content-muted hover:text-content-primary" />
                  )}
                </button>
              </div>
            )}

            {/* Mobile Number */}
            {mobileNumber && (
              <div className="flex items-center gap-3 bg-surface-dark rounded-xl p-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-content-faint">Mobile Number</p>
                  <p className="text-sm text-content-primary truncate">{mobileNumber}</p>
                </div>
                <button
                  onClick={() => handleCopy(mobileNumber, setCopiedMobile)}
                  className="p-1 hover:bg-surface-hover rounded transition-colors"
                  title="Copy mobile number"
                >
                  {copiedMobile ? (
                    <Check size={14} className="text-primary" />
                  ) : (
                    <Copy size={14} className="text-content-muted hover:text-content-primary" />
                  )}
                </button>
              </div>
            )}

            {/* Telephone Number */}
            {telephoneNumber && (
              <div className="flex items-center gap-3 bg-surface-dark rounded-xl p-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-content-faint">Telephone Number</p>
                  <p className="text-sm text-content-primary truncate">{telephoneNumber}</p>
                </div>
                <button
                  onClick={() => handleCopy(telephoneNumber, setCopiedTelephone)}
                  className="p-1 hover:bg-surface-hover rounded transition-colors"
                  title="Copy telephone number"
                >
                  {copiedTelephone ? (
                    <Check size={14} className="text-primary" />
                  ) : (
                    <Copy size={14} className="text-content-muted hover:text-content-primary" />
                  )}
                </button>
              </div>
            )}

            {/* Date of Birth with Age */}
            {member.dateOfBirth && (
              <div className="flex items-center gap-3 bg-surface-dark rounded-xl p-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-content-faint">Date of Birth</p>
                  <p className="text-sm text-content-primary">{formatBirthdayWithAge(member.dateOfBirth)}</p>
                </div>
                <button
                  onClick={() => handleCopy(member.dateOfBirth, setCopiedBirthday)}
                  className="p-1 hover:bg-surface-hover rounded transition-colors"
                  title="Copy date of birth"
                >
                  {copiedBirthday ? (
                    <Check size={14} className="text-primary" />
                  ) : (
                    <Copy size={14} className="text-content-muted hover:text-content-primary" />
                  )}
                </button>
              </div>
            )}

            {/* Address */}
            {member.address && (
              <div className="flex items-center gap-3 bg-surface-dark rounded-xl p-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-content-faint">Address</p>
                  <p className="text-sm text-content-primary truncate">{member.address}</p>
                </div>
                <button
                  onClick={() => handleCopy(member.address, setCopiedAddress)}
                  className="p-1 hover:bg-surface-hover rounded transition-colors"
                  title="Copy address"
                >
                  {copiedAddress ? (
                    <Check size={14} className="text-primary" />
                  ) : (
                    <Copy size={14} className="text-content-muted hover:text-content-primary" />
                  )}
                </button>
              </div>
            )}

            {/* No details fallback */}
            {!hasAnyDetails && (
              <div className="text-center py-6">
                <User className="w-8 h-8 text-content-faint mx-auto mb-2" />
                <p className="text-sm text-content-faint">No additional details available</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-border bg-surface-dark">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-surface-button hover:bg-surface-button-hover text-content-secondary text-sm font-medium rounded-xl transition-colors"
          >
            Close
          </button>
          {onConfirm && (
            <button
              onClick={() => {
                onConfirm(member)
                onClose()
              }}
              className="px-5 py-2.5 bg-secondary hover:brightness-110 text-white text-sm font-medium rounded-xl transition-all"
            >
              View Full Profile
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ViewConfirmationModal
