
import { useState } from "react"

function NotificationsReminders() {
  const [reminders, setReminders] = useState({
    breakfast: true,
    lunch: true,
    dinner: true,
    water: false,
    general: false,
  })

  const toggleReminder = (key) => {
    setReminders((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const reminderItems = [
    {
      key: "breakfast",
      title: "Breakfast Reminder",
      description: "Receive an alert to log your breakfast meal, helping you stay consistent with your dietary plan.",
    },
    {
      key: "lunch",
      title: "Lunch Reminder",
      description: "Get a timely notification to log your lunch meal, ensuring accurate daily tracking.",
    },
    {
      key: "dinner",
      title: "Dinner Reminder",
      description: "Be reminded to log your dinner meal, completing your daily nutrition overview.",
    },
    {
      key: "water",
      title: "Water Intake Reminder",
      description: "Receive regular reminders to track your daily water consumption, promoting hydration.",
    },
    {
      key: "general",
      title: "General Nutrition Reminder",
      description: "Occasional tips and gentle reminders for balanced nutrition, supporting your health goals.",
    },
  ]

  return (
    <div className="min-h-screen bg-[#1C1C1C] rounded-3xl text-white p-6">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl mt-7 font-semibold mb-3">Notifications & Reminders</h1>
          <p className="text-[#C1C1C1] text-sm leading-relaxed">
          Manage your personalized alerts to help you stay on track with your nutrition and hydration goals. Toggle the switches below to activate or deactivate specific reminders.
          </p>
        </div>

        {/* Reminder Items */}
        <div className="space-y-4">
          {reminderItems.map((item) => (
            <div key={item.key} className="bg-[#212121] border border-[#383838] rounded-lg p-6 flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-base font-medium mb-2">{item.title}</h3>
                <p className="text-gray-200 text-sm leading-relaxed">{item.description}</p>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => toggleReminder(item.key)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#1a1a1a] ${
                  reminders[item.key] ? "bg-indigo-600" : "bg-gray-600"
                }`}
                role="switch"
                aria-checked={reminders[item.key]}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    reminders[item.key] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NotificationsReminders
