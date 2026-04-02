import { useTranslation } from "react-i18next"
import { Plus, Minus, X } from "lucide-react"

const EditQuantityModal = ({ editingFood, setEditingFood, editQuantity, setEditQuantity, handleEditFood, removeFood }) => {
  const { t } = useTranslation()
  if (!editingFood) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-card rounded-xl p-4 md:p-6 w-full max-w-xs">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-content-primary">{t("nutrition.editQuantity.title")}</h3>
          <button onClick={() => setEditingFood(null)} className="text-content-muted hover:text-content-primary"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-sm text-content-secondary mb-3">{editingFood.food.name}</p>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setEditQuantity(String(Math.max(0.5, Number(editQuantity) - 0.5)))}
            className="w-10 h-10 rounded-xl bg-surface-button hover:bg-surface-button-hover flex items-center justify-center transition-colors text-content-primary"><Minus className="w-4 h-4" /></button>
          <input type="number" inputMode="decimal" value={editQuantity} onChange={(e) => setEditQuantity(e.target.value)} min="0.5" step="0.5"
            className="flex-1 bg-surface-dark rounded-xl px-4 py-2.5 text-center text-lg font-semibold text-content-primary border border-transparent focus:border-primary outline-none" />
          <button onClick={() => setEditQuantity(String(Number(editQuantity) + 0.5))}
            className="w-10 h-10 rounded-xl bg-surface-button hover:bg-surface-button-hover flex items-center justify-center transition-colors text-content-primary"><Plus className="w-4 h-4" /></button>
        </div>
        <p className="text-xs text-content-faint text-center mb-4">= {Math.round(editingFood.food.calories * Number(editQuantity))} kcal</p>
        <div className="flex gap-3">
          <button onClick={() => { removeFood(editingFood.mealType, editingFood.food.id); setEditingFood(null) }}
            className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm transition-colors">{t("common.delete")}</button>
          <button onClick={handleEditFood}
            className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-medium transition-colors">{t("common.save")}</button>
        </div>
      </div>
    </div>
  )
}

export default EditQuantityModal
