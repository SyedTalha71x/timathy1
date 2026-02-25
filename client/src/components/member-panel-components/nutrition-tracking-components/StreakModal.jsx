import { X, Flame, TrendingUp, Trophy, Target } from "lucide-react"

const streakMessages = [
  { min: 1, max: 2, title: "Just Getting Started!", text: "Every journey begins with a single step. Keep logging your meals — consistency is key." },
  { min: 3, max: 6, title: "Building Momentum!", text: "3+ days in a row — your habit is forming. It takes about 21 days to build a lasting habit, you're on your way." },
  { min: 7, max: 13, title: "One Week Strong!", text: "A full week of tracking! You're developing real awareness of your nutrition. This is where change begins." },
  { min: 14, max: 20, title: "Two Weeks In!", text: "You're past the hardest part. Most people quit in the first week — you're already ahead of the curve." },
  { min: 21, max: 29, title: "Habit Formed!", text: "21+ days means this is becoming second nature. Your consistency is paying off." },
  { min: 30, max: 59, title: "Monthly Champion!", text: "A whole month of dedication. You're in the top 5% of people who actually stick with nutrition tracking." },
  { min: 60, max: 89, title: "Two Months Strong!", text: "Your discipline is inspiring. The data you've collected is incredibly valuable for understanding your body." },
  { min: 90, max: Infinity, title: "Legendary Streak!", text: "90+ days — you've made nutrition tracking a lifestyle. This level of commitment leads to lasting results." },
]

const getStreakMessage = (streak) =>
  streakMessages.find((m) => streak >= m.min && streak <= m.max) || streakMessages[0]

const milestones = [3, 7, 14, 21, 30, 60, 90, 180, 365]

const StreakModal = ({ show, onClose, streak }) => {
  if (!show) return null
  const msg = getStreakMessage(streak)
  const nextMilestone = milestones.find((m) => m > streak)
  const daysToNext = nextMilestone ? nextMilestone - streak : null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-card rounded-xl p-5 md:p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-base font-semibold text-content-primary flex items-center gap-2">
            <Flame className="w-5 h-5 text-primary" /> Your Streak
          </h3>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary"><X className="w-5 h-5" /></button>
        </div>

        {/* Big streak number */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-3">
            <div>
              <p className="text-3xl font-bold text-primary">{streak}</p>
              <p className="text-[10px] text-primary/70 font-medium -mt-1">DAYS</p>
            </div>
          </div>
          <h4 className="text-lg font-bold text-content-primary">{msg.title}</h4>
          <p className="text-sm text-content-secondary mt-1.5 leading-relaxed">{msg.text}</p>
        </div>

        {/* Next milestone */}
        {daysToNext && (
          <div className="bg-surface-hover rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-content-primary">Next milestone: {nextMilestone} days</span>
              </div>
              <span className="text-xs text-content-faint">{daysToNext} to go</span>
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
            { icon: TrendingUp, text: "Consistent tracking helps identify eating patterns" },
            { icon: Target, text: "Even logging imperfect days keeps your streak alive" },
            { icon: Flame, text: "Streaks build discipline — discipline builds results" },
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <tip.icon className="w-3.5 h-3.5 text-content-faint mt-0.5 flex-shrink-0" />
              <p className="text-xs text-content-secondary">{tip.text}</p>
            </div>
          ))}
        </div>

        <button onClick={onClose}
          className="w-full mt-5 bg-primary hover:bg-primary-hover text-white rounded-xl py-2.5 text-sm font-medium transition-colors">
          Keep Going!
        </button>
      </div>
    </div>
  )
}

export default StreakModal
