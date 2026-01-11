import { useState } from "react"
import toast from "react-hot-toast"
import { ToastContainer } from "react-toastify"

function NutritionalGoals() {
  const [goals, setGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fats: 70,
  })

  const handleChange = (field, value) => {
    setGoals((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleResetToDefault = () => {
    setGoals({
      calories: 2000,
      protein: 150,
      carbs: 250,
      fats: 70,
    })
  }

  const handleSaveGoals = () => {
    console.log("Saving goals:", goals)
    // Add your save logic here
    toast.success('Goals saved successfully!')
    // alert("Goals saved successfully!")
  }

  return (
    <div className="min-h-screen bg-[#1C1C1C] rounded-3xl text-white p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <ToastContainer/>
      <div className="w-full max-w-6xl">
        <div className="bg-[#212121] border border-[#383838] rounded-lg p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-semibold mb-2">Set Your Daily Nutritional Goals</h1>
          <p className="text-[#9ca3af] text-sm mb-6">
            Define your daily targets for calories and macronutrients to stay on track with your fitness journey.
          </p>

          <div className="space-y-4">
            {/* Daily Calories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            
            <div>
              <label className="block text-sm text-[#e5e7eb] mb-2">Daily Calories (kcal)</label>
              <input
                type="number"
                value={goals.calories}
                onChange={(e) => handleChange("calories", e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#5F5F5F] rounded-md px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent"
              />
            </div>


            {/* Protein */}
            <div>
              <label className="block text-sm text-[#e5e7eb] mb-2">Protein (g)</label>
              <input
                type="number"
                value={goals.protein}
                onChange={(e) => handleChange("protein", e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#5F5F5F] rounded-md px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent"
              />
            </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Carbohydrates */}
            <div>
              <label className="block text-sm text-[#e5e7eb] mb-2">Carbohydrates (g)</label>
              <input
                type="number"
                value={goals.carbs}
                onChange={(e) => handleChange("carbs", e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#5F5F5F] rounded-md px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent"
              />
            </div>

            {/* Fats */}
            <div>
              <label className="block text-sm text-[#e5e7eb] mb-2">Fats (g)</label>
              <input
                type="number"
                value={goals.fats}
                onChange={(e) => handleChange("fats", e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#5F5F5F] rounded-md px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent"
              />
            </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6 justify-end">
            <button
              onClick={handleResetToDefault}
              className="px-4 py-2 text-sm text-white bg-[#1A1A1A] border border-[#3a3a3a] rounded-md hover:bg-[#2a2a2a] transition-colors"
            >
              Reset to Default
            </button>
            <button 
              onClick={handleSaveGoals}
              className="px-4 py-2 text-sm text-white bg-[#636AE8] rounded-md hover:bg-[#5558e3] transition-colors"
            >
              Save Goals
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NutritionalGoals