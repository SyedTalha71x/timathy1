/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */

import { useState } from "react"
import { Calendar, Edit2, Plus, Trash2, X } from "lucide-react"

const DailySummary = () => {
    const [meals, setMeals] = useState({
        breakfast: [
            {
                id: 1,
                name: "Oatmeal with Berries & Almonds",
                serving: "1 bowl",
                calories: 380,
                protein: 12,
                carbs: 55,
                fats: 14,
            },
            {
                id: 2,
                name: "Scrambled Eggs (2) with Spinach",
                serving: "1 serving",
                calories: 220,
                protein: 18,
                carbs: 3,
                fats: 16,
            },
        ],
        lunch: [
            {
                id: 3,
                name: "Grilled Chicken Salad",
                serving: "1 large bowl",
                calories: 450,
                protein: 40,
                carbs: 20,
                fats: 25,
            },
            {
                id: 4,
                name: "Whole Wheat Bread",
                serving: "2 slices",
                calories: 160,
                protein: 6,
                carbs: 30,
                fats: 2,
            },
        ],
        dinner: [
            {
                id: 5,
                name: "Baked Salmon with Roasted Vegetables",
                serving: "1 fillet, 1 cup veggies",
                calories: 580,
                protein: 45,
                carbs: 35,
                fats: 30,
            },
        ],
        snacks: [
            {
                id: 6,
                name: "Greek Yogurt with Honey",
                serving: "1 cup",
                calories: 180,
                protein: 15,
                carbs: 25,
                fats: 3,
            },
            {
                id: 7,
                name: "Mixed Nuts",
                serving: "1 handful",
                calories: 180,
                protein: 7,
                carbs: 12,
                fats: 14,
            },
        ],
    })

    const [editModal, setEditModal] = useState({ isOpen: false, meal: null, foodId: null })
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, meal: null, foodId: null })
    const [editForm, setEditForm] = useState({
        name: "",
        serving: "",
        calories: "",
        protein: "",
        carbs: "",
        fats: "",
    })

    // Calculate totals
    const calculateTotals = () => {
        const totals = { calories: 0, protein: 0, carbs: 0, fats: 0 }

        Object.values(meals).forEach((mealItems) => {
            mealItems.forEach((item) => {
                totals.calories += item.calories
                totals.protein += item.protein
                totals.carbs += item.carbs
                totals.fats += item.fats
            })
        })

        return totals
    }

    const totals = calculateTotals()

    const openEditModal = (mealType, food) => {
        setEditForm({
            name: food.name,
            serving: food.serving,
            calories: food.calories.toString(),
            protein: food.protein.toString(),
            carbs: food.carbs.toString(),
            fats: food.fats.toString(),
        })
        setEditModal({ isOpen: true, meal: mealType, foodId: food.id })
    }

    const closeEditModal = () => {
        setEditModal({ isOpen: false, meal: null, foodId: null })
        setEditForm({ name: "", serving: "", calories: "", protein: "", carbs: "", fats: "" })
    }

    const handleEditSubmit = (e) => {
        e.preventDefault()

        setMeals((prev) => ({
            ...prev,
            [editModal.meal]: prev[editModal.meal].map((item) =>
                item.id === editModal.foodId
                    ? {
                        ...item,
                        name: editForm.name,
                        serving: editForm.serving,
                        calories: Number.parseInt(editForm.calories),
                        protein: Number.parseInt(editForm.protein),
                        carbs: Number.parseInt(editForm.carbs),
                        fats: Number.parseInt(editForm.fats),
                    }
                    : item,
            ),
        }))

        closeEditModal()
    }

    const openDeleteModal = (mealType, foodId) => {
        setDeleteModal({ isOpen: true, meal: mealType, foodId })
    }

    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, meal: null, foodId: null })
    }

    const handleDelete = () => {
        setMeals((prev) => ({
            ...prev,
            [deleteModal.meal]: prev[deleteModal.meal].filter((item) => item.id !== deleteModal.foodId),
        }))

        closeDeleteModal()
    }

    const FoodCard = ({ food, mealType }) => (
        <div className="bg-[#212121]  rounded-lg md:p-6 p-3 space-y-2">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="text-white font-medium text-base mb-1">{food.name}</h3>
                    <p className="text-gray-400 text-sm mb-3">{food.serving}</p>

                    <div className="grid grid-cols-1 gap-x-8 gap-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-200">Calories:</span>
                            <span className="text-white">{food.calories} kcal</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-200">Carbs:</span>
                            <span className="text-white">{food.carbs}g</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-200">Protein:</span>
                            <span className="text-white">{food.protein}g</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-200">Fats:</span>
                            <span className="text-white">{food.fats}g</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 pt-2">
                <button
                    onClick={() => openEditModal(mealType, food)}
                    className="flex items-center gap-1.5 px-3 py-1.5 cursor-pointer bg-[#2a2a2a] hover:bg-[#333333] text-white rounded text-sm transition-colors"
                >
                    <Edit2 size={14} />
                    Edit
                </button>
                <button
                    onClick={() => openDeleteModal(mealType, food.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 cursor-pointer bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                >
                    <Trash2 size={14} />
                    Delete
                </button>
            </div>
        </div>
    )

    const MealSection = ({ title, mealType, foods }) => (
        <div className="space-y-4 border-b border-[#38383880] pb-6">
            <h2 className="text-white text-xl font-semibold">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {foods.map((food) => (
                    <FoodCard key={food.id} food={food} mealType={mealType} />
                ))}
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-[#1C1C1C] rounded-3xl text-white p-4 md:p-6 lg:p-8">
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Calendar className="text-indigo-400" size={24} />
                        <h1 className="md:text-2xl text-xl font-bold">Daily Summary</h1>
                    </div>
                    <p className="text-gray-400 text-sm">Thursday, November 27, 2025</p>
                </div>

                <div className="bg-[#212121] rounded-lg md:p-6 p-4">
                    <h2 className="text-white text-lg font-semibold mb-4">Today's Overview</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <p className="text-gray-400 text-sm mb-1">Calories</p>
                            <p className="text-indigo-400 text-2xl font-bold">{totals.calories}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400 text-sm mb-1">Protein</p>
                            <p className="text-indigo-400 text-2xl font-bold">{totals.protein}g</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400 text-sm mb-1">Carbs</p>
                            <p className="text-indigo-400 text-2xl font-bold">{totals.carbs}g</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400 text-sm mb-1">Fats</p>
                            <p className="text-indigo-400 text-2xl font-bold">{totals.fats}g</p>
                        </div>
                    </div>
                </div>

                <MealSection title="Breakfast" mealType="breakfast" foods={meals.breakfast} />
                <MealSection title="Lunch" mealType="lunch" foods={meals.lunch} />
                <MealSection title="Dinner" mealType="dinner" foods={meals.dinner} />
                <MealSection title="Snacks" mealType="snacks" foods={meals.snacks} />

                <div className="flex justify-end items-center">

                    <button
                        className="w-full md:w-auto   bg-indigo-600 cursor-pointer text-sm hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus size={16} />
                        Add More Food
                    </button>
                </div>
            </div>

            {/* Edit Modal */}
            {editModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1a1a1a] rounded-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-white">Edit Food Item</h2>
                            <button onClick={closeEditModal} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Food Name</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Serving Size</label>
                                <input
                                    type="text"
                                    value={editForm.serving}
                                    onChange={(e) => setEditForm({ ...editForm, serving: e.target.value })}
                                    className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Calories</label>
                                    <input
                                        type="number"
                                        value={editForm.calories}
                                        onChange={(e) => setEditForm({ ...editForm, calories: e.target.value })}
                                        className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Protein (g)</label>
                                    <input
                                        type="number"
                                        value={editForm.protein}
                                        onChange={(e) => setEditForm({ ...editForm, protein: e.target.value })}
                                        className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Carbs (g)</label>
                                    <input
                                        type="number"
                                        value={editForm.carbs}
                                        onChange={(e) => setEditForm({ ...editForm, carbs: e.target.value })}
                                        className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Fats (g)</label>
                                    <input
                                        type="number"
                                        value={editForm.fats}
                                        onChange={(e) => setEditForm({ ...editForm, fats: e.target.value })}
                                        className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex md:flex-row flex-col gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="flex-1 px-4 py-2 text-sm bg-[#2a2a2a] hover:bg-[#333333] text-white rounded transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1a1a1a] rounded-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-white">Confirm Deletion</h2>
                            <button onClick={closeDeleteModal} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="mb-6">

                            <p className="text-gray-300 text-sm text-center">
                                Are you sure you want to delete this food item? This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={closeDeleteModal}
                                className="flex-1 px-4 py-2 bg-[#2a2a2a] text-sm hover:bg-[#333333] text-white rounded transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 px-4 py-2 bg-red-600 text-sm hover:bg-red-700 text-white rounded transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DailySummary
