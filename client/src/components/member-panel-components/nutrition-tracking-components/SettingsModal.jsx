import { useTranslation } from "react-i18next"
import { X, Plus, Star, Pencil, Trash2, ChevronDown, User, Target, ListPlus } from "lucide-react"
import {
  SettingsCard, ACTIVITY_LEVELS, GOAL_TYPES,
  calcBMR, calcTDEE, calcMacros, calcWaterMl,
} from "./nutritionConstants"

const SettingsModal = ({
  show, onClose, settingsTab, setSettingsTab,
  profileForm, setProfileForm, goalForm, setGoalForm,
  handleSaveSettings, calculateFromProfile,
  customFoods, deleteCustomFood, toggleFavorite, isFavorite,
  openCustomFood, setShowSettings,
}) => {
  const { t } = useTranslation()
  if (!show) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 pt-[env(safe-area-inset-top,0px)]">
      <div className="bg-surface-card rounded-t-2xl sm:rounded-xl w-full sm:max-w-lg max-h-[88dvh] sm:max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <h3 className="text-base font-semibold text-content-primary">{t("nav.settings")}</h3>
          <button onClick={onClose} className="p-1 text-content-muted hover:text-content-primary"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex border-b border-border flex-shrink-0" style={{ touchAction: "manipulation" }}>
          {[{ key: "profile", label: t("nutrition.settings.profile"), icon: User }, { key: "goals", label: t("nutrition.settings.goals"), icon: Target }, { key: "foods", label: t("nutrition.settings.myFoods"), icon: ListPlus }].map((tab) => {
            const TabIcon = tab.icon
            return (
              <button key={tab.key} onClick={() => setSettingsTab(tab.key)}
                className={`flex-1 py-3 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${settingsTab === tab.key ? "text-primary border-b-2 border-primary" : "text-content-muted"}`}>
                <TabIcon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            )
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6" style={{ WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" }}>
          {/* PROFILE TAB */}
          {settingsTab === "profile" && (
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
                        {profileForm.activity === level.value && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        )}
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
              {/* TDEE preview */}
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
          )}

          {/* GOALS TAB */}
          {settingsTab === "goals" && (
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
          )}

          {/* MY FOODS TAB */}
          {settingsTab === "foods" && (
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
                          className={`p-1.5 rounded-lg transition-colors ${isFavorite(food.id) ? "text-yellow-400" : "text-content-faint hover:text-yellow-400"}`}>
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
          )}
        </div>

        {/* Sticky footer buttons — always visible above keyboard */}
        {settingsTab === "profile" && (
          <div className="flex-shrink-0 p-4 border-t border-border bg-surface-card" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1.5rem)" }}>
            <button onClick={() => { calculateFromProfile(); setSettingsTab("goals") }}
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
