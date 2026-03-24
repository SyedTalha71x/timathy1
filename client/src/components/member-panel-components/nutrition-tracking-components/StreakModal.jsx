import { useTranslation } from "react-i18next"
import { X, Flame, TrendingUp, Trophy, Target } from "lucide-react"

const streakMessages = [
  { min: 1, max: 2, titleKey: "nutrition.streakMsg.1title", textKey: "nutrition.streakMsg.1text" },
  { min: 3, max: 6, titleKey: "nutrition.streakMsg.2title", textKey: "nutrition.streakMsg.2text" },
  { min: 7, max: 13, titleKey: "nutrition.streakMsg.3title", textKey: "nutrition.streakMsg.3text" },
  { min: 14, max: 20, titleKey: "nutrition.streakMsg.4title", textKey: "nutrition.streakMsg.4text" },
  { min: 21, max: 29, titleKey: "nutrition.streakMsg.5title", textKey: "nutrition.streakMsg.5text" },
  { min: 30, max: 59, titleKey: "nutrition.streakMsg.6title", textKey: "nutrition.streakMsg.6text" },
  { min: 60, max: 89, titleKey: "nutrition.streakMsg.7title", textKey: "nutrition.streakMsg.7text" },
  { min: 90, max: Infinity, titleKey: "nutrition.streakMsg.8title", textKey: "nutrition.streakMsg.8text" },
]

const getStreakMessage = (streak) =>
  streakMessages.find((m) => streak >= m.min && streak <= m.max) || streakMessages[0]

const milestones = [3, 7, 14, 21, 30, 60, 90, 180, 365]

const StreakModal = ({ show, onClose, streak }) => {
  const { t } = useTranslation()
  if (!show) return null
  const msg = getStreakMessage(streak)
  const nextMilestone = milestones.find((m) => m > streak)
  const daysToNext = nextMilestone ? nextMilestone - streak : null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-card rounded-xl p-5 md:p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-base font-semibold text-content-primary flex items-center gap-2">
            <Flame className="w-5 h-5 text-primary" /> {t("nutrition.streak.title")}
          </h3>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary"><X className="w-5 h-5" /></button>
        </div>

        {/* Big streak number */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-3">
            <div>
              <p className="text-3xl font-bold text-primary">{streak}</p>
              <p className="text-[10px] text-primary/70 font-medium -mt-1">{t("nutrition.streak.days")}</p>
            </div>
          </div>
          <h4 className="text-lg font-bold text-content-primary">{t(msg.titleKey)}</h4>
          <p className="text-sm text-content-secondary mt-1.5 leading-relaxed">{t(msg.textKey)}</p>
        </div>

        {/* Next milestone */}
        {daysToNext && (
          <div className="bg-surface-hover rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-content-primary">{t("nutrition.streak.nextMilestone", { days: nextMilestone })}</span>
              </div>
              <span className="text-xs text-content-faint">{t("nutrition.streak.toGo", { days: daysToNext })}</span>
            </div>
            <div className="h-2 bg-surface-button rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${((streak / nextMilestone) * 100)}%` }} />
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="space-y-2.5">
          {[
            { icon: TrendingUp, text: t("nutrition.streak.tip1") },
            { icon: Target, text: t("nutrition.streak.tip2") },
            { icon: Flame, text: t("nutrition.streak.tip3") },
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <tip.icon className="w-3.5 h-3.5 text-content-faint mt-0.5 flex-shrink-0" />
              <p className="text-xs text-content-secondary">{tip.text}</p>
            </div>
          ))}
        </div>

        <button onClick={onClose}
          className="w-full mt-5 bg-primary hover:bg-primary-hover text-white rounded-xl py-2.5 text-sm font-medium transition-colors">
          {t("nutrition.streak.keepGoing")}
        </button>
      </div>
    </div>
  )
}

export default StreakModal
