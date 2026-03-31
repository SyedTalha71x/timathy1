/* eslint-disable react/prop-types */
import { X, Trash2, AlertTriangle } from "lucide-react"
import { useTranslation } from "react-i18next"

// =============================================================================
// SHARED DELETE CONFIRMATION MODAL
// =============================================================================
// Used by: configuration.jsx (all delete actions), admin-notes.jsx, and any future delete flows
//
// INTERFACE:
//   isOpen:        boolean — controls visibility
//   onClose:       () => void — called when modal is dismissed (Cancel / X / backdrop)
//   onConfirm:     () => void — called when user confirms the delete
//   title:         string (optional) — modal title, defaults to t("common.delete")
//   itemName:      string (optional) — the name of the item being deleted (highlighted)
//   message:       string|JSX (optional) — primary message body
//   description:   string|JSX (optional) — secondary description (e.g. consequences)
//   confirmText:   string (optional) — confirm button label, defaults to t("common.delete")
//   cancelText:    string (optional) — cancel button label, defaults to t("common.cancel")
//   variant:       "danger" | "warning" (optional) — visual style, defaults to "danger"
// =============================================================================

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  message,
  description,
  confirmText,
  cancelText,
  variant = "danger",
}) => {
  const { t } = useTranslation()

  if (!isOpen) return null

  // Apply translated defaults
  const resolvedTitle = title || t("common.delete")
  const resolvedConfirmText = confirmText || t("common.delete")
  const resolvedCancelText = cancelText || t("common.cancel")

  const isDanger = variant === "danger"
  const iconBg = isDanger ? "bg-red-500/20" : "bg-amber-500/20"
  const iconColor = isDanger ? "text-red-400" : "text-amber-400"
  const btnBg = isDanger
    ? "bg-red-500 hover:bg-red-600"
    : "bg-amber-500 hover:bg-amber-600"
  const Icon = isDanger ? Trash2 : AlertTriangle

  // Build default message if none provided
  const renderMessage = () => {
    if (message) {
      return typeof message === "string" ? (
        <p className="text-content-muted text-sm">{message}</p>
      ) : (
        message
      )
    }

    return (
      <p className="text-content-muted text-sm">
        {itemName ? (
          <>
            {t("common.deleteModal.messageWithItem", { defaultValue: "Are you sure you want to delete" })}{" "}
            <span className="text-content-primary font-semibold">
              &quot;{itemName}&quot;
            </span>
            ?
          </>
        ) : (
          t("common.deleteModal.messageDefault", { defaultValue: "Are you sure you want to delete this item?" })
        )}
      </p>
    )
  }

  const handleClose = () => {
    onClose?.()
  }

  const handleConfirm = () => {
    onConfirm?.()
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1100] p-4"
      onClick={handleClose}
    >
      <div
        className="bg-surface-card w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${iconBg} rounded-xl`}>
              <Icon size={20} className={iconColor} />
            </div>
            <h2 className="text-lg font-semibold text-content-primary">
              {resolvedTitle}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-content-muted hover:text-content-primary p-2 hover:bg-surface-dark rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderMessage()}

          {description && (
            <p className="text-content-faint text-sm mt-2">{description}</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-surface-button text-sm font-medium text-content-primary rounded-xl hover:bg-surface-button-hover transition-colors"
          >
            {resolvedCancelText}
          </button>

          <button
            onClick={handleConfirm}
            className={`w-full sm:w-auto px-5 py-2.5 ${btnBg} text-sm font-medium text-white rounded-xl transition-colors flex items-center justify-center gap-2`}
          >
            <Trash2 className="w-4 h-4" />
            {resolvedConfirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
