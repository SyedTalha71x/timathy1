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
  if (!show) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-surface-card rounded-t-2xl sm:rounded-xl w-full sm:max-w-lg max-h-[90dvh] sm:max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <h3 className="text-base font-semibold text-content-primary">Settings</h3>
          <button onClick={onClose} className="p-1 text-content-muted hover:text-content-primary"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex border-b border-border flex-shrink-0" style={{ touchAction: "manipulation" }}>
          {[{ key: "profile", label: "Profile", icon: User }, { key: "goals", label: "Goals", icon: Target }, { key: "foods", label: "My Foods", icon: ListPlus }].map((t) => {
            const TabIcon = t.icon
            return (
              <button key={t.key} onClick={() => setSettingsTab(t.key)}
                className={`flex-1 py-3 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${settingsTab === t.key ? "text-primary border-b-2 border-primary" : "text-content-muted"}`}>
                <TabIcon className="w-3.5 h-3.5" /> {t.label}
              </button>
            )
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6" style={{ WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" }}>
          {/* PROFILE TAB */}
          {settingsTab === "profile" && (
            <div className="space-y-4">
              <p className="text-xs text-content-muted">Your body metrics help us calculate accurate daily targets using the Mifflin-St Jeor formula.</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-content-muted mb-1 block">Gender</label>
                  <div className="relative">
                    <select value={profileForm.gender} onChange={(e) => setProfileForm((p) => ({ ...p, gender: e.target.value }))}
                      className="w-full appearance-none bg-surface-dark rounded-xl px-4 py-2.5 pr-9 text-sm text-content-primary border border-transparent focus:border-primary outline-none">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-faint pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-content-muted mb-1 block">Age</label>
                  <input type="number" value={profileForm.age} onChange={(e) => setProfileForm((p) => ({ ...p, age: e.target.value }))} placeholder="30"
                    className="w-full bg-surface-dark rounded-xl px-4 py-2.5 text-sm text-content-primary border border-transparent focus:border-primary outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-content-muted mb-1 block">Height (cm)</label>
                  <input type="number" value={profileForm.height} onChange={(e) => setProfileForm((p) => ({ ...p, height: e.target.value }))} placeholder="175"
                    className="w-full bg-surface-dark rounded-xl px-4 py-2.5 text-sm text-content-primary border border-transparent focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="text-xs text-content-muted mb-1 block">Weight (kg)</label>
                  <input type="number" value={profileForm.weight} onChange={(e) => setProfileForm((p) => ({ ...p, weight: e.target.value }))} placeholder="75"
                    className="w-full bg-surface-dark rounded-xl px-4 py-2.5 text-sm text-content-primary border border-transparent focus:border-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-content-muted mb-2 block">Activity Level</label>
                <div className="space-y-1.5">
                  {ACTIVITY_LEVELS.map((level) => (
                    <button key={level.value} onClick={() => setProfileForm((p) => ({ ...p, activity: level.value }))}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl border transition-colors ${profileForm.activity === level.value ? "border-primary bg-primary/5" : "border-transparent bg-surface-dark hover:bg-surface-button"}`}>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-content-primary">{level.label}</p>
                        {profileForm.activity === level.value && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-content-faint leading-tight mt-0.5">{level.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-content-muted mb-2 block">Goal</label>
                <div className="flex gap-2">
                  {GOAL_TYPES.map((g) => (
                    <button key={g.value} onClick={() => setProfileForm((p) => ({ ...p, goalType: g.value }))}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-colors ${profileForm.goalType === g.value ? "bg-primary text-white" : "bg-surface-dark text-content-muted hover:text-content-primary"}`}>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* TDEE preview */}
              {profileForm.weight && profileForm.height && profileForm.age && (
                <SettingsCard className="!p-4 !bg-primary/5 border border-primary/20">
                  <p className="text-xs text-content-muted mb-2">Calculated Daily Targets</p>
                  <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center">
                    {(() => {
                      const bmr = calcBMR(profileForm.weight, profileForm.height, profileForm.age, profileForm.gender)
                      const tdee = calcTDEE(bmr, profileForm.activity)
                      const offset = GOAL_TYPES.find((g) => g.value === profileForm.goalType)?.offset || 0
                      const cal = Math.max(1200, tdee + offset)
                      const m = calcMacros(cal)
                      const wMl = calcWaterMl(profileForm.weight, profileForm.activity)
                      return [
                        { label: "Calories", val: cal },
                        { label: "Protein", val: m.protein },
                        { label: "Carbs", val: m.carbs },
                        { label: "Fat", val: m.fats },
                        { label: "Water", val: `${(wMl / 1000).toFixed(1)}L` },
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
              <p className="text-xs text-content-muted">Fine-tune your daily targets manually or use your profile calculation.</p>
              {[{ key: "calories", label: "Calories (kcal)" }, { key: "protein", label: "Protein (g)" }, { key: "carbs", label: "Carbohydrates (g)" }, { key: "fats", label: "Fat (g)" }, { key: "waterMl", label: "Water (ml)" }].map((field) => (
                <div key={field.key}>
                  <label className="text-sm text-content-secondary block mb-2">{field.label}</label>
                  <input type="number" value={goalForm[field.key]} onChange={(e) => setGoalForm((p) => ({ ...p, [field.key]: e.target.value }))}
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
                <p className="text-xs text-content-muted">{customFoods.length} custom food{customFoods.length !== 1 ? "s" : ""} created</p>
                <button onClick={() => { setShowSettings(false); openCustomFood("settings") }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-medium transition-colors">
                  <Plus className="w-3.5 h-3.5" /> New Food
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
                  <p className="text-sm">No custom foods yet</p>
                  <p className="text-xs mt-1">Create your own foods with custom nutrition values</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sticky footer buttons — always visible above keyboard */}
        {settingsTab === "profile" && (
          <div className="flex-shrink-0 p-4 border-t border-border bg-surface-card" style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 1rem)" }}>
            <button onClick={() => { calculateFromProfile(); setSettingsTab("goals") }}
              className="w-full bg-primary hover:bg-primary-hover text-white rounded-xl py-2.5 text-sm font-medium transition-colors">
              Apply & Set Goals
            </button>
          </div>
        )}
        {settingsTab === "goals" && (
          <div className="flex-shrink-0 p-4 border-t border-border bg-surface-card" style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 1rem)" }}>
            <div className="flex gap-3">
              <button onClick={() => setGoalForm({ calories: 2000, protein: 150, carbs: 250, fats: 70, waterMl: 2500 })}
                className="flex-1 px-4 py-2.5 bg-surface-button hover:bg-surface-button-hover rounded-xl text-content-primary text-sm transition-colors">Reset</button>
              <button onClick={handleSaveSettings}
                className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-hover rounded-xl text-white text-sm font-medium transition-colors">Save Goals</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SettingsModal
