/* eslint-disable react/no-unescaped-entities */

import { useState } from "react"
import { RiWifiOffLine } from "react-icons/ri"

function OfflineMode() {
  const [pendingFoods] = useState([
    {
      id: 1,
      name: "Grilled Chicken Breast",
      mealType: "Lunch",
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      name: "Brown Rice (cooked)",
      mealType: "Lunch",
      calories: 205,
      protein: 4.3,
      carbs: 45,
      fat: 1.6,
      timestamp: "2 hours ago",
    },
    {
      id: 3,
      name: "Steamed Broccoli",
      mealType: "Lunch",
      calories: 55,
      protein: 3.7,
      carbs: 11.2,
      fat: 0.6,
      timestamp: "2 hours ago",
    },
    {
      id: 4,
      name: "Banana",
      mealType: "Snack",
      calories: 105,
      protein: 1.3,
      carbs: 27,
      fat: 0.3,
      timestamp: "1 hour ago",
    },
    {
      id: 5,
      name: "Protein Shake",
      mealType: "Snack",
      calories: 150,
      protein: 25,
      carbs: 5,
      fat: 3,
      timestamp: "30 minutes ago",
    },
  ])

  const handleManualEntry = () => {
    console.log("Opening manual food entry...")
    // Navigate to manual food entry page
  }

  return (
    <div className="min-h-screen bg-[#1C1C1C] rounded-3xl text-white p-4 md:p-6 lg:p-8">
      <div className=" w-full">
        {/* Header */}
        <h1 className="text-2xl md:text-3xl font-semibold mb-6">Offline Mode</h1>

        {/* Offline Status Card */}
        <div className="bg-[#212121] rounded-lg p-6 mb-6 border border-[#383838]">
          <div className="flex flex-col items-center text-center">
            {/* Wifi Off Icon */}
            <div className="mb-4">
            <RiWifiOffLine size={30} className="text-red-500" />

            </div>

            {/* Status Text */}
            <h2 className="text-xl font-semibold mb-2">Offline Mode Active</h2>
            <p className="text-gray-400 text-sm max-w-2xl">
              You are currently offline. Your food entries will be saved locally and automatically synchronized with the
              cloud once an internet connection is re-established.
            </p>
          </div>
        </div>

        {/* Add Food Manually Card */}
        <div className="bg-[#212121] rounded-lg p-6 mb-6 border border-[#383838]">
          <h3 className="text-lg font-semibold text-center mb-2">Add Food Manually</h3>
          <p className="text-gray-400 text-center text-sm mb-4">
            No internet? No problem! Log your food items here and they will sync automatically when you're back online.
          </p>

          <button
            onClick={handleManualEntry}
            className="w-full bg-indigo-600 text-sm hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Manual Food Entry
          </button>
        </div>

        {/* Recently Logged (Pending Sync) */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recently Logged (Pending Sync)</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingFoods.map((food) => (
              <div
                key={food.id}
                className="bg-[#212121] rounded-lg p-4 border border-[#383838] hover:border-[#3a3a3a] transition-colors"
              >
                {/* Food Name and Calories */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-white mb-1">{food.name}</h3>
                    <p className="text-xs text-gray-500">{food.mealType}</p>
                  </div>
                  <span className="text-indigo-400 font-semibold text-sm ml-2">{food.calories} kcal</span>
                </div>

                {/* Macros */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Protein</p>
                    <p className="text-sm font-medium">{food.protein}g</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Carbs</p>
                    <p className="text-sm font-medium">{food.carbs}g</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Fat</p>
                    <p className="text-sm font-medium">{food.fat}g</p>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="flex items-center justify-end text-xs text-gray-500">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {food.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OfflineMode
