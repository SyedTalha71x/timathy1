/* eslint-disable react/prop-types */
import { X, Mail, Phone, Calendar, MapPin, User } from "lucide-react"

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

  const bgColor = isStaff ? "bg-blue-600" : "bg-orange-500"

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
  title = "View Member Details"
}) => {
  if (!isOpen || !member) return null

  const firstName = member.firstName || member.name?.split(" ")[0] || ""
  const lastName = member.lastName || member.name?.split(" ")[1] || ""
  const fullName = member.name || `${firstName} ${lastName}`.trim()
  const isStaff = member.role === "staff"

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
          {/* Profile Section */}
          <div className="flex flex-col items-center mb-6">
            {member.logo || member.image ? (
              <img
                src={member.logo || member.image}
                alt={fullName}
                className="w-20 h-20 rounded-2xl object-cover mb-3"
              />
            ) : (
              <InitialsAvatar
                firstName={firstName}
                lastName={lastName}
                size="xl"
                isStaff={isStaff}
              />
            )}
            <h3 className="text-lg font-semibold text-white mt-3">{fullName}</h3>
            {isStaff && (
              <span className="text-xs bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full mt-1">
                Staff Member
              </span>
            )}
          </div>

          {/* Details Grid */}
          <div className="space-y-3">
            {member.email && (
              <div className="flex items-center gap-3 bg-[#1a1a1a] rounded-xl p-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-white truncate">{member.email}</p>
                </div>
              </div>
            )}

            {member.phone && (
              <div className="flex items-center gap-3 bg-[#1a1a1a] rounded-xl p-3">
                <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm text-white">{member.phone}</p>
                </div>
              </div>
            )}

            {member.dateOfBirth && (
              <div className="flex items-center gap-3 bg-[#1a1a1a] rounded-xl p-3">
                <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Date of Birth</p>
                  <p className="text-sm text-white">{member.dateOfBirth}</p>
                </div>
              </div>
            )}

            {member.address && (
              <div className="flex items-center gap-3 bg-[#1a1a1a] rounded-xl p-3">
                <div className="w-9 h-9 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="text-sm text-white truncate">{member.address}</p>
                </div>
              </div>
            )}

            {!member.email && !member.phone && !member.dateOfBirth && !member.address && (
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
                onConfirm(member)
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

export default ViewConfirmationModal
