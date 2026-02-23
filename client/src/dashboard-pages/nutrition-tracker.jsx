import { useState, useEffect, useRef, useMemo } from "react"
import {
  Plus, Minus, Search, X, ChevronLeft, ChevronRight, Settings,
  Droplets, Coffee, Sun, Moon, Cookie, Trash2, ScanBarcode, TrendingUp,
  Target, AlertCircle, CheckCircle, Star, Copy, Zap, Pencil, Flame,
  ChevronDown, User, ListPlus, BookOpen
} from "lucide-react"
import DatePickerField from "../../components/shared/DatePickerField"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, ReferenceLine
} from "recharts"
import { useDispatch, useSelector } from "react-redux"
import { fetchFood, newFood } from "../../features/food/foodSlice"
import { fetchDailySummery } from "../../features/dailysummery/dailySummerySlice"
import { createGoals } from "../../features/userGoals/userGoalSlice"
import { barcodeScanner } from "../../features/barcodeScanner/barCodeSlice"
import BarcodeScannerComponent from "react-qr-barcode-scanner"

// ============================================
// Constants & Helpers
// ============================================
const UNIT_OPTIONS = [
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

const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "Sedentary", desc: "Office job, no exercise", factor: 1.2 },
  { value: "light", label: "Lightly Active", desc: "Light exercise 1-3 days/week", factor: 1.375 },
  { value: "moderate", label: "Moderately Active", desc: "Moderate exercise 3-5 days/week", factor: 1.55 },
  { value: "active", label: "Active", desc: "Hard exercise 6-7 days/week", factor: 1.725 },
  { value: "very_active", label: "Very Active", desc: "Physical job + exercise", factor: 1.9 },
]

const GOAL_TYPES = [
  { value: "lose", label: "Lose Weight", offset: -500 },
  { value: "maintain", label: "Maintain Weight", offset: 0 },
  { value: "gain", label: "Build Muscle", offset: 300 },
]

// Mifflin-St Jeor
const calcBMR = (weight, height, age, gender) => {
  if (!weight || !height || !age) return 0
  const w = Number(weight), h = Number(height), a = Number(age)
  return gender === "female" ? (10 * w) + (6.25 * h) - (5 * a) - 161 : (10 * w) + (6.25 * h) - (5 * a) + 5
}

const calcTDEE = (bmr, activity) => {
  const level = ACTIVITY_LEVELS.find((a) => a.value === activity)
  return Math.round(bmr * (level?.factor || 1.2))
}

const calcMacros = (calories) => ({
  protein: Math.round((calories * 0.30) / 4),
  carbs: Math.round((calories * 0.45) / 4),
  fats: Math.round((calories * 0.25) / 9),
})

// Water: ~35ml/kg base, adjusted by activity
const WATER_ACTIVITY_MULT = { sedentary: 0.9, light: 1.0, moderate: 1.1, active: 1.25, very_active: 1.4 }
const calcWaterMl = (weight, activity) => {
  if (!weight) return 2500
  return Math.round(Number(weight) * 35 * (WATER_ACTIVITY_MULT[activity] || 1.0))
}

// ============================================
// Reusable Components
// ============================================
const SettingsCard = ({ children, className = "" }) => (
  <div className={`bg-surface-hover rounded-xl p-4 sm:p-5 ${className}`}>{children}</div>
)

const UnitSelect = ({ value, onChange, className = "" }) => (
  <div className="relative">
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className={`w-full appearance-none bg-surface-dark rounded-xl px-4 py-2.5 pr-9 text-sm text-content-primary border border-transparent focus:border-primary outline-none ${className}`}>
      <option value="">Select unit</option>
      {UNIT_OPTIONS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-faint pointer-events-none" />
  </div>
)

const CalorieRing = ({ consumed, goal, size = 160, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(consumed / Math.max(goal, 1), 1.2)
  const offset = circumference - pct * circumference
  const remaining = goal - consumed
  const isOver = remaining < 0
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-surface-button" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} strokeLinecap="round"
          stroke={isOver ? "var(--color-accent-red, #ef4444)" : "var(--color-primary, #f97316)"}
          strokeDasharray={circumference} strokeDashoffset={Math.max(offset, 0)}
          className="transition-all duration-700 ease-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-content-primary">{Math.abs(remaining)}</span>
        <span className="text-xs text-content-muted">{isOver ? "over" : "remaining"}</span>
      </div>
    </div>
  )
}

const MacroBar = ({ label, current, goal, color }) => {
  const pct = Math.min((current / Math.max(goal, 1)) * 100, 100)
  return (
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-xs font-medium text-content-secondary">{label}</span>
        <span className="text-xs text-content-faint">{Math.round(current)}/{goal}g</span>
      </div>
      <div className="h-2 bg-surface-button rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

const mealIcons = { breakfast: Coffee, lunch: Sun, dinner: Moon, snacks: Cookie }
const mealLabels = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snacks: "Snacks" }

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-card border border-border rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="text-content-muted mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill }} className="font-medium">
          {p.name}: {Math.round(p.value)}{p.name === "Calories" || p.name === "Actual" || p.name === "Target" ? " kcal" : "g"}
        </p>
      ))}
    </div>
  )
}

const micronutrientData = [
  { name: "Vitamin A", current: 750, goal: 900, unit: "mcg", type: "vitamin" },
  { name: "Vitamin C", current: 80, goal: 90, unit: "mg", type: "vitamin" },
  { name: "Vitamin D", current: 12, goal: 20, unit: "mcg", type: "vitamin", critical: true },
  { name: "Vitamin B12", current: 2.1, goal: 2.4, unit: "mcg", type: "vitamin" },
  { name: "Iron", current: 14, goal: 18, unit: "mg", type: "mineral", critical: true },
  { name: "Calcium", current: 850, goal: 1000, unit: "mg", type: "mineral" },
  { name: "Magnesium", current: 310, goal: 400, unit: "mg", type: "mineral", critical: true },
  { name: "Zinc", current: 9, goal: 11, unit: "mg", type: "mineral" },
  { name: "Potassium", current: 2800, goal: 3500, unit: "mg", type: "mineral" },
  { name: "Folate", current: 320, goal: 400, unit: "mcg", type: "vitamin" },
]

// ============================================
// MAIN COMPONENT
// ============================================
const NutritionTracker = () => {
  const dispatch = useDispatch()
  const { foodData } = useSelector((state) => state.food)
  const { dailySummeryData } = useSelector((state) => state.dailySummery)
  const { scanning: barcodeLoading, foodData: barcodeFood, error: barcodeError } = useSelector((state) => state.barCode || {})

  const [activeView, setActiveView] = useState("diary")

  // Date
  const [selectedDate, setSelectedDate] = useState(new Date())
  const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
  const todayStr = new Date().toISOString().split("T")[0]
  const isToday = dateStr === todayStr

  // Meals
  const [meals, setMeals] = useState({})
  const [yesterdayMeals, setYesterdayMeals] = useState({})

  // Profile (persisted)
  const [profile, setProfile] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("nutrition_profile") || "null")
      return saved || { gender: "male", age: 30, height: 175, weight: 75, activity: "moderate", goalType: "maintain" }
    } catch { return { gender: "male", age: 30, height: 175, weight: 75, activity: "moderate", goalType: "maintain" } }
  })

  // Goals (derived from profile or manual)
  const [goals, setGoals] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("nutrition_goals") || "null")
      return saved || { calories: 2000, protein: 150, carbs: 250, fats: 70, waterMl: 2500 }
    } catch { return { calories: 2000, protein: 150, carbs: 250, fats: 70, waterMl: 2500 } }
  })

  // Settings modal
  const [showSettings, setShowSettings] = useState(false)
  const [settingsTab, setSettingsTab] = useState("profile") // profile | goals | foods
  const [profileForm, setProfileForm] = useState({ ...profile })
  const [goalForm, setGoalForm] = useState({ ...goals })

  // Add food
  const [showAddFood, setShowAddFood] = useState(false)
  const [addFoodMeal, setAddFoodMeal] = useState("breakfast")
  const [addFoodTab, setAddFoodTab] = useState("search")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFood, setSelectedFood] = useState(null)
  const [quantity, setQuantity] = useState("1")
  const [unit, setUnit] = useState("")

  // Quick-Add
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [quickAddMeal, setQuickAddMeal] = useState("breakfast")
  const [quickForm, setQuickForm] = useState({ name: "", calories: "", protein: "", carbs: "", fats: "" })

  // Custom food
  const [showCustomFood, setShowCustomFood] = useState(false)
  const [customForm, setCustomForm] = useState({ name: "", calories: "", protein: "", carbs: "", fats: "", servingSize: "", servingUnit: "g" })
  const [editingCustomId, setEditingCustomId] = useState(null) // null = create, id = edit
  const [customFoodReturnTo, setCustomFoodReturnTo] = useState(null) // "addFood" | "settings" | null

  // Edit food
  const [editingFood, setEditingFood] = useState(null)
  const [editQuantity, setEditQuantity] = useState("1")

  // Barcode scanner modal
  const [showBarcode, setShowBarcode] = useState(false)
  const [barcodeActive, setBarcodeActive] = useState(true)
  const lastScanned = useRef(null)

  // Favorites (persisted)
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("nutrition_favorites") || "[]") } catch { return [] }
  })

  // Custom foods (persisted)
  const [customFoods, setCustomFoods] = useState(() => {
    try { return JSON.parse(localStorage.getItem("nutrition_custom_foods") || "[]") } catch { return [] }
  })

  const [waterDrank, setWaterDrank] = useState(0) // in ml
  const waterGoalMl = Number(goals.waterMl) || 2500
  const waterMl = waterGoalMl
  const [nutrientFilter, setNutrientFilter] = useState("all")
  const [streak] = useState(7)

  const searchRef = useRef(null)
  const mealRefs = { breakfast: useRef(null), lunch: useRef(null), dinner: useRef(null), snacks: useRef(null) }
  const [isFabOpen, setIsFabOpen] = useState(false)

  const scrollToMeal = (mealType) => {
    setActiveView("diary")
    setTimeout(() => {
      mealRefs[mealType]?.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 100)
  }

  useEffect(() => { dispatch(fetchFood()); dispatch(fetchDailySummery()) }, [dispatch])

  // Persist
  useEffect(() => { try { localStorage.setItem("nutrition_favorites", JSON.stringify(favorites)) } catch {} }, [favorites])
  useEffect(() => { try { localStorage.setItem("nutrition_custom_foods", JSON.stringify(customFoods)) } catch {} }, [customFoods])
  useEffect(() => { try { localStorage.setItem("nutrition_profile", JSON.stringify(profile)) } catch {} }, [profile])
  useEffect(() => { try { localStorage.setItem("nutrition_goals", JSON.stringify(goals)) } catch {} }, [goals])

  // Close FAB on outside click
  useEffect(() => {
    if (!isFabOpen) return
    const close = () => setIsFabOpen(false)
    document.addEventListener("click", close)
    return () => document.removeEventListener("click", close)
  }, [isFabOpen])

  // Normalize API data
  useEffect(() => {
    if (dailySummeryData?.meals) {
      const normalized = {}
      Object.entries(dailySummeryData.meals).forEach(([type, items]) => {
        normalized[type] = items.map((item, idx) => ({
          id: idx + 1, name: item.food?.name || "Unknown",
          calories: Number(item.food?.calories || 0), protein: Number(item.food?.protein || 0),
          carbs: Number(item.food?.carbs || 0), fats: Number(item.food?.fats || 0),
          quantity: item.quantity || 1, unit: item.unit || "",
        }))
      })
      setMeals(normalized)
      setYesterdayMeals(normalized)
    }
  }, [dailySummeryData])

  // Totals
  const totals = Object.values(meals).flat().reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories * (item.quantity || 1),
      protein: acc.protein + item.protein * (item.quantity || 1),
      carbs: acc.carbs + item.carbs * (item.quantity || 1),
      fats: acc.fats + item.fats * (item.quantity || 1),
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 }
  )

  // Date nav
  const shiftDate = (days) => { const d = new Date(selectedDate); d.setDate(d.getDate() + days); setSelectedDate(d) }
  const handleDatePick = (str) => { if (!str) return; const [y, m, d] = str.split("-").map(Number); setSelectedDate(new Date(y, m - 1, d)) }
  const formatDate = (d) => {
    if (isToday) return "Today"
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1)
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday"
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  // All foods
  const allFoods = useMemo(() => [...(foodData || []), ...customFoods], [foodData, customFoods])
  const filteredFoods = allFoods.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
  const favoriteFoods = useMemo(() => allFoods.filter((f) => favorites.includes(f._id || f.id)), [allFoods, favorites])

  const toggleFavorite = (foodId) => setFavorites((prev) => prev.includes(foodId) ? prev.filter((id) => id !== foodId) : [...prev, foodId])
  const isFavorite = (foodId) => favorites.includes(foodId)

  // Add food
  const handleAddFood = () => {
    if (!selectedFood) return
    const foodId = selectedFood._id || selectedFood.id
    if (foodId && !selectedFood.isCustom) {
      dispatch(newFood({ date: selectedDate, mealType: addFoodMeal, foodId, quantity: Number(quantity), unit }))
        .unwrap().catch((err) => console.error(err))
    }
    setMeals((prev) => ({
      ...prev,
      [addFoodMeal]: [...(prev[addFoodMeal] || []), {
        id: Date.now(), name: selectedFood.name,
        calories: Number(selectedFood.calories || 0), protein: Number(selectedFood.protein || 0),
        carbs: Number(selectedFood.carbs || 0), fats: Number(selectedFood.fats || 0),
        quantity: Number(quantity), unit,
      }],
    }))
    const meal = addFoodMeal
    resetAddFood()
    scrollToMeal(meal)
  }

  const resetAddFood = () => { setShowAddFood(false); setSearchQuery(""); setSelectedFood(null); setQuantity("1"); setUnit(""); setAddFoodTab("search") }
  const openAddFood = (meal) => { setAddFoodMeal(meal); setShowAddFood(true); setTimeout(() => searchRef.current?.focus(), 100) }

  // Quick-Add
  const handleQuickAdd = () => {
    if (!quickForm.calories && !quickForm.name) return
    const meal = quickAddMeal
    setMeals((prev) => ({
      ...prev,
      [quickAddMeal]: [...(prev[quickAddMeal] || []), {
        id: Date.now(), name: quickForm.name || "Quick Entry",
        calories: Number(quickForm.calories || 0), protein: Number(quickForm.protein || 0),
        carbs: Number(quickForm.carbs || 0), fats: Number(quickForm.fats || 0), quantity: 1, unit: "",
      }],
    }))
    setShowQuickAdd(false)
    setQuickForm({ name: "", calories: "", protein: "", carbs: "", fats: "" })
    scrollToMeal(meal)
  }

  // Custom food
  const handleSaveCustomFood = () => {
    if (!customForm.name || !customForm.calories) return
    if (editingCustomId) {
      // Update existing
      setCustomFoods((prev) => prev.map((f) => f.id === editingCustomId ? {
        ...f, name: customForm.name, calories: Number(customForm.calories || 0),
        protein: Number(customForm.protein || 0), carbs: Number(customForm.carbs || 0),
        fats: Number(customForm.fats || 0), servingSize: customForm.servingSize, unit: customForm.servingUnit,
      } : f))
    } else {
      // Create new
      const newCustom = {
        id: `custom_${Date.now()}`, _id: `custom_${Date.now()}`, isCustom: true,
        name: customForm.name, calories: Number(customForm.calories || 0),
        protein: Number(customForm.protein || 0), carbs: Number(customForm.carbs || 0),
        fats: Number(customForm.fats || 0), servingSize: customForm.servingSize, unit: customForm.servingUnit,
      }
      setCustomFoods((prev) => [...prev, newCustom])
    }
    closeCustomFood()
  }

  const openCustomFood = (returnTo, food = null) => {
    if (food) {
      setEditingCustomId(food.id)
      setCustomForm({ name: food.name, calories: String(food.calories || ""), protein: String(food.protein || ""), carbs: String(food.carbs || ""), fats: String(food.fats || ""), servingSize: food.servingSize || "", servingUnit: food.unit || "g" })
    } else {
      setEditingCustomId(null)
      setCustomForm({ name: "", calories: "", protein: "", carbs: "", fats: "", servingSize: "", servingUnit: "g" })
    }
    setCustomFoodReturnTo(returnTo)
    setShowCustomFood(true)
  }

  const closeCustomFood = () => {
    setShowCustomFood(false)
    setEditingCustomId(null)
    setCustomForm({ name: "", calories: "", protein: "", carbs: "", fats: "", servingSize: "", servingUnit: "g" })
    // Return to previous modal
    if (customFoodReturnTo === "addFood") setShowAddFood(true)
    if (customFoodReturnTo === "settings") setShowSettings(true)
    setCustomFoodReturnTo(null)
  }

  const deleteCustomFood = (id) => {
    setCustomFoods((prev) => prev.filter((f) => f.id !== id))
    setFavorites((prev) => prev.filter((fId) => fId !== id))
  }

  // Edit food
  const openEditFood = (mealType, food) => { setEditingFood({ mealType, food }); setEditQuantity(String(food.quantity || 1)) }
  const handleEditFood = () => {
    if (!editingFood) return
    setMeals((prev) => ({
      ...prev,
      [editingFood.mealType]: (prev[editingFood.mealType] || []).map((f) =>
        f.id === editingFood.food.id ? { ...f, quantity: Number(editQuantity) || 1 } : f
      ),
    }))
    setEditingFood(null)
  }
  const removeFood = (mealType, foodId) => setMeals((prev) => ({ ...prev, [mealType]: (prev[mealType] || []).filter((f) => f.id !== foodId) }))

  // Copy meal
  const copyMealFromYesterday = (mealType) => {
    const items = yesterdayMeals[mealType]
    if (!items?.length) return
    setMeals((prev) => ({ ...prev, [mealType]: [...(prev[mealType] || []), ...items.map((f) => ({ ...f, id: Date.now() + Math.random() }))] }))
  }

  const mealCalories = (type) => (meals[type] || []).reduce((sum, f) => sum + f.calories * (f.quantity || 1), 0)

  // Settings: calculate from profile
  const calculateFromProfile = () => {
    const bmr = calcBMR(profileForm.weight, profileForm.height, profileForm.age, profileForm.gender)
    const tdee = calcTDEE(bmr, profileForm.activity)
    const goalOffset = GOAL_TYPES.find((g) => g.value === profileForm.goalType)?.offset || 0
    const targetCal = Math.max(1200, tdee + goalOffset)
    const macros = calcMacros(targetCal)
    setGoalForm({ calories: targetCal, protein: macros.protein, carbs: macros.carbs, fats: macros.fats, waterMl: calcWaterMl(profileForm.weight, profileForm.activity) })
  }

  const handleSaveSettings = () => {
    setProfile({ ...profileForm })
    setGoals({ ...goalForm })
    dispatch(createGoals(goalForm))
    setShowSettings(false)
  }

  // ============================================
  // INSIGHTS DATA — performance vs goals
  // ============================================

  // Today's performance scores (0-100%)
  const calScore = Math.min(Math.round((totals.calories / Math.max(Number(goals.calories), 1)) * 100), 150)
  const proteinScore = Math.min(Math.round((totals.protein / Math.max(Number(goals.protein), 1)) * 100), 150)
  const carbsScore = Math.min(Math.round((totals.carbs / Math.max(Number(goals.carbs), 1)) * 100), 150)
  const fatScore = Math.min(Math.round((totals.fats / Math.max(Number(goals.fats), 1)) * 100), 150)
  const waterScore = Math.min(Math.round((waterDrank / Math.max(waterGoalMl, 1)) * 100), 100)

  // Overall daily score (weighted: cals 40%, macros 40%, water 20%)
  const calAccuracy = 100 - Math.abs(calScore - 100)
  const macroAccuracy = Math.round((Math.min(proteinScore, 100) + Math.min(carbsScore, 100) + Math.min(fatScore, 100)) / 3)
  const dailyScore = Math.round(calAccuracy * 0.4 + macroAccuracy * 0.4 + waterScore * 0.2)

  const getScoreLabel = (s) => s >= 90 ? "Excellent" : s >= 70 ? "Good" : s >= 50 ? "Fair" : "Needs work"
  const getScoreColor = (s) => s >= 90 ? "text-green-400" : s >= 70 ? "text-blue-400" : s >= 50 ? "text-yellow-400" : "text-red-400"

  // Weekly data — today is dynamic, rest is demo (would come from API)
  const g = Number(goals.calories)
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const todayDayIndex = new Date().getDay() // 0=Sun
  const todayLabel = dayNames[todayDayIndex === 0 ? 6 : todayDayIndex - 1]
  const demoWeekCalories = { Mon: 1850, Tue: 2200, Wed: 1950, Thu: 2400, Fri: 1780, Sat: 2100, Sun: 2050 }
  const weeklyCalorieData = dayNames.map((day) => ({
    day,
    Calories: day === todayLabel ? Math.round(totals.calories) : demoWeekCalories[day],
    Goal: g,
  }))
  const weeklyAvg = Math.round(weeklyCalorieData.reduce((s, d) => s + d.Calories, 0) / 7)
  const weeklyDeficit = (g * 7) - weeklyCalorieData.reduce((s, d) => s + d.Calories, 0)

  // Days on target (within ±10% of goal)
  const daysOnTarget = weeklyCalorieData.filter((d) => Math.abs(d.Calories - g) <= g * 0.1).length

  const trendData = [
    { date: "Week 1", Actual: Math.round(g * 0.92), Target: g },
    { date: "Week 2", Actual: Math.round(g * 1.03), Target: g },
    { date: "Week 3", Actual: Math.round(g * 0.96), Target: g },
    { date: "This week", Actual: weeklyAvg, Target: g },
  ]

  const macroPieData = [
    { name: "Protein", value: Math.round(totals.protein) || 1, color: "#3b82f6" },
    { name: "Carbs", value: Math.round(totals.carbs) || 1, color: "var(--color-primary, #f97316)" },
    { name: "Fat", value: Math.round(totals.fats) || 1, color: "#eab308" },
  ]
  const macroTotal = macroPieData.reduce((s, d) => s + d.value, 0)

  const demoWeekMacros = {
    Mon: { p: 110, c: 180, f: 55 }, Tue: { p: 125, c: 210, f: 62 }, Wed: { p: 115, c: 195, f: 58 },
    Thu: { p: 130, c: 220, f: 65 }, Fri: { p: 120, c: 200, f: 60 }, Sat: { p: 135, c: 230, f: 70 }, Sun: { p: 125, c: 215, f: 63 },
  }
  const weeklyMacroData = dayNames.map((day) => ({
    day,
    Protein: day === todayLabel ? Math.round(totals.protein) : demoWeekMacros[day].p,
    Carbs: day === todayLabel ? Math.round(totals.carbs) : demoWeekMacros[day].c,
    Fat: day === todayLabel ? Math.round(totals.fats) : demoWeekMacros[day].f,
  }))

  const filteredNutrients = useMemo(() => {
    if (nutrientFilter === "vitamins") return micronutrientData.filter((n) => n.type === "vitamin")
    if (nutrientFilter === "minerals") return micronutrientData.filter((n) => n.type === "mineral")
    if (nutrientFilter === "critical") return micronutrientData.filter((n) => n.critical)
    return micronutrientData
  }, [nutrientFilter])

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="flex flex-col h-full bg-surface-base text-content-primary overflow-hidden rounded-3xl select-none">

      {/* ========== ADD FOOD MODAL ========== */}
      {showAddFood && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
          <div className="bg-surface-card rounded-t-2xl sm:rounded-xl w-full sm:max-w-md max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
              <h3 className="text-base font-semibold text-content-primary">Add to {mealLabels[addFoodMeal]}</h3>
              <button onClick={resetAddFood} className="p-1 text-content-muted hover:text-content-primary transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex border-b border-border flex-shrink-0">
              {[{ key: "search", label: "Search" }, { key: "favorites", label: "Favorites" }, { key: "recent", label: "Recent" }].map((t) => (
                <button key={t.key} onClick={() => { setAddFoodTab(t.key); setSelectedFood(null); setSearchQuery("") }}
                  className={`flex-1 py-2.5 text-xs font-medium transition-colors ${addFoodTab === t.key ? "text-primary border-b-2 border-primary" : "text-content-muted"}`}>
                  {t.label}
                </button>
              ))}
            </div>
            {addFoodTab === "search" && (
              <div className="p-4 border-b border-border flex-shrink-0 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-faint" />
                  <input ref={searchRef} type="text" placeholder="Search foods..." value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setSelectedFood(null) }}
                    className="w-full bg-surface-dark rounded-xl pl-10 pr-4 py-2.5 text-sm text-content-primary placeholder-content-faint border border-transparent focus:border-primary outline-none" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setShowAddFood(false); setShowBarcode(true); setBarcodeActive(true); lastScanned.current = null }}
                    className="flex-1 flex items-center justify-center gap-2 bg-surface-button hover:bg-surface-button-hover rounded-xl px-3 py-2 text-xs text-content-primary transition-colors">
                    <ScanBarcode className="w-3.5 h-3.5" /> Barcode
                  </button>
                  <button onClick={() => { setShowAddFood(false); openCustomFood("addFood") }}
                    className="flex-1 flex items-center justify-center gap-2 bg-surface-button hover:bg-surface-button-hover rounded-xl px-3 py-2 text-xs text-content-primary transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Create Food
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
                      <label className="text-xs text-content-muted mb-1 block">Quantity</label>
                      <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="0.5" step="0.5"
                        className="w-full bg-surface-dark rounded-xl px-4 py-2.5 text-sm text-content-primary border border-transparent focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-content-muted mb-1 block">Unit</label>
                      <UnitSelect value={unit} onChange={setUnit} />
                    </div>
                  </div>
                  <button onClick={handleAddFood}
                    className="w-full bg-primary hover:bg-primary-hover text-white rounded-xl py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Add to {mealLabels[addFoodMeal]}
                  </button>
                </div>
              ) : (
                <>
                  {addFoodTab === "search" && (searchQuery ? (
                    filteredFoods.length > 0 ? filteredFoods.slice(0, 15).map((food) => (
                      <button key={food._id || food.id} onClick={() => { setSelectedFood(food); setSearchQuery(""); setUnit(food.unit || "") }}
                        className="w-full text-left px-4 py-3 hover:bg-surface-hover transition-colors flex justify-between items-center border-b border-border/50">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {food.isCustom && <span className="text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded font-medium flex-shrink-0">Custom</span>}
                          <span className="text-sm text-content-primary truncate">{food.name}</span>
                        </div>
                        <span className="text-xs text-content-faint ml-2 flex-shrink-0">{Math.round(food.calories || 0)} kcal</span>
                      </button>
                    )) : <div className="p-8 text-center text-content-muted text-sm">No foods found</div>
                  ) : (
                    <div className="p-4">
                      <p className="text-xs font-medium text-content-muted uppercase tracking-wider mb-3">Suggestions</p>
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
                          <p className="text-sm">No favorites yet</p>
                          <p className="text-xs mt-1">Star foods when adding them to save as favorites</p>
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
      )}

      {/* ========== QUICK-ADD MODAL ========== */}
      {showQuickAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-card rounded-xl p-4 md:p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-semibold text-content-primary flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Quick Add</h3>
              <button onClick={() => setShowQuickAdd(false)} className="text-content-muted hover:text-content-primary"><X className="w-5 h-5" /></button>
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
      )}

      {/* ========== CUSTOM FOOD MODAL ========== */}
      {showCustomFood && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-card rounded-xl p-4 md:p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-semibold text-content-primary">{editingCustomId ? "Edit Custom Food" : "Create Custom Food"}</h3>
              <button onClick={closeCustomFood} className="text-content-muted hover:text-content-primary"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-content-muted mb-1 block">Food Name <span className="text-red-400">*</span></label>
                <input type="text" value={customForm.name} onChange={(e) => setCustomForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Grandma's Soup"
                  className="w-full bg-surface-dark rounded-xl px-4 py-2.5 text-sm text-content-primary placeholder-content-faint border border-transparent focus:border-primary outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-content-muted mb-1 block">Serving Size</label>
                  <input type="text" value={customForm.servingSize} onChange={(e) => setCustomForm((p) => ({ ...p, servingSize: e.target.value }))} placeholder="100"
                    className="w-full bg-surface-dark rounded-xl px-4 py-2.5 text-sm text-content-primary placeholder-content-faint border border-transparent focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="text-xs text-content-muted mb-1 block">Unit</label>
                  <UnitSelect value={customForm.servingUnit} onChange={(v) => setCustomForm((p) => ({ ...p, servingUnit: v }))} />
                </div>
              </div>
              <div>
                <label className="text-xs text-content-muted mb-1 block">Calories (kcal) <span className="text-red-400">*</span></label>
                <input type="number" value={customForm.calories} onChange={(e) => setCustomForm((p) => ({ ...p, calories: e.target.value }))} placeholder="0"
                  className="w-full bg-surface-dark rounded-xl px-4 py-2.5 text-sm text-content-primary placeholder-content-faint border border-transparent focus:border-primary outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[{ key: "protein", label: "Protein" }, { key: "carbs", label: "Carbs" }, { key: "fats", label: "Fat" }].map((f) => (
                  <div key={f.key}>
                    <label className="text-[10px] text-content-faint mb-1 block">{f.label} (g)</label>
                    <input type="number" value={customForm[f.key]} onChange={(e) => setCustomForm((p) => ({ ...p, [f.key]: e.target.value }))} placeholder="0"
                      className="w-full bg-surface-dark rounded-xl px-3 py-2 text-sm text-content-primary placeholder-content-faint border border-transparent focus:border-primary outline-none text-center" />
                  </div>
                ))}
              </div>
            </div>
            <button onClick={handleSaveCustomFood} disabled={!customForm.name || !customForm.calories}
              className="w-full mt-4 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-xl py-2.5 text-sm font-medium transition-colors">{editingCustomId ? "Save Changes" : "Save Custom Food"}</button>
          </div>
        </div>
      )}

      {/* ========== EDIT QUANTITY MODAL ========== */}
      {editingFood && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-card rounded-xl p-4 md:p-6 w-full max-w-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-semibold text-content-primary">Edit Quantity</h3>
              <button onClick={() => setEditingFood(null)} className="text-content-muted hover:text-content-primary"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-content-secondary mb-3">{editingFood.food.name}</p>
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setEditQuantity(String(Math.max(0.5, Number(editQuantity) - 0.5)))}
                className="w-10 h-10 rounded-xl bg-surface-button hover:bg-surface-button-hover flex items-center justify-center transition-colors text-content-primary"><Minus className="w-4 h-4" /></button>
              <input type="number" value={editQuantity} onChange={(e) => setEditQuantity(e.target.value)} min="0.5" step="0.5"
                className="flex-1 bg-surface-dark rounded-xl px-4 py-2.5 text-center text-lg font-semibold text-content-primary border border-transparent focus:border-primary outline-none" />
              <button onClick={() => setEditQuantity(String(Number(editQuantity) + 0.5))}
                className="w-10 h-10 rounded-xl bg-surface-button hover:bg-surface-button-hover flex items-center justify-center transition-colors text-content-primary"><Plus className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-content-faint text-center mb-4">= {Math.round(editingFood.food.calories * Number(editQuantity))} kcal</p>
            <div className="flex gap-3">
              <button onClick={() => { removeFood(editingFood.mealType, editingFood.food.id); setEditingFood(null) }}
                className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm transition-colors">Delete</button>
              <button onClick={handleEditFood}
                className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-medium transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ========== BARCODE SCANNER MODAL ========== */}
      {showBarcode && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
          <div className="bg-surface-card rounded-t-2xl sm:rounded-xl w-full sm:max-w-md max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
              <h3 className="text-base font-semibold text-content-primary flex items-center gap-2">
                <ScanBarcode className="w-4 h-4 text-primary" /> Barcode Scanner
              </h3>
              <button onClick={() => { setShowBarcode(false); setBarcodeActive(false); lastScanned.current = null; setShowAddFood(true) }}
                className="p-1 text-content-muted hover:text-content-primary transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Scanner viewport */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-surface-dark border-2 border-dashed border-border">
                {barcodeActive ? (
                  <BarcodeScannerComponent
                    width="100%"
                    height="100%"
                    onUpdate={(err, result) => {
                      if (result?.text) {
                        const code = result.text.trim()
                        if (code !== lastScanned.current) {
                          lastScanned.current = code
                          dispatch(barcodeScanner(code))
                        }
                      }
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-sm text-content-muted">Scanner paused</p>
                  </div>
                )}
              </div>

              <p className="text-xs text-content-faint text-center">
                {barcodeLoading ? "Searching..." : lastScanned.current ? `Scanned: ${lastScanned.current}` : "Point camera at barcode"}
              </p>

              {/* Found food */}
              {barcodeFood && (
                <SettingsCard className="!p-4">
                  <h4 className="text-sm font-semibold text-content-primary mb-2">{barcodeFood.name}</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-content-secondary mb-3">
                    {barcodeFood.serving && <p>Serving: {barcodeFood.serving}</p>}
                    {barcodeFood.servingSize && <p>Size: {barcodeFood.servingSize}g</p>}
                    <p>Calories: {barcodeFood.calories} kcal</p>
                    <p>Protein: {barcodeFood.protein}g</p>
                    <p>Carbs: {barcodeFood.carbs}g</p>
                    <p>Fats: {barcodeFood.fats}g</p>
                  </div>
                  {/* Add to meal */}
                  <div className="flex gap-2">
                    {["breakfast", "lunch", "dinner", "snacks"].map((m) => {
                      const MealIcon = mealIcons[m]
                      return (
                        <button key={m} onClick={() => {
                          setMeals((prev) => ({
                            ...prev,
                            [m]: [...(prev[m] || []), {
                              id: Date.now(), name: barcodeFood.name,
                              calories: Number(barcodeFood.calories || 0), protein: Number(barcodeFood.protein || 0),
                              carbs: Number(barcodeFood.carbs || 0), fats: Number(barcodeFood.fats || 0),
                              quantity: 1, unit: "portion",
                            }],
                          }))
                          setShowBarcode(false); setBarcodeActive(false); lastScanned.current = null
                          scrollToMeal(m)
                        }}
                          className="flex-1 flex flex-col items-center gap-1 py-2.5 bg-surface-button hover:bg-primary hover:text-white rounded-xl text-xs text-content-primary transition-colors">
                          <MealIcon className="w-4 h-4" />
                          <span className="capitalize text-[10px]">{m}</span>
                        </button>
                      )
                    })}
                  </div>
                </SettingsCard>
              )}

              {barcodeError && (
                <p className="text-xs text-red-400 text-center">{barcodeError}</p>
              )}

              {/* Controls */}
              <button onClick={() => setBarcodeActive(!barcodeActive)}
                className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  barcodeActive
                    ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    : "bg-primary hover:bg-primary-hover text-white"
                }`}>
                {barcodeActive ? "Pause Scanner" : "Resume Scanner"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== SETTINGS MODAL (Profile + Goals + My Foods) ========== */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
          <div className="bg-surface-card rounded-t-2xl sm:rounded-xl w-full sm:max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
              <h3 className="text-base font-semibold text-content-primary">Settings</h3>
              <button onClick={() => setShowSettings(false)} className="p-1 text-content-muted hover:text-content-primary"><X className="w-5 h-5" /></button>
            </div>

            {/* Tab bar */}
            <div className="flex border-b border-border flex-shrink-0">
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

            <div className="flex-1 overflow-y-auto p-4 md:p-6">
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
                    <div className="space-y-2">
                      {ACTIVITY_LEVELS.map((level) => (
                        <button key={level.value} onClick={() => setProfileForm((p) => ({ ...p, activity: level.value }))}
                          className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${profileForm.activity === level.value ? "border-primary bg-primary/5" : "border-transparent bg-surface-dark hover:bg-surface-button"}`}>
                          <p className="text-sm font-medium text-content-primary">{level.label}</p>
                          <p className="text-xs text-content-faint">{level.desc}</p>
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
                      <div className="grid grid-cols-5 gap-2 text-center">
                        {(() => {
                          const bmr = calcBMR(profileForm.weight, profileForm.height, profileForm.age, profileForm.gender)
                          const tdee = calcTDEE(bmr, profileForm.activity)
                          const offset = GOAL_TYPES.find((g) => g.value === profileForm.goalType)?.offset || 0
                          const cal = Math.max(1200, tdee + offset)
                          const m = calcMacros(cal)
                          const wMl = calcWaterMl(profileForm.weight, profileForm.activity)
                          return [
                            { label: "Calories", val: cal, u: "kcal" },
                            { label: "Protein", val: m.protein, u: "g" },
                            { label: "Carbs", val: m.carbs, u: "g" },
                            { label: "Fat", val: m.fats, u: "g" },
                            { label: "Water", val: `${(wMl / 1000).toFixed(1)}L`, u: `${wMl} ml` },
                          ].map((item) => (
                            <div key={item.label}>
                              <p className="text-lg font-bold text-primary">{item.val}</p>
                              <p className="text-[10px] text-content-faint">{item.label}</p>
                            </div>
                          ))
                        })()}
                      </div>
                    </SettingsCard>
                  )}
                  <button onClick={() => { calculateFromProfile(); setSettingsTab("goals") }}
                    className="w-full bg-primary hover:bg-primary-hover text-white rounded-xl py-2.5 text-sm font-medium transition-colors">
                    Apply & Set Goals
                  </button>
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
                  <div className="flex gap-3">
                    <button onClick={() => setGoalForm({ calories: 2000, protein: 150, carbs: 250, fats: 70, waterMl: 2500 })}
                      className="flex-1 px-4 py-2.5 bg-surface-button hover:bg-surface-button-hover rounded-xl text-content-primary text-sm transition-colors">Reset</button>
                    <button onClick={handleSaveSettings}
                      className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-hover rounded-xl text-white text-sm font-medium transition-colors">Save Goals</button>
                  </div>
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
          </div>
        </div>
      )}

      {/* ========== HEADER ========== */}
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between p-4 sm:px-6 sm:pt-6 sm:pb-4">
          <div className="flex items-center gap-2">
            <button onClick={() => shiftDate(-1)} className="p-1.5 hover:bg-surface-button rounded-lg transition-colors text-content-muted hover:text-content-primary">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-semibold">{formatDate(selectedDate)}</h1>
              <DatePickerField value={dateStr} onChange={handleDatePick} iconSize={16} />
            </div>
            <button onClick={() => shiftDate(1)} className="p-1.5 hover:bg-surface-button rounded-lg transition-colors text-content-muted hover:text-content-primary" disabled={isToday}>
              <ChevronRight className={`w-5 h-5 ${isToday ? "opacity-30" : ""}`} />
            </button>
          </div>
          <div className="flex items-center gap-1">
            {streak > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-lg mr-1">
                <Flame className="w-3.5 h-3.5 text-primary" /><span className="text-xs font-semibold text-primary">{streak}</span>
              </div>
            )}
            <button onClick={() => { setProfileForm({ ...profile }); setGoalForm({ ...goals }); setSettingsTab("profile"); setShowSettings(true) }}
              className="p-2 hover:bg-surface-button rounded-xl transition-colors text-content-muted hover:text-content-primary">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex border-b border-border">
          {[{ key: "diary", label: "Diary", icon: BookOpen }, { key: "insights", label: "Insights", icon: TrendingUp }].map((tab) => {
            const TabIcon = tab.icon
            return (
              <button key={tab.key} onClick={() => setActiveView(tab.key)}
                className={`flex-1 px-2 sm:px-4 py-4 text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${activeView === tab.key
                  ? "text-content-primary border-b-2 border-primary"
                  : "text-content-muted hover:text-content-primary"
                }`}>
                <TabIcon size={16} className="inline mr-1 sm:mr-2" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ========== CONTENT ========== */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">

        {/* ===== DIARY ===== */}
        {activeView === "diary" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <SettingsCard className="!p-5">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <CalorieRing consumed={Math.round(totals.calories)} goal={Number(goals.calories)} />
                <div className="flex-1 w-full space-y-3">
                  <div className="flex justify-between text-xs text-content-faint mb-1">
                    <span>{Math.round(totals.calories)} eaten</span>
                    <span>{goals.calories} kcal goal</span>
                  </div>
                  <MacroBar label="Protein" current={totals.protein} goal={Number(goals.protein)} color="bg-blue-500" />
                  <MacroBar label="Carbs" current={totals.carbs} goal={Number(goals.carbs)} color="bg-primary" />
                  <MacroBar label="Fat" current={totals.fats} goal={Number(goals.fats)} color="bg-yellow-500" />
                </div>
              </div>
            </SettingsCard>

            {/* Desktop: Central add food bar */}
            <div className="hidden lg:flex items-center gap-2">
              {["breakfast", "lunch", "dinner", "snacks"].map((m) => {
                const MIcon = mealIcons[m]
                return (
                  <button key={m} onClick={() => openAddFood(m)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-surface-hover hover:bg-surface-button rounded-xl text-sm text-content-primary transition-colors">
                    <MIcon className="w-4 h-4 text-content-muted" />
                    <span className="hidden xl:inline">{mealLabels[m]}</span>
                    <Plus className="w-3.5 h-3.5 text-primary" />
                  </button>
                )
              })}
              <button onClick={() => setShowQuickAdd(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-hover hover:bg-surface-button rounded-xl text-sm text-content-primary transition-colors">
                <Zap className="w-4 h-4 text-primary" />
              </button>
            </div>

            {["breakfast", "lunch", "dinner", "snacks"].map((mealType) => {
              const Icon = mealIcons[mealType]
              const items = meals[mealType] || []
              const cal = mealCalories(mealType)
              const hasYesterday = (yesterdayMeals[mealType] || []).length > 0
              return (
                <div key={mealType} ref={mealRefs[mealType]}>
                <SettingsCard className="!p-0 overflow-hidden">
                  <div className="flex items-center justify-between px-4 sm:px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-card flex items-center justify-center"><Icon className="w-4 h-4 text-content-muted" /></div>
                      <div>
                        <h3 className="text-sm font-medium text-content-primary">{mealLabels[mealType]}</h3>
                        {cal > 0 && <p className="text-xs text-content-faint">{Math.round(cal)} kcal</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {hasYesterday && items.length === 0 && (
                        <button onClick={() => copyMealFromYesterday(mealType)} title="Copy from yesterday"
                          className="w-8 h-8 rounded-lg bg-surface-card hover:bg-surface-button flex items-center justify-center transition-colors text-content-faint hover:text-content-primary">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  {items.length > 0 && (
                    <div className="border-t border-border/50">
                      {items.map((food) => (
                        <div key={food.id} className="flex items-center justify-between px-4 sm:px-5 py-2.5 hover:bg-surface-card/50 transition-colors group cursor-pointer"
                          onClick={() => openEditFood(mealType, food)}>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-content-primary truncate">{food.name}</p>
                            <p className="text-xs text-content-faint">{food.quantity > 1 ? `${food.quantity}× ` : ""}{food.unit}{food.unit ? " · " : ""}{Math.round(food.calories * (food.quantity || 1))} kcal</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="hidden sm:flex gap-3 text-xs text-content-faint">
                              <span>P: {Math.round(food.protein * (food.quantity || 1))}g</span>
                              <span>C: {Math.round(food.carbs * (food.quantity || 1))}g</span>
                              <span>F: {Math.round(food.fats * (food.quantity || 1))}g</span>
                            </div>
                            <Pencil className="w-3.5 h-3.5 text-content-faint opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {items.length === 0 && (
                    <button onClick={() => openAddFood(mealType)}
                      className="w-full px-4 sm:px-5 py-4 border-t border-border/50 text-center text-sm text-content-faint hover:text-content-muted hover:bg-surface-card/50 transition-colors">Tap to add food</button>
                  )}
                </SettingsCard>
                </div>
              )
            })}

            <SettingsCard className="!p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2"><Droplets className="w-4 h-4 text-blue-400" /><h3 className="text-sm font-medium text-content-primary">Water</h3></div>
                <span className="text-xs text-content-faint">{waterDrank} / {waterGoalMl} ml</span>
              </div>
              {/* Progress bar */}
              <div className="h-3 bg-surface-button rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${waterDrank > waterGoalMl ? "bg-blue-500" : "bg-blue-400"}`}
                  style={{ width: `${Math.min((waterDrank / Math.max(waterGoalMl, 1)) * 100, 100)}%` }}
                />
              </div>
              {/* Quick-add buttons */}
              <div className="flex items-center gap-2">
                <button onClick={() => setWaterDrank(Math.max(0, waterDrank - 250))}
                  className="w-9 h-9 rounded-lg bg-surface-card flex items-center justify-center hover:bg-surface-button transition-colors text-content-muted"><Minus className="w-4 h-4" /></button>
                <div className="flex-1 flex gap-2">
                  {[150, 250, 330, 500].map((ml) => (
                    <button key={ml} onClick={() => setWaterDrank(waterDrank + ml)}
                      className="flex-1 py-2 bg-surface-card hover:bg-surface-button rounded-lg text-xs font-medium text-content-primary transition-colors">
                      +{ml}ml
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-content-faint mt-2.5 text-center">
                {waterDrank > waterGoalMl
                  ? `${(waterDrank / 1000).toFixed(1)}L — ${waterDrank - waterGoalMl} ml over goal`
                  : waterDrank === waterGoalMl
                  ? `Goal reached! ${(waterDrank / 1000).toFixed(1)}L`
                  : `${(waterDrank / 1000).toFixed(1)}L · ${waterGoalMl - waterDrank} ml to go`}
              </p>
            </SettingsCard>
          </div>
        )}

        {/* ===== INSIGHTS ===== */}
        {activeView === "insights" && (
          <div className="max-w-3xl mx-auto space-y-6">

            {/* Today's Score */}
            <SettingsCard className="!p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-content-primary">Today's Performance</h3>
                <div className={`text-sm font-bold ${getScoreColor(dailyScore)}`}>{dailyScore}/100 — {getScoreLabel(dailyScore)}</div>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {[
                  { label: "Calories", pct: calScore, target: `${goals.calories} kcal`, actual: `${Math.round(totals.calories)}` },
                  { label: "Protein", pct: proteinScore, target: `${goals.protein}g`, actual: `${Math.round(totals.protein)}g` },
                  { label: "Carbs", pct: carbsScore, target: `${goals.carbs}g`, actual: `${Math.round(totals.carbs)}g` },
                  { label: "Fat", pct: fatScore, target: `${goals.fats}g`, actual: `${Math.round(totals.fats)}g` },
                  { label: "Water", pct: waterScore, target: `${(waterGoalMl / 1000).toFixed(1)}L`, actual: `${(waterDrank / 1000).toFixed(1)}L` },
                ].map((item) => {
                  const capped = Math.min(item.pct, 100)
                  const isOver = item.pct > 110
                  const isGood = item.pct >= 80 && item.pct <= 110
                  return (
                    <div key={item.label} className="text-center">
                      <div className="relative w-12 h-12 mx-auto mb-1.5">
                        <svg width={48} height={48} className="transform -rotate-90">
                          <circle cx={24} cy={24} r={20} fill="none" strokeWidth={4} className="text-surface-button" stroke="currentColor" />
                          <circle cx={24} cy={24} r={20} fill="none" strokeWidth={4} strokeLinecap="round"
                            stroke={isOver ? "var(--color-accent-red, #ef4444)" : isGood ? "#22c55e" : "#eab308"}
                            strokeDasharray={125.66} strokeDashoffset={125.66 - (capped / 100) * 125.66} />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-content-primary">{item.pct}%</span>
                      </div>
                      <p className="text-[10px] font-medium text-content-secondary">{item.label}</p>
                      <p className="text-[9px] text-content-faint">{item.actual} / {item.target}</p>
                    </div>
                  )
                })}
              </div>
            </SettingsCard>

            {/* Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Weekly Avg", value: `${weeklyAvg}`, sub: `Goal: ${goals.calories} kcal`, status: Math.abs(weeklyAvg - g) < g * 0.1 ? "on-track" : "low" },
                { label: "On Target", value: `${daysOnTarget}/7`, sub: "days within ±10%", status: daysOnTarget >= 5 ? "on-track" : "low" },
                { label: "Streak", value: `${streak} days`, sub: "Keep it up!", status: "on-track", isStreak: true },
                { label: "Weekly", value: `${weeklyDeficit > 0 ? "-" : "+"}${Math.abs(Math.round(weeklyDeficit))}`, sub: weeklyDeficit > 0 ? "Deficit (kcal)" : "Surplus (kcal)", status: profile.goalType === "lose" ? (weeklyDeficit > 0 ? "on-track" : "low") : profile.goalType === "gain" ? (weeklyDeficit < 0 ? "on-track" : "low") : (Math.abs(weeklyDeficit) < 1000 ? "on-track" : "low") },
              ].map((card) => (
                <SettingsCard key={card.label} className="!p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-content-muted">{card.label}</span>
                    {card.isStreak ? <Flame className="w-3.5 h-3.5 text-primary" /> : card.status === "on-track" ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <AlertCircle className="w-3.5 h-3.5 text-yellow-400" />}
                  </div>
                  <p className="text-xl font-bold text-content-primary">{card.value}</p>
                  <p className="text-xs text-content-faint mt-0.5">{card.sub}</p>
                </SettingsCard>
              ))}
            </div>

            <SettingsCard>
              <h3 className="text-sm font-medium text-content-primary mb-4">Weekly Calorie Intake</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyCalorieData} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #333)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: "var(--color-content-faint, #888)", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "var(--color-content-faint, #888)", fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                    <Tooltip content={<ChartTooltip />} />
                    <ReferenceLine y={Number(goals.calories)} stroke="var(--color-primary, #f97316)" strokeDasharray="4 4" strokeWidth={1.5} />
                    <Bar dataKey="Calories" fill="var(--color-primary, #f97316)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-content-faint mt-2 text-center">Dashed line = daily goal ({goals.calories} kcal)</p>
            </SettingsCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SettingsCard>
                <h3 className="text-sm font-medium text-content-primary mb-4">Macro Distribution</h3>
                <div className="flex items-center gap-4">
                  <div className="h-40 w-40 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart><Pie data={macroPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value" stroke="none">
                        {macroPieData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                      </Pie></PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-3">
                    {macroPieData.map((macro) => (
                      <div key={macro.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: macro.color }} /><span className="text-xs text-content-secondary">{macro.name}</span></div>
                        <span className="text-sm font-medium text-content-primary">{macro.value}g <span className="text-xs text-content-faint">({macroTotal > 0 ? Math.round((macro.value / macroTotal) * 100) : 0}%)</span></span>
                      </div>
                    ))}
                  </div>
                </div>
              </SettingsCard>
              <SettingsCard>
                <h3 className="text-sm font-medium text-content-primary mb-4">Calorie Trend</h3>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #333)" vertical={false} />
                      <XAxis dataKey="date" tick={{ fill: "var(--color-content-faint, #888)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "var(--color-content-faint, #888)", fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                      <Tooltip content={<ChartTooltip />} />
                      <Area type="monotone" dataKey="Target" stroke="#666" strokeDasharray="4 4" fill="none" strokeWidth={1.5} />
                      <Area type="monotone" dataKey="Actual" stroke="var(--color-primary, #f97316)" fill="var(--color-primary, #f97316)" fillOpacity={0.15} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </SettingsCard>
            </div>

            <SettingsCard>
              <h3 className="text-sm font-medium text-content-primary mb-4">Weekly Macros</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyMacroData} barSize={24}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #333)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: "var(--color-content-faint, #888)", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "var(--color-content-faint, #888)", fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="Protein" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="Carbs" stackId="a" fill="var(--color-primary, #f97316)" />
                    <Bar dataKey="Fat" stackId="a" fill="#eab308" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-3">
                {[{ label: "Protein", color: "#3b82f6" }, { label: "Carbs", color: "var(--color-primary, #f97316)" }, { label: "Fat", color: "#eab308" }].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} /><span className="text-xs text-content-faint">{l.label}</span></div>
                ))}
              </div>
            </SettingsCard>

            <SettingsCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-content-primary">Micronutrients</h3>
                <div className="flex gap-1">
                  {[{ key: "all", label: "All" }, { key: "vitamins", label: "Vitamins" }, { key: "minerals", label: "Minerals" }, { key: "critical", label: "Low" }].map((f) => (
                    <button key={f.key} onClick={() => setNutrientFilter(f.key)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${nutrientFilter === f.key ? "bg-primary text-white" : "text-content-muted hover:text-content-primary hover:bg-surface-button"}`}>{f.label}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                {filteredNutrients.map((nutrient) => {
                  const pct = Math.min((nutrient.current / nutrient.goal) * 100, 100)
                  return (
                    <div key={nutrient.name}>
                      <div className="flex justify-between items-baseline mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-content-primary">{nutrient.name}</span>
                          {nutrient.critical && <AlertCircle className="w-3 h-3 text-yellow-400" />}
                        </div>
                        <span className="text-xs text-content-faint">{nutrient.current} / {nutrient.goal} {nutrient.unit}</span>
                      </div>
                      <div className="h-1.5 bg-surface-button rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${pct < 60 ? "bg-yellow-500" : "bg-green-500"}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </SettingsCard>
          </div>
        )}
      </div>

      {/* ========== MOBILE FAB ========== */}
      {activeView === "diary" && (
        <div className="lg:hidden fixed bottom-4 right-4 z-40">
          {/* FAB Menu */}
          <div className={`absolute bottom-16 right-0 flex flex-col gap-2 transition-all duration-200 ${isFabOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
            {["breakfast", "lunch", "dinner", "snacks"].map((m) => {
              const MIcon = mealIcons[m]
              return (
                <button key={m} onClick={(e) => { e.stopPropagation(); openAddFood(m); setIsFabOpen(false) }}
                  className="flex items-center gap-2 bg-surface-card text-content-primary pl-3 pr-4 py-2.5 rounded-xl shadow-lg whitespace-nowrap">
                  <MIcon className="w-4 h-4 text-content-muted" />
                  <span className="text-sm">{mealLabels[m]}</span>
                </button>
              )
            })}
            <button onClick={(e) => { e.stopPropagation(); setShowQuickAdd(true); setIsFabOpen(false) }}
              className="flex items-center gap-2 bg-surface-card text-content-primary pl-3 pr-4 py-2.5 rounded-xl shadow-lg whitespace-nowrap">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm">Quick Add</span>
            </button>
          </div>
          {/* FAB Button */}
          <button onClick={(e) => { e.stopPropagation(); setIsFabOpen(!isFabOpen) }}
            className={`bg-primary hover:bg-primary-hover text-white p-4 rounded-xl shadow-lg transition-all active:scale-95 ${isFabOpen ? "rotate-45" : ""}`}
            aria-label="Add food">
            <Plus size={22} />
          </button>
        </div>
      )}

    </div>
  )
}

export default NutritionTracker
