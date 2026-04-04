/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X } from "lucide-react"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"

// =============================================================================
// UNIFIED NOTIFY MEMBER/LEAD MODAL
// =============================================================================
// Used by: CreateAppointmentModal, EditAppointmentModal, CreateTrialTrainingModal,
//          calendar.jsx (drag & drop), ClassDetailModal (enroll/remove/cancel)
//
// NEW INTERFACE (preferred):
//   action:        "book" | "change" | "cancel"
//   entityType:    "member" | "lead"
//   entityName:    "Max Mustermann" or "Max Mustermann, Anna Schmidt" (comma-separated for multiple)
//   memberCount:   number (optional, for plural — auto-detected from entityName if not set)
//   appointmentType: "EMS Strength" (optional)
//   date:          "Monday, January 27, 2025" (pre-formatted)
//   time:          "09:00 - 10:00" (pre-formatted)
//   isTrial:       boolean
//   isRecurring:   boolean
//   recurringInfo: { frequency: "weekly", occurrences: 5 }
//   onConfirm:     (shouldNotify, { email, push }) => void
//   onClose:       () => void   ("Back" - returns to parent form)
//   customTitle:   string (optional — overrides modal title)
//   customMessage: string|JSX (optional — overrides message content)
//   hideBack:      boolean (optional — hides "Back" button)
//   hidePush:      boolean (optional — hides push notification checkbox)
//   hideNotificationOptions: boolean (optional — hides all notification checkboxes)
//
// LEGACY INTERFACE (calendar.jsx drag & drop - kept for backward compatibility):
//   notifyAction:       "change" | "cancel"
//   pendingEventInfo:   { event } from FullCalendar
//   appointment:        appointment data object
//   handleNotifyMember: (shouldNotify, { email, push }) => void
// =============================================================================

const NotifyModalMain = ({
  isOpen,
  onClose,

  // --- New unified interface ---
  action,          // "book" | "change" | "cancel"
  entityType,      // "member" | "lead"
  entityName,      // pre-formatted full name(s)
  memberCount,     // optional: number of members (for plural labels)
  appointmentType, // e.g. "EMS Strength" or "Trial Training - EMS Strength"
  date,            // pre-formatted date string
  time,            // pre-formatted time string
  isTrial = false,
  isRecurring = false,
  recurringInfo,   // { frequency, occurrences }
  onConfirm,       // (shouldNotify, { email, push }) => void
  customTitle,     // optional: override modal title
  customMessage,   // optional: override message content (JSX or string)
  hideBack = false, // optional: hide "Back" button
  hidePush = false, // optional: hide push notification checkbox
  hideNotificationOptions = false, // optional: hide all notification checkboxes

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

  const { t, i18n } = useTranslation()
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
      dateStr = start.toLocaleDateString(i18n.language, { weekday: "long", day: "numeric", month: "long", year: "numeric" })
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
      count: 1,
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
    count: memberCount || (entityName ? entityName.split(",").length : 1),
  }

  const isLead = resolved.entityType === "lead"
  const isPlural = resolved.count > 1
  
  // Singular/Plural labels
  const entityLabel = isLead 
    ? (isPlural ? t("studioCalendar.notify.leads") : t("studioCalendar.notify.lead")) 
    : (isPlural ? t("studioCalendar.notify.members") : t("studioCalendar.notify.member"))
  const EntityLabel = isLead 
    ? (isPlural ? t("studioCalendar.notify.leads") : t("studioCalendar.notify.lead")) 
    : (isPlural ? t("studioCalendar.notify.members") : t("studioCalendar.notify.member"))
  
  const hl = "font-semibold text-primary"

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
  // Format name display for multiple members
  // =============================================
  const formatNames = (nameStr) => {
    if (!nameStr) return ""
    const names = nameStr.split(",").map(n => n.trim()).filter(Boolean)
    if (names.length <= 2) return names.join(" and ")
    return `${names[0]}, ${names[1]} and ${names.length - 2} other${names.length - 2 > 1 ? "s" : ""}`
  }

  // =============================================
  // Message rendering
  // =============================================
  const renderMessage = () => {
    const { action: act, entityName: name, appointmentType: type, date: d, time: t } = resolved
    const displayName = isPlural ? formatNames(name) : name

    if (act === "book") {
      if (isRecurring && recurringInfo) {
        return (
          <p className="text-content-primary text-sm">
            New <span className={hl}>{t("studioCalendar.notify.recurringAppointment")}</span> for{" "}
            <span className={hl}>{displayName}</span> starting{" "}
            <span className={hl}>{d}</span>{" "}
            ({recurringInfo.occurrences} occurrences, {recurringInfo.frequency}).
            <br /><br />
            {t("studioCalendar.notify.askNotifyBooking", { entity: entityLabel })}
          </p>
        )
      }

      if (resolved.isTrial) {
        return (
          <p className="text-content-primary text-sm">
            New <span className={hl}>{t("studioCalendar.filterLabels.trialTraining")}</span> for{" "}
            <span className={hl}>{displayName}</span> on{" "}
            <span className={hl}>{d}</span> at{" "}
            <span className={hl}>{t}</span>.
            <br /><br />
            {t("studioCalendar.notify.askNotifyBooking", { entity: entityLabel })}
          </p>
        )
      }

      return (
        <p className="text-content-primary text-sm">
          {isPlural ? (
            <>
              <span className={hl}>{displayName}</span>{" "}
              {type && <span className="text-content-muted">({type})</span>}{" "}
              will be enrolled in the class on{" "}
              <span className={hl}>{d}</span> at{" "}
              <span className={hl}>{t}</span>.
            </>
          ) : (
            <>
              New appointment for <span className={hl}>{displayName}</span> on{" "}
              <span className={hl}>{d}</span> at{" "}
              <span className={hl}>{t}</span>.
            </>
          )}
          <br /><br />
          {t("studioCalendar.notify.askNotifyBooking", { entity: entityLabel })}
        </p>
      )
    }

    if (act === "cancel") {
      return (
        <p className="text-content-primary text-sm">
          {isPlural ? (
            <>
              <span className={hl}>{resolved.count} {entityLabel}</span>
              {type && <span className="text-content-muted"> ({type})</span>}{" "}
              will be removed from the class on{" "}
              <span className={hl}>{d}</span> at{" "}
              <span className={hl}>{t}</span>.
              <br /><br />
              Affected {entityLabel}: <span className={hl}>{displayName}</span>.
            </>
          ) : (
            <>
              <span className={hl}>{displayName}'s</span>
              {type && <span className="text-content-muted"> ({type})</span>} appointment on{" "}
              <span className={hl}>{d}</span> at{" "}
              <span className={hl}>{t}</span>{" "}
              will be <span className={hl}>{t("studioCalendar.notify.cancelled")}</span>.
            </>
          )}
          <br /><br />
          {t("studioCalendar.notify.askNotifyCancellation", { entity: entityLabel })}
        </p>
      )
    }

    // "change" (default)
    return (
      <p className="text-content-primary text-sm">
        {isPlural ? (
          <>
            <span className={hl}>{resolved.count} {entityLabel}</span>
            {type && <span className="text-content-muted"> ({type})</span>}{" "}
            will be moved to{" "}
            <span className={hl}>{d}</span> at{" "}
            <span className={hl}>{t}</span>.
          </>
        ) : (
          <>
            <span className={hl}>{displayName}'s</span>
            {type && <span className="text-content-muted"> ({type})</span>} appointment will be moved to{" "}
            <span className={hl}>{d}</span> at{" "}
            <span className={hl}>{t}</span>.
          </>
        )}
        <br /><br />
        {t("studioCalendar.notify.askNotifyChange", { entity: entityLabel })}
      </p>
    )
  }

  // =============================================
  // Render
  // =============================================
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1100] p-4" onClick={handleClose}>
      {/* Custom checkbox style — matches selling sidebar */}
      <style>{`
        .notify-check { appearance: none; -webkit-appearance: none; width: 1rem; height: 1rem; border-radius: 0.25rem; border: 1px solid var(--color-border); background: var(--color-surface-card); cursor: pointer; flex-shrink: 0; }
        .notify-check:checked { background-color: var(--color-primary); border-color: var(--color-primary); background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E"); background-size: 100% 100%; background-position: center; background-repeat: no-repeat; }
        .notify-check:focus { outline: none; box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 40%, transparent); }
      `}</style>

      <div
        className="bg-surface-card w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-semibold text-content-primary">{customTitle || t("studioCalendar.actionModal.notify", { type: EntityLabel })}</h2>
          <button onClick={handleClose} className="text-content-muted hover:text-content-primary p-2 hover:bg-surface-dark rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {customMessage ? (
            typeof customMessage === "string" 
              ? <p className="text-content-primary text-sm">{customMessage}</p>
              : customMessage
          ) : renderMessage()}

          {/* Notification Options */}
          {!hideNotificationOptions && (
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotification}
                  onChange={(e) => setEmailNotification(e.target.checked)}
                  className="notify-check"
                />
                <span className="text-content-primary text-sm">{t("studioCalendar.actionModal.emailNotification")}</span>
              </label>

              {/* App Push Notification - only for members, not leads */}
              {!isLead && !hidePush && (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pushNotification}
                    onChange={(e) => setPushNotification(e.target.checked)}
                    className="notify-check"
                  />
                  <span className="text-content-primary text-sm">{t("studioCalendar.actionModal.pushNotification")}</span>
                </label>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t border-border flex flex-col-reverse sm:flex-row gap-2 ${hideBack ? 'sm:justify-end' : 'sm:justify-between'}`}>
          {!hideBack && (
            <button
              onClick={handleClose}
              className="w-full sm:w-auto px-5 py-2.5 bg-surface-button text-sm font-medium text-content-primary rounded-xl hover:bg-surface-button-hover transition-colors"
            >
              Back
            </button>
          )}

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

export default NotifyModalMain
