/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react"
import { Clock, MapPin, AlertTriangle } from "lucide-react"

const fmtDateDisplay = (ds) => {
  if (!ds) return ""
  const d = typeof ds === "string" ? new Date(ds) : ds
  if (isNaN(d.getTime())) return ds
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
}

const ClassCancelModal = ({ show, onClose, onConfirm, classData }) => {
  if (!show || !classData) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-card rounded-xl p-4 md:p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold text-content-primary mb-4">Cancel Enrollment</h3>

        <p className="text-content-secondary mb-4 text-sm">
          Are you sure you want to cancel your enrollment in this class?
        </p>

        {/* Class details */}
        <div className="bg-surface-hover rounded-xl overflow-hidden mb-4">
          <div className="h-1" style={{ backgroundColor: classData.color || "#6c5ce7" }} />
          <div className="p-4">
            <p className="text-content-primary font-medium text-sm mb-1.5">{classData.typeName}</p>
            <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-content-faint">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {fmtDateDisplay(classData.date)} · {classData.startTime} – {classData.endTime}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {classData.room}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2.5">
              <div
                className="w-5 h-5 rounded flex items-center justify-center text-white text-[8px] font-semibold flex-shrink-0"
                style={{ backgroundColor: classData.trainerColor || "#6c5ce7" }}
              >
                {classData.trainerName?.split(" ").map(p => p.charAt(0)).join("").toUpperCase()}
              </div>
              <span className="text-xs text-content-secondary">{classData.trainerName}</span>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 mb-6 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-content-secondary">
            Your spot will be released and made available to other members. You can re-enroll later if spots are still available.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-surface-button hover:bg-surface-button-hover rounded-xl text-content-primary transition-colors text-sm"
          >
            Keep Enrollment
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl text-white transition-colors text-sm"
          >
            Cancel Enrollment
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClassCancelModal
