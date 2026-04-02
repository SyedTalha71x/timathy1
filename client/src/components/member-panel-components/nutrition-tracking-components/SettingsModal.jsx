import { useTranslation } from "react-i18next"
import { useRef, useEffect, useCallback } from "react"
import { X, Plus, Star, Pencil, Trash2, ChevronDown, User, Target, ListPlus } from "lucide-react"
import {
  SettingsCard, ACTIVITY_LEVELS, GOAL_TYPES,
  calcBMR, calcTDEE, calcMacros, calcWaterMl,
} from "./nutritionConstants"

const tabKeys = ["profile", "goals", "foods"]

const SettingsModal = ({
  show, onClose, settingsTab, setSettingsTab,
  profileForm, setProfileForm, goalForm, setGoalForm,
  handleSaveSettings, calculateFromProfile,
  customFoods, deleteCustomFood, toggleFavorite, isFavorite,
  openCustomFood, setShowSettings,
}) => {
  const { t } = useTranslation()
  const swipeRef = useRef(null)
  const activeTabRef = useRef(settingsTab)

  useEffect(() => { activeTabRef.current = settingsTab }, [settingsTab])

  // Animate to tab (click or swipe)
  const animateToTab = useCallback((key) => {
    const el = swipeRef.current
    if (!el) return
    const idx = tabKeys.indexOf(key)
    el.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
    el.style.transform = `translateX(-${idx * (100 / tabKeys.length)}%)`
    setSettingsTab(key)
  }, [setSettingsTab])

  // Sync transform when tab changes externally (e.g. "Apply & Set Goals" button)
  useEffect(() => {
    const el = swipeRef.current
    if (!el) return
    const idx = tabKeys.indexOf(settingsTab)
    el.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
    el.style.transform = `translateX(-${idx * (100 / tabKeys.length)}%)`
  }, [settingsTab, show])

  // Touch swipe handlers
  useEffect(() => {
    const el = swipeRef.current
    if (!el) return

    let startX, startY, startT, dx, locked, isH
    const pct = 100 / tabKeys.length

    const onStart = (e) => {
      const t = e.touches[0]
      startX = t.clientX; startY = t.clientY; startT = Date.now()
      dx = 0; locked = false; isH = false
      el.style.transition = 'none'
    }

    const onMove = (e) => {
      const t = e.touches[0]
      const rawDx = t.clientX - startX
      const dy = t.clientY - startY

      if (!locked && (Math.abs(rawDx) > 8 || Math.abs(dy) > 8)) {
        locked = true
        isH = Math.abs(rawDx) > Math.abs(dy) * 1.3
      }
      if (!isH) return
      e.preventDefault()

      const i = tabKeys.indexOf(activeTabRef.current)
      dx = rawDx
      if ((i === 0 && dx > 0) || (i === tabKeys.length - 1 && dx < 0)) {
        dx = rawDx * 0.15
      }
      el.style.transform = `translateX(calc(-${i * pct}% + ${dx}px))`
    }

    const onEnd = () => {
      if (!isH) return
      const i = tabKeys.indexOf(activeTabRef.current)
      const velocity = Math.abs(dx) / Math.max(Date.now() - startT, 1)
      const panelW = el.parentElement?.offsetWidth || window.innerWidth
      const threshold = panelW * 0.15

      let target = i
      if (dx < -threshold || (dx < -20 && velocity > 0.25)) {
        target = Math.min(i + 1, tabKeys.length - 1)
      } else if (dx > threshold || (dx > 20 && velocity > 0.25)) {
        target = Math.max(i - 1, 0)
      }

      el.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
      el.style.transform = `translateX(-${target * pct}%)`

      if (target !== i) setSettingsTab(tabKeys[target])
    }

    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchmove', onMove, { passive: false })
    el.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchmove', onMove)
      el.removeEventListener('touchend', onEnd)
    }
  }, [setSettingsTab, show])

  if (!show) return null

  const panelScroll = "h-full overflow-y-auto p-4 md:p-6"
  const panelPadding = { WebkitOverflowScrolling: "touch", overscrollBehavior: "contain", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 5rem)" }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 pt-[env(safe-area-inset-top,0px)]">
      <div className="bg-surface-card rounded-t-2xl sm:rounded-xl w-full sm:max-w-lg max-h-[88dvh] sm:max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <h3 className="text-base font-semibold text-content-primary">{t("nutrition.settings.title")}</h3>
          <button onClick={onClose} className="p-1 text-content-muted hover:text-content-primary"><X className="w-5 h-5" /></button>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-border flex-shrink-0" style={{ touchAction: "manipulation" }}>
          {[{ key: "profile", label: t("nutrition.settings.profile"), icon: User }, { key: "goals", label: t("nutrition.settings.goals"), icon: Target }, { key: "foods", label: t("nutrition.settings.myFoods"), icon: ListPlus }].map((tab) => {
            const TabIcon = tab.icon
            return (
              <button key={tab.key} onClick={() => animateToTab(tab.key)}
                className={`flex-1 py-3 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${settingsTab === tab.key ? "text-primary border-b-2 border-primary" : "text-content-muted"}`}>
                <TabIcon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            )
          })}
        </div>

        {/* Swipe Panels */}
        <div className="flex-1 overflow-hidden min-h-0">
          <div
            ref={swipeRef}
            className="flex h-full"
            style={{ width: `${tabKeys.length * 100}%`, willChange: 'transform', touchAction: 'pan-y pinch-zoom', transform: `translateX(-${tabKeys.indexOf(settingsTab) * (100 / tabKeys.length)}%)` }}
          >
            {/* PROFILE */}
            <div className="h-full" style={{ width: `${100 / tabKeys.length}%` }}>
              <div className={panelScroll} style={panelPadding}>
                <div className="space-y-4">
                  <p className="text-xs text-content-muted">{t("nutrition.settings.profileDesc")}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-content-muted mb-1 block">{t("nutrition.settings.gender")}</label>
                      <div className="relative">
                        <select value={profileForm.gender} onChange={(e) => setProfileForm((p) => ({ ...p, gender: e.target.value }))}
                          className="w-full appearance-none bg-surface-dark rounded-xl px-4 py-2.5 pr-9 text-sm text-content-primary border border-transparent focus:border-primary outline-none">
                          <option value="male">{t("studioMenu.popup.male")}</option>
                          <option value="female">{t("studioMenu.popup.female")}</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-faint pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-content-muted mb-1 block">{t("nutrition.settings.age")}</label>
                      <input type="number" inputMode="decimal" value={profileForm.age} onChange={(e) => setProfileForm((p) => ({ ...p, age: e.target.value }))} placeholder="30"
                        className="w-full bg-surface-dark rounded-xl px-4 py-2.5 text-sm text-content-primary border border-transparent focus:border-primary outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-content-muted mb-1 block">{t("nutrition.settings.height")}</label>
                      <input type="number" inputMode="decimal" value={profileForm.height} onChange={(e) => setProfileForm((p) => ({ ...p, height: e.target.value }))} placeholder="175"
                        className="w-full bg-surface-dark rounded-xl px-4 py-2.5 text-sm text-content-primary border border-transparent focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-content-muted mb-1 block">{t("nutrition.settings.weight")}</label>
                      <input type="number" inputMode="decimal" value={profileForm.weight} onChange={(e) => setProfileForm((p) => ({ ...p, weight: e.target.value }))} placeholder="75"
                        className="w-full bg-surface-dark rounded-xl px-4 py-2.5 text-sm text-content-primary border border-transparent focus:border-primary outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-content-muted mb-2 block">{t("nutrition.settings.activityLevel")}</label>
                    <div className="space-y-1.5">
                      {ACTIVITY_LEVELS.map((level) => (
                        <button key={level.value} onClick={() => setProfileForm((p) => ({ ...p, activity: level.value }))}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl border transition-colors ${profileForm.activity === level.value ? "border-primary bg-primary/5" : "border-transparent bg-surface-dark hover:bg-surface-button"}`}>
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-content-primary">{t(level.labelKey)}</p>
                            {profileForm.activity === level.value && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                          </div>
                          <p className="text-[11px] text-content-faint leading-tight mt-0.5">{t(level.descKey)}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-content-muted mb-2 block">{t("nutrition.settings.goal")}</label>
                    <div className="flex gap-2">
                      {GOAL_TYPES.map((g) => (
                        <button key={g.value} onClick={() => setProfileForm((p) => ({ ...p, goalType: g.value }))}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-colors ${profileForm.goalType === g.value ? "bg-primary text-white" : "bg-surface-dark text-content-muted hover:text-content-primary"}`}>
                          {t(g.labelKey)}
                        </button>
                      ))}
                    </div>
                  </div>
                  {profileForm.weight && profileForm.height && profileForm.age && (
                    <SettingsCard className="!p-4 !bg-primary/5 border border-primary/20">
                      <p className="text-xs text-content-muted mb-2">{t("nutrition.settings.calculatedTargets")}</p>
                      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center">
                        {(() => {
                          const bmr = calcBMR(profileForm.weight, profileForm.height, profileForm.age, profileForm.gender)
                          const tdee = calcTDEE(bmr, profileForm.activity)
                          const offset = GOAL_TYPES.find((g) => g.value === profileForm.goalType)?.offset || 0
                          const cal = Math.max(1200, tdee + offset)
                          const m = calcMacros(cal)
                          const wMl = calcWaterMl(profileForm.weight, profileForm.activity)
                          return [
                            { label: t("nutrition.macros.calories"), val: cal },
                            { label: t("nutrition.macros.protein"), val: m.protein },
                            { label: t("nutrition.macros.carbs"), val: m.carbs },
                            { label: t("nutrition.macros.fat"), val: m.fats },
                            { label: t("nutrition.diary.water"), val: `${(wMl / 1000).toFixed(1)}L` },
                          ].map((item) => (
                            <div key={item.label}>
                              <p className="text-base sm:text-lg font-bold text-primary">{item.val}</p>
                              <p className="text-[9px] sm:text-[10px] text-content-faint">{item.label}</p>
                            </div>
                          ))
                        })()}
                      </div>
                    </SettingsCard>
                  )}
                </div>
              </div>
            </div>

            {/* GOALS */}
            <div className="h-full" style={{ width: `${100 / tabKeys.length}%` }}>
              <div className={panelScroll} style={panelPadding}>
                <div className="space-y-4">
                  <p className="text-xs text-content-muted">{t("nutrition.settings.goalsDesc")}</p>
                  {[{ key: "calories", label: t("nutrition.settings.caloriesKcal") }, { key: "protein", label: t("nutrition.settings.proteinG") }, { key: "carbs", label: t("nutrition.settings.carbsG") }, { key: "fats", label: t("nutrition.settings.fatG") }, { key: "waterMl", label: t("nutrition.settings.waterMl") }].map((field) => (
                    <div key={field.key}>
                      <label className="text-sm text-content-secondary block mb-2">{field.label}</label>
                      <input type="number" inputMode="decimal" value={goalForm[field.key]} onChange={(e) => setGoalForm((p) => ({ ...p, [field.key]: e.target.value }))}
                        className="w-full bg-surface-dark rounded-xl px-4 py-2.5 text-sm text-content-primary border border-transparent focus:border-primary outline-none" />
                      {field.key === "waterMl" && goalForm.waterMl && (
                        <p className="text-xs text-content-faint mt-1">= {(Number(goalForm.waterMl) / 1000).toFixed(1)}L</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* MY FOODS */}
            <div className="h-full" style={{ width: `${100 / tabKeys.length}%` }}>
              <div className={panelScroll} style={panelPadding}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-content-muted">{t("nutrition.settings.customFoodCount", { count: customFoods.length })}</p>
                    <button onClick={() => { setShowSettings(false); openCustomFood("settings") }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-medium transition-colors">
                      <Plus className="w-3.5 h-3.5" /> {t("nutrition.settings.newFood")}
                    </button>
                  </div>
                  {customFoods.length > 0 ? (
                    <div className="space-y-2">
                      {customFoods.map((food) => (
                        <div key={food.id} className="flex items-center justify-between bg-surface-dark rounded-xl px-4 py-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-content-primary truncate">{food.name}</p>
                            <div className="flex gap-3 text-xs text-content-faint mt-0.5">
                              <span>{food.calories} kcal</span>
                              <span>P: {food.protein}g</span>
                              <span>C: {food.carbs}g</span>
                              <span>F: {food.fats}g</span>
                              {food.servingSize && <span>· {food.servingSize}{food.unit}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 ml-3 flex-shrink-0">
                            <button onClick={() => toggleFavorite(food.id)}
                              className={`p-1.5 rounded-lg transition-colors ${isFavorite(food.id) ? "text-primary" : "text-content-faint hover:text-primary"}`}>
                              <Star className="w-3.5 h-3.5" fill={isFavorite(food.id) ? "currentColor" : "none"} />
                            </button>
                            <button onClick={() => { setShowSettings(false); openCustomFood("settings", food) }}
                              className="p-1.5 rounded-lg text-content-faint hover:text-content-primary hover:bg-surface-button transition-colors">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => deleteCustomFood(food.id)}
                              className="p-1.5 rounded-lg text-content-faint hover:text-red-400 hover:bg-red-500/10 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-content-muted">
                      <ListPlus className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">{t("nutrition.settings.noCustomFoods")}</p>
                      <p className="text-xs mt-1">{t("nutrition.settings.createCustomHint")}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky footer buttons */}
        {settingsTab === "profile" && (
          <div className="flex-shrink-0 p-4 border-t border-border bg-surface-card" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1.5rem)" }}>
            <button onClick={() => { calculateFromProfile(); animateToTab("goals") }}
              className="w-full bg-primary hover:bg-primary-hover text-white rounded-xl py-2.5 text-sm font-medium transition-colors">
              {t("nutrition.settings.applySetGoals")}
            </button>
          </div>
        )}
        {settingsTab === "goals" && (
          <div className="flex-shrink-0 p-4 border-t border-border bg-surface-card" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1.5rem)" }}>
            <div className="flex gap-3">
              <button onClick={() => setGoalForm({ calories: 2000, protein: 150, carbs: 250, fats: 70, waterMl: 2500 })}
                className="flex-1 px-4 py-2.5 bg-surface-button hover:bg-surface-button-hover rounded-xl text-content-primary text-sm transition-colors">{t("nutrition.settings.reset")}</button>
              <button onClick={handleSaveSettings}
                className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-hover rounded-xl text-white text-sm font-medium transition-colors">{t("nutrition.settings.saveGoals")}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SettingsModal
