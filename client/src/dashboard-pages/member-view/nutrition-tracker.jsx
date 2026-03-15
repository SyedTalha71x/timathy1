import { useState, useEffect, useRef, useMemo } from "react"
import {
  Plus, Minus, X, ChevronLeft, ChevronRight, Settings,
  Droplets, TrendingUp, AlertCircle, CheckCircle, Star, Copy,
  Zap, Pencil, Flame, BookOpen, ScanBarcode, Loader2
} from "lucide-react"
import DatePickerField from "../../components/shared/DatePickerField"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, ReferenceLine
} from "recharts"
import { useDispatch, useSelector } from "react-redux"
import { fetchFood, newFood } from "../../features/food/foodSlice"
import { fetchDailySummery } from "../../features/dailysummery/dailySummerySlice"
// TODO [Backend]: Create fetchWeeklySummary action in a new slice or extend dailySummerySlice
// Expected API: GET /api/weekly-summary?date=YYYY-MM-DD
// Response: { days: [{ date, calories, protein, carbs, fats, water }], streak: number }
// import { fetchWeeklySummary } from "../../features/dailysummery/dailySummerySlice"
import { createGoals } from "../../features/userGoals/userGoalSlice"
import { barcodeScanner } from "../../features/barcodeScanner/barCodeSlice"

// Modals
import AddFoodModal from "../../components/member-panel-components/nutrition-tracking-components/AddFoodModal"
import QuickAddModal from "../../components/member-panel-components/nutrition-tracking-components/QuickAddModal"
import CustomFoodModal from "../../components/member-panel-components/nutrition-tracking-components/CustomFoodModal"
import EditQuantityModal from "../../components/member-panel-components/nutrition-tracking-components/EditQuantityModal"
import BarcodeScannerModal from "../../components/member-panel-components/nutrition-tracking-components/BarcodeScannerModal"
import SettingsModal from "../../components/member-panel-components/nutrition-tracking-components/SettingsModal"
import StreakModal from "../../components/member-panel-components/nutrition-tracking-components/StreakModal"
import { haptic } from "../../utils/haptic"

// Shared constants & components
import {
  SettingsCard, mealIcons, mealLabels, micronutrientData,
  calcBMR, calcTDEE, calcMacros, calcWaterMl,
  ACTIVITY_LEVELS, GOAL_TYPES,
} from "../../components/member-panel-components/nutrition-tracking-components/nutritionConstants"

// ============================================
// Local Components
// ============================================

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

// ============================================
// MAIN COMPONENT
// ============================================
const NutritionTracker = () => {
  const dispatch = useDispatch()
  const { foodData } = useSelector((state) => state.food)
  const { dailySummeryData, loading: diaryLoading } = useSelector((state) => state.dailySummery)
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

  const [waterDrank, setWaterDrank] = useState(0) // in ml — populated from API per day
  const waterGoalMl = Number(goals.waterMl) || 2500
  const waterMl = waterGoalMl
  const [nutrientFilter, setNutrientFilter] = useState("all")
  const [streak] = useState(7) // always current streak, independent of selected date
  const [showStreak, setShowStreak] = useState(false)

  // Weekly data for insights (from API or demo fallback)
  // TODO [Backend]: Populate from fetchWeeklySummary response
  const [weeklyData, setWeeklyData] = useState(null)
  const [weeklyLoading, setWeeklyLoading] = useState(false)

  const searchRef = useRef(null)
  const mealRefs = { breakfast: useRef(null), lunch: useRef(null), dinner: useRef(null), snacks: useRef(null) }
  const [isFabOpen, setIsFabOpen] = useState(false)

  const scrollToMeal = (mealType) => {
    setActiveView("diary")
    setTimeout(() => {
      mealRefs[mealType]?.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 100)
  }

  // Fetch food database once
  useEffect(() => { dispatch(fetchFood()) }, [dispatch])

  // Fetch daily summary whenever selected date changes
  // TODO [Backend]: fetchDailySummery must accept a date string parameter
  // Expected API: GET /api/daily-summary?date=YYYY-MM-DD
  // Response: { meals: {...}, waterMl: number }
  useEffect(() => {
    setMeals({})
    setWaterDrank(0)
    dispatch(fetchDailySummery(dateStr))
  }, [dateStr, dispatch])

  // Fetch yesterday's meals for "copy from yesterday" feature
  useEffect(() => {
    const yesterday = new Date(selectedDate)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`
    // TODO [Backend]: Need a lightweight endpoint or reuse fetchDailySummery for yesterday
    // For now, yesterdayMeals is populated from the previous dailySummeryData response
    // Once the API supports date params, fetch yesterday separately:
    // dispatch(fetchDailySummery(yesterdayStr)).then(res => setYesterdayMeals(normalize(res)))
  }, [dateStr])

  // Fetch weekly data when insights tab is active
  // TODO [Backend]: Implement fetchWeeklySummary endpoint
  // Once available, uncomment:
  // useEffect(() => {
  //   if (activeView === "insights") {
  //     setWeeklyLoading(true)
  //     dispatch(fetchWeeklySummary(dateStr))
  //       .unwrap()
  //       .then((data) => { setWeeklyData(data); setWeeklyLoading(false) })
  //       .catch(() => { setWeeklyData(null); setWeeklyLoading(false) })
  //   }
  // }, [activeView, dateStr, dispatch])

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

  // Normalize API data for selected date
  useEffect(() => {
    if (dailySummeryData?.meals) {
      const normalized = {}
      Object.entries(dailySummeryData.meals).forEach(([type, items]) => {
        normalized[type] = items.map((item, idx) => ({
          id: item._id || idx + 1, name: item.food?.name || "Unknown",
          calories: Number(item.food?.calories || 0), protein: Number(item.food?.protein || 0),
          carbs: Number(item.food?.carbs || 0), fats: Number(item.food?.fats || 0),
          quantity: item.quantity || 1, unit: item.unit || "",
        }))
      })
      setMeals(normalized)
      // TODO [Backend]: Once yesterday is fetched separately, don't overwrite yesterdayMeals here
      setYesterdayMeals(normalized)

      // Hydrate water from API response
      // TODO [Backend]: Include waterMl in daily summary response
      if (dailySummeryData.waterMl !== undefined) {
        setWaterDrank(Number(dailySummeryData.waterMl) || 0)
      }
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

  // Date nav — block future dates
  const shiftDate = (days) => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + days)
    // Prevent navigating into the future
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    if (d > today) return
    haptic.light()
    setSelectedDate(d)
  }
  const handleDatePick = (str) => {
    if (!str) return
    // Prevent selecting future dates
    if (str > todayStr) return
    const [y, m, d] = str.split("-").map(Number)
    setSelectedDate(new Date(y, m - 1, d))
  }
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

  const toggleFavorite = (foodId) => { haptic.light(); setFavorites((prev) => prev.includes(foodId) ? prev.filter((id) => id !== foodId) : [...prev, foodId]) }
  const isFavorite = (foodId) => favorites.includes(foodId)

  // Add food
  const handleAddFood = () => {
    if (!selectedFood) return
    haptic.success()
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
  const openAddFood = (meal) => { haptic.light(); setAddFoodMeal(meal); setShowAddFood(true); setTimeout(() => searchRef.current?.focus(), 100) }

  // Quick-Add
  const handleQuickAdd = () => {
    if (!quickForm.calories && !quickForm.name) return
    haptic.success()
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
    haptic.success()
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
    haptic.warning()
    setCustomFoods((prev) => prev.filter((f) => f.id !== id))
    setFavorites((prev) => prev.filter((fId) => fId !== id))
  }

  // Edit food
  const openEditFood = (mealType, food) => { haptic.light(); setEditingFood({ mealType, food }); setEditQuantity(String(food.quantity || 1)) }
  const handleEditFood = () => {
    if (!editingFood) return
    haptic.success()
    setMeals((prev) => ({
      ...prev,
      [editingFood.mealType]: (prev[editingFood.mealType] || []).map((f) =>
        f.id === editingFood.food.id ? { ...f, quantity: Number(editQuantity) || 1 } : f
      ),
    }))
    setEditingFood(null)
  }
  const removeFood = (mealType, foodId) => { haptic.warning(); setMeals((prev) => ({ ...prev, [mealType]: (prev[mealType] || []).filter((f) => f.id !== foodId) })) }

  // Copy meal
  const copyMealFromYesterday = (mealType) => {
    const items = yesterdayMeals[mealType]
    if (!items?.length) return
    haptic.success()
    setMeals((prev) => ({ ...prev, [mealType]: [...(prev[mealType] || []), ...items.map((f) => ({ ...f, id: Date.now() + Math.random() }))] }))
  }

  const mealCalories = (type) => (meals[type] || []).reduce((sum, f) => sum + f.calories * (f.quantity || 1), 0)

  // Water update helper — syncs with API
  // TODO [Backend]: Create endpoint PUT /api/daily-summary/water { date, waterMl }
  const updateWater = (newAmount) => {
    const clamped = Math.max(0, newAmount)
    haptic.light()
    setWaterDrank(clamped)
    // dispatch(updateDailyWater({ date: dateStr, waterMl: clamped }))
  }

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
    haptic.success()
    setProfile({ ...profileForm })
    setGoals({ ...goalForm })
    dispatch(createGoals(goalForm))
    setShowSettings(false)
  }

  // ============================================
  // INSIGHTS DATA — performance vs goals
  // ============================================

  // Selected day's performance scores (0-100%)
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

  // Performance label based on selected date
  const performanceLabel = isToday ? "Today's Performance" : `${formatDate(selectedDate)} Performance`

  // ---- Weekly data ----
  // Helpers: get the Mon–Sun week containing the selected date
  const getWeekDates = (date) => {
    const d = new Date(date)
    const dayOfWeek = d.getDay() // 0=Sun
    const monday = new Date(d)
    monday.setDate(d.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(monday)
      day.setDate(monday.getDate() + i)
      return day
    })
  }
  const weekDates = getWeekDates(selectedDate)
  const selectedDayLabel = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][
    selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1
  ]

  const g = Number(goals.calories)
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  // Demo data as fallback until backend provides real weekly data
  // TODO [Backend]: Replace with weeklyData from fetchWeeklySummary
  const demoWeekCalories = { Mon: 1850, Tue: 2200, Wed: 1950, Thu: 2400, Fri: 1780, Sat: 2100, Sun: 2050 }
  const demoWeekMacros = {
    Mon: { p: 110, c: 180, f: 55 }, Tue: { p: 125, c: 210, f: 62 }, Wed: { p: 115, c: 195, f: 58 },
    Thu: { p: 130, c: 220, f: 65 }, Fri: { p: 120, c: 200, f: 60 }, Sat: { p: 135, c: 230, f: 70 }, Sun: { p: 125, c: 215, f: 63 },
  }

  // Build weekly chart data — selected day uses real totals, rest from API or demo
  const weeklyCalorieData = dayNames.map((day, idx) => {
    // If weeklyData from API is available, use it
    if (weeklyData?.days?.[idx]) {
      const apiDay = weeklyData.days[idx]
      return { day, Calories: Math.round(apiDay.calories || 0), Goal: g }
    }
    // Fallback: selected day = real data, rest = demo
    return {
      day,
      Calories: day === selectedDayLabel ? Math.round(totals.calories) : demoWeekCalories[day],
      Goal: g,
    }
  })
  const weeklyAvg = Math.round(weeklyCalorieData.reduce((s, d) => s + d.Calories, 0) / 7)
  const weeklyDeficit = (g * 7) - weeklyCalorieData.reduce((s, d) => s + d.Calories, 0)

  // Days on target (within ±10% of goal)
  const daysOnTarget = weeklyCalorieData.filter((d) => Math.abs(d.Calories - g) <= g * 0.1).length

  // Calorie trend (last 4 weeks) — always current, independent of date selection
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

  const weeklyMacroData = dayNames.map((day, idx) => {
    if (weeklyData?.days?.[idx]) {
      const apiDay = weeklyData.days[idx]
      return { day, Protein: Math.round(apiDay.protein || 0), Carbs: Math.round(apiDay.carbs || 0), Fat: Math.round(apiDay.fats || 0) }
    }
    return {
      day,
      Protein: day === selectedDayLabel ? Math.round(totals.protein) : demoWeekMacros[day].p,
      Carbs: day === selectedDayLabel ? Math.round(totals.carbs) : demoWeekMacros[day].c,
      Fat: day === selectedDayLabel ? Math.round(totals.fats) : demoWeekMacros[day].f,
    }
  })

  // Week label for insights header
  const weekLabel = useMemo(() => {
    const start = weekDates[0]
    const end = weekDates[6]
    const fmt = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    return `${fmt(start)} – ${fmt(end)}`
  }, [weekDates])

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

      <AddFoodModal
        show={showAddFood} onClose={resetAddFood}
        addFoodMeal={addFoodMeal} addFoodTab={addFoodTab} setAddFoodTab={setAddFoodTab}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        selectedFood={selectedFood} setSelectedFood={setSelectedFood}
        quantity={quantity} setQuantity={setQuantity} unit={unit} setUnit={setUnit}
        searchRef={searchRef} filteredFoods={filteredFoods} allFoods={allFoods}
        favoriteFoods={favoriteFoods} foodData={foodData}
        toggleFavorite={toggleFavorite} isFavorite={isFavorite}
        handleAddFood={handleAddFood}
        onOpenBarcode={() => { setShowAddFood(false); setShowBarcode(true); setBarcodeActive(true); lastScanned.current = null }}
        onOpenCustomFood={() => { setShowAddFood(false); openCustomFood("addFood") }}
      />

      <QuickAddModal
        show={showQuickAdd} onClose={() => setShowQuickAdd(false)}
        quickAddMeal={quickAddMeal} setQuickAddMeal={setQuickAddMeal}
        quickForm={quickForm} setQuickForm={setQuickForm} handleQuickAdd={handleQuickAdd}
      />

      <CustomFoodModal
        show={showCustomFood} onClose={closeCustomFood}
        editingCustomId={editingCustomId} customForm={customForm}
        setCustomForm={setCustomForm} handleSaveCustomFood={handleSaveCustomFood}
      />

      <EditQuantityModal
        editingFood={editingFood} setEditingFood={setEditingFood}
        editQuantity={editQuantity} setEditQuantity={setEditQuantity}
        handleEditFood={handleEditFood} removeFood={removeFood}
      />

      <BarcodeScannerModal
        show={showBarcode}
        onClose={() => { setShowBarcode(false); setBarcodeActive(false); lastScanned.current = null; setShowAddFood(true) }}
        barcodeActive={barcodeActive} setBarcodeActive={setBarcodeActive}
        barcodeLoading={barcodeLoading} barcodeFood={barcodeFood} barcodeError={barcodeError}
        lastScanned={lastScanned} dispatch={dispatch} barcodeScanAction={barcodeScanner}
        preselectedMeal={addFoodMeal}
        onAddFood={(mealType, food) => {
          setMeals((prev) => ({
            ...prev,
            [mealType]: [...(prev[mealType] || []), {
              id: Date.now(), name: food.name,
              calories: Number(food.calories || 0), protein: Number(food.protein || 0),
              carbs: Number(food.carbs || 0), fats: Number(food.fats || 0),
              quantity: 1, unit: "portion",
            }],
          }))
          setShowBarcode(false); setBarcodeActive(false); lastScanned.current = null
          scrollToMeal(mealType)
        }}
      />

      <SettingsModal
        show={showSettings} onClose={() => setShowSettings(false)}
        settingsTab={settingsTab} setSettingsTab={setSettingsTab}
        profileForm={profileForm} setProfileForm={setProfileForm}
        goalForm={goalForm} setGoalForm={setGoalForm}
        handleSaveSettings={handleSaveSettings} calculateFromProfile={calculateFromProfile}
        customFoods={customFoods} deleteCustomFood={deleteCustomFood}
        toggleFavorite={toggleFavorite} isFavorite={isFavorite}
        openCustomFood={openCustomFood} setShowSettings={setShowSettings}
      />

      <StreakModal show={showStreak} onClose={() => setShowStreak(false)} streak={streak} />

      {/* ========== HEADER ========== */}
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between p-4 sm:px-6 sm:pt-6 sm:pb-4">
          <div className="flex items-center gap-2">
            <button onClick={() => shiftDate(-1)} className="p-1.5 hover:bg-surface-button rounded-lg transition-colors text-content-muted hover:text-content-primary">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-semibold">{formatDate(selectedDate)}</h1>
              <DatePickerField value={dateStr} onChange={handleDatePick} iconSize={16} maxDate={todayStr} />
            </div>
            <button onClick={() => shiftDate(1)} className="p-1.5 hover:bg-surface-button rounded-lg transition-colors text-content-muted hover:text-content-primary" disabled={isToday}>
              <ChevronRight className={`w-5 h-5 ${isToday ? "opacity-30" : ""}`} />
            </button>
          </div>
          <div className="flex items-center gap-1">
            {streak > 0 && (
              <button onClick={() => { haptic.light(); setShowStreak(true) }} className="flex items-center gap-1 px-2 py-1 bg-primary/10 hover:bg-primary/20 rounded-lg mr-1 transition-colors">
                <Flame className="w-3.5 h-3.5 text-primary" /><span className="text-xs font-semibold text-primary">{streak}</span>
              </button>
            )}
            <button onClick={() => { haptic.light(); setProfileForm({ ...profile }); setGoalForm({ ...goals }); setSettingsTab("profile"); setShowSettings(true) }}
              className="p-2 hover:bg-surface-button rounded-xl transition-colors text-content-muted hover:text-content-primary">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex border-b border-border">
          {[{ key: "diary", label: "Diary", icon: BookOpen }, { key: "insights", label: "Insights", icon: TrendingUp }].map((tab) => {
            const TabIcon = tab.icon
            return (
              <button key={tab.key} onClick={() => { haptic.light(); setActiveView(tab.key) }}
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
            {/* Loading overlay for date changes */}
            {diaryLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                <span className="ml-2 text-sm text-content-muted">Loading {formatDate(selectedDate)}...</span>
              </div>
            )}
            {!diaryLoading && (<>
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
                <button onClick={() => updateWater(waterDrank - 250)}
                  className="w-9 h-9 rounded-lg bg-surface-card flex items-center justify-center hover:bg-surface-button transition-colors text-content-muted"><Minus className="w-4 h-4" /></button>
                <div className="flex-1 flex gap-2">
                  {[150, 250, 330, 500].map((ml) => (
                    <button key={ml} onClick={() => updateWater(waterDrank + ml)}
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
          </>)}
          </div>
        )}

        {/* ===== INSIGHTS ===== */}
        {activeView === "insights" && (
          <div className="max-w-3xl mx-auto space-y-6">

            {/* Daily Score */}
            <SettingsCard className="!p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-content-primary">{performanceLabel}</h3>
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
              <h3 className="text-sm font-medium text-content-primary mb-4">Weekly Calorie Intake <span className="text-xs text-content-faint font-normal ml-1">({weekLabel})</span></h3>
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
              <h3 className="text-sm font-medium text-content-primary mb-4">Weekly Macros <span className="text-xs text-content-faint font-normal ml-1">({weekLabel})</span></h3>
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
                    <button key={f.key} onClick={() => { haptic.light(); setNutrientFilter(f.key) }}
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
          <button onClick={(e) => { e.stopPropagation(); haptic.light(); setIsFabOpen(!isFabOpen) }}
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
