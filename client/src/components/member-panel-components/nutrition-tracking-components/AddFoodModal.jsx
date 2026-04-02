import { useTranslation } from "react-i18next"
import { Plus, Search, X, Star, ScanBarcode } from "lucide-react"
import { SettingsCard, UnitSelect, mealLabels } from "./nutritionConstants"

const AddFoodModal = ({
  show, onClose, addFoodMeal, addFoodTab, setAddFoodTab,
  searchQuery, setSearchQuery, selectedFood, setSelectedFood,
  quantity, setQuantity, unit, setUnit, searchRef,
  filteredFoods, allFoods, favoriteFoods, foodData,
  toggleFavorite, isFavorite, handleAddFood,
  onOpenBarcode, onOpenCustomFood,
}) => {
  const { t } = useTranslation()
  if (!show) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 pt-[env(safe-area-inset-top,0px)]">
      <div className="bg-surface-card rounded-t-2xl sm:rounded-xl w-full sm:max-w-md max-h-[88dvh] sm:h-auto sm:max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <h3 className="text-base font-semibold text-content-primary">{t("nutrition.addFood.addTo", { meal: t(mealLabels[addFoodMeal]) })}</h3>
          <button onClick={onClose} className="p-1 text-content-muted hover:text-content-primary transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex border-b border-border flex-shrink-0">
          {[{ key: "search", label: t("common.search") }, { key: "favorites", label: t("nutrition.addFood.favorites") }, { key: "recent", label: t("nutrition.addFood.recent") }].map((tab) => (
            <button key={tab.key} onClick={() => { setAddFoodTab(tab.key); setSelectedFood(null); setSearchQuery("") }}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors ${addFoodTab === tab.key ? "text-primary border-b-2 border-primary" : "text-content-muted"}`}>
              {tab.label}
            </button>
          ))}
        </div>
        {addFoodTab === "search" && (
          <div className="p-4 border-b border-border flex-shrink-0 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-faint" />
              <input ref={searchRef} type="text" placeholder={t("nutrition.addFood.searchPlaceholder")} value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSelectedFood(null) }}
                className="w-full bg-surface-dark rounded-xl pl-10 pr-4 py-2.5 text-sm text-content-primary placeholder-content-faint border border-transparent focus:border-primary outline-none" />
            </div>
            <div className="flex gap-2">
              <button onClick={onOpenBarcode}
                className="flex-1 flex items-center justify-center gap-2 bg-surface-button hover:bg-surface-button-hover rounded-xl px-3 py-2 text-xs text-content-primary transition-colors">
                <ScanBarcode className="w-3.5 h-3.5" /> {t("nutrition.addFood.barcode")}
              </button>
              <button onClick={onOpenCustomFood}
                className="flex-1 flex items-center justify-center gap-2 bg-surface-button hover:bg-surface-button-hover rounded-xl px-3 py-2 text-xs text-content-primary transition-colors">
                <Plus className="w-3.5 h-3.5" /> {t("nutrition.addFood.createFood")}
              </button>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {selectedFood ? (
            <div className="p-4 space-y-4">
              <SettingsCard className="!p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-content-primary mb-1">{selectedFood.name}</h4>
                    <div className="flex gap-3 text-xs text-content-faint">
                      <span>{Math.round(selectedFood.calories || 0)} kcal</span>
                      <span>P: {Math.round(selectedFood.protein || 0)}g</span>
                      <span>C: {Math.round(selectedFood.carbs || 0)}g</span>
                      <span>F: {Math.round(selectedFood.fats || 0)}g</span>
                    </div>
                  </div>
                  <button onClick={() => toggleFavorite(selectedFood._id || selectedFood.id)}
                    className={`p-1.5 rounded-lg transition-colors ${isFavorite(selectedFood._id || selectedFood.id) ? "text-yellow-400" : "text-content-faint hover:text-yellow-400"}`}>
                    <Star className="w-4 h-4" fill={isFavorite(selectedFood._id || selectedFood.id) ? "currentColor" : "none"} />
                  </button>
                </div>
              </SettingsCard>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-content-muted mb-1 block">{t("nutrition.addFood.quantity")}</label>
                  <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="0.5" step="0.5"
                    className="w-full bg-surface-dark rounded-xl px-4 py-2.5 text-sm text-content-primary border border-transparent focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="text-xs text-content-muted mb-1 block">{t("nutrition.customFood.unit")}</label>
                  <UnitSelect value={unit} onChange={setUnit} />
                </div>
              </div>
              <button onClick={handleAddFood}
                className="w-full bg-primary hover:bg-primary-hover text-white rounded-xl py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> {t("nutrition.addFood.addTo", { meal: t(mealLabels[addFoodMeal]) })}
              </button>
            </div>
          ) : (
            <>
              {addFoodTab === "search" && (searchQuery ? (
                filteredFoods.length > 0 ? filteredFoods.slice(0, 15).map((food) => (
                  <button key={food._id || food.id} onClick={() => { setSelectedFood(food); setSearchQuery(""); setUnit(food.unit || "") }}
                    className="w-full text-left px-4 py-3 hover:bg-surface-hover transition-colors flex justify-between items-center border-b border-border/50">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {food.isCustom && <span className="text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded font-medium flex-shrink-0">{t("nutrition.addFood.custom")}</span>}
                      <span className="text-sm text-content-primary truncate">{food.name}</span>
                    </div>
                    <span className="text-xs text-content-faint ml-2 flex-shrink-0">{Math.round(food.calories || 0)} kcal</span>
                  </button>
                )) : <div className="p-8 text-center text-content-muted text-sm">{t("nutrition.addFood.noFoods")}</div>
              ) : (
                <div className="p-4">
                  <p className="text-xs font-medium text-content-muted uppercase tracking-wider mb-3">{t("nutrition.addFood.suggestions")}</p>
                  {allFoods.slice(0, 8).map((food) => (
                    <button key={food._id || food.id} onClick={() => { setSelectedFood(food); setUnit(food.unit || "") }}
                      className="w-full text-left px-3 py-2.5 hover:bg-surface-hover rounded-lg transition-colors flex justify-between items-center">
                      <span className="text-sm text-content-primary truncate">{food.name}</span>
                      <span className="text-xs text-content-faint">{Math.round(food.calories || 0)} kcal</span>
                    </button>
                  ))}
                </div>
              ))}
              {addFoodTab === "favorites" && (
                <div className="p-4">
                  {favoriteFoods.length > 0 ? favoriteFoods.map((food) => (
                    <button key={food._id || food.id} onClick={() => { setSelectedFood(food); setUnit(food.unit || "") }}
                      className="w-full text-left px-3 py-2.5 hover:bg-surface-hover rounded-lg transition-colors flex justify-between items-center">
                      <div className="flex items-center gap-2"><Star className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" /><span className="text-sm text-content-primary">{food.name}</span></div>
                      <span className="text-xs text-content-faint">{Math.round(food.calories || 0)} kcal</span>
                    </button>
                  )) : (
                    <div className="text-center py-10 text-content-muted">
                      <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">{t("nutrition.addFood.noFavorites")}</p>
                      <p className="text-xs mt-1">{t("nutrition.addFood.starHint")}</p>
                    </div>
                  )}
                </div>
              )}
              {addFoodTab === "recent" && (
                <div className="p-4">
                  {(foodData || []).slice(0, 10).map((food) => (
                    <button key={food._id} onClick={() => { setSelectedFood(food); setUnit(food.unit || ""); setAddFoodTab("search") }}
                      className="w-full text-left px-3 py-2.5 hover:bg-surface-hover rounded-lg transition-colors flex justify-between items-center">
                      <span className="text-sm text-content-primary">{food.name}</span>
                      <span className="text-xs text-content-faint">{Math.round(food.calories || 0)} kcal</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddFoodModal
