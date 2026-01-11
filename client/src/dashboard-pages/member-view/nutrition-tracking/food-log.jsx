
import { Plus } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

function FoodLog() {
    const navigate = useNavigate()
    const [selectedMeal, setSelectedMeal] = useState("Breakfast")
    const [foodName, setFoodName] = useState("")
    const [quantity, setQuantity] = useState("1")
    const [unit, setUnit] = useState("")
    const [notes, setNotes] = useState("")
    const [searchQuery, setSearchQuery] = useState("")

    const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snacks"]

    const recentlyLogged = [
        { name: "Chicken Breast (Grilled)", calories: 165 },
        { name: "Brown Rice", calories: 123 },
        { name: "Broccoli (Steamed)", calories: 55 },
        { name: "Protein Shake (Whey)", calories: 150 },
    ]

    const favoriteFoods = [
        { name: "Avocado Toast", calories: 250 },
        { name: "Greek Yogurt with Berries", calories: 180 },
        { name: "Salmon Fillet (Baked)", calories: 200 },
        { name: "Spinach Salad with Vinaigrette", calories: 100 },
    ]

    const handleAddFood = () => {
        console.log("Adding food:", { foodName, quantity, unit, notes, meal: selectedMeal })
        // Reset form
        setFoodName("")
        setQuantity("1")
        setUnit("")
        setNotes("")
    }

    const handleScanBarcode = () => {
        navigate('/member-view/barcode-entry')
    }

    return (
        <div className="min-h-screen bg-[#1C1C1C] rounded-3xl text-white p-4 sm:p-6 lg:p-8">
            <div className="">
                <div className="mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold mb-2">Log Your Meal</h1>
                    <p className="text-gray-400 text-sm">
                        Select a meal type to start tracking your food intake for the day.
                    </p>
                </div>

                <div className="bg-[#383838] p-1 rounded-lg flex mb-4">
                    {mealTypes.map((meal) => (
                        <button
                            key={meal}
                            onClick={() => setSelectedMeal(meal)}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all
        ${selectedMeal === meal
                                    ? "bg-indigo-500 text-white shadow"
                                    : "text-gray-200 hover:text-white"
                                }`}
                        >
                            {meal}
                        </button>
                    ))}
                </div>



                <p className="text-gray-400 text-sm mb-6">Logging food for your {selectedMeal} meal.</p>

                <div className="bg-[#212121] rounded-lg p-4 sm:p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-3">Find Food</h2>
                    <input
                        type="text"
                        placeholder="Search for food items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0f0f0f]  border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-3"
                    />
                    <button onClick={handleScanBarcode} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                            />
                        </svg>
                        Scan Barcode
                    </button>
                </div>

                <div className="grid grid-cols-1 bg-[#212121] p-4 rounded-md md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h2 className="text-lg font-semibold mb-3">Recently Logged</h2>
                        <div className="space-y-2">
                            {recentlyLogged.map((food, index) => (
                                <div
                                    key={index}
                                    className="bg-[#1a1a1a] border border-[#5F5F5F] rounded-lg p-3 sm:p-4 flex justify-between items-center hover:bg-[#252525] transition-colors cursor-pointer"
                                >
                                    <span className="text-sm  text-[#636AE8]">{food.name}</span>
                                    <span className="text-sm text-white">{food.calories} kcal</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-3">Favorite Foods</h2>
                        <div className="space-y-2">
                            {favoriteFoods.map((food, index) => (
                                <div
                                    key={index}
                                    className="bg-[#1a1a1a] border border-[#5F5F5F] rounded-lg p-3 sm:p-4 flex justify-between items-center hover:bg-[#252525] transition-colors cursor-pointer"
                                >
                                    <span className="text-sm  text-[#636AE8]">{food.name}</span>
                                    <span className="text-sm text-white">{food.calories} kcal</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-[#212121] rounded-md p-4 sm:p-6">
                    <h2 className="text-lg font-semibold mb-4">Manually Add Food</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-white mb-2">Food Name</label>
                            <input
                                type="text"
                                placeholder="e.g., Apple, Almonds, Cereal"
                                value={foodName}
                                onChange={(e) => setFoodName(e.target.value)}
                                className="w-full bg-[#1A1A1A] border border-[#5F5F5F] text-sm rounded-lg px-4 py-2.5  text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            />
                        </div>

                        {/* Quantity and Unit */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Quantity</label>
                                <input
                                    type="text"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="w-full bg-[#1A1A1A] border border-[#5F5F5F] text-sm rounded-lg px-4 py-2.5  text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Unit</label>
                                <input
                                    type="text"
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    className="w-full bg-[#1A1A1A] border border-[#5F5F5F] text-sm rounded-lg px-4 py-2.5  text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Notes (Optional)</label>
                            <textarea
                                placeholder="Any specific details about the food item?"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                className="w-full bg-[#1A1A1A] border border-[#5F5F5F] text-sm rounded-lg px-4 py-2.5  text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
                            />
                        </div>

                        <button
                            onClick={handleAddFood}
                            className="w-full bg-indigo-600 cursor-pointer text-sm hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus size={16}/>
                            Add Food to Meal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FoodLog
