import { useTranslation } from "react-i18next"
import { X, Zap } from "lucide-react"
import { mealLabels } from "./nutritionConstants"

const QuickAddModal = ({ show, onClose, quickAddMeal, setQuickAddMeal, quickForm, setQuickForm, handleQuickAdd }) => {
  const { t } = useTranslation()
  if (!show) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-surface-card rounded-t-2xl sm:rounded-xl w-full sm:max-w-sm max-h-[90dvh] sm:max-h-[85vh] flex flex-col">
        <div className="flex justify-between items-center p-4 md:p-6 pb-0 md:pb-0 flex-shrink-0">
          <h3 className="text-base font-semibold text-content-primary flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> {t("nutrition.diary.quickAdd")}</h3>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pt-3 md:pt-3">
          <p className="text-xs text-content-muted mb-4">{t("nutrition.quickAdd.description")}</p>
          <div className="flex gap-1 mb-4 bg-surface-button rounded-xl p-1">
            {["breakfast", "lunch", "dinner", "snacks"].map((m) => (
              <button key={m} onClick={() => setQuickAddMeal(m)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${quickAddMeal === m ? "bg-surface-hover text-content-primary shadow-sm" : "text-content-muted"}`}>{t(mealLabels[m])}</button>
            ))}
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-content-muted mb-1 block">{t("nutrition.quickAdd.nameOptional")}</label>
              <input type="text" value={quickForm.name} onChange={(e) => setQuickForm((p) => ({ ...p, name: e.target.value }))} placeholder={t("nutrition.placeholders.quickAddName")}
                className="w-full bg-surface-dark rounded-xl px-4 py-2.5 text-sm text-content-primary placeholder-content-faint border border-transparent focus:border-primary outline-none" />
            </div>
            <div>
              <label className="text-xs text-content-muted mb-1 block">{t("nutrition.customFood.caloriesKcal")} <span className="text-red-400">*</span></label>
              <input type="number" inputMode="decimal" value={quickForm.calories} onChange={(e) => setQuickForm((p) => ({ ...p, calories: e.target.value }))} placeholder={t("nutrition.placeholders.calories")}
                className="w-full bg-surface-dark rounded-xl px-4 py-2.5 text-sm text-content-primary placeholder-content-faint border border-transparent focus:border-primary outline-none" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[{ key: "protein", label: t("nutrition.macros.protein") }, { key: "carbs", label: t("nutrition.macros.carbs") }, { key: "fats", label: t("nutrition.macros.fat") }].map((f) => (
                <div key={f.key}>
                  <label className="text-[10px] text-content-faint mb-1 block">{f.label} (g)</label>
                  <input type="number" inputMode="decimal" value={quickForm[f.key]} onChange={(e) => setQuickForm((p) => ({ ...p, [f.key]: e.target.value }))} placeholder="0"
                    className="w-full bg-surface-dark rounded-xl px-3 py-2 text-sm text-content-primary placeholder-content-faint border border-transparent focus:border-primary outline-none text-center" />
                </div>
              ))}
            </div>
          </div>
          <button onClick={handleQuickAdd} disabled={!quickForm.calories}
            className="w-full mt-4 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-xl py-2.5 text-sm font-medium transition-colors">{t("nutrition.quickAdd.addTo", { meal: t(mealLabels[quickAddMeal]) })}</button>
        </div>
      </div>
    </div>
  )
}

export default QuickAddModal
