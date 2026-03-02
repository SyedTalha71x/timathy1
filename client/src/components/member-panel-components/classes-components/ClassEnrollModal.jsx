/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react"
import { Clock, MapPin, Users } from "lucide-react"

const fmtDateDisplay = (ds) => {
  if (!ds) return ""
  const d = typeof ds === "string" ? new Date(ds) : ds
  if (isNaN(d.getTime())) return ds
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
}

const ClassEnrollModal = ({ show, onClose, onConfirm, classData }) => {
  if (!show || !classData) return null

  const spotsLeft = Math.max(0, (classData.maxParticipants || 0) - (classData.enrolledMembers?.length || 0))

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-card rounded-xl p-4 md:p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold text-content-primary mb-4">Confirm Enrollment</h3>

        <div className="space-y-4 mb-6">
          {/* Class details card */}
          <div className="bg-surface-hover rounded-xl overflow-hidden">
            <div className="h-1" style={{ backgroundColor: classData.color || "#6c5ce7" }} />
            <div className="p-4">
              <p className="text-content-primary font-medium text-sm mb-2">{classData.typeName}</p>
              <div className="flex items-center flex-wrap gap-x-4 gap-y-1.5 text-xs text-content-faint">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {fmtDateDisplay(classData.date)} · {classData.startTime} – {classData.endTime}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {classData.room}
                </span>
              </div>
              {/* Trainer */}
              <div className="flex items-center gap-2 mt-3">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[9px] font-semibold flex-shrink-0"
                  style={{ backgroundColor: classData.trainerColor || "#6c5ce7" }}
                >
                  {classData.trainerName?.split(" ").map(p => p.charAt(0)).join("").toUpperCase()}
                </div>
                <span className="text-xs text-content-secondary">{classData.trainerName}</span>
              </div>
            </div>
          </div>

          {/* Spots info */}
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
            <h4 className="text-primary font-medium mb-2 text-sm">Enrollment Info</h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-content-muted">Current Participants</span>
                <span className="text-content-primary">
                  {classData.enrolledMembers?.length || 0}/{classData.maxParticipants}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-content-muted">After Enrollment</span>
                <span className="text-content-primary">
                  {(classData.enrolledMembers?.length || 0) + 1}/{classData.maxParticipants}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-content-muted">Spots Remaining</span>
                <span className={`font-medium ${spotsLeft <= 3 ? "text-yellow-400" : "text-content-primary"}`}>
                  {spotsLeft - 1}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-surface-button hover:bg-surface-button-hover rounded-xl text-content-primary transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-hover rounded-xl text-white transition-colors text-sm"
          >
            Confirm Enrollment
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClassEnrollModal
