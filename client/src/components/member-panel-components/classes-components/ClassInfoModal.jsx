/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react"
import { useTranslation } from "react-i18next"
import { X, Clock, MapPin, Users, Repeat } from "lucide-react"

const ClassInfoModal = ({
  show,
  onClose,
  classData,
  isEnrolled = false,
  isFull = false,
  spotsLeft = 0,
  onEnroll,
  onCancel,
}) => {
  const { t, i18n } = useTranslation()
  if (!show || !classData) return null

  const fmtDate = (ds) => {
    if (!ds) return ""
    const d = typeof ds === "string" ? (() => { const [y,m,day] = ds.split("-").map(Number); return new Date(y, m-1, day) })() : ds
    if (isNaN(d.getTime())) return ds
    return d.toLocaleDateString(i18n.language, { weekday: "long", month: "long", day: "numeric", year: "numeric" })
  }

  const fillPct = ((classData.enrolledMembers?.length || 0) / (classData.maxParticipants || 1)) * 100

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-card rounded-xl w-full max-w-md overflow-hidden">
        {/* Color bar */}
        <div className="h-1.5" style={{ backgroundColor: classData.color || "#6c5ce7" }} />

        {/* Header */}
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-0 flex justify-between items-start">
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="text-lg font-semibold text-content-primary truncate">{classData.typeName}</h3>
            <p className="text-xs text-content-faint mt-0.5">{fmtDate(classData.date)}</p>
          </div>
          <button
            onClick={onClose}
            className="text-content-muted hover:text-content-primary transition-colors flex-shrink-0 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 md:px-6 py-4 md:py-5 space-y-4">
          {/* Description */}
          {classData.description && (
            <p className="text-content-secondary text-sm leading-relaxed">{classData.description}</p>
          )}

          {/* Details grid */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-sm bg-surface-hover rounded-xl p-3">
              <span className="text-content-muted flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {t("classes.infoModal.time")}
              </span>
              <span className="text-content-primary font-medium">
                {classData.startTime} – {classData.endTime}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm bg-surface-hover rounded-xl p-3">
              <span className="text-content-muted flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {t("classes.infoModal.duration")}
              </span>
              <span className="text-content-primary font-medium">{t("classes.card.duration", { minutes: classData.duration })}</span>
            </div>

            <div className="flex justify-between items-center text-sm bg-surface-hover rounded-xl p-3">
              <span className="text-content-muted flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {t("classes.infoModal.room")}
              </span>
              <span className="text-content-primary font-medium">{classData.room}</span>
            </div>

            <div className="flex justify-between items-center text-sm bg-surface-hover rounded-xl p-3">
              <span className="text-content-muted flex items-center gap-2">
                <Users className="w-4 h-4" />
                {t("classes.infoModal.participants")}
              </span>
              <span className="text-content-primary font-medium">
                {t("classes.card.participants", { enrolled: classData.enrolledMembers?.length || 0, max: classData.maxParticipants })}
              </span>
            </div>

            {classData.isRecurring && (
              <div className="flex justify-between items-center text-sm bg-surface-hover rounded-xl p-3">
                <span className="text-content-muted flex items-center gap-2">
                  <Repeat className="w-4 h-4" />
                  {t("classes.infoModal.schedule")}
                </span>
                <span className="text-content-primary font-medium">{t("classes.infoModal.recurring")}</span>
              </div>
            )}
          </div>

          {/* Trainer */}
          <div className="bg-surface-hover rounded-xl p-3 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
              style={{ backgroundColor: classData.trainerColor || "#6c5ce7" }}
            >
              {classData.trainerName?.split(" ").map(p => p.charAt(0)).join("").toUpperCase()}
            </div>
            <div>
              <p className="text-sm text-content-primary font-medium">{classData.trainerName}</p>
              <p className="text-xs text-content-faint">{t("classes.infoModal.trainer")}</p>
            </div>
          </div>

          {/* Spots bar */}
          {!isEnrolled && !isFull && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-content-faint">{t("classes.infoModal.availability")}</span>
                <span className={`text-xs font-medium ${spotsLeft <= 3 ? "text-yellow-400" : "text-green-400"}`}>
                  {t("classes.card.spotsLeft", { count: spotsLeft })}
                </span>
              </div>
              <div className="h-1.5 bg-surface-card rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${fillPct}%`,
                    backgroundColor: spotsLeft <= 2 ? "#e17055" : spotsLeft <= 5 ? "#fdcb6e" : classData.color || "#6c5ce7",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 md:px-6 py-4 border-t border-border flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-surface-button hover:bg-surface-button-hover rounded-xl text-content-primary transition-colors text-sm"
          >
            {t("common.close")}
          </button>
          {isEnrolled ? (
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl text-white transition-colors text-sm"
            >
              {t("classes.infoModal.cancelEnrollment")}
            </button>
          ) : isFull ? (
            <button
              disabled
              className="flex-1 px-4 py-2.5 bg-surface-button text-content-faint rounded-xl text-sm cursor-not-allowed"
            >
              {t("classes.card.full")}
            </button>
          ) : (
            <button
              onClick={onEnroll}
              className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-hover rounded-xl text-white transition-colors text-sm"
            >
              {t("classes.infoModal.enroll")}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClassInfoModal
