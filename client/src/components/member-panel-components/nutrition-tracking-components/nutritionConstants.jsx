import { ChevronDown, Coffee, Sun, Moon, Cookie } from "lucide-react"

// ============================================
// Constants
// ============================================
export const UNIT_OPTIONS = [
  { value: "g", label: "Gram (g)" },
  { value: "ml", label: "Milliliter (ml)" },
  { value: "oz", label: "Ounce (oz)" },
  { value: "cup", label: "Cup" },
  { value: "tbsp", label: "Tablespoon" },
  { value: "tsp", label: "Teaspoon" },
  { value: "piece", label: "Piece" },
  { value: "slice", label: "Slice" },
  { value: "portion", label: "Portion" },
  { value: "bowl", label: "Bowl" },
  { value: "scoop", label: "Scoop" },
]

export const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "Sedentary", desc: "Office job, no exercise", factor: 1.2 },
  { value: "light", label: "Lightly Active", desc: "Light exercise 1-3 days/week", factor: 1.375 },
  { value: "moderate", label: "Moderately Active", desc: "Moderate exercise 3-5 days/week", factor: 1.55 },
  { value: "active", label: "Active", desc: "Hard exercise 6-7 days/week", factor: 1.725 },
  { value: "very_active", label: "Very Active", desc: "Physical job + exercise", factor: 1.9 },
]

export const GOAL_TYPES = [
  { value: "lose", label: "Lose Weight", offset: -500 },
  { value: "maintain", label: "Maintain Weight", offset: 0 },
  { value: "gain", label: "Build Muscle", offset: 300 },
]

export const mealIcons = { breakfast: Coffee, lunch: Sun, dinner: Moon, snacks: Cookie }
export const mealLabels = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snacks: "Snacks" }

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

export const UnitSelect = ({ value, onChange, className = "" }) => (
  <div className="relative">
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className={`w-full appearance-none bg-surface-dark rounded-xl px-4 py-2.5 pr-9 text-sm text-content-primary border border-transparent focus:border-primary outline-none ${className}`}>
      <option value="">Select unit</option>
      {UNIT_OPTIONS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-faint pointer-events-none" />
  </div>
)

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
