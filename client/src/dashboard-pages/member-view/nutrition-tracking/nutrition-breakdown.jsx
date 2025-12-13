/* eslint-disable react/no-unknown-property */
import { useState } from "react"

function NutrientBreakdown() {
  const [servingSize, setServingSize] = useState(100)
  const [showAllNutrition, setShowAllNutrition] = useState(false)

  // Calculate nutrients based on serving size (base is 100g)
  const baseCalories = 165
  const baseProtein = 31.0
  const baseCarbs = 0.0
  const baseFats = 3.6

  const multiplier = servingSize / 100

  const calories = Math.round(baseCalories * multiplier)
  const protein = (baseProtein * multiplier).toFixed(1)
  const carbs = (baseCarbs * multiplier).toFixed(1)
  const fats = (baseFats * multiplier).toFixed(1)

  const handleSliderChange = (e) => {
    setServingSize(Number(e.target.value))
  }

  const handleInputChange = (e) => {
    const value = Number(e.target.value)
    if (value >= 0 && value <= 500) {
      setServingSize(value)
    }
  }

  return (
    <div className="min-h-screen rounded-3xl bg-[#1C1C1C] text-white p-4 sm:p-6 ">
      <div className="">
        <h1 className="md:text-2xl text-xl  font-bold mb-6">Nutrient Breakdown</h1>

<div className="bg-[#212121] rounded-xl md:p-4 p-0  ">
<div className="max-w-6xl w-full mx-auto">



        <div className=" rounded-lg  md:p-6 p-4 mb-6">
          <h2 className="md:text-xl text-lg font-semibold mb-4">Grilled Chicken Breast</h2>
          <div className="flex items-center md:flex-row flex-col gap-4">
            <img
              src="/grilled-chicken.svg"
              alt="Grilled Chicken Breast"
              className="md:w-30 h-full md:h-30 w-full rounded-lg object-cover"
            />
            <p className="text-sm text-[#C1C1C1] leading-relaxed">
              A lean protein source, grilled to perfection. Ideal for muscle growth and satiety. Contains essential
              amino acids and is low in fat.
            </p>
          </div>
        </div>

        {/* Adjust Serving Size */}
        <div className="  border-t border-[#383838] md:p-6 p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Adjust Serving Size</h2>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="500"
              value={servingSize}
              onChange={handleSliderChange}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${(servingSize / 500) * 100}%, #374151 ${(servingSize / 500) * 100}%, #374151 100%)`,
              }}
            />
            <div className="flex items-center gap-2 bg-[#2a2a2a] rounded-lg px-4 py-2">
              <input
                type="number"
                value={servingSize}
                onChange={handleInputChange}
                className="w-16 bg-transparent text-white text-center focus:outline-none"
                min="0"
                max="500"
              />
              <span className="text-gray-400">g</span>
            </div>
          </div>
        </div>

        {/* Macronutrient Summary */}
        <div className=" border-t border-[#383838] md:p-6 p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Macronutrient Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* Calories */}
            <div className="bg-[#3838384D] p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Calories</div>
              <div className="text-xl font-bold mb-2">{calories} kcal</div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600" style={{ width: "70%" }}></div>
              </div>
            </div>

            {/* Protein */}
            <div className="bg-[#3838384D] p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Protein</div>
              <div className="text-xl font-bold mb-2">{protein}g</div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600" style={{ width: "90%" }}></div>
              </div>
            </div>

            {/* Carbohydrates */}
            <div className="bg-[#3838384D] p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Carbohydrates</div>
              <div className="text-xl font-bold mb-2">{carbs}g</div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600" style={{ width: "0%" }}></div>
              </div>
            </div>

            {/* Fats */}
            <div className="bg-[#3838384D] p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Fats</div>
              <div className="text-xl font-bold mb-2">{fats}g</div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600" style={{ width: "85%" }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Nutrients */}
        <div className=" border-t border-[#383838] md:p-6 p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Detailed Nutrients</h2>
          <button
            onClick={() => setShowAllNutrition(!showAllNutrition)}
            className="w-full flex items-center justify-between text-gray-300 hover:text-white transition-colors"
          >
            <span className="text-sm">View All Nutritional Facts</span>
            <svg
              className={`w-5 h-5 transition-transform ${showAllNutrition ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showAllNutrition && (
            <div className="mt-4 pt-4 border-t border-gray-700 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Saturated Fat</span>
                <span className="text-white">1.0g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Trans Fat</span>
                <span className="text-white">0.0g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cholesterol</span>
                <span className="text-white">85mg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Sodium</span>
                <span className="text-white">74mg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Fiber</span>
                <span className="text-white">0.0g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Sugar</span>
                <span className="text-white">0.0g</span>
              </div>
            </div>
          )}
        </div>

        <button className="w-full bg-indigo-600 text-sm hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
          Add to Meal
        </button>
        </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          border: 2px solid white;
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          border: 2px solid white;
        }
      `}</style>
    </div>
  )
}

export default NutrientBreakdown
