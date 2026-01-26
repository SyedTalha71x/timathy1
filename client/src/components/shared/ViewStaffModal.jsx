/* eslint-disable react/prop-types */
import { useState } from "react"
import { X, Mail, Phone, Calendar, MapPin, User, Briefcase, Copy, Check, Smartphone } from "lucide-react"

// Initials Avatar Component
const InitialsAvatar = ({ firstName, lastName, size = "lg" }) => {
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

  return (
    <div
      className={`bg-blue-600 rounded-2xl flex items-center justify-center text-white font-semibold ${sizeClasses[size]}`}
    >
      {getInitials()}
    </div>
  )
}

// Role Tag Component - matches staff.jsx
const RoleTag = ({ role }) => {
  const getDynamicRoleColor = (role) => {
    const roleColors = {
      'Telephone operator': 'bg-purple-600',
      'Software Engineer': 'bg-blue-600', 
      'System Engineer': 'bg-green-600',
      'Manager': 'bg-red-600',
      'Trainer': 'bg-indigo-600',
      'Reception': 'bg-yellow-600',
      'Cleaner': 'bg-orange-600',
      'Admin': 'bg-pink-600',
      'Therapist': 'bg-teal-600'
    };

    return roleColors[role] || 'bg-gray-600';
  };

  const bgColor = getDynamicRoleColor(role);

  return (
    <div className={`inline-flex items-center gap-1.5 ${bgColor} text-white px-2.5 py-1 rounded-lg text-xs font-medium`}>
      <Briefcase size={12} className="flex-shrink-0" />
      <span>{role}</span>
    </div>
  );
};

const ViewStaffModal = ({
  isOpen,
  onClose,
  staff = null,
  onConfirm,
  title = "View Staff Details"
}) => {
  // Copy states
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedMobile, setCopiedMobile] = useState(false)
  const [copiedTelephone, setCopiedTelephone] = useState(false)
  const [copiedBirthday, setCopiedBirthday] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState(false)

  if (!isOpen || !staff) return null

  const firstName = staff.firstName || staff.name?.split(" ")[0] || ""
  const lastName = staff.lastName || staff.name?.split(" ")[1] || ""
  const fullName = staff.name || `${firstName} ${lastName}`.trim()

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

  // Get mobile number from various possible field names
  const mobileNumber = staff.phone || staff.phoneNumber || staff.mobileNumber || staff.mobile || null

  // Get telephone number from various possible field names
  const telephoneNumber = staff.telephoneNumber || staff.telephone || staff.landline || staff.tel || null

  // Check if we have any details to show
  const hasAnyDetails = staff.email || mobileNumber || telephoneNumber || staff.dateOfBirth || staff.address

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[10000]">
      <div className="bg-[#0E0E0E] rounded-2xl w-full max-w-md mx-4 border border-gray-800/50 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Profile Section - Horizontal Layout */}
          <div className="flex items-center gap-4 mb-6">
            {/* Avatar */}
            {staff.logo || staff.image || staff.img ? (
              <img
                src={staff.logo || staff.image || staff.img}
                alt={fullName}
                className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
              />
            ) : (
              <InitialsAvatar
                firstName={firstName}
                lastName={lastName}
                size="lg"
              />
            )}
            
            {/* Name and Role */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white truncate">{fullName}</h3>
              
              {staff.role && (
                <div className="mt-1.5">
                  <RoleTag role={staff.role} />
                </div>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-3">
            {/* Email */}
            {staff.email && (
              <div className="flex items-center gap-3 bg-[#1a1a1a] rounded-xl p-3">
                <div className="w-9 h-9 rounded-lg bg-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-white truncate">{staff.email}</p>
                </div>
                <button
                  onClick={() => handleCopy(staff.email, setCopiedEmail)}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                  title="Copy email"
                >
                  {copiedEmail ? (
                    <Check size={14} className="text-orange-500" />
                  ) : (
                    <Copy size={14} className="text-gray-400 hover:text-white" />
                  )}
                </button>
              </div>
            )}

            {/* Mobile Number */}
            {mobileNumber && (
              <div className="flex items-center gap-3 bg-[#1a1a1a] rounded-xl p-3">
                <div className="w-9 h-9 rounded-lg bg-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Mobile Number</p>
                  <p className="text-sm text-white truncate">{mobileNumber}</p>
                </div>
                <button
                  onClick={() => handleCopy(mobileNumber, setCopiedMobile)}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                  title="Copy mobile number"
                >
                  {copiedMobile ? (
                    <Check size={14} className="text-orange-500" />
                  ) : (
                    <Copy size={14} className="text-gray-400 hover:text-white" />
                  )}
                </button>
              </div>
            )}

            {/* Telephone Number */}
            {telephoneNumber && (
              <div className="flex items-center gap-3 bg-[#1a1a1a] rounded-xl p-3">
                <div className="w-9 h-9 rounded-lg bg-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Telephone Number</p>
                  <p className="text-sm text-white truncate">{telephoneNumber}</p>
                </div>
                <button
                  onClick={() => handleCopy(telephoneNumber, setCopiedTelephone)}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                  title="Copy telephone number"
                >
                  {copiedTelephone ? (
                    <Check size={14} className="text-orange-500" />
                  ) : (
                    <Copy size={14} className="text-gray-400 hover:text-white" />
                  )}
                </button>
              </div>
            )}

            {/* Date of Birth with Age */}
            {staff.dateOfBirth && (
              <div className="flex items-center gap-3 bg-[#1a1a1a] rounded-xl p-3">
                <div className="w-9 h-9 rounded-lg bg-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Date of Birth</p>
                  <p className="text-sm text-white">{formatBirthdayWithAge(staff.dateOfBirth)}</p>
                </div>
                <button
                  onClick={() => handleCopy(staff.dateOfBirth, setCopiedBirthday)}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                  title="Copy date of birth"
                >
                  {copiedBirthday ? (
                    <Check size={14} className="text-orange-500" />
                  ) : (
                    <Copy size={14} className="text-gray-400 hover:text-white" />
                  )}
                </button>
              </div>
            )}

            {/* Address */}
            {staff.address && (
              <div className="flex items-center gap-3 bg-[#1a1a1a] rounded-xl p-3">
                <div className="w-9 h-9 rounded-lg bg-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="text-sm text-white truncate">{staff.address}</p>
                </div>
                <button
                  onClick={() => handleCopy(staff.address, setCopiedAddress)}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                  title="Copy address"
                >
                  {copiedAddress ? (
                    <Check size={14} className="text-orange-500" />
                  ) : (
                    <Copy size={14} className="text-gray-400 hover:text-white" />
                  )}
                </button>
              </div>
            )}

            {/* No details fallback */}
            {!hasAnyDetails && (
              <div className="text-center py-6">
                <User className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No additional details available</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-800/50 bg-[#0a0a0a]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#1a1a1a] hover:bg-[#252525] text-white text-sm font-medium rounded-xl transition-colors"
          >
            Close
          </button>
          {onConfirm && (
            <button
              onClick={() => {
                onConfirm(staff)
                onClose()
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium rounded-xl transition-all"
            >
              View Full Profile
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ViewStaffModal
