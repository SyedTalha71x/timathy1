/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react"
import { useTranslation } from "react-i18next"

const CancelModal = ({ show, onClose, onConfirm, appointmentToCancel }) => {
  const { t, i18n } = useTranslation()
  if (!show) return null

  const isPending = appointmentToCancel?.status === "pending"

  const fmtDate = (iso) => {
    if (!iso) return ""
    const d = typeof iso === "string" ? (() => { const [y,m,day] = iso.split("T")[0].split("-").map(Number); return new Date(y, m-1, day) })() : iso
    if (isNaN(d.getTime())) return iso
    return d.toLocaleDateString(i18n.language, { month: "short", day: "2-digit", year: "numeric" })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-card rounded-xl p-4 md:p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold text-content-primary mb-4">
          {isPending ? t("appointments.cancelModal.cancelRequest") : t("appointments.cancelModal.cancelBooking")}
        </h3>

        <p className="text-content-secondary mb-4 text-sm">
          {isPending ? t("appointments.cancelModal.confirmCancelRequest") : t("appointments.cancelModal.confirmCancelBooking")}
        </p>

        <div className="bg-surface-hover rounded-xl p-4 mb-6">
          <p className="text-content-primary font-medium text-sm">{appointmentToCancel?.service?.name}</p>
          <p className="text-content-muted text-xs mt-1">
            {fmtDate(appointmentToCancel?.date)}
            {" · "}
            {appointmentToCancel?.timeSlot?.start} - {appointmentToCancel?.timeSlot?.end}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-surface-button hover:bg-surface-button-hover rounded-xl text-content-primary transition-colors text-sm"
          >
            {t("appointments.cancelModal.keep")}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl text-white transition-colors text-sm"
          >
            {t("appointments.cancelModal.confirmBtn")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CancelModal
