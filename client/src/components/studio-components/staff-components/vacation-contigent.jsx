/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { X, Plus, Minus } from "lucide-react"

// Initials Avatar Component - Blue background with initials (like members)
const InitialsAvatar = ({ firstName, lastName, size = "md", className = "" }) => {
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || ""
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || ""
    return `${firstInitial}${lastInitial}` || "?"
  }

  const sizeClasses = {
    sm: "w-9 h-9 text-sm",
    md: "w-[60px] h-[60px] text-xl",
    lg: "w-24 h-24 text-3xl",
  }

  return (
    <div 
      className={`bg-primary rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0 ${sizeClasses[size]} ${className}`}
      style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
    >
      {getInitials()}
    </div>
  )
}

const VacationContingentModal = ({ 
  isOpen, 
  onClose, 
  staff, 
  onUpdateContingent 
}) => {
  const [contingent, setContingent] = useState(staff?.vacationDays || 0)
  const [notes, setNotes] = useState("")
  
  // Get current year for display
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    if (staff) {
      setContingent(staff.vacationDays || 0)
      setNotes(staff.vacationNotes || "")
    }
  }, [staff])

  const handleIncrement = () => {
    setContingent(prev => prev + 1)
  }

  const handleDecrement = () => {
    if (contingent > 0) {
      setContingent(prev => prev - 1)
    }
  }

  const handleSave = () => {
    if (onUpdateContingent && staff) {
      onUpdateContingent(staff.id, contingent, notes)
    }
    onClose()
  }

  if (!isOpen || !staff) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-surface-base w-full max-w-md rounded-xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-semibold text-content-primary">
            Manage Vacation Contingent
          </h2>
          <button
            onClick={onClose}
            className="text-content-muted hover:text-content-primary transition-colors p-2 hover:bg-surface-hover rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            {staff.img ? (
              <img
                src={staff.img}
                width={60}
                height={60}
                className="rounded-xl w-[60px] h-[60px] object-cover mb-3"
                alt={`${staff.firstName} ${staff.lastName}`}
              />
            ) : (
              <InitialsAvatar 
                firstName={staff.firstName} 
                lastName={staff.lastName} 
                size="md"
                className="mb-3"
              />
            )}
            <h3 className="text-content-primary font-medium text-lg text-center">
              {staff.firstName} {staff.lastName}
            </h3>
            <p className="text-content-muted text-sm text-center">{staff.role}</p>
          </div>

          <div className="mb-6">
            <label className="block text-content-primary text-sm font-medium mb-2 text-center">
              Vacation Days Contingent
            </label>
            <p className="text-content-muted text-xs mb-4 text-center">
              Period: 01.01.{currentYear} - 31.12.{currentYear}
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleDecrement}
                disabled={contingent <= 0}
                className="p-2 rounded-lg bg-surface-button text-content-primary disabled:bg-surface-dark disabled:text-content-faint disabled:cursor-not-allowed hover:bg-surface-button-hover transition-colors"
              >
                <Minus size={20} />
              </button>
              
              <div className="text-3xl font-bold text-content-primary min-w-[60px] text-center">
                {contingent}
              </div>
              
              <button
                onClick={handleIncrement}
                className="p-2 rounded-lg bg-surface-button text-content-primary hover:bg-surface-button-hover transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
            <p className="text-content-faint text-xs text-center mt-3">
              Days remaining for this year
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-surface-button text-sm font-medium text-content-secondary rounded-xl hover:bg-surface-button-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 bg-primary text-sm font-medium text-white rounded-xl hover:bg-primary-hover transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default VacationContingentModal
