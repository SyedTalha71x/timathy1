/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X } from "lucide-react"
import { useState } from "react"

const NotifyMemberModalMain = ({
  isOpen,
  onClose,
  notifyAction,
  pendingEventInfo,
  appointment, // Full appointment data passed from calendar.jsx (for lead detection)
  actuallyHandleCancelAppointment,
  handleNotifyMember,
  setPendingEventInfo,
}) => {
  const [emailNotification, setEmailNotification] = useState(true)
  const [pushNotification, setPushNotification] = useState(true)

  if (!isOpen) return null

  const handleClose = () => {
    onClose()
  }

  // Get appointment data from either appointment prop or pendingEventInfo
  const getAppointmentData = () => {
    if (appointment) return appointment
    if (!pendingEventInfo?.event) return null
    return pendingEventInfo.event.extendedProps?.appointment || null
  }

  const appointmentData = getAppointmentData()
  
  // Check if this is a lead (trial training with leadId)
  const isLead = appointmentData?.isTrial && appointmentData?.leadId
  const entityLabel = isLead ? "lead" : "member"
  const EntityLabel = isLead ? "Lead" : "Member"

  // Hole Mitgliedsname aus pendingEventInfo oder appointment
  const getMemberName = () => {
    if (appointmentData) {
      const lastName = appointmentData.lastName || ''
      return lastName ? `${appointmentData.name} ${lastName}` : appointmentData.name
    }
    
    if (!pendingEventInfo?.event) return null
    const event = pendingEventInfo.event
    return event.title || null
  }

  // Get appointment type with trialType if applicable
  const getAppointmentType = () => {
    if (!appointmentData) return null
    if (appointmentData.isTrial && appointmentData.trialType) {
      return `Trial Training • ${appointmentData.trialType}`
    }
    return appointmentData.type || null
  }

  // Formatiere das neue Datum und Zeit aus pendingEventInfo
  const getNewDateTimeInfo = () => {
    if (!pendingEventInfo?.event) return null
    
    const event = pendingEventInfo.event
    const start = event.start
    const end = event.end
    
    if (!start) return null
    
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    const formattedDate = start.toLocaleDateString('en-US', dateOptions)
    const formattedStartTime = start.toTimeString().split(" ")[0].substring(0, 5)
    const formattedEndTime = end ? end.toTimeString().split(" ")[0].substring(0, 5) : ''
    
    return {
      date: formattedDate,
      time: formattedEndTime ? `${formattedStartTime} - ${formattedEndTime}` : formattedStartTime
    }
  }

  const memberName = getMemberName()
  const appointmentType = getAppointmentType()
  const newDateTime = getNewDateTimeInfo()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" onClick={handleClose}>
      <div
        className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Notify {EntityLabel}</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-white text-sm">
            {notifyAction === "change" && newDateTime ? (
              <>
                {memberName && (
                  <>
                    <span className="font-semibold text-orange-400">{memberName}'s</span>
                    {appointmentType && <span className="text-gray-400"> ({appointmentType})</span>}
                    {" "}appointment will be moved to{" "}
                  </>
                )}
                {!memberName && "The appointment will be moved to "}
                <span className="font-semibold text-orange-400">{newDateTime.date}</span> at{" "}
                <span className="font-semibold text-orange-400">{newDateTime.time}</span>.
                <br /><br />
                Do you want to notify the {entityLabel} about this change?
              </>
            ) : (
              <>Do you want to notify the {entityLabel} about this {notifyAction}?</>
            )}
          </p>

          {/* Notification Options */}
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotification}
                onChange={(e) => setEmailNotification(e.target.checked)}
                className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
              />
              <span className="text-white text-sm">Email Notification</span>
            </label>
            
            {/* App Push Notification - only for members, not leads */}
            {!isLead && (
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushNotification}
                  onChange={(e) => setPushNotification(e.target.checked)}
                  className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
                />
                <span className="text-white text-sm">App Push Notification</span>
              </label>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2 sm:justify-between">
          {/* Cancel Button - Links, neutral */}
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-gray-700 text-sm font-medium text-white rounded-xl hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>

          <div className="flex flex-col-reverse sm:flex-row gap-2">
            {/* No should NOTIFY = false */}
            <button
              onClick={() => {
                handleNotifyMember(false)
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-gray-800 text-sm font-medium text-white rounded-xl hover:bg-gray-700 transition-colors border border-gray-600"
            >
              No, Don't Notify
            </button>

            {/* Yes should APPLY the change and set shouldNotify = true - Orange */}
            <button
              onClick={() => {
                handleNotifyMember(true, { email: emailNotification, push: !isLead && pushNotification })
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-orange-500 text-sm font-medium text-white rounded-xl hover:bg-orange-600 transition-colors"
            >
              Yes, Notify {EntityLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotifyMemberModalMain
