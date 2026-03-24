/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react"
import { useTranslation } from "react-i18next"

const RequestModal = ({
  show,
  onClose,
  onConfirm,
  selectedService,
  selectedMonth,
  selectedDate,
  selectedYear,
  selectedTimeSlot,
  timeSlots,
  months,
}) => {
  const { t } = useTranslation()
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-card rounded-xl p-4 md:p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold text-content-primary mb-4">{t("appointments.requestModal.title")}</h3>

        <div className="space-y-4 mb-6">
          <div className="bg-surface-hover rounded-xl p-4">
            <p className="text-content-primary font-medium text-sm">{selectedService?.name}</p>
            <p className="text-content-muted text-xs mt-1">
              {t("appointments.bookingModal.dateTime", {
                month: months[selectedMonth],
                day: selectedDate,
                year: selectedYear,
                start: selectedTimeSlot?.start,
                end: selectedTimeSlot?.end,
              })}
            </p>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <h4 className="text-yellow-400 font-medium mb-2 text-sm">{t("appointments.requestModal.requestInfo")}</h4>
            <p className="text-content-secondary text-xs">
              {t("appointments.requestModal.requestDesc")}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-surface-button hover:bg-surface-button-hover rounded-xl text-content-primary transition-colors text-sm"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-yellow-600 hover:bg-yellow-500 rounded-xl text-white transition-colors text-sm"
          >
            {t("appointments.requestModal.sendRequest")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RequestModal
