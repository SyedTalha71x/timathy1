import { X, Zap } from "lucide-react"
import { mealLabels } from "./nutritionConstants"

const QuickAddModal = ({ show, onClose, quickAddMeal, setQuickAddMeal, quickForm, setQuickForm, handleQuickAdd }) => {
  if (!show) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-card rounded-xl p-4 md:p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-content-primary flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Quick Add</h3>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-xs text-content-muted mb-4">Add calories quickly — perfect for restaurant meals or estimates.</p>
        <div className="flex gap-1 mb-4 bg-surface-button rounded-xl p-1">
          {["breakfast", "lunch", "dinner", "snacks"].map((m) => (
            <button key={m} onClick={() => setQuickAddMeal(m)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${quickAddMeal === m ? "bg-surface-hover text-content-primary shadow-sm" : "text-content-muted"}`}>{m}</button>
          ))}
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-content-muted mb-1 block">Name (optional)</label>
            <input type="text" value={quickForm.name} onChange={(e) => setQuickForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Restaurant dinner"
              className="w-full bg-surface-dark rounded-xl px-4 py-2.5 text-sm text-content-primary placeholder-content-faint border border-transparent focus:border-primary outline-none" />
          </div>
          <div>
            <label className="text-xs text-content-muted mb-1 block">Calories (kcal) <span className="text-red-400">*</span></label>
            <input type="number" value={quickForm.calories} onChange={(e) => setQuickForm((p) => ({ ...p, calories: e.target.value }))} placeholder="e.g. 500"
              className="w-full bg-surface-dark rounded-xl px-4 py-2.5 text-sm text-content-primary placeholder-content-faint border border-transparent focus:border-primary outline-none" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[{ key: "protein", label: "Protein" }, { key: "carbs", label: "Carbs" }, { key: "fats", label: "Fat" }].map((f) => (
              <div key={f.key}>
                <label className="text-[10px] text-content-faint mb-1 block">{f.label} (g)</label>
                <input type="number" value={quickForm[f.key]} onChange={(e) => setQuickForm((p) => ({ ...p, [f.key]: e.target.value }))} placeholder="0"
                  className="w-full bg-surface-dark rounded-xl px-3 py-2 text-sm text-content-primary placeholder-content-faint border border-transparent focus:border-primary outline-none text-center" />
              </div>
            ))}
          </div>
        </div>
        <button onClick={handleQuickAdd} disabled={!quickForm.calories}
          className="w-full mt-4 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-xl py-2.5 text-sm font-medium transition-colors">Add to {mealLabels[quickAddMeal]}</button>
      </div>
    </div>
  )
}

export default QuickAddModal
