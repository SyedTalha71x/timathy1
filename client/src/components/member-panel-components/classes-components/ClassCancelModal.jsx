/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react"
import { useTranslation } from "react-i18next"
import { X, Clock, MapPin, AlertTriangle } from "lucide-react"

const ClassCancelModal = ({ show, onClose, onConfirm, classData }) => {
  const { t, i18n } = useTranslation()
  if (!show || !classData) return null

  const fmtDate = (ds) => {
    if (!ds) return ""
    const d = typeof ds === "string" ? (() => { const [y,m,day] = ds.split("-").map(Number); return new Date(y, m-1, day) })() : ds
    if (isNaN(d.getTime())) return ds
    return d.toLocaleDateString(i18n.language, { weekday: "short", month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-card rounded-xl w-full max-w-md overflow-hidden">
        {/* Color bar */}
        <div className="h-1.5" style={{ backgroundColor: classData.color || "#6c5ce7" }} />

        {/* Header */}
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-0 flex justify-between items-start">
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="text-lg font-semibold text-content-primary">{t("classes.cancelModal.title")}</h3>
            <p className="text-sm text-content-secondary mt-1">{t("classes.cancelModal.description")}</p>
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

          {/* Warning */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-content-secondary">{t("classes.cancelModal.warning")}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 md:px-6 py-4 border-t border-border flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-surface-button hover:bg-surface-button-hover rounded-xl text-content-primary transition-colors text-sm"
          >
            {t("classes.cancelModal.keepEnrollment")}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl text-white transition-colors text-sm"
          >
            {t("classes.infoModal.cancelEnrollment")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClassCancelModal
