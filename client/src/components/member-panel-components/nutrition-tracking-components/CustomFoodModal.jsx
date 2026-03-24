import { useTranslation } from "react-i18next"
import { X } from "lucide-react"
import { UnitSelect } from "./nutritionConstants"

const CustomFoodModal = ({ show, onClose, editingCustomId, customForm, setCustomForm, handleSaveCustomFood }) => {
  const { t } = useTranslation()
  if (!show) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-card rounded-xl p-4 md:p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-content-primary">{editingCustomId ? t("nutrition.customFood.editTitle") : t("nutrition.customFood.createTitle")}</h3>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-content-muted mb-1 block">{t("nutrition.customFood.foodName")} <span className="text-red-400">*</span></label>
            <input type="text" value={customForm.name} onChange={(e) => setCustomForm((p) => ({ ...p, name: e.target.value }))} placeholder={t("nutrition.placeholders.foodName")}
              className="w-full bg-surface-dark rounded-xl px-4 py-2.5 text-sm text-content-primary placeholder-content-faint border border-transparent focus:border-primary outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-content-muted mb-1 block">{t("nutrition.customFood.servingSize")}</label>
              <input type="text" value={customForm.servingSize} onChange={(e) => setCustomForm((p) => ({ ...p, servingSize: e.target.value }))} placeholder="100"
                className="w-full bg-surface-dark rounded-xl px-4 py-2.5 text-sm text-content-primary placeholder-content-faint border border-transparent focus:border-primary outline-none" />
            </div>
            <div>
              <label className="text-xs text-content-muted mb-1 block">{t("nutrition.customFood.unit")}</label>
              <UnitSelect value={customForm.servingUnit} onChange={(v) => setCustomForm((p) => ({ ...p, servingUnit: v }))} />
            </div>
          </div>
          <div>
            <label className="text-xs text-content-muted mb-1 block">{t("nutrition.customFood.caloriesKcal")} <span className="text-red-400">*</span></label>
            <input type="number" value={customForm.calories} onChange={(e) => setCustomForm((p) => ({ ...p, calories: e.target.value }))} placeholder="0"
              className="w-full bg-surface-dark rounded-xl px-4 py-2.5 text-sm text-content-primary placeholder-content-faint border border-transparent focus:border-primary outline-none" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[{ key: "protein", label: t("nutrition.macros.protein") }, { key: "carbs", label: t("nutrition.macros.carbs") }, { key: "fats", label: t("nutrition.macros.fat") }].map((f) => (
              <div key={f.key}>
                <label className="text-[10px] text-content-faint mb-1 block">{f.label} (g)</label>
                <input type="number" value={customForm[f.key]} onChange={(e) => setCustomForm((p) => ({ ...p, [f.key]: e.target.value }))} placeholder="0"
                  className="w-full bg-surface-dark rounded-xl px-3 py-2 text-sm text-content-primary placeholder-content-faint border border-transparent focus:border-primary outline-none text-center" />
              </div>
            ))}
          </div>
        </div>
        <button onClick={handleSaveCustomFood} disabled={!customForm.name || !customForm.calories}
          className="w-full mt-4 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-xl py-2.5 text-sm font-medium transition-colors">{editingCustomId ? t("nutrition.customFood.saveChanges") : t("nutrition.customFood.saveCustomFood")}</button>
      </div>
    </div>
  )
}

export default CustomFoodModal
