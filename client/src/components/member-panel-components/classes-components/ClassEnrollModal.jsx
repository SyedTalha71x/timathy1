/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react"
import { useTranslation } from "react-i18next"
import { Clock, MapPin, Users } from "lucide-react"

const ClassEnrollModal = ({ show, onClose, onConfirm, classData }) => {
  const { t, i18n } = useTranslation()
  if (!show || !classData) return null

  const fmtDate = (ds) => {
    if (!ds) return ""
    const d = typeof ds === "string" ? (() => { const [y,m,day] = ds.split("-").map(Number); return new Date(y, m-1, day) })() : ds
    if (isNaN(d.getTime())) return ds
    return d.toLocaleDateString(i18n.language, { weekday: "short", month: "short", day: "numeric", year: "numeric" })
  }

  const spotsLeft = Math.max(0, (classData.maxParticipants || 0) - (classData.enrolledMembers?.length || 0))

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-card rounded-xl w-full max-w-md overflow-hidden">
        {/* Color bar */}
        <div className="h-1.5" style={{ backgroundColor: classData.color || "#6c5ce7" }} />

        {/* Header */}
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-0 flex justify-between items-start">
          <h3 className="text-lg font-semibold text-content-primary">{t("classes.enrollModal.title")}</h3>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary transition-colors flex-shrink-0 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-4 md:px-6 py-4 md:py-5 space-y-4">
          {/* Class details */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-sm bg-surface-hover rounded-xl p-3">
              <span className="text-content-primary font-medium">{classData.typeName}</span>
            </div>
            <div className="flex justify-between items-center text-sm bg-surface-hover rounded-xl p-3">
              <span className="text-content-muted flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {t("classes.infoModal.time")}
              </span>
              <span className="text-content-primary font-medium">
                {fmtDate(classData.date)} · {classData.startTime} – {classData.endTime}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm bg-surface-hover rounded-xl p-3">
              <span className="text-content-muted flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {t("classes.infoModal.room")}
              </span>
              <span className="text-content-primary font-medium">{classData.room}</span>
            </div>
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

          {/* Spots info */}
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
            <h4 className="text-primary font-medium mb-2 text-sm">{t("classes.enrollModal.enrollmentInfo")}</h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-content-muted">{t("classes.enrollModal.currentParticipants")}</span>
                <span className="text-content-primary">
                  {classData.enrolledMembers?.length || 0}/{classData.maxParticipants}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-content-muted">{t("classes.enrollModal.afterEnrollment")}</span>
                <span className="text-content-primary">
                  {(classData.enrolledMembers?.length || 0) + 1}/{classData.maxParticipants}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-content-muted">{t("classes.enrollModal.spotsRemaining")}</span>
                <span className={`font-medium ${spotsLeft <= 3 ? "text-yellow-400" : "text-content-primary"}`}>
                  {spotsLeft - 1}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 md:px-6 py-4 border-t border-border flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-surface-button hover:bg-surface-button-hover rounded-xl text-content-primary transition-colors text-sm"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-hover rounded-xl text-white transition-colors text-sm"
          >
            {t("classes.enrollModal.confirmEnrollment")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClassEnrollModal
