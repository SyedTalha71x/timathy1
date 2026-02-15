/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X } from "lucide-react"
import { useState, useEffect } from "react"

// =============================================================================
// UNIFIED NOTIFY MEMBER/LEAD MODAL
// =============================================================================
// Used by: CreateAppointmentModal, EditAppointmentModal, CreateTrialTrainingModal,
//          calendar.jsx (drag & drop)
//
// NEW INTERFACE (preferred):
//   action:        "book" | "change" | "cancel"
//   entityType:    "member" | "lead"
//   entityName:    "Max Mustermann"
//   appointmentType: "EMS Strength" (optional)
//   date:          "Monday, January 27, 2025" (pre-formatted)
//   time:          "09:00 - 10:00" (pre-formatted)
//   isTrial:       boolean - controls highlight color (text-trial vs text-primary)
//   isRecurring:   boolean
//   recurringInfo: { frequency: "weekly", occurrences: 5 }
//   onConfirm:     (shouldNotify, { email, push }) => void
//   onClose:       () => void   ("Back" - returns to parent form)
//
// LEGACY INTERFACE (calendar.jsx drag & drop - kept for backward compatibility):
//   notifyAction:       "change" | "cancel"
//   pendingEventInfo:   { event } from FullCalendar
//   appointment:        appointment data object
//   handleNotifyMember: (shouldNotify, { email, push }) => void
// =============================================================================

const NotifyMemberModalMain = ({
  isOpen,
  onClose,

  // --- New unified interface ---
  action,          // "book" | "change" | "cancel"
  entityType,      // "member" | "lead"
  entityName,      // pre-formatted full name
  appointmentType, // e.g. "EMS Strength" or "Trial Training - EMS Strength"
  date,            // pre-formatted date string
  time,            // pre-formatted time string
  isTrial = false, // highlight color: text-trial vs text-primary
  isRecurring = false,
  recurringInfo,   // { frequency, occurrences }
  onConfirm,       // (shouldNotify, { email, push }) => void

  // --- Legacy interface (calendar.jsx) ---
  notifyAction,
  pendingEventInfo,
  appointment,
  actuallyHandleCancelAppointment,
  handleNotifyMember,
  setPendingEventInfo,
}) => {
  const [emailNotification, setEmailNotification] = useState(true)
  const [pushNotification, setPushNotification] = useState(true)

  // Reset checkboxes when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmailNotification(true)
      setPushNotification(true)
    }
  }, [isOpen])

  if (!isOpen) return null

  // =============================================
  // Resolve props: new interface vs legacy
  // =============================================
  const isLegacy = !onConfirm && !!handleNotifyMember

  const getLegacyData = () => {
    const apt = appointment || pendingEventInfo?.event?.extendedProps?.appointment || null
    const isLeadApt = apt?.isTrial && apt?.leadId
    const name = apt
      ? (apt.lastName ? `${apt.name} ${apt.lastName}` : apt.name)
      : pendingEventInfo?.event?.title || ""
    const type = apt?.isTrial && apt?.trialType
      ? `Trial Training \u2022 ${apt.trialType}`
      : apt?.type || null

    let dateStr = ""
    let timeStr = ""
    if (pendingEventInfo?.event?.start) {
      const start = pendingEventInfo.event.start
      const end = pendingEventInfo.event.end
      dateStr = start.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
      const startT = start.toTimeString().substring(0, 5)
      const endT = end ? end.toTimeString().substring(0, 5) : ""
      timeStr = endT ? `${startT} - ${endT}` : startT
    }

    return {
      action: notifyAction || "change",
      entityType: isLeadApt ? "lead" : "member",
      entityName: name,
      appointmentType: type,
      date: dateStr,
      time: timeStr,
      isTrial: !!isLeadApt,
    }
  }

  const resolved = isLegacy ? getLegacyData() : {
    action: action || "book",
    entityType: entityType || "member",
    entityName: entityName || "",
    appointmentType: appointmentType || null,
    date: date || "",
    time: time || "",
    isTrial: isTrial,
  }

  const isLead = resolved.entityType === "lead"
  const entityLabel = isLead ? "lead" : "member"
  const EntityLabel = isLead ? "Lead" : "Member"
  const highlightClass = resolved.isTrial ? "font-semibold text-trial" : "font-semibold text-primary"

  // =============================================
  // Handlers
  // =============================================
  const handleClose = () => {
    onClose?.()
  }

  const handleConfirmAction = (shouldNotify) => {
    const options = { email: emailNotification, push: !isLead && pushNotification }
    if (isLegacy) {
      handleNotifyMember(shouldNotify, options)
    } else {
      onConfirm?.(shouldNotify, options)
    }
  }

  // =============================================
  // Message rendering
  // =============================================
  const renderMessage = () => {
    const { action: act, entityName: name, appointmentType: type, date: d, time: t } = resolved

    if (act === "book") {
      if (isRecurring && recurringInfo) {
        return (
          <p className="text-content-primary text-sm">
            New <span className={highlightClass}>recurring appointment</span> for{" "}
            <span className={highlightClass}>{name}</span> starting{" "}
            <span className={highlightClass}>{d}</span>{" "}
            ({recurringInfo.occurrences} occurrences, {recurringInfo.frequency}).
            <br /><br />
            Do you want to notify the {entityLabel} about this booking?
          </p>
        )
      }

      if (resolved.isTrial) {
        return (
          <p className="text-content-primary text-sm">
            New <span className={highlightClass}>Trial Training</span> for{" "}
            <span className={highlightClass}>{name}</span> on{" "}
            <span className={highlightClass}>{d}</span> at{" "}
            <span className={highlightClass}>{t}</span>.
            <br /><br />
            Do you want to notify the {entityLabel} about this booking?
          </p>
        )
      }

      return (
        <p className="text-content-primary text-sm">
          New appointment for <span className={highlightClass}>{name}</span> on{" "}
          <span className={highlightClass}>{d}</span> at{" "}
          <span className={highlightClass}>{t}</span>.
          <br /><br />
          Do you want to notify the {entityLabel} about this booking?
        </p>
      )
    }

    if (act === "cancel") {
      return (
        <p className="text-content-primary text-sm">
          <span className={highlightClass}>{name}'s</span>
          {type && <span className="text-content-muted"> ({type})</span>} appointment on{" "}
          <span className={highlightClass}>{d}</span> at{" "}
          <span className={highlightClass}>{t}</span>{" "}
          will be <span className="font-semibold text-accent-red">cancelled</span>.
          <br /><br />
          Do you want to notify the {entityLabel} about this cancellation?
        </p>
      )
    }

    // "change" (default)
    return (
      <p className="text-content-primary text-sm">
        <span className={highlightClass}>{name}'s</span>
        {type && <span className="text-content-muted"> ({type})</span>} appointment will be moved to{" "}
        <span className={highlightClass}>{d}</span> at{" "}
        <span className={highlightClass}>{t}</span>.
        <br /><br />
        Do you want to notify the {entityLabel} about this change?
      </p>
    )
  }

  // =============================================
  // Render
  // =============================================
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" onClick={handleClose}>
      <div
        className="bg-surface-card w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-semibold text-content-primary">Notify {EntityLabel}</h2>
          <button onClick={handleClose} className="text-content-muted hover:text-content-primary p-2 hover:bg-surface-dark rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderMessage()}

          {/* Notification Options */}
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotification}
                onChange={(e) => setEmailNotification(e.target.checked)}
                className="w-4 h-4 text-primary bg-surface-button border-border rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-content-primary text-sm">Email Notification</span>
            </label>

            {/* App Push Notification - only for members, not leads */}
            {!isLead && (
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushNotification}
                  onChange={(e) => setPushNotification(e.target.checked)}
                  className="w-4 h-4 text-primary bg-surface-button border-border rounded focus:ring-primary focus:ring-2"
                />
                <span className="text-content-primary text-sm">App Push Notification</span>
              </label>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex flex-col-reverse sm:flex-row gap-2 sm:justify-between">
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-surface-button text-sm font-medium text-content-primary rounded-xl hover:bg-surface-button-hover transition-colors"
          >
            Back
          </button>

          <div className="flex flex-col-reverse sm:flex-row gap-2">
            <button
              onClick={() => handleConfirmAction(false)}
              className="w-full sm:w-auto px-5 py-2.5 bg-surface-dark text-sm font-medium text-content-primary rounded-xl hover:bg-surface-hover transition-colors border border-border"
            >
              No, Don't Notify
            </button>

            <button
              onClick={() => handleConfirmAction(true)}
              className="w-full sm:w-auto px-5 py-2.5 bg-primary text-sm font-medium text-white rounded-xl hover:bg-primary-hover transition-colors"
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
