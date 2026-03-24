import { ChevronDown, Coffee, Sun, Moon, Cookie } from "lucide-react"
import { useTranslation } from "react-i18next"

// ============================================
// Constants
// ============================================
export const UNIT_OPTIONS = [
  { value: "g", labelKey: "nutrition.units.gram" },
  { value: "ml", labelKey: "nutrition.units.milliliter" },
  { value: "oz", labelKey: "nutrition.units.ounce" },
  { value: "cup", labelKey: "nutrition.units.cup" },
  { value: "tbsp", labelKey: "nutrition.units.tablespoon" },
  { value: "tsp", labelKey: "nutrition.units.teaspoon" },
  { value: "piece", labelKey: "nutrition.units.piece" },
  { value: "slice", labelKey: "nutrition.units.slice" },
  { value: "portion", labelKey: "nutrition.units.portion" },
  { value: "bowl", labelKey: "nutrition.units.bowl" },
  { value: "scoop", labelKey: "nutrition.units.scoop" },
]

export const ACTIVITY_LEVELS = [
  { value: "sedentary", labelKey: "nutrition.activity.sedentary", descKey: "nutrition.activity.sedentaryDesc", factor: 1.2 },
  { value: "light", labelKey: "nutrition.activity.light", descKey: "nutrition.activity.lightDesc", factor: 1.375 },
  { value: "moderate", labelKey: "nutrition.activity.moderate", descKey: "nutrition.activity.moderateDesc", factor: 1.55 },
  { value: "active", labelKey: "nutrition.activity.active", descKey: "nutrition.activity.activeDesc", factor: 1.725 },
  { value: "very_active", labelKey: "nutrition.activity.veryActive", descKey: "nutrition.activity.veryActiveDesc", factor: 1.9 },
]

export const GOAL_TYPES = [
  { value: "lose", labelKey: "nutrition.goalTypes.loseWeight", offset: -500 },
  { value: "maintain", labelKey: "nutrition.goalTypes.maintainWeight", offset: 0 },
  { value: "gain", labelKey: "nutrition.goalTypes.buildMuscle", offset: 300 },
]

export const mealIcons = { breakfast: Coffee, lunch: Sun, dinner: Moon, snacks: Cookie }
export const mealLabels = { breakfast: "nutrition.meals.breakfast", lunch: "nutrition.meals.lunch", dinner: "nutrition.meals.dinner", snacks: "nutrition.meals.snacks" }

// ============================================
// Calculation Helpers
// ============================================
export const calcBMR = (weight, height, age, gender) => {
  if (!weight || !height || !age) return 0
  const w = Number(weight), h = Number(height), a = Number(age)
  return gender === "female" ? (10 * w) + (6.25 * h) - (5 * a) - 161 : (10 * w) + (6.25 * h) - (5 * a) + 5
}

export const calcTDEE = (bmr, activity) => {
  const level = ACTIVITY_LEVELS.find((a) => a.value === activity)
  return Math.round(bmr * (level?.factor || 1.2))
}

export const calcMacros = (calories) => ({
  protein: Math.round((calories * 0.30) / 4),
  carbs: Math.round((calories * 0.45) / 4),
  fats: Math.round((calories * 0.25) / 9),
})

const WATER_ACTIVITY_MULT = { sedentary: 0.9, light: 1.0, moderate: 1.1, active: 1.25, very_active: 1.4 }
export const calcWaterMl = (weight, activity) => {
  if (!weight) return 2500
  return Math.round(Number(weight) * 35 * (WATER_ACTIVITY_MULT[activity] || 1.0))
}

// ============================================
// Reusable Components
// ============================================
export const SettingsCard = ({ children, className = "" }) => (
  <div className={`bg-surface-hover rounded-xl p-4 sm:p-5 ${className}`}>{children}</div>
)

export const UnitSelect = ({ value, onChange, className = "" }) => {
  const { t } = useTranslation()
  return (
  <div className="relative">
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className={`w-full appearance-none bg-surface-dark rounded-xl px-4 py-2.5 pr-9 text-sm text-content-primary border border-transparent focus:border-primary outline-none ${className}`}>
      <option value="">{t("nutrition.units.selectUnit")}</option>
      {UNIT_OPTIONS.map((u) => <option key={u.value} value={u.value}>{t(u.labelKey)}</option>)}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-faint pointer-events-none" />
  </div>
)}

export const micronutrientData = [
  { name: "Vitamin A", current: 650, goal: 900, unit: "mcg", type: "vitamin", critical: false },
  { name: "Vitamin C", current: 45, goal: 90, unit: "mg", type: "vitamin", critical: true },
  { name: "Vitamin D", current: 8, goal: 20, unit: "mcg", type: "vitamin", critical: true },
  { name: "Iron", current: 12, goal: 18, unit: "mg", type: "mineral", critical: true },
  { name: "Calcium", current: 800, goal: 1000, unit: "mg", type: "mineral", critical: false },
  { name: "Potassium", current: 2100, goal: 3400, unit: "mg", type: "mineral", critical: true },
  { name: "Vitamin B12", current: 2.0, goal: 2.4, unit: "mcg", type: "vitamin", critical: false },
  { name: "Zinc", current: 8, goal: 11, unit: "mg", type: "mineral", critical: false },
]
