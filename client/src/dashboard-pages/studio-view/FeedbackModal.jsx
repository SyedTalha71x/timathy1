import {
  MessageCircle,
  MessageSquarePlus,
  Lightbulb,
  Bug,
  Star,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { haptic } from "../../utils/haptic"
import { useDispatch, useSelector } from 'react-redux'
import { createFeedbackThunk } from '../../features/supportCenter/supportSlice'

export const feedbackTypes = [
  { id: 'suggestion', label: 'Suggestion', icon: Lightbulb },
  { id: 'bug', label: 'Bug Report', icon: Bug },
  { id: 'praise', label: 'Praise', icon: Star },
  { id: 'other', label: 'Other', icon: MessageCircle },
]

const FeedbackModal = ({
  isOpen,
  isSubmitted,
  feedbackData,
  onFeedbackDataChange,
  onClose,
  onSuccess
}) => {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.support || {})

  const handleSubmit = async () => {
    if (!feedbackData.subject.trim() || !feedbackData.message.trim()) return

    haptic.medium()

    try {
      await dispatch(createFeedbackThunk(feedbackData)).unwrap()
      onSuccess?.("Your Feedback is Submitted successfully") // Call success callback if provided
      onClose(true)
    } catch (err) {
      console.error('Failed to submit feedback:', err)
    }
  }

  if (!isOpen) return null

  // Success State
  if (isSubmitted) {
    return (
      <div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-surface-card rounded-2xl w-full max-w-md overflow-hidden border border-border p-8 text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-content-primary mb-2 oxanium_font">Thank You!</h2>
          <p className="text-content-secondary open_sans_font">
            Your feedback has been submitted successfully. We appreciate you taking the time to help us improve OrgaGym.
          </p>
          <button
            onClick={() => {
              haptic.light()
              onClose()
            }}
            className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="bg-surface-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <MessageSquarePlus size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-content-primary oxanium_font">Send Feedback</h2>
              <p className="text-sm text-content-secondary open_sans_font">Help us improve OrgaGym</p>
            </div>
          </div>
          <button
            onClick={() => { haptic.light(); onClose() }}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors active:scale-90"
            style={{ touchAction: "manipulation" }}
          >
            <span className="text-content-faint hover:text-content-secondary text-xl">×</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 sm:mx-5 mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-500 open_sans_font">{error}</p>
            <button
              onClick={() => dispatch(resetFeedbackState())}
              className="ml-auto text-xs text-red-500 hover:text-red-400"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
          {/* Feedback Type */}
          <div>
            <label className="block text-sm font-medium text-content-secondary mb-2 open_sans_font">Feedback Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {feedbackTypes.map((type) => {
                const IconComponent = type.icon
                const isSelected = feedbackData.type === type.id;

                return (
                  <button
                    key={type.id}
                    onClick={() => {
                      haptic.light();
                      onFeedbackDataChange({ ...feedbackData, type: type.id })
                    }}
                    className={`p-3 rounded-xl border transition-all text-center active:scale-95 ${isSelected
                      ? 'border-primary bg-primary/10 text-content-primary'
                      : 'border-border bg-surface-button text-content-secondary hover:bg-surface-button-hover'
                      }`}
                    style={{ touchAction: "manipulation" }}
                  >
                    <IconComponent
                      size={20}
                      className={`mx-auto mb-1 ${isSelected ? 'text-primary' : 'text-content-faint'}`}
                    />
                    <span className="text-xs open_sans_font">{type.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-content-secondary mb-2 open_sans_font">Subject</label>
            <input
              type="text"
              value={feedbackData.subject}
              onChange={(e) => onFeedbackDataChange({ ...feedbackData, subject: e.target.value })}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder="Brief summary of your feedback"
              className="w-full bg-surface-dark border border-border rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-content-primary text-sm sm:text-base focus:outline-none focus:border-primary transition-colors placeholder-content-faint"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-content-secondary mb-2 open_sans_font">Message</label>
            <textarea
              value={feedbackData.message}
              onChange={(e) => onFeedbackDataChange({ ...feedbackData, message: e.target.value })}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder="Tell us more about your feedback..."
              rows={4}
              className="w-full bg-surface-dark border border-border rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-content-primary text-sm sm:text-base focus:outline-none focus:border-primary transition-colors resize-none placeholder-content-faint"
            />
          </div>

          {/* Rating (optional) */}
          <div>
            <label className="block text-sm font-medium text-content-secondary mb-2 open_sans_font">
              How would you rate your experience? <span className="text-content-faint">(optional)</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => {
                    haptic.light();
                    onFeedbackDataChange({ ...feedbackData, rating: star })
                  }}
                  className="transition-transform active:scale-90"
                  style={{ touchAction: "manipulation" }}
                >
                  <Star
                    size={24}
                    className={feedbackData.rating >= star ? 'text-primary fill-primary' : 'text-content-faint'}
                  />
                </button>
              ))}
              {feedbackData.rating > 0 && (
                <button
                  onClick={() => {
                    haptic.light();
                    onFeedbackDataChange({ ...feedbackData, rating: 0 })
                  }}
                  className="text-xs text-content-faint hover:text-content-secondary ml-2"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 sm:p-5 border-t border-border" style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}>
          <button
            onClick={() => { haptic.light(); onClose() }}
            disabled={loading}
            className="flex-1 px-4 py-2.5 sm:py-3 bg-surface-button text-content-primary rounded-xl hover:bg-surface-button-hover transition-colors font-medium text-sm sm:text-base open_sans_font active:scale-[0.97] disabled:opacity-50"
            style={{ touchAction: "manipulation" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!feedbackData.subject.trim() || !feedbackData.message.trim() || loading}
            className="flex-1 px-4 py-2.5 sm:py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base open_sans_font active:scale-[0.97] flex items-center justify-center gap-2"
            style={{ touchAction: "manipulation" }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Sending...
              </>
            ) : (
              'Send Feedback'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FeedbackModal